import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 1. 루트 경로 접속 시 보여줄 기본 페이지 설정 (Personal Project 메인으로 리다이렉트)
  {
    path: '/',
    redirect: '/personal/',
  },
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
  { path: '/personal/login', name: 'PersonalLogin', component: () => import('../views/PersonalAuthView.vue') },
  { path: '/personal/signup', name: 'PersonalSignup', component: () => import('../views/PersonalAuthView.vue') },
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
    ],
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
  // 2. WebHistory 대신 WebHashHistory로 변경하여 GitHub Pages 404 에러 방지
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
