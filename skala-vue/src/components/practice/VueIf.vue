<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>v-if 디렉티브 학습</h2>
    <button @click="isVisible = !isVisible">토글</button>
    <p v-if="isVisible">v-if로 표시되는 내용</p>
    <p v-else>v-else로 표시되는 내용</p>
  </div>
</template>
