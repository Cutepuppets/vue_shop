"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Login = _interopRequireDefault(require("./components/Login.vue"));

var _Home = _interopRequireDefault(require("./components/Home.vue"));

var _Welcome = _interopRequireDefault(require("./components/Welcome.vue"));

var _Users = _interopRequireDefault(require("./components/user/Users.vue"));

var _Rights = _interopRequireDefault(require("./components/power/Rights"));

var _Roles = _interopRequireDefault(require("./components/power/Roles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]); //导出路由规则


var router = new _vueRouter["default"]({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: _Login["default"]
  }, {
    path: '/home',
    component: _Home["default"],
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: _Welcome["default"]
    }, {
      path: '/users',
      component: _Users["default"]
    }, {
      path: '/rights',
      component: _Rights["default"]
    }, {
      path: '/roles',
      component: _Roles["default"]
    }]
  }]
}); // 挂载路由导航守卫

router.beforeEach(function (to, from, next) {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next(); // 获取token

  var tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
});
var _default = router;
exports["default"] = _default;