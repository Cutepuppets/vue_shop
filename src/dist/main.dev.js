"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router.js"));

require("./plugins/element.js");

require("./assets/css/global.css");

require("./assets/fonts/iconfont.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//引入全局样式表
//导入字体图标
//配置请求根路径
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

_axios["default"].interceptors.request.use(function (config) {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token'); // 在最后必须 return config

  return config;
}); //导入并挂载axios


_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false; //程序启动的入口JS
//挂载导入的路由和渲染导入的App跟组件页面

new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');