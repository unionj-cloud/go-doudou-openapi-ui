import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

import Tab from '@/views/tab/index.vue'
import Doc from '@/views/doc/index.vue'

Vue.use(VueRouter)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'index',
        component: Tab,
        name: 'Tab',
        meta: {
          title: 'tab',
          icon: 'tab'
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/pet',
    component: Layout,
    redirect: '/pet/index',
    name: 'Pet',
    meta: {
      title: 'pet',
      icon: 'nested'
    },
    children: [
      {
        path: 'index',
        component: Doc,
        name: 'Index',
        meta: {
          title: 'index'
        }
      },
      {
        path: '%2Fpet%2F%7Bid%7D',
        component: Doc,
        name: 'Jack',
        meta: {
          title: 'jack'
        },
        redirect: '/%2Fpet%2F%7Bid%7D/get',
        children: [
          {
            path: 'get',
            component: Doc,
            name: 'Jack:Get',
            meta: {
              title: 'get'
            }
          },
          {
            path: 'post',
            component: Doc,
            name: 'Jack:Post',
            meta: {
              title: 'post'
            }
          },
          {
            path: 'put',
            component: Doc,
            name: 'Jack:Put',
            meta: {
              title: 'put'
            }
          },
          {
            path: 'delete',
            component: Doc,
            name: 'Jack:Delete',
            meta: {
              title: 'delete'
            }
          }
        ]
      },
      {
        path: '%2Fpet%2Fpage',
        component: Doc,
        name: 'Rose',
        meta: {
          title: 'rose'
        },
        redirect: '/%2Fpet%2Fpage/get',
        children: [
          {
            path: 'get',
            component: Doc,
            name: 'Rose:Get',
            meta: {
              title: 'get'
            }
          },
          {
            path: 'post',
            component: Doc,
            name: 'Rose:Post',
            meta: {
              title: 'post'
            }
          },
          {
            path: 'put',
            component: Doc,
            name: 'Rose:Put',
            meta: {
              title: 'put'
            }
          },
          {
            path: 'delete',
            component: Doc,
            name: 'Rose:Delete',
            meta: {
              title: 'delete'
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
