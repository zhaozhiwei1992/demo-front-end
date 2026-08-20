// 状态 与 事件 枚举 —— 纯字符串常量，无任何 Vue 依赖
export const STATUS = {
  IDLE: 'IDLE',                       // 空闲，等待用户输入
  UNDERSTANDING: 'UNDERSTANDING',     // 正在理解用户意图（调 LLM）
  AWAITING_CONFIRM: 'AWAITING_CONFIRM', // 等用户确认预览
  COMMITTING: 'COMMITTING',           // 正在提交业务校验
  VALIDATING: 'VALIDATING',           // 业务侧校验中
  REVISING: 'REVISING',               // 追问/修正
  COMPLETE: 'COMPLETE',               // 表单完成
  SUBMITTING: 'SUBMITTING',           // 正式提交中
  DONE: 'DONE'                        // 终态
}

export const EVENTS = {
  USER_INPUT: 'USER_INPUT',           // 用户输入
  LLM_READY: 'LLM_READY',             // LLM 返回结果
  USER_CONFIRM: 'USER_CONFIRM',       // 用户确认
  USER_SUPPLEMENT: 'USER_SUPPLEMENT', // 用户补充信息
  USER_CANCEL: 'USER_CANCEL',         // 用户取消
  REQ_SENT: 'REQ_SENT',               // 请求已发送
  BIZ_PASS: 'BIZ_PASS',               // 业务校验通过
  BIZ_FAIL: 'BIZ_FAIL',               // 业务校验失败
  USER_SUBMIT: 'USER_SUBMIT',         // 用户提交
  USER_AMEND: 'USER_AMEND',           // 用户修改
  BIZ_OK: 'BIZ_OK',                   // 提交换行成功
  BIZ_ERR: 'BIZ_ERR',                 // 提交业务失败
  RESET: 'RESET'                      // 重置
}
