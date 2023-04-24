import { ElMessage } from 'element-plus';
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
} from 'vue-router';

const routes: any = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/awardsSetting', //奖项设置
    name: 'AwardsSetting',
    component: () => import('../views/AwardsSetting.vue'),
  },
  {
    path: '/giftPerson',//抽奖人员
    name: 'GiftPerson',
    component: () => import('../views/GiftPerson.vue'),
  },
  {
    path: '/winList',//中奖名单
    name: 'WinList',
    component: () => import('../views/WinList.vue'),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// // 路由守卫，没有进行登录时，不能访问其他页面
// router.beforeEach( (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any)=> {
//   // to:进入某条路径的路由对象，from：从哪条路径来的路由对象，next：表示往下执行的下一步函数
//   // next可以写路由对象参数，也可以不写参数
  
//   if (to.path == '/' ) {
//     // 登录或者注册才可以往下进行
//     next();
// } else {
//     // 获取 token
//     const token = sessionStorage.getItem('token')
//     // token 不存在
//     if (token === null || token === '') {
//         // ElMessage.error('您还没有登录，请先登录');
//         next('/');
//         ElMessage.error('您还没有登录，请先登录');
//     } else {
//         next();
//     }
// }

// })

export default router;
