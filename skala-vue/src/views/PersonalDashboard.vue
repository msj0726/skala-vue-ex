<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { fetchCurrentWeather, WEATHER_CITIES } from '@/services/weatherApi'
import { fetchTopHeadlines } from '@/services/newsApi'
import { STOCK_MARKETS, fetchStockSeries } from '@/services/stockApi'

document.title = '오늘의 브리핑 | 개인 프로젝트'
const configStore = useConfigStore()

const today = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

// 현재 위치 날씨
const currentLocationWeather = ref(null)
const isLoadingLocation = ref(false)

const getCurrentLocation = () => {
  isLoadingLocation.value = true
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const result = await fetchCurrentWeather({
            id: 'current',
            name: '현재 위치',
            lat: latitude,
            lon: longitude
          })
          currentLocationWeather.value = result
        } catch (error) {
          // Fallback to Seoul
          currentLocationWeather.value = await fetchCurrentWeather(WEATHER_CITIES[0])
        }
        isLoadingLocation.value = false
      },
      async () => {
        // Fallback to Seoul
        currentLocationWeather.value = await fetchCurrentWeather(WEATHER_CITIES[0])
        isLoadingLocation.value = false
      }
    )
  }
}

// 뉴스 데이터
const news = ref([])
const isNewsLoading = ref(true)

const formatNewsTime = (publishedAt) => {
  const publishedDate = new Date(publishedAt)
  if (Number.isNaN(publishedDate.getTime())) return '시간 정보 없음'
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - publishedDate.getTime()) / 60000))
  if (elapsedMinutes < 60) return `${Math.max(1, elapsedMinutes)}분 전`
  if (elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)}시간 전`
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(publishedDate)
}

const loadNews = async () => {
  isNewsLoading.value = true
  try {
    const result = await fetchTopHeadlines()
    news.value = result.articles.slice(0, 8).map((article) => ({
      ...article,
      time: formatNewsTime(article.publishedAt)
    }))
  } catch {
    news.value = []
  }
  isNewsLoading.value = false
}

// 주식 데이터
const stocks = ref(STOCK_MARKETS.slice(0, 4).map((market) => ({
  ...market,
  value: '—',
  change: '—',
  up: null,
})))

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const loadStocks = async () => {
  await Promise.all(stocks.value.map(async (stock) => {
    try {
      const result = await fetchStockSeries(stock)
      const latest = result.series.at(-1)?.value
      const previous = result.series.at(-2)?.value
      const percentChange = result.percentChange ?? ((latest - previous) / previous) * 100

      stock.value = currencyFormatter.format(latest)
      stock.change = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`
      stock.up = percentChange >= 0
      stock.rawValue = latest
    } catch {
      // Keep default values
    }
  }))
}

onMounted(() => {
  getCurrentLocation()
  loadNews()
  loadStocks()
})
</script>

<template>
  <main class="newspaper-layout">
    <!-- Masthead -->
    <header class="masthead">
      <div class="masthead-top">
        <div class="nav-links-header">
          <RouterLink to="/personal/weather">날씨</RouterLink>
          <RouterLink to="/personal/news">뉴스</RouterLink>
          <RouterLink to="/personal/stocks">주식</RouterLink>
          <RouterLink to="/personal/exercises">과제</RouterLink>
        </div>
        <div class="date-info">{{ today }}</div>
      </div>
      <h1 class="newspaper-title">The Daily Brief</h1>
      <p class="newspaper-subtitle">오늘 하루를 시작하는 모든 정보</p>
    </header>

    <!-- Weather Section with Map -->
    <section class="weather-banner">
      <div class="weather-content">
        <div class="weather-label">현재 날씨</div>
        <button @click="getCurrentLocation" class="location-btn" :disabled="isLoadingLocation">
          📍 {{ isLoadingLocation ? '위치 확인 중...' : '내 위치 날씨 보기' }}
        </button>
      </div>
      <div v-if="currentLocationWeather" class="weather-display">
        <div class="weather-map">
          <div class="map-marker">📍</div>
          <div class="map-location">{{ currentLocationWeather.name }}</div>
        </div>
        <div class="weather-info-box">
          <div class="weather-temp">{{ configStore.formatTemperature(currentLocationWeather.temp) }}</div>
          <div class="weather-details">
            <p class="weather-condition">{{ currentLocationWeather.status }}</p>
            <p class="weather-desc">{{ currentLocationWeather.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Lead Story -->
      <article v-if="news[0]" class="lead-story">
        <span class="section-label">TOP NEWS</span>
        <h2 class="lead-headline">
          <a v-if="news[0].url" :href="news[0].url" target="_blank">{{ news[0].title }}</a>
          <span v-else>{{ news[0].title }}</span>
        </h2>
        <p class="lead-excerpt">{{ news[0].description }}</p>
        <div class="article-meta">
          <span class="article-source">{{ news[0].source }}</span>
          <span class="article-time">{{ news[0].time }}</span>
        </div>
      </article>

      <!-- Secondary Stories -->
      <div class="secondary-stories">
        <article v-for="(item, index) in news.slice(1, 4)" :key="index" class="secondary-story">
          <span class="section-label">NEWS</span>
          <h3>
            <a v-if="item.url" :href="item.url" target="_blank">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h3>
          <p class="story-excerpt">{{ item.description }}</p>
          <div class="article-meta">
            <span class="article-source">{{ item.source }}</span>
            <span class="article-time">{{ item.time }}</span>
          </div>
        </article>
      </div>

      <!-- Stock Spotlight -->
      <aside class="stock-spotlight">
        <h3 class="sidebar-title">Stock Spotlight</h3>
        <div class="stock-list">
          <div v-for="stock in stocks" :key="stock.symbol" class="stock-item">
            <div class="stock-symbol">{{ stock.symbol }}</div>
            <div class="stock-price">{{ stock.rawValue?.toFixed(2) ?? '—' }}</div>
            <div :class="['stock-change', stock.up ? 'positive' : stock.up === false ? 'negative' : 'neutral']">
              {{ stock.change }}
            </div>
          </div>
        </div>
        <RouterLink to="/personal/stocks" class="more-link">전체 시세 보기 →</RouterLink>
      </aside>

      <!-- More News -->
      <div class="more-news">
        <article v-for="(item, index) in news.slice(4, 8)" :key="index" class="news-brief">
          <h4>
            <a v-if="item.url" :href="item.url" target="_blank">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h4>
          <div class="article-meta">
            <span class="article-source">{{ item.source }}</span>
            <span class="article-time">{{ item.time }}</span>
          </div>
        </article>
      </div>
    </div>

    <!-- Bottom Links -->
    <footer class="newspaper-footer">
      <RouterLink to="/personal/news">더 많은 뉴스</RouterLink>
      <RouterLink to="/personal/weather">날씨 상세</RouterLink>
      <RouterLink to="/personal/stocks">주식 차트</RouterLink>
      <RouterLink to="/personal/exercises">과제 모음</RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.newspaper-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px 60px;
  background: #fafafa;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.masthead {
  border-bottom: 4px double #000;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.masthead-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.nav-links-header {
  display: flex;
  gap: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 0.85rem;
}

.nav-links-header a {
  color: #000;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-links-header a:hover {
  text-decoration: underline;
}

.date-info {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 0.85rem;
  color: #666;
}

.newspaper-title {
  font-size: 4rem;
  font-weight: 900;
  text-align: center;
  margin: 20px 0 8px;
  font-family: 'Georgia', serif;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.newspaper-subtitle {
  text-align: center;
  font-size: 0.95rem;
  color: #666;
  font-style: italic;
  margin: 0;
}

.weather-banner {
  background: #f5f5f5;
  border: 2px solid #000;
  padding: 20px 24px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.location-btn {
  padding: 8px 16px;
  background: #000;
  color: white;
  border: none;
  font-size: 0.85rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  font-weight: 600;
}

.location-btn:hover:not(:disabled) {
  background: #333;
}

.location-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.weather-display {
  display: flex;
  align-items: center;
  gap: 24px;
}

.weather-map {
  position: relative;
  width: 120px;
  height: 120px;
  background: repeating-linear-gradient(
    0deg,
    #e0e0e0 0px,
    #e0e0e0 1px,
    transparent 1px,
    transparent 20px
  ),
  repeating-linear-gradient(
    90deg,
    #e0e0e0 0px,
    #e0e0e0 1px,
    transparent 1px,
    transparent 20px
  );
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.map-marker {
  font-size: 2.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.map-location {
  position: absolute;
  bottom: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: #000;
  color: white;
  padding: 4px 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.weather-info-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-temp {
  font-size: 3.5rem;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.weather-condition {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.weather-desc {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 30px;
  margin-bottom: 40px;
}

.lead-story {
  grid-column: 1;
  grid-row: 1;
  padding-right: 30px;
  border-right: 1px solid #ddd;
}

.section-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #000;
  border: 2px solid #000;
  padding: 4px 10px;
  margin-bottom: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.lead-headline {
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 0 0 20px;
  font-weight: 700;
}

.lead-headline a,
.lead-headline span {
  color: #000;
  text-decoration: none;
}

.lead-headline a:hover {
  text-decoration: underline;
}

.lead-excerpt {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #666;
}

.article-source {
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stock-spotlight {
  grid-column: 2;
  grid-row: 1 / 3;
  background: #000;
  color: white;
  padding: 24px;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.stock-list {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.stock-item {
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
}

.stock-symbol {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.stock-price {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.stock-change {
  font-size: 0.95rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.stock-change.positive { color: #4ade80; }
.stock-change.negative { color: #f87171; }
.stock-change.neutral { color: #999; }

.more-link {
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.more-link:hover {
  text-decoration: underline;
}

.secondary-stories {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  gap: 24px;
  padding-right: 30px;
  border-right: 1px solid #ddd;
}

.secondary-story h3 {
  font-size: 1.4rem;
  line-height: 1.3;
  margin: 12px 0;
  font-weight: 700;
}

.secondary-story h3 a,
.secondary-story h3 span {
  color: #000;
  text-decoration: none;
}

.secondary-story h3 a:hover {
  text-decoration: underline;
}

.story-excerpt {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
  margin-bottom: 12px;
}

.more-news {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-top: 30px;
  border-top: 2px solid #000;
}

.news-brief h4 {
  font-size: 1.1rem;
  line-height: 1.4;
  margin: 0 0 8px;
  font-weight: 700;
}

.news-brief h4 a,
.news-brief h4 span {
  color: #000;
  text-decoration: none;
}

.news-brief h4 a:hover {
  text-decoration: underline;
}

.newspaper-footer {
  border-top: 2px double #000;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  gap: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.newspaper-footer a {
  color: #000;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.newspaper-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .newspaper-layout {
    padding: 70px 20px 40px;
  }

  .newspaper-title {
    font-size: 2.5rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .lead-story,
  .secondary-stories {
    border-right: none;
    padding-right: 0;
  }

  .stock-spotlight {
    grid-column: 1;
    grid-row: auto;
  }

  .more-news {
    grid-template-columns: 1fr;
  }

  .weather-banner {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
