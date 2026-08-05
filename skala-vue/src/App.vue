<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import TeamApp from './TeamApp.vue'
import PersonalApp from './PersonalApp.vue'

const router = useRouter()
const showSelector = ref(true)

onMounted(() => {
  const path = router.currentRoute.value.path
  if (path.startsWith('/personal') || path.startsWith('/team')) {
    showSelector.value = false
  }
})

const selectProject = (project) => {
  showSelector.value = false
  if (project === 'personal') {
    router.push('/personal/')
  } else {
    router.push(`/${project}/`)
  }
}

const goBack = () => {
  showSelector.value = true
  router.push('/')
}
</script>

<template>
  <div id="app">
    <!-- Project Selector Screen -->
    <div v-if="showSelector" class="selector-screen">
      <h1>프로젝트 선택</h1>
      <div class="project-cards">
        <div class="project-card" @click="selectProject('personal')">
          <h2>👤 개인 과제</h2>
          <p>날씨 대시보드 + 라우터</p>
        </div>
        <div class="project-card" @click="selectProject('team')">
          <h2>👥 팀 과제</h2>
          <p>협업 프로젝트</p>
        </div>
      </div>
    </div>

    <!-- Project View with Router -->
    <div v-else class="project-view">
      <button
        v-if="router.currentRoute.value.path === '/personal/' || router.currentRoute.value.path === '/team/'"
        class="back-button"
        @click="goBack"
      >
        ← 프로젝트 선택으로 돌아가기
      </button>

      <!-- Team project with navigation -->
      <TeamApp v-if="router.currentRoute.value.path.startsWith('/team')" />

      <!-- Personal project with navigation -->
      <PersonalApp v-else-if="router.currentRoute.value.path.startsWith('/personal')" />
    </div>
  </div>
</template>

<style scoped>
.selector-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(125deg, #124f79 0%, #176fa7 62%, #3997cf 100%);
  color: white;
  padding: 2rem;
}

.selector-screen h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-align: center;
}

.project-cards {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
}

.project-card {
  background: white;
  color: #203e54;
  padding: 3.5rem 3rem;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 280px;
  max-width: 320px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
}

.project-card h2 {
  font-size: 2.2rem;
  margin-bottom: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.project-card p {
  font-size: 1.05rem;
  color: #728897;
  line-height: 1.6;
}

.project-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.back-button {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(23, 111, 167, 0.95);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(23, 111, 167, 0.3);
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(18, 79, 121, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 111, 167, 0.4);
}

@media (max-width: 768px) {
  .selector-screen h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .project-cards {
    gap: 1.5rem;
  }

  .project-card {
    min-width: 240px;
    padding: 2.5rem 2rem;
  }

  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
}
</style>
