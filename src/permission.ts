import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import { DocModule } from '@/store/modules/doc'
import settings from './settings'

NProgress.configure({ showSpinner: false })

const getPageTitle = (key: string) => {
  return `${settings.title}`
}

DocModule.GetDocument()
  .then(() => {
    return PermissionModule.GenerateRoutes([])
  })
  .then(() => {
    PermissionModule.dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })
  })

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  next()
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
