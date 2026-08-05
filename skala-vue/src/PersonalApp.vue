<script setup>
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showNav = computed(() => !route.path.startsWith('/personal/exercises'))
</script>

<template>
  <div class="personal-app">
    <!-- Router View (no navigation for MLB theme) -->
    <RouterView />
  </div>
</template>

<style scoped>
.personal-app {
  min-height: 100vh;
}
</style>
