<template>
  <div class="container">
    <div class="row clearfix fsm-header">
      <div class="col-md-12">
        <h1 class="page-header">对话表单 FSM 演示
          <small>AI 表单状态机（无 Vue 依赖的纯 JS 模块）</small>
        </h1>
        <p class="lead">
          场景：AI 助手帮你填「请假申请」。从 <code>输入 → 理解 → 预览确认 → 业务校验 → 追问 → 提交 → 成功</code>。
          状态由 <code>src/ai-form-fsm/</code> 纯 JS 路由表驱动，UI 只是 <code>status</code> 的投影。
        </p>

        <!-- 状态机当前状态可视化 -->
        <div class="panel panel-default">
          <div class="panel-heading">
            <strong>当前状态：{{ status }}</strong>
            <span v-if="ui.tip" class="label label-info fs-tip">{{ ui.tip }}</span>
          </div>
          <div class="panel-body">
            <span
              v-for="st in allStates"
              :key="st"
              class="label fs-node"
              :class="{
                'label-primary': status === st,
                'label-default': status !== st,
                'fs-done': isDoneState(st)
              }"
            >{{ st }}</span>
            <div class="fs-log">
              <h4>事件日志</h4>
              <ul>
                <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
                <li v-if="!logs.length" class="text-muted">（尚无事件，从输入开始）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row clearfix">
      <div class="col-md-6">
        <!-- ============ 用户操作区 ============ -->
        <div class="panel panel-primary">
          <div class="panel-heading">1️⃣ 一句话描述请假需求</div>
          <div class="panel-body">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="inputText"
                placeholder="例如：我想下周一到周三请年假"
                :disabled="ui.inputLocked"
              />
            </div>
            <button
              class="btn btn-primary"
              :disabled="ui.inputLocked || !inputText"
              @click="onUserSend(inputText)"
            >发送</button>
            <button class="btn btn-default" @click="onReset">重置</button>
          </div>
        </div>

        <!-- ============ 只读按钮演示防并发 ============ -->
        <div class="panel panel-warning">
          <div class="panel-heading">2️⃣ 防并发演示（连点确认）</div>
          <div class="panel-body">
            <p>在「等待确认」状态时连续点两次下面按钮，第二次会被状态机表自动忽略。双击试试：</p>
            <button
              class="btn btn-success"
              :disabled="status !== 'AWAITING_CONFIRM'"
              @click="onUserConfirm"
            >连点我（确认生成）</button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- ============ 状态投影的卡片区（UI 是 status 的投影） ============ -->
        <div class="panel panel-default">
          <div class="panel-heading">状态投影卡片 <small>UI 只跟随 status</small></div>
          <div class="panel-body">
            <!-- 等待确认：显示 LLM 解析出的预览卡片 -->
            <div v-if="status === 'AWAITING_CONFIRM' && ui.card" class="alert alert-info">
              <strong>AI 解析结果（待确认）：</strong>
              <pre>{{ formatCard(ui.card) }}</pre>
              <button class="btn btn-success btn-sm" @click="onUserConfirm">✅ 确认</button>
              <button class="btn btn-warning btn-sm" @click="onUserSupplement">🔄 我说漏了，补充</button>
              <button class="btn btn-danger btn-sm" @click="onUserCancel">✖️ 取消</button>
            </div>

            <!-- 追问/修正：显示业务校验失败的原因 + 重新描述 -->
            <div v-if="status === 'REVISING' && ui.card" class="alert alert-danger">
              <strong>业务校验未通过，请修正：</strong>
              <pre>{{ formatCard(ui.card) }}</pre>
              <input type="text" class="form-control" v-model="inputText" placeholder="重新描述，例如：改成周三到周五" />
              <button class="btn btn-warning btn-sm" @click="onReviseSend">🔄 重新提交</button>
              <button class="btn btn-danger btn-sm" @click="onUserCancel">✖️ 放弃</button>
            </div>

            <!-- 表单完成：可提交或继续改 -->
            <div v-if="status === 'COMPLETE' && ui.card" class="alert alert-success">
              <strong>✅ 校验通过，表单已完成：</strong>
              <pre>{{ formatCard(ui.card) }}</pre>
              <button class="btn btn-primary btn-sm" @click="onUserSubmit">🚀 正式提交</button>
              <button class="btn btn-default btn-sm" @click="onUserAmend">✏️ 还想改</button>
            </div>

            <!-- 提交完成（终态） -->
            <div v-if="status === 'DONE'" class="alert alert-success">
              <strong>🎉 提交成功！业务单号：{{ ui.bizKey }}</strong>
              <p class="text-muted">6 秒后自动重置回空闲态（RESET 事件）。</p>
            </div>

            <div v-if="status === 'IDLE'" class="text-muted">
              输入一句话并发送，启动整个流程。
            </div>
            <div v-if="status === 'UNDERSTANDING'" class="text-muted">
              ⏳ 正在理解你的意图（模拟 LLM 调用）…
            </div>
            <div v-if="status === 'COMMITTING'" class="text-muted">
              ⏳ 正在提交表单校验…
            </div>
            <div v-if="status === 'VALIDATING'" class="text-muted">
              ⏳ 业务侧校验中…
            </div>
            <div v-if="status === 'SUBMITTING'" class="text-muted">
              ⏳ 正式提交中…
            </div>
          </div>
        </div>

        <!-- 代码结构说明 -->
        <div class="panel panel-default">
          <div class="panel-heading">模块结构</div>
          <div class="panel-body">
            <pre>src/ai-form-fsm/
  ├── types.js        # 状态 / 事件枚举
  ├── transitions.js  # 纯路由表（无 Vue）
  ├── fsm.js          # createFsm() 工厂（无 Vue）
  └── index.js        # 统一导出

