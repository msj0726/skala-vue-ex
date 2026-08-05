<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>v-show 디렉티브 학습</h2>
    <button @click="isVisible = !isVisible">토글</button>
    <p v-show="isVisible">v-show로 표시되는 내용 (DOM에는 항상 존재)</p>
  </div>
</template>
