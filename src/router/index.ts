import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { OpenAPIV3 } from 'openapi-types'
import _ from 'lodash'

/* Layout */
import Layout from '@/layout/index.vue'

import Redirect from '@/views/redirect/index.vue'
import Home from '@/views/home/index.vue'
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
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: Redirect
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: Home,
        name: 'Home',
        meta: {
          title: 'home',
          icon: 'home',
          affix: true,
          i18n: true
        }
      }
    ]
  }
]

function endpoint2Key(endpoint: string) :string {
  return endpoint.replace(/[{}]/ig, '_').replace(/[^a-zA-Z0-9_]/ig, '')
}

function endpoint2ModuleName(endpoint: string) :string {
  return endpoint.split('/')[1]
}

export const paths2Route = (paths: OpenAPIV3.PathsObject): RouteConfig[] => {
  const routes: RouteConfig[] = []
  Object.keys(paths).sort().forEach(endpoint => {
    const pathItem = paths[endpoint]
    if (pathItem?.get) {
      const method = 'get'
      const summary = pathItem.get.summary
      let tag = ''
      if (pathItem.get.tags?.length) {
        tag = pathItem.get.tags[0]
      }
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false
        }
      })
    }
    if (pathItem?.post) {
      const method = 'post'
      const summary = pathItem.post.summary
      let tag = ''
      if (pathItem.post.tags?.length) {
        tag = pathItem.post.tags[0]
      }
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false
        }
      })
    }
    if (pathItem?.put) {
      const method = 'put'
      const summary = pathItem.put.summary
      let tag = ''
      if (pathItem.put.tags?.length) {
        tag = pathItem.put.tags[0]
      }
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false
        }
      })
    }
    if (pathItem?.delete) {
      const method = 'delete'
      const summary = pathItem.delete.summary
      let tag = ''
      if (pathItem.delete.tags?.length) {
        tag = pathItem.delete.tags[0]
      }
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false
        }
      })
    }
  })
  const groupBy = _.groupBy(routes, 'meta.tag')
  const result: RouteConfig[] = []
  Object.keys(groupBy).forEach(key => {
    const routes = groupBy[key]
    const { endpoint } = routes[0].meta
    const firstPart = endpoint2ModuleName(endpoint)
    const moduleName = _.capitalize(firstPart)
    const father: RouteConfig = {
      path: `/${firstPart}`,
      component: Layout,
      redirect: `/${firstPart}/${routes[0].path}`,
      name: _.capitalize(firstPart),
      meta: {
        title: moduleName,
        icon: 'nested',
        i18n: false
      },
      children: [...routes]
    }
    result.push(father)
  })
  return _.sortBy(result, [function(o) { return o.path }])
}

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
