// 纯状态机工厂 —— 完全不依赖 Vue，可单测、可复用、不随组件销毁丢逻辑
import { transitions } from './transitions'
import { STATUS } from './types'

/**
 * @param {{ onEnter?: (state, payload, session) => void | { [state]: (payload, session) => void },
 *           onLeave?: (state, next, payload) => void | { [state]: (state, next, payload) => void } }} hooks
 */
export function createFsm({ onEnter, onLeave } = {}) {
  let status = STATUS.IDLE
  let session = {}

  // 兼容两种回调形态：单个函数 / 按状态映射的对象

  // dispatch 事件：查表决定是否流转，返回 { status, consumed }
  function dispatch(event, payload) {
    const stateTransitions = transitions[status] || {}
    const next = stateTransitions[event]
    if (!next) return { status, consumed: false }

    // onLeave 在状态变更前调用，指向旧状态
    if (onLeave) {
      const h = typeof onLeave === 'function' ? onLeave : onLeave[status]
      if (h) h(status, next, payload)
    }
    status = next
    if (onEnter) {
      const h = typeof onEnter === 'function' ? onEnter : onEnter[next]
      if (h) h(next, payload, session)
    }
    return { status, consumed: true }
  }

  function getStatus() { return status }
  function setSession(s) { session = { ...session, ...s } }
  function getSession() { return session }
  function reset() { status = STATUS.IDLE; session = {} }

  return { dispatch, getStatus, getSession, setSession, reset }
}
