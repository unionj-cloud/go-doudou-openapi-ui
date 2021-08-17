import { OpenAPIV3 } from 'openapi-types'
import { RouteConfig } from 'vue-router'
import Doc from '@/views/doc/index.vue'
import Layout from '@/layout/index.vue'
import _, { now } from 'lodash'

export function endpoint2Key(endpoint: string): string {
  return endpoint.replace(/[{}]/ig, '_').replace(/[^a-zA-Z0-9_]/ig, '')
}

export function endpoint2ModuleName(endpoint: string): string {
  return endpoint.split('/')[1]
}

function getFirstPart(endpoint:string) {
  return `${endpoint2ModuleName(endpoint)}${(Date.now() + '').substring(8) + (+Math.random().toFixed(6)) * 1000000}`
}

export const paths2Route = (paths: OpenAPIV3.PathsObject): RouteConfig[] => {
  const routes: RouteConfig[] = []
  Object.keys(paths).sort().forEach(endpoint => {
    const pathItem = paths[endpoint]
    if (pathItem?.get) {
      const method = 'get'
      const summary = pathItem.get.summary
      let tag = endpoint2ModuleName(endpoint)
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
      let tag = endpoint2ModuleName(endpoint)
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
      let tag = endpoint2ModuleName(endpoint)
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
      let tag = endpoint2ModuleName(endpoint)
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
  return _.sortBy(result, [function(o) { return o.path }])
}

export interface HomeTable {
  module: string
  summary: string
  path: string
  method: string
  description: string
  route: string
}

export function paths2HomeTable(paths: OpenAPIV3.PathsObject): HomeTable[] {
  const table: HomeTable[] = []
  Object.keys(paths).sort().forEach(endpoint => {
    const pathItem = paths[endpoint]
    const _tag = endpoint2ModuleName(endpoint)
    const firstPart = getFirstPart(endpoint)
    if (pathItem?.get) {
      const method = 'get'
      const summary = pathItem.get.summary || ''
      let tag = _tag
      if (pathItem.get.tags?.length) {
        tag = pathItem.get.tags[0]
      }
      table.push({
        module: tag,
        summary,
        path: endpoint,
        method,
        description: pathItem.get.description || '',
        route: `/${firstPart}/${encodeURIComponent(endpoint)}/${method}`
      })
    }
    if (pathItem?.post) {
      const method = 'post'
      const summary = pathItem.post.summary || ''
      let tag = _tag
      if (pathItem.post.tags?.length) {
        tag = pathItem.post.tags[0]
      }
      table.push({
        module: tag,
        summary,
        path: endpoint,
        method,
        description: pathItem.post.description || '',
        route: `/${firstPart}/${encodeURIComponent(endpoint)}/${method}`
      })
    }
    if (pathItem?.put) {
      const method = 'put'
      const summary = pathItem.put.summary || ''
      let tag = _tag
      if (pathItem.put.tags?.length) {
        tag = pathItem.put.tags[0]
      }
      table.push({
        module: tag,
        summary,
        path: endpoint,
        method,
        description: pathItem.put.description || '',
        route: `/${firstPart}/${encodeURIComponent(endpoint)}/${method}`
      })
    }
    if (pathItem?.delete) {
      const method = 'delete'
      const summary = pathItem.delete.summary || ''
      let tag = _tag
      if (pathItem.delete.tags?.length) {
        tag = pathItem.delete.tags[0]
      }
      table.push({
        module: tag,
        summary,
        path: endpoint,
        method,
        description: pathItem.delete.description || '',
        route: `/${firstPart}/${encodeURIComponent(endpoint)}/${method}`
      })
    }
  })
  return _.sortBy(table, [function(o) { return o.path }])
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
