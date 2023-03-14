<template>
  <div>
    <!-- 动态引入组件 业务页面(当前) -> 组件模版页面 -> 组件 -->
    <ui-view v-bind:menuid="xx" ref="mainRef"></ui-view>
  </div>
</template>

<!-- vue 只能有一个script标签, 静态方式, 每个菜单一个vue文件-->
<script>
import common from './js/common.js'
import business from './js/dynamic-component-ext.js'
export default {
  ...common,
  ...business,
}
</script>

<!-- 如何实现引入多个并且合并到当前vue上下文中? -->