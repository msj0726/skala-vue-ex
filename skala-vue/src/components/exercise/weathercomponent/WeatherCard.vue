<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
// [수정된 부분] defineProps의 반환값을 props 변수에 할당합니다.
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
// 🔥 [핵심 미션] 스토어의 상태값이 'fahrenheit'일 때만 화씨 공식 적용 연산
const displayTemp = computed(() => {
  // 이제 props 변수가 정의되었으므로 정상적으로 접근 가능합니다.
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: white;
  border: 1px solid #e5edf2;
  padding: 20px 24px;
  margin-bottom: 14px;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(35, 81, 112, 0.04);
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(35, 81, 112, 0.12);
  border-color: #c9dce8;
}

.weather-card h4 {
  color: #203e54;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.weather-card p {
  color: #728897;
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
}

.hot {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.25);
}

.cool {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.25);
}

.btn-detail {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 8px 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #176fa7 0%, #3997cf 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(23, 111, 167, 0.2);
}

.btn-detail:hover {
  background: linear-gradient(135deg, #124f79 0%, #176fa7 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 111, 167, 0.3);
}
</style>