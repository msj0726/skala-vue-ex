<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import AppPractice from './AppPractice.vue'
import AppComposition from './AppComposition.vue'
import WeatherMockup from './components/exercise/WeatherMockup.vue'

const activeAssignment = ref(null)

const assignmentLabels = computed(() => ({
  1: '과제 1: 반응형 시스템',
  2: '과제 2: Composition API',
  3: '과제 3: 날씨 API',
  4: '과제 4: Vue Router',
  5: '과제 5: 라우팅'
}))
</script>

<template>
  <div class="exercise-app">
    <!-- Apple-style Navigation -->
    <nav class="exercise-nav">
      <div class="nav-content">
        <div class="nav-title">Vue 과제</div>
        <div class="nav-links">
          <RouterLink to="/personal/exercises" class="nav-link">날씨</RouterLink>
          <RouterLink to="/personal/exercises/about" class="nav-link">소개</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Assignment Selector -->
    <div class="assignment-selector">
      <button
        v-for="num in 5"
        :key="num"
        @click="activeAssignment = num"
        :class="['assignment-btn', { active: activeAssignment === num }]"
      >
        {{ num }}
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="content-wrapper">
      <!-- If assignment button clicked -->
      <template v-if="activeAssignment !== null">
        <!-- Assignments 1-3: Component-based -->
        <div v-if="activeAssignment === 1" class="assignment-content">
          <h1 class="assignment-title">{{ assignmentLabels[1] }}</h1>
          <AppPractice />
        </div>

        <div v-else-if="activeAssignment === 2" class="assignment-content">
          <h1 class="assignment-title">{{ assignmentLabels[2] }}</h1>
          <AppComposition />
        </div>

        <div v-else-if="activeAssignment === 3" class="assignment-content">
          <h1 class="assignment-title">{{ assignmentLabels[3] }}</h1>
          <WeatherMockup />
        </div>

        <!-- Assignments 4-5: Router-based -->
        <div v-else-if="activeAssignment === 4 || activeAssignment === 5" class="assignment-content router-content">
          <h1 class="assignment-title">{{ assignmentLabels[activeAssignment] }}</h1>
          <RouterView />
        </div>
      </template>

      <!-- Default: Show router content (for 4,5 assignments) -->
      <template v-else>
        <div class="assignment-content router-content">
          <RouterView />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.exercise-app {
  min-height: 100vh;
  background: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Apple-style Navigation */
.exercise-nav {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #424245;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #0071e3;
}

.nav-link.router-link-active {
  color: #0071e3;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  right: 0;
  height: 2px;
  background: #0071e3;
}

/* Assignment Selector */
.assignment-selector {
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.assignment-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  border: none;
  background: #f5f5f7;
  color: #1d1d1f;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.assignment-btn:hover {
  background: #e8e8ed;
  transform: scale(1.05);
}

.assignment-btn.active {
  background: #0071e3;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.assignment-content {
  background: white;
  border-radius: 18px;
  padding: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.assignment-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 32px 0;
  letter-spacing: -0.02em;
}

.router-content {
  padding: 0;
  overflow: hidden;
}

.router-content .assignment-title {
  padding: 48px 48px 0 48px;
}

/* Placeholder */
.assignment-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.placeholder-content {
  text-align: center;
  color: #86868b;
}

.placeholder-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.placeholder-content h2 {
  font-size: 28px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px 0;
}

.placeholder-content p {
  font-size: 17px;
  color: #86868b;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 16px;
  }

  .nav-links {
    gap: 20px;
  }

  .assignment-selector {
    padding: 12px 16px;
    gap: 8px;
  }

  .assignment-btn {
    width: 40px;
    height: 40px;
    font-size: 15px;
  }

  .content-wrapper {
    padding: 24px 16px;
  }

  .assignment-content {
    padding: 32px 24px;
    border-radius: 12px;
  }

  .assignment-title {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .router-content .assignment-title {
    padding: 32px 24px 0 24px;
  }
}
</style>
