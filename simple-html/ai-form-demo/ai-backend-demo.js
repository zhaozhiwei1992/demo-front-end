/**
 * ai-backend-demo.js — 模拟「AI 后端」翻译器（业务无关，规则式）
 *
 * 对应通用协议第④层。本 demo 用确定性规则模拟 LLM 的三类能力，
 * 便于无后端也能跑通全链路；真实环境替换为 LLM 调用即可：
 *   1) 意图/实体抽取：从用户自然语言里抽字段值
 *   2) 校验反馈解析：把业务校验(raw/结构化)映射成字段 status
 *   3) 生成人话追问 + blocks 渲染报文
 *
 * 所有业务语义（字段 label/报错词）都从 schema 读取，不写死。
 */
(function (global) {
  // ---- 关键词抽取：根据 schema 字段对用户原话做粗粒度匹配（业务无关启发式）----
  function extractValues(userText, schema) {
    const vals = {};
    schema.fields.forEach((f) => {
      if (f.type === 'date') {
        // 匹配 5月11日 / 2026-05-11 / 明天(占位)
        const m = userText.match(/(\d{4}[-年]\d{1,2}[-月]\d{1,2}日?|\d{1,2}月\d{1,2}日)/);
        if (m) vals[f.code] = m[0];
      } else if (f.type === 'enum') {
        const hit = f.options.find((o) => userText.indexOf(o.value) >= 0 || userText.indexOf(o.label) >= 0);
        if (hit) vals[f.code] = hit.value;
      } else {
        // string/number 等：从 label 之后截取，到下一个字段 label 或日期/枚举 token 即截断
        const idx = userText.indexOf(f.label);
        if (idx >= 0) {
          let rest = userText.slice(idx + f.label.length).replace(/^[:：是]/, '').trim();
          // 截断边界：其余字段 label、日期模式、枚举 value/label
          let cut = rest.length;
          schema.fields.forEach((other) => {
            if (other === f) return;
            const at = rest.indexOf(other.label);
            if (at >= 0 && at < cut) cut = at;
            if (other.type === 'enum') {
              other.options.forEach((o) => {
                const at2 = rest.indexOf(o.value);
                const at3 = rest.indexOf(o.label);
                if (at2 >= 0 && at2 < cut) cut = at2;
                if (at3 >= 0 && at3 < cut) cut = at3;
              });
            }
          });
          const date = rest.match(/(\d{1,2}月\d{1,2}日|\d{4}[-年]\d{1,2}[-月]\d{1,2})/);
          if (date && date.index >= 0 && date.index < cut) cut = date.index;
          rest = rest.slice(0, cut).trim();
          if (rest) vals[f.code] = rest;
        }
      }
    });
    return vals;
  }

  // ---- 校验反馈解析（支持结构化 fieldResults 或 raw 文本）----
  function parseValidation(feedback, schema) {
    const results = [];
    if (Array.isArray(feedback.fieldResults)) {
      return feedback.fieldResults; // 结构化直达
    }
    const raw = (feedback.raw || '').toString();
    schema.fields.forEach((f) => {
      if (!f.required) return;
      const alias = [f.label, ...(f.validationAlias || [])].join(' ');
      const mentioned = alias && raw.split(/[,，;；\n\s]+/).some((seg) => seg && alias.indexOf(seg) >= 0);
      if (mentioned) {
        results.push({ code: f.code, status: 'missing', message: '系统必填' });
      }
    });
    return results;
  }

  /** 生成 AI 后端渲染报文：reply + form_summary blocks + suggestions */
  function buildRender({ schema, values, userText, mode, validation }) {
    const fieldsView = [];
    schema.fields.forEach((f) => {
      const v = values[f.code];
      if (mode === 'VALIDATION_RESULT' && validation) {
        const pv = validation.find((x) => x.code === f.code);
        if (pv && pv.status === 'missing') {
          fieldsView.push({ code: f.code, label: f.label, value: '未填', status: 'missing', reason: pv.message || '必填' });
          return;
        }
      }
      if (v === undefined || v === null || v === '') {
        fieldsView.push({ code: f.code, label: f.label, value: '未填', status: 'missing', reason: '必填项未提及' });
      } else {
        fieldsView.push({ code: f.code, label: f.label, value: v, status: 'ok' });
      }
    });

    const missing = fieldsView.filter((x) => x.status === 'missing');
    let reply;
    if (mode === 'VALIDATION_RESULT') {
      reply = missing.length
        ? `表单校验还差 ${missing.length} 项必填：\n${missing.map((x, i) => `${i + 1}. ${x.label}`).join('\n')}\n请补充后我可再帮您写入。`
        : '校验通过，信息已完整。可确认提交。';
    } else {
      reply = missing.length
        ? `我理解了您的意图，还差 ${missing.length} 项必填：\n${missing.map((x, i) => `${i + 1}. ${x.label}`).join('\n')}`
        : '我理解了您的意图，信息已完整，确认无误后写入表单。';
    }

    return {
      reply,
      blocks: [
        {
          type: 'form_summary',
          data: { formName: schema.formName, fields: fieldsView },
        },
      ],
      suggestions: missing.length
        ? missing.map((x) => `补充${x.label}`).concat(['取消'])
        : ['确认提交', '再改改'],
      inputLocked: false,
      values, // 供宿主落值
    };
  }

  /** 完整一轮翻译入口 */
  function translate({ userText, schema, mode, validation, lastValues }) {
    const values = Object.assign({}, lastValues || {}, extractValues(userText, schema));
    return buildRender({ schema, values, userText, mode, validation });
  }

  global.AIBackend = { translate, parseValidation, extractValues };
})(window);
