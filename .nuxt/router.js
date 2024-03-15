import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _15e931d4 = () => interopDefault(import('..\\pages\\carrito.vue' /* webpackChunkName: "pages/carrito" */))
const _067ac470 = () => interopDefault(import('..\\pages\\catalago.vue' /* webpackChunkName: "pages/catalago" */))
const _98880672 = () => interopDefault(import('..\\pages\\login_prueba.vue' /* webpackChunkName: "pages/login_prueba" */))
const _9a65e8c8 = () => interopDefault(import('..\\pages\\venta.vue' /* webpackChunkName: "pages/venta" */))
const _ae29d1bc = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/carrito",
    component: _15e931d4,
    name: "carrito"
  }, {
    path: "/catalago",
    component: _067ac470,
    name: "catalago"
  }, {
    path: "/login_prueba",
    component: _98880672,
    name: "login_prueba"
  }, {
    path: "/venta",
    component: _9a65e8c8,
    name: "venta"
  }, {
    path: "/",
    component: _ae29d1bc,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
