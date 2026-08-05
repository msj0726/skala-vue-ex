<script setup>
import { ref } from 'vue'

const welcomeMessage = ref('Welcome to Skala-Vue')
</script>

<template>
    <div class="sample-card">
        <h2>{{ welcomeMessage }}</h2>
            <p class="result-box">{{ welcomeMessage.toUpperCase() }}</p>
            <p class="result-box">{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>
    </div>
</template>



<style scoped>
.sample-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-top: 20px; }
.result-box { background-color: #f9f9f9; padding: 10px; border-radius: 4px; }
h3 { margin-top: 15px; font-size: 1.1em; color: #333; }
</style>