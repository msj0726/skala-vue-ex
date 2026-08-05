<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/auth'
const router = useRouter()
const { currentUser, logout } = useAuth()
const signOut = () => { logout(); router.push('/') }
</script>

<template>
  <nav class="mlb-nav" aria-label="MLB 페이지 탐색">
    <RouterLink to="/" class="brand" aria-label="MLB Weather 홈">
      <span class="brand-mark"><span></span></span>
      <span>MLB WEATHER</span>
    </RouterLink>
    <div class="nav-links">
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/all-stadiums">구장</RouterLink>
      <RouterLink to="/standings">순위</RouterLink>
    </div>
    <div class="auth-links" v-if="currentUser"><span>{{ currentUser.name }}님</span><button @click="signOut">로그아웃</button></div>
    <div class="auth-links" v-else><RouterLink to="/login">로그인</RouterLink><RouterLink class="signup-link" to="/signup">회원가입</RouterLink></div>
  </nav>
</template>

<style scoped>
.mlb-nav { position: absolute; inset: 0 0 auto; z-index: 20; height: 68px; padding: 0 max(24px, calc((100vw - 1360px) / 2)); display: flex; align-items: center; gap: 42px; color: #fff; border-bottom: 1px solid rgba(255,255,255,.14); background: rgba(7,13,22,.58); backdrop-filter: blur(18px); font: 700 13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
.brand { display: inline-flex; align-items: center; gap: 11px; color: #fff; font-size: 14px; white-space: nowrap; }
.brand-mark { width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.5); border-radius: 50%; background: #f5f1e8; box-shadow: inset -5px -5px 10px rgba(0,0,0,.14); }
.brand-mark span { width: 18px; height: 18px; border: 2px dashed #d9473f; border-radius: 50%; }
.nav-links { display: flex; align-self: stretch; gap: 30px; }
.nav-links a { position: relative; display: grid; place-items: center; color: rgba(255,255,255,.62); }
.nav-links a::after { content: ''; position: absolute; inset: auto 0 0; height: 2px; background: #e2443a; transform: scaleX(0); transition: transform .2s; }
.nav-links a:hover,.nav-links a.router-link-exact-active { color: #fff; }
.nav-links a.router-link-exact-active::after { transform: scaleX(1); }
.live-status { margin-left: auto; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,.68); font-size: 10px; }
.live-status i { width: 7px; height: 7px; border-radius: 50%; background: #55d88d; box-shadow: 0 0 0 5px rgba(85,216,141,.12); animation: pulse 2s infinite; }
.auth-links{margin-left:auto;display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.72);font-size:11px}.auth-links a,.auth-links button{color:#fff;font:inherit;font-weight:800}.auth-links button{padding:7px 10px;border:1px solid rgba(255,255,255,.25);background:transparent;cursor:pointer}.auth-links .signup-link{padding:8px 11px;border-radius:2px;background:#d9473f}
@keyframes pulse { 50% { box-shadow: 0 0 0 8px rgba(85,216,141,0); } }
@media (max-width: 640px) { .mlb-nav { height: 60px; padding: 0 12px; gap: 13px; } .brand { font-size: 0; gap: 0; } .brand-mark { width: 26px; height: 26px; } .nav-links { gap: 12px; } .auth-links{gap:6px}.auth-links span{display:none}.auth-links a,.auth-links button{font-size:9px}.live-status { display: none; } }
</style>
