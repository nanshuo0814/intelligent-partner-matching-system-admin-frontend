import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 roles: ['admin','editor']    control the page roles (you can set multiple roles)
 title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
 breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作台', icon: 'dashboard' }
    }]
  },
  {
    path: '/homePage',
    component: Layout,
    children: [
      {
        name: 'homePageAdmin',
        path: '/homePage/admin',
        component: () => import('@/views/homePage/HomePageAdmin'),
        meta: { title: '首页内容管理', icon: 'homePage' }
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        name: 'UserAdmin',
        path: '/user/admin',
        component: () => import('@/views/user/UserAdmin'),
        meta: { title: '用户管理', icon: 'user' }
      },
    ]
  },
  {
    path: '/post',
    component: Layout,
    children: [
      {
        name: 'PostAdmin',
        path: '/admin/post',
        component: () => import('@/views/post/PostAdmin'),
        meta: { title: '帖子管理', icon: 'post' }
      },
    ]
  },
  {
    path: '/post/commnet',
    component: Layout,
    children: [
      {
        name: 'PostAdmin',
        path: '/admin/post/comment',
        component: () => import('@/views/postComment/PostCommentAdmin'),
        meta: { title: '帖子评论管理', icon: 'postComment' }
      },
    ]
  },
  {
    path: '/team',
    component: Layout,
    children: [
      {
        name: 'TeamAdmin',
        path: '/team/admin',
        component: () => import('@/views/team/TeamAdmin'),
        meta: { title: '队伍管理', icon: 'team' }
      },
    ]
  },
  {
    path: '/tag',
    component: Layout,
    children: [
      {
        name: 'TagAdmin',
        path: '/tag/admin',
        component: () => import('@/views/tag/TagAdmin'),
        meta: { title: '标签管理', icon: 'tag' }
      },
    ]
  },
  {
    path: '/report',
    component: Layout,
    children: [
      {
        name: 'ReportAdmin',
        path: '/report/admin',
        component: () => import('@/views/report/ReportAdmin'),
        meta: { title: '举报反馈管理', icon: 'report' }
      },
    ]
  },
  {
    path: '/info',
    component: Layout,
    children: [
      {
        name: 'UserInfo',
        path: '/info/user',
        component: () => import('@/views/user/UserInfo'),
        meta: { title: '个人信息管理', icon: 'form' }
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
