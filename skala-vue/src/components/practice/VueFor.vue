<script setup>
import { ref } from 'vue'

const items = ref(['사과', '바나나', '오렌지'])
</script>

<template>
  <div class="practice-section">
    <h2>v-for 디렉티브 학습</h2>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ index + 1 }}. {{ item }}
      </li>
    </ul>
  </div>
</template>
