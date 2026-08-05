import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/team/', name: 'team-home', component: () => import('../team-views/MainDashboardView.vue') },
  { path: '/team/weather', name: 'team-weather', component: () => import('../team-views/WeatherHomeView.vue') },
  { path: '/team/about', name: 'team-about', component: () => import('../team-views/WeatherAboutView.vue') },
  { path: '/team/stocks', name: 'team-stocks', component: () => import('../team-views/StockChartView.vue') },
  { path: '/team/subscribe', name: 'team-subscribe', component: () => import('../team-views/SubscriptionCheckoutView.vue') },
  { path: '/team/weather/:cityId', name: 'team-weather-detail', component: () => import('../team-views/WeatherDetailView.vue') },
  { path: '/team/:pathMatch(.*)*', name: 'team-not-found', component: () => import('../team-views/NotFoundView.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
