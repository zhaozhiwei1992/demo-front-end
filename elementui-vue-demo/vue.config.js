const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  // 前端所有发往/api的请求都会转发至后端服务http://127.0.0.1:8080/api
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/api',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/json': {
        target: 'http://127.0.0.1:8080/json',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/json': ''
        }
      }
    }
  }

})
