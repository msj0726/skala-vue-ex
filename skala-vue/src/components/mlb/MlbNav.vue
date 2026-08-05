<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="mlb-nav" aria-label="MLB 페이지 탐색">
    <RouterLink to="/personal/" class="brand" aria-label="MLB Weather 홈">
      <span class="brand-mark"><span></span></span>
      <span>MLB WEATHER</span>
    </RouterLink>
    <div class="nav-links">
      <RouterLink to="/personal/">홈</RouterLink>
      <RouterLink to="/personal/all-stadiums">구장</RouterLink>
      <RouterLink to="/personal/standings">순위</RouterLink>
    </div>
    <span class="live-status"><i></i> LIVE DATA</span>
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
@keyframes pulse { 50% { box-shadow: 0 0 0 8px rgba(85,216,141,0); } }
@media (max-width: 640px) { .mlb-nav { height: 60px; padding: 0 16px; gap: 20px; } .brand { font-size: 0; gap: 0; } .brand-mark { width: 26px; height: 26px; } .nav-links { gap: 20px; } .live-status { display: none; } }
</style>
