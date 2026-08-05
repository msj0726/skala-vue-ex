<script setup>
import { ref } from 'vue'


// 1. 일반 변수 (화면이 실시간으로 바뀌지 않음)
let normalCount = 0
// 2. 반응성 변수 (화면이 실시간으로 바뀜)
const vueCount = ref(0)
</script>


<template>      
    <div class="sample-card">
        <h2>Hello Skala-Vue</h2>
        <h3 class="result-box">일반 변수 클릭: {{ normalCount }}</h3>

        <button @click="normalCount++">일반 변수 증가</button>
        <br />
        <h3 class="result-box">Vue 반응성 변수 클릭: {{ vueCount }}</h3>
        <button @click="vueCount++">Vue 변수 증가</button>
    </div>
</template>


<style scoped>
.sample-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-top: 20px; }
.result-box { background-color: #f9f9f9; padding: 10px; border-radius: 4px; }
h3 { margin-top: 15px; font-size: 1.1em; color: #333; }
</style>