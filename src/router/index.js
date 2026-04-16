import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import AccountView from '../views/AccountView.vue'
import CartView from '../views/CartView.vue'
import ItemView from '../views/ItemView.vue'
import CheckoutView from '../views/Checkout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },

    // Temporary routing fix for individual clothing items
    {
      path: '/item/:id',
      name: 'item',
      component: ItemView,
    }
  ],
})

export default router