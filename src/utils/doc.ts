import { OpenAPIV3 } from 'openapi-types'
import { RouteConfig } from 'vue-router'
import Doc from '@/views/doc/index.vue'
import Layout from '@/layout/index.vue'
import _ from 'lodash'
import { debug } from 'node:console'

export function endpoint2Key(endpoint: string): string {
  return endpoint.replace(/[{}]/ig, '_').replace(/[^a-zA-Z0-9_]/ig, '')
}

export function endpoint2ModuleName(endpoint: string): string {
  return endpoint.split('/')[1]
}

function getFirstPart(endpoint: string) {
  return endpoint2ModuleName(endpoint)
}

export const paths2Route = (paths: OpenAPIV3.PathsObject): RouteConfig[] => {
  const routes: RouteConfig[] = []
  Object.keys(paths).sort().forEach(endpoint => {
    const pathItem = paths[endpoint]
    if (pathItem?.get) {
      const method = 'get'
      const summary = pathItem.get.summary
      const tag = endpoint2ModuleName(endpoint)
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false,
          summary,
          method,
          description: pathItem.get.description
        }
      })
    }
    if (pathItem?.post) {
      const method = 'post'
      const summary = pathItem.post.summary
      const tag = endpoint2ModuleName(endpoint)
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false,
          summary,
          method,
          description: pathItem.post.description
        }
      })
    }
    if (pathItem?.put) {
      const method = 'put'
      const summary = pathItem.put.summary
      const tag = endpoint2ModuleName(endpoint)
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false,
          summary,
          method,
          description: pathItem.put.description
        }
      })
    }
    if (pathItem?.delete) {
      const method = 'delete'
      const summary = pathItem.delete.summary
      const tag = endpoint2ModuleName(endpoint)
      routes.push({
        path: `${encodeURIComponent(endpoint)}/${method}`,
        name: `${endpoint2Key(endpoint)}:${method}`,
        component: Doc,
        meta: {
          title: summary || `${method.toUpperCase()} ${endpoint}`,
          tag,
          endpoint,
          i18n: false,
          summary,
          method,
          description: pathItem.delete.description
        }
      })
    }
  })
  const groupBy = _.groupBy(routes, 'meta.tag')
  const result: RouteConfig[] = []
  Object.keys(groupBy).forEach(key => {
    const routes = _.sortBy(groupBy[key], ['meta.endpoint'])
    const { endpoint } = routes[0].meta
    const firstPart = getFirstPart(endpoint)
    const moduleName = _.capitalize(key)
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
  return _.sortBy(result, ['meta.title'])
}

export interface HomeTable {
  module: string
  summary: string
  path: string
  method: string
  description: string
  route: string
}

export function routes2HomeTable(routes: RouteConfig[]): HomeTable[] {
  const table: HomeTable[] = []
  routes.forEach((route: RouteConfig) => {
    route.children?.forEach(subRoute => {
      table.push({
        module: _.capitalize(subRoute.meta.tag),
        summary: subRoute.meta.summary,
        path: subRoute.meta.endpoint,
        method: subRoute.meta.method,
        description: subRoute.meta.description || '',
        route: `${route.path}/${subRoute.path}`
      })
    })
  })
  return _.sortBy(table, ['module', 'path'])
}

export function tagType(method: string): string {
  switch (method) {
    case 'get': {
      return ''
    }
    case 'post': {
      return 'success'
    }
    case 'put': {
      return 'warning'
    }
    case 'delete': {
      return 'danger'
    }
    default: {
      return 'info'
    }
  }
}
