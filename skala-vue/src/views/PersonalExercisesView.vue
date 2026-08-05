<script setup>
import { RouterLink } from 'vue-router'
import AppExercise from '../AppExercise.vue'
</script>

<template>
  <div class="exercises-newspaper">
    <header class="page-masthead">
      <div class="masthead-top">
        <RouterLink to="/personal/" class="back-link">← 홈</RouterLink>
        <div class="exercises-label">ASSIGNMENTS</div>
      </div>
      <h1 class="page-title">Exercises</h1>
      <p class="page-subtitle">과제 1부터 5까지 모든 연습 문제</p>
    </header>

    <div class="exercises-content">
      <AppExercise />
    </div>
  </div>
</template>

<style scoped>
.exercises-newspaper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 40px 60px;
  background: #fafafa;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.page-masthead {
  border-bottom: 4px double #000;
  padding-bottom: 20px;
  margin-bottom: 40px;
}

.masthead-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.back-link {
  color: #000;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: 0.05em;
}

.back-link:hover {
  text-decoration: underline;
}

.exercises-label {
  padding: 4px 12px;
  font-size: 0.7rem;
  font-weight: 800;
  border: 2px solid #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: 0.1em;
}

.page-title {
  font-size: 4rem;
  font-weight: 900;
  text-align: center;
  margin: 20px 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.page-subtitle {
  text-align: center;
  font-size: 0.95rem;
  color: #666;
  font-style: italic;
}

.exercises-content {
  background: white;
  border: 2px solid #000;
  padding: 40px;
}

@media (max-width: 900px) {
  .exercises-newspaper {
    padding: 70px 20px 40px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .exercises-content {
    padding: 24px 16px;
  }
}
</style>