组件只做：收集事件 dispatch 进来 + watch status 渲染。FSM 表自动挡非法流转。</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createFsm, STATUS, EVENTS } from '@/ai-form-fsm'

// ===== 模拟外部依赖（真实项目里换成真实 LLM / 业务接口） =====
function callLLM(text) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        type: 'leave',
        reason: text.indexOf('病') > -1 ? '病假' : '年假',
        start: '下周一',
        end: '下周三',
        days: 3
      })
    }, 800)
  })
}

// 业务校验：模拟"请假跨周末必失败"的规则
function postToBizValidate(card) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (card.reason === '年假' && card.end === '下周三') {
        // BIZ_FAIL → REVISING
        resolve({ ok: false, errMsg: '年假不能覆盖下周三（系统盘点日）' })
      } else {
        resolve({ ok: true })
      }
    }, 800)
  })
}

function postToBizSubmit() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ ok: true, bizKey: 'LEAVE-2026-' + Math.floor(Math.random() * 9000 + 1000) }), 800)
  })
}

export default {
  name: 'AiFormFlow',
  data() {
    return {
      status: STATUS.IDLE,
      inputText: '',
      logs: [],
      allStates: Object.keys(STATUS),
      doneStates: [STATUS.DONE],
      ui: {
        inputLocked: false,
        tip: '',
        card: null,
        bizKey: ''
      },
      fsm: null
    }
  },
  computed: {
    // 流程是否已走完（用于节点高亮）
  },
  watch: {
    // ✅ UI 只跟 status 走，不跟 dispatch 走（可统一埋点）
    status(newVal, oldVal) {
      this.logs.push(`[状态变更] ${oldVal} → ${newVal}`)
    }
  },
  mounted() {
    this.fsm = createFsm({
      onEnter: this.onEnterState.bind(this)
    })
    // 把 FSM 内部状态同步到 data.status，让 watch / 模板生效
    this.$watch(() => this.fsm.getStatus(), v => { this.status = v })
  },
  methods: {
    isDoneState(st) { return this.doneStates.indexOf(st) > -1 },

    formatCard(card) {
      return JSON.stringify(card, null, 2)
    },

    // ===== 事件来源：用户 / 业务 =====
    onUserSend(text) {
      if (this.status !== STATUS.IDLE) return
      this.fsm.setSession({ userText: text })
      this.fsm.dispatch(EVENTS.USER_INPUT, { text })
      this.inputText = ''
    },
    onReviseSend() {
      if (this.status !== STATUS.REVISING) return
      const text = this.inputText
      if (!text) return
      this.fsm.setSession({ userText: text })
      this.fsm.dispatch(EVENTS.USER_INPUT, { text })
      this.inputText = ''
    },
    onUserConfirm() {
      this.logs.push(`[事件] USER_CONFIRM（consumed=${this.fsm.dispatch(EVENTS.USER_CONFIRM).consumed}）`)
    },
    onUserSupplement() {
      this.fsm.dispatch(EVENTS.USER_SUPPLEMENT)
    },
    onUserCancel() {
      this.fsm.dispatch(EVENTS.USER_CANCEL)
    },
    onUserSubmit() {
      this.fsm.dispatch(EVENTS.USER_SUBMIT)
    },
    onUserAmend() {
      this.fsm.dispatch(EVENTS.USER_AMEND)
    },
    onReset() {
      this.fsm.reset()
      this.status = STATUS.IDLE
      this.ui = { inputLocked: false, tip: '', card: null, bizKey: '' }
    },

    // ===== 状态入口副作用（集中在这里） =====
    onEnterState(state, payload, session) {
      this.status = state // 同步给 data
      switch (state) {
        case STATUS.UNDERSTANDING:
          this.ui.inputLocked = true
          this.ui.tip = '正在理解意图…'
          callLLM(session.userText).then(res => {
            this.fsm.setSession({ llmResult: res })
            this.fsm.dispatch(EVENTS.LLM_READY, { res })
          })
          break

        case STATUS.AWAITING_CONFIRM:
          this.ui.inputLocked = false
          this.ui.card = payload.res
          this.ui.tip = '等待用户确认'
          break

        case STATUS.COMMITTING:
          this.ui.inputLocked = true
          this.ui.tip = '正在提交表单校验…'
          postToBizValidate(session.llmResult).then(res => {
            this.fsm.setSession({ validateResult: res })
            if (res.ok) {
              this.fsm.dispatch(EVENTS.BIZ_PASS, { finalSummary: session.llmResult })
            } else {
              this.fsm.dispatch(EVENTS.BIZ_FAIL, { llmReply: { ...session.llmResult, errMsg: res.errMsg } })
            }
          })
          // 通知 FSM 请求已发（同步事件，无异步）
          this.fsm.dispatch(EVENTS.REQ_SENT)
          break

        case STATUS.VALIDATING:
          this.ui.tip = '校验中…'
          break

        case STATUS.REVISING:
          this.ui.inputLocked = false
          this.ui.card = payload.llmReply
          this.ui.tip = '校验未通过，请修正'
          break

        case STATUS.COMPLETE:
          this.ui.inputLocked = false
          this.ui.card = payload.finalSummary
          this.ui.tip = '校验通过，可提交'
          break

        case STATUS.SUBMITTING:
          this.ui.inputLocked = true
          this.ui.tip = '正式提交中…'
          this.fsm.dispatch(EVENTS.BIZ_OK, {})
          break

        case STATUS.DONE:
          this.ui.inputLocked = false
          this.ui.bizKey = payload.bizKey || ('LEAVE-' + Date.now())
          setTimeout(() => {
            this.logs.push('[事件] RESET（自动重置）')
            this.fsm.dispatch(EVENTS.RESET)
          }, 6000)
          break

        case STATUS.IDLE:
          this.ui = { inputLocked: false, tip: '', card: null, bizKey: '' }
          break
      }
    }
  }
}
</script>

<style scoped>
.fsm-header { margin-top: 20px; }
.fs-tip { margin-left: 10px; }
.fs-node { margin-right: 6px; font-size: 12px; }
.fs-done { text-decoration: line-through; opacity: 0.6; }
.fs-log { margin-top: 15px; }
.fs-log h4 { font-weight: normal; font-size: 14px; }
.fs-log ul { max-height: 160px; overflow-y: auto; padding-left: 20px; }
.fs-log li { font-size: 12px; }
pre { font-size: 12px; }
</style>
