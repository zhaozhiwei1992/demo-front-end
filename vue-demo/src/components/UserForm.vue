<template>
  <form role="form" @submit="onSubmit">
    <!-- mode === 'detail' 时禁用编辑 -->
    <div class="form-group">
      <label for="userid">id</label>
      <input
        type="text"
        class="form-control"
        id="userid"
        v-model="form.id"
        :disabled="readonly"
      />
    </div>
    <div class="form-group">
      <label for="username">name</label>
      <input
        type="text"
        class="form-control"
        placeholder="username"
        id="username"
        v-model="form.name"
        :disabled="readonly"
      />
    </div>
    <div class="form-group">
      <label for="userage">age</label>
      <input
        type="text"
        class="form-control"
        placeholder="age"
        id="userage"
        v-model="form.age"
        :disabled="readonly"
      />
    </div>
    <div class="form-group">
      <label for="userpassword">password</label>
      <input
        type="password"
        class="form-control"
        placeholder="password"
        id="userpassword"
        v-model="form.password"
        :disabled="readonly"
      />
    </div>

    <!-- detail 模式不显示提交按钮，返回由外部 router-link 负责 -->
    <button v-if="!readonly" type="submit" class="btn btn-default">
      {{ submitText }}
    </button>
  </form>
</template>

<script>
// 复用的用户表单
// 通过 mode prop 区分三种形态：
//   add    -> 新增（空表单，提交触发 add）
//   edit   -> 修改（带默认值，提交触发 update）
//   detail -> 只读详情
// 提交时 $emit('submit')，由父组件决定如何调用接口、跳转。
export default {
  name: 'UserForm',
  props: {
    // 初始表单数据（父组件传入）
    initialUser: {
      type: Object,
      default: () => ({ id: '', name: '', age: '', password: '' })
    },
    // add | edit | detail
    mode: {
      type: String,
      default: 'add'
    }
  },
  data() {
    // 用 {...initialUser} 拷贝一份，避免直接改 props 引用
    return {
      form: { ...this.initialUser }
    }
  },
  watch: {
    // 父组件异步拿到数据后整体替换 initialUser 时，同步到内部 form
    initialUser: {
      handler(val) {
        this.form = { ...val }
      },
      deep: true
    }
  },
  computed: {
    readonly() {
      return this.mode === 'detail'
    },
    submitText() {
      return this.mode === 'edit' ? '保存修改' : '提交'
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      if (this.readonly) return
      this.$emit('submit', { ...this.form })
    }
  }
}
</script>
