import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'PersonalHome', component: () => import('../views/PersonalProject.vue') },
  { path: '/all-stadiums', name: 'PersonalAllStadiums', component: () => import('../views/PersonalAllStadiums.vue') },
  { path: '/standings', name: 'PersonalStandings', component: () => import('../views/PersonalStandings.vue') },
  { path: '/login', name: 'PersonalLogin', component: () => import('../views/PersonalAuthView.vue') },
  { path: '/signup', name: 'PersonalSignup', component: () => import('../views/PersonalAuthView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({ history: createWebHashHistory(import.meta.env.BASE_URL), routes })
