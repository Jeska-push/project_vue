import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      name: 'catalog',
      path: '/',
      component: () => import('../views/CatalogView.vue')
    },
    {
      name: 'product',
      path: '/product',
      component: () => import('../views/ProductView.vue')
    },
    {
      name: 'product',
      path: '/product/:id',
      component: () => import('..//views/ProductView.vue')
    },
    {
      name: 'delivery',
      path: '/delivery',
      component: () => import('..//components/TheDelivery.vue')
    },
    {
      name: 'basket',
      path: '/basket',
      component: () => import('..//views/BasketView.vue')
    },
    {
      name: 'order',
      path: '/order',
      component: () => import('..//views/OrderView.vue')
    },

    {
      name: 'succesOrder',
      path: '/succesOrder',
      component: () => import('..//views/SuccesOrderView.vue')
    },
    {
      name: 'not-found',
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
