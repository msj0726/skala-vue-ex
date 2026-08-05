<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
      class="search-input"
    />
    <p class="search-status">
      검색 중인 도시: <strong>{{ currentQuery || '없음' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner h3 {
  color: #203e54;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.search-input {
  width: 100%;
  padding: 12px 18px;
  border: 2px solid #e5edf2;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #203e54;
  transition: all 0.2s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #176fa7;
  box-shadow: 0 0 0 4px rgba(23, 111, 167, 0.1);
}

.search-input::placeholder {
  color: #94a5b0;
}

.search-status {
  margin-top: 12px;
  color: #728897;
  font-size: 0.9rem;
}

.search-status strong {
  color: #176fa7;
  font-weight: 700;
}
</style>
