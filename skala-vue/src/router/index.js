import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Personal Project - Main Dashboard
  {
    path: '/personal/',
    name: 'PersonalHome',
    component: () => import('../views/PersonalProject.vue'),
  },
  {
    path: '/personal/all-stadiums',
    name: 'PersonalAllStadiums',
    component: () => import('../views/PersonalAllStadiums.vue'),
  },
  {
    path: '/personal/standings',
    name: 'PersonalStandings',
    component: () => import('../views/PersonalStandings.vue'),
  },
  // Personal Exercises - Nested routes for assignments 4 & 5
  {
    path: '/personal/exercises',
    component: () => import('../AppExercise.vue'),
    children: [
      {
        path: '',
        name: 'ExerciseHome',
        component: () => import('../views/WeatherHomeView.vue'),
      },
      {
        path: 'about',
        name: 'ExerciseAbout',
        component: () => import('../views/WeatherAboutView.vue'),
      },
      {
        path: 'weather/:cityId',
        name: 'ExerciseWeatherDetail',
        component: () => import('../views/WeatherDetailView.vue'),
      },
    ]
  },
  // Team Project
  {
    path: '/team/',
    name: 'team-home',
    component: () => import('../team-views/MainDashboardView.vue'),
  },
  {
    path: '/team/weather',
    name: 'team-weather',
    component: () => import('../team-views/WeatherHomeView.vue'),
  },
  {
    path: '/team/about',
    name: 'team-about',
    component: () => import('../team-views/WeatherAboutView.vue'),
  },
  {
    path: '/team/stocks',
    name: 'team-stocks',
    component: () => import('../team-views/StockChartView.vue'),
  },
  {
    path: '/team/subscribe',
    name: 'team-subscribe',
    component: () => import('../team-views/SubscriptionCheckoutView.vue'),
  },
  {
    path: '/team/weather/:cityId',
    name: 'team-weather-detail',
    component: () => import('../team-views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
