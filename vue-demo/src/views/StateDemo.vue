<template>
  <div class="container">
    <div class="page-header">
      <h1>状态随 action 变化 <small>一个简单的状态机演示</small></h1>
      <p class="lead">
        状态存在 <code>data.status</code>，按钮是 <code>action</code>。
        每次点击 action，都会查一张「状态迁移表」来决定：当前状态下该 action 是否允许、跳转到哪个新状态。
        这是一个纯粹的 Vue 2 演示，不依赖任何外部状态机库。
      </p>
    </div>

    <div class="row clearfix">
      <div class="col-md-6">
        <!-- 当前状态 -->
        <div class="panel panel-primary">
          <div class="panel-heading">
            <strong>当前状态：{{ status }}</strong>
          </div>
          <div class="panel-body">
            <span
              v-for="st in STATUS"
              :key="st"
              class="label"
              :class="status === st ? 'label-primary fs-node-active' : 'label-default fs-node'"
            >{{ st }}</span>
            <hr>
            <p class="text-muted">最后事件：{{ lastAction || '（暂无）' }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- action 按钮区 -->
        <div class="panel panel-default">
          <div class="panel-heading">可用 action（灰色 = 当前状态不允许）</div>
          <div class="panel-body">
            <button
              v-for="act in ACTIONS"
              :key="act"
              class="btn"
              :class="can(act) ? 'btn-primary' : 'btn-default'"
              :disabled="!can(act)"
              @click="doAction(act)"
            >{{ act }}</button>
          </div>
        </div>

        <!-- 事件历史 -->
        <div class="panel panel-default">
          <div class="panel-heading">事件历史</div>
          <div class="panel-body">
            <ul>
              <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
              <li v-if="!logs.length" class="text-muted">（尚无事件，点上面的按钮试试）</li>
            </ul>
          </div>
        </div>

        <button class="btn btn-warning" @click="reset">重置</button>
      </div>
    </div>
  </div>
</template>

<script>
// ===== 状态 / action 枚举 =====
const STATUS = {
  PENDING: 'pending',      // 待支付
  PAID: 'paid',            // 已支付
  SHIPPED: 'shipped',      // 已发货
  COMPLETED: 'completed',  // 已完成（终态）
  CANCELLED: 'cancelled'   // 已取消（终态）
}

const ACTIONS = ['pay', 'ship', 'complete', 'cancel']

// ===== 状态迁移表：action -> { from: 允许的源状态[], to: 目标状态 } =====
// 这是「状态随 action 变化」的核心：状态怎么变，全由这张表决定
const TRANSITIONS = {
  pay:      { from: [STATUS.PENDING],  to: STATUS.PAID },
  ship:     { from: [STATUS.PAID],     to: STATUS.SHIPPED },
  complete: { from: [STATUS.SHIPPED],  to: STATUS.COMPLETED },
  cancel:   { from: [STATUS.PENDING, STATUS.PAID], to: STATUS.CANCELLED }
}

export default {
  name: 'StateDemo',
  data() {
    return {
      STATUS,            // 暴露给模板遍历
      ACTIONS,           // 暴露给模板遍历
      status: STATUS.PENDING,
      lastAction: '',
      logs: []
    }
  },
  methods: {
    // 当前状态下，某个 action 是否允许执行
    can(action) {
      const t = TRANSITIONS[action]
      return !!t && t.from.indexOf(this.status) > -1
    },
    doAction(action) {
      if (!this.can(action)) return
      const t = TRANSITIONS[action]
      const from = this.status
      const to = t.to
      this.status = to
      this.lastAction = action
      this.logs.push(`[action] ${action} : ${from} → ${to}`)
    },
    reset() {
      this.status = STATUS.PENDING
      this.lastAction = ''
      this.logs = []
    }
  }
}
</script>

<style scoped>
.fs-node { margin: 0 6px 6px 0; display: inline-block; }
.fs-node-active { margin: 0 6px 6px 0; display: inline-block; }
</style>
