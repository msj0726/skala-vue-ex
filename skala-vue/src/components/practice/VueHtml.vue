<template>
  <div class="sample-card">
    <h2>Example 3: v-html 디렉티브 학습</h2>
    
    <h3>1. 일반 보간법 {{}} 사용 결과:</h3>
    <p class="result-box">{{ rawHtmlData }}</p>
    
    <h3>2. v-html 디렉티브 사용 결과:</h3>
    <!-- v-html을 사용하면 문자열 안의 HTML 태그가 실제 디자인으로 렌더링됩니다. -->
    <p class="result-box" v-html="rawHtmlData"></p>
  </div>
</template>

<script setup>
const rawHtmlData = '이 글자는 <span style="color: red; font-weight: bold;">빨간색 굵은 글자</span>이다.'
</script>

<style scoped>
.sample-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-top: 20px; }
.result-box { background-color: #f9f9f9; padding: 10px; border-radius: 4px; }
h3 { margin-top: 15px; font-size: 1.1em; color: #333; }
</style>