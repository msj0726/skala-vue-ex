<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { fetchCurrentWeather, WEATHER_CITIES } from '@/services/weatherApi.js'

import SearchBar from '../components/exercise/weathercomponent/SearchBar.vue'
import WeatherCard from '../components/exercise/weathercomponent/WeatherCard.vue'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 날씨 데이터 로드
const loadWeather = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const results = await Promise.allSettled(WEATHER_CITIES.map(fetchCurrentWeather))
    weatherList.value = results
      .filter(({ status }) => status === 'fulfilled')
      .map(({ value }) => value)

    const failed = results.find(({ status }) => status === 'rejected')
    if (failed && weatherList.value.length === 0) {
      loadError.value = '날씨 정보를 불러올 수 없습니다.'
    }
  } catch {
    loadError.value = '날씨 정보를 불러오는 중 오류가 발생했습니다.'
    // API 실패 시 Mock 데이터 사용
    weatherList.value = [
      { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
      { id: 'city_02', name: '수원', temp: 24, status: '비' },
      { id: 'city_03', name: '부산', temp: 26, status: '구름' },
    ]
  } finally {
    isLoading.value = false
  }
}

// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  loadWeather()
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/personal/weather/${id}`)
}
</script>

<template>
  <div class="weather-newspaper">
    <!-- Masthead -->
    <header class="page-masthead">
      <div class="masthead-top">
        <RouterLink to="/personal/" class="back-link">← 홈</RouterLink>
        <div class="weather-status">LIVE WEATHER</div>
      </div>
      <h1 class="page-title">Weather Report</h1>
      <p class="page-subtitle">지역별 실시간 날씨 현황</p>
    </header>

    <!-- Search Section -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-label">도시 검색</div>
        <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
        <button @click="configStore.toggleUnit()" class="unit-toggle">
          {{ configStore.unit === 'celsius' ? '℉' : '℃' }}
        </button>
        <button v-if="loadError" @click="loadWeather" class="reload-btn">
          🔄
        </button>
      </div>
    </section>

    <!-- Weather Content -->
    <main class="weather-content">
      <div v-if="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>날씨 정보를 불러오는 중...</p>
      </div>

      <div v-else-if="loadError && weatherList.length === 0" class="error-section">
        <p>{{ loadError }}</p>
        <button @click="loadWeather" class="retry-button">다시 시도</button>
      </div>

      <div v-else class="weather-grid">
        <div v-if="loadError" class="warning-banner">
          ⚠️ API 연결 실패로 샘플 데이터를 표시합니다.
        </div>

        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="handleDetailJump(item.id)"
        />
      </div>
    </main>

    <!-- Status Bar -->
    <footer class="status-footer">
      {{ selectedCityInfo }}
    </footer>
  </div>
</template>

<style scoped>
.weather-newspaper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px 60px;
  background: #fafafa;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.page-masthead {
  border-bottom: 4px double #000;
  padding-bottom: 20px;
  margin-bottom: 30px;
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

.weather-status {
  padding: 4px 12px;
  font-size: 0.7rem;
  font-weight: 800;
  border: 2px solid #000;
  background: #000;
  color: white;
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

.search-section {
  background: white;
  border: 2px solid #000;
  padding: 24px;
  margin-bottom: 40px;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  flex-shrink: 0;
}

.unit-toggle,
.reload-btn {
  padding: 8px 16px;
  background: #000;
  color: white;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  flex-shrink: 0;
}

.unit-toggle:hover,
.reload-btn:hover {
  background: #333;
}

.weather-content {
  margin-bottom: 30px;
}

.loading-section,
.error-section {
  text-align: center;
  padding: 80px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #ddd;
  border-top-color: #000;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 20px;
  padding: 12px 24px;
  background: #000;
  color: white;
  border: none;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
}

.retry-button:hover {
  background: #333;
}

.warning-banner {
  grid-column: 1 / -1;
  background: white;
  border: 2px solid #000;
  padding: 16px 24px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.weather-grid {
  display: grid;
  gap: 20px;
}

.status-footer {
  background: white;
  border: 2px solid #000;
  padding: 16px 24px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
}

@media (max-width: 900px) {
  .weather-newspaper {
    padding: 70px 20px 40px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .search-container {
    flex-wrap: wrap;
  }
}
</style>
