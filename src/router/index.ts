import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { OpenAPIV3 } from 'openapi-types'
import _ from 'lodash'

/* Layout */
import Layout from '@/layout/index.vue'

import Tab from '@/views/tab/index.vue'
import DocIndex from '@/views/doc/index.vue'
import DocDetail from '@/views/doc/detail.vue'

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

function endpoint2Key(endpoint: string) :string {
  return endpoint.replace(/[{}]/ig, '_').replace(/[^a-zA-Z0-9_]/ig, '')
}

function endpoint2ModuleName(endpoint: string) :string {
  return endpoint.split('/')[1]
}

export const paths2Route = (paths: OpenAPIV3.PathsObject): RouteConfig[] => {
  const routes: RouteConfig[] = []
  Object.keys(paths).forEach(endpoint => {
    const pathItem = paths[endpoint]
    const firstPart = endpoint2ModuleName(endpoint)
    let moduleName = _.capitalize(firstPart)
    let method = ''
    let summary
    if (pathItem?.get) {
      method = 'get'
      summary = pathItem.get.summary
      if (pathItem.get.tags?.length) {
        moduleName = pathItem.get.tags[0]
      }
    }
    if (pathItem?.post) {
      method = 'post'
      summary = pathItem.post.summary
      if (pathItem.post.tags?.length) {
        moduleName = pathItem.post.tags[0]
      }
    }
    if (pathItem?.put) {
      method = 'put'
      summary = pathItem.put.summary
      if (pathItem.put.tags?.length) {
        moduleName = pathItem.put.tags[0]
      }
    }
    if (pathItem?.delete) {
      method = 'delete'
      summary = pathItem.delete.summary
      if (pathItem.delete.tags?.length) {
        moduleName = pathItem.delete.tags[0]
      }
    }
    const route: RouteConfig = {
      path: `/${firstPart}`,
      component: Layout,
      redirect: `/${firstPart}/index`,
      name: _.capitalize(firstPart),
      meta: {
        title: moduleName,
        icon: 'nested'
      },
      children: [
        {
          path: `${encodeURIComponent(endpoint)}/${method}`,
          name: `${endpoint2Key(endpoint)}:${method}`,
          component: DocDetail,
          meta: {
            title: summary || `${method.toUpperCase()} ${endpoint}`
          }
        }
      ]
    }
    routes.push(route)
  })
  const groupBy = _.groupBy(routes, 'meta.title')
  const result: RouteConfig[] = []
  Object.keys(groupBy).forEach(key => {
    const routes = groupBy[key]
    const father = routes[0]
    const children = routes.map(route => route.children).reduce((x, y) => x?.concat(y || []), [])
    let _sortedChildren: RouteConfig[] = [{
      path: 'index',
      component: DocIndex,
      name: `${father.name}:Index`,
      meta: {
        title: `${father.meta.title}`
      }
    }]
    let filtered: RouteConfig[] = children?.filter(child => child.name?.split(':')[1] === 'get') || []
    _sortedChildren = [..._sortedChildren, ...filtered]
    filtered = children?.filter(child => child.name?.split(':')[1] === 'post') || []
    _sortedChildren = [..._sortedChildren, ...filtered]
    filtered = children?.filter(child => child.name?.split(':')[1] === 'put') || []
    _sortedChildren = [..._sortedChildren, ...filtered]
    filtered = children?.filter(child => child.name?.split(':')[1] === 'delete') || []
    _sortedChildren = [..._sortedChildren, ...filtered]
    father.children = [..._sortedChildren]
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
