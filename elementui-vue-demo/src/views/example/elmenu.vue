<template>
  <el-row>
    <!-- 左侧菜单区 -->
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <!-- 动态左侧树 -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          style="margin-top: 20px"
          :collapse="isCollapse"
        >
          <template v-for="(item, index) in homeMenu">
            <el-submenu
              :index="item.index.toString()"
              v-if="item.children.length != 0"
              :key="index * 30"
            >
              <template slot="title">
                <i :class="item.icons"></i>
                <span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item
                :index="items.index.toString()"
                v-for="(items, indexs) in item.children"
                :key="indexs"
              >
                {{ items.title }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              :index="item.index.toString()"
              v-else
              :key="index * 2"
            >
              <i :class="item.icons"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </el-col>

    <!-- 右侧内容区 -->
    <el-col :span="20"
      ><div class="grid-content bg-purple-light">
        <div class="card jh-card">
          <router-view></router-view>
        </div></div
    ></el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/",
      // 左侧导航是否为鼠标划入显示二级菜单
      isCollapse: false,

      homeMenu: [
        { index: "/", title: "导航1", children: [] },
        {
          index: "/example/uiexample",
          title: "导航2",
          children: [
            { index: "/xx", title: "导航2-1", children: [] },
            { index: "/xx2", title: "导航2-2", children: [] },
          ],
        },
      ],
    };
  },

  methods: {
    // el-menu选中会传入链接信息 key === index
    handleSelect(key, keyPath) {
      console.log("点击了select");
      console.log(key, keyPath);
      // 跳转指定地址
      this.$router.push(key);
    },
  },
};
</script>