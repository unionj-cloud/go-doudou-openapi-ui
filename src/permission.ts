import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'

NProgress.configure({ showSpinner: false })

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

PermissionModule.GenerateRoutes([])
// Dynamically add accessible routes
PermissionModule.dynamicRoutes.forEach(route => {
  router.addRoute(route)
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
