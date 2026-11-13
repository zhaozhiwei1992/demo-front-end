/**
 * cross-domain-bus.js — 通用跨域事件总线（业务无关）
 *
 * 对应智能填单通用协议第②层「跨域通信通道层」。
 * - 统一 Envelope: { channel, version, messageId, replyTo, action, payload }
 * - postMessage 为默认传输实现（可插拔）
 * - 支持 send(action,payload) 与 on(action,handler) 订阅，messageId 用于去重
 *
 * channel 是协议身份标识（过滤站内 postMessage 噪音 / 多协议共存时的命名空间），
 * 不是业务路由键：业务差异一律走 action + payload。默认 'AI_FORM'，多套协议共存
 * 的页面可显式传不同 channel 隔离；注意两端（宿主 / AI 助手）必须传一致的值，
 * 否则消息被静默丢弃（无日志，排查困难）。
 *
 * 用法（宿主页 / AI 助手各持有一份实例，参数不同）：
 *   const bus = new CrossDomainBus({ channel, targetWindow, targetOrigin, myOrigin });
 *   bus.on('ACTION', ({ payload, reply }) => { ... });
 *   bus.send('ACTION', { ... });
 */
(function (global) {
  const CHANNEL = 'AI_FORM';
  const VERSION = 1;
  let seq = 0;

  class CrossDomainBus {
    /**
     * @param {Object} opts
     * @param {string} [opts.channel='AI_FORM']  协议身份标识 / 命名空间；两端必须传一致，多协议共存时隔离用
     * @param {Window} opts.targetWindow  消息发往的窗口（对面宿主或 iframe）
     * @param {string} opts.targetOrigin  消息发往方的 origin（校验/白名单用；演示可传 '*'）
     * @param {string} opts.myOrigin      允许接收的消息来源 origin（跨域对面），用于收到消息时校验；null 或同源场景可跳过（可选）
     */
    constructor({ channel = CHANNEL, targetWindow, targetOrigin = '*', myOrigin = null }) {
      this.channel = channel;
      this.targetWindow = targetWindow;
      this.targetOrigin = targetOrigin;
      this.myOrigin = myOrigin;
      this.handlers = new Map();
      this.ready = false;
      this._onMessage = this._onMessage.bind(this);
    }

    /** 启动监听（页面加载后调用，用于接收对面消息） */
    init() {
      this.ready = true;
      global.addEventListener('message', this._onMessage);
      return this;
    }

    /** 停止监听 */
    destroy() {
      global.removeEventListener('message', this._onMessage);
      this.ready = false;
    }

    /** 订阅某个 action */
    on(action, handler) {
      const set = this.handlers.get(action) || new Set();
      set.add(handler);
      this.handlers.set(action, set);
      return () => set.delete(handler); // 返回取消订阅函数
    }

    /** 发送一条 action 消息，返回 messageId（便于对应响应） */
    send(action, payload) {
      const msg = {
        channel: this.channel,
        version: VERSION,
        messageId: `${Date.now()}-${++seq}`,
        replyTo: null,
        action,
        payload: payload || {},
      };
      if (this.targetWindow && this.targetWindow.postMessage) {
        try {
          this.targetWindow.postMessage(msg, this.targetOrigin);
          if (global.AI_FORM_DEBUG) console.log(`[bus] → send   ${action}  ${msg.messageId}  (target=${this.targetOrigin})`);
        } catch (err) {
          console.error(`[bus] ✗ send FAILED ${action}:`, err.message);
        }
      }
      return msg.messageId;
    }

    /** 回复某条消息（带上 replyTo） */
    reply(action, payload, replyTo) {
      const msg = {
        channel: this.channel,
        version: VERSION,
        messageId: `${Date.now()}-${++seq}`,
        replyTo,
        action,
        payload: payload || {},
      };
      if (this.targetWindow && this.targetWindow.postMessage) {
        try {
          this.targetWindow.postMessage(msg, this.targetOrigin);
          if (global.AI_FORM_DEBUG) console.log(`[bus] → reply  ${action}  ${msg.messageId}  (target=${this.targetOrigin})`);
        } catch (err) {
          console.error(`[bus] ✗ reply FAILED ${action}:`, err.message);
        }
      }
      return msg.messageId;
    }

    _onMessage(e) {
      const data = e.data;
      // 基本校验：envelope 结构 + channel（必须是本实例配置的协议身份）
      if (!data || data.channel !== this.channel) return;
      // 演示简化：允许 myOrigin 为 null 时跳过严格 origin 校验
      if (this.myOrigin && e.origin && e.origin !== this.myOrigin) {
        if (global.AI_FORM_DEBUG) console.warn(`[bus] ← drop   ${data.action}  (src=${e.origin} != myOrigin=${this.myOrigin})`);
        return;
      }
      if (global.AI_FORM_DEBUG) console.log(`[bus] ← recv   ${data.action}  (src=${e.origin})`);

      const { action, payload } = data;
      const set = this.handlers.get(action);
      if (set) {
        set.forEach((h) => {
          try {
            h({ payload, replyTo: data.messageId, raw: data });
          } catch (err) {
            console.error('[bus] handler error:', action, err);
          }
        });
      }
    }
  }

  global.CrossDomainBus = CrossDomainBus;
})(window);
