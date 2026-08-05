<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MlbNav from '@/components/mlb/MlbNav.vue'
import { fetchBallparkWeather } from '@/services/mlbApi'

// 전체 30개 MLB 팀 구장 데이터
const stadiums = ref([
  // American League East
  { id: 1, team: 'Yankees', teamKo: '양키스', stadium: 'Yankee Stadium', city: 'Bronx, NY', lat: 40.8296, lon: -73.9262, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/nyy.png&h=200&w=200', color: '#003087', division: 'AL East' },
  { id: 2, team: 'Red Sox', teamKo: '레드삭스', stadium: 'Fenway Park', city: 'Boston, MA', lat: 42.3467, lon: -71.0972, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/bos.png&h=200&w=200', color: '#BD3039', division: 'AL East' },
  { id: 3, team: 'Blue Jays', teamKo: '블루제이스', stadium: 'Rogers Centre', city: 'Toronto, ON', lat: 43.6414, lon: -79.3894, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tor.png&h=200&w=200', color: '#134A8E', division: 'AL East' },
  { id: 4, team: 'Orioles', teamKo: '오리올스', stadium: 'Oriole Park', city: 'Baltimore, MD', lat: 39.2839, lon: -76.6217, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/bal.png&h=200&w=200', color: '#DF4601', division: 'AL East' },
  { id: 5, team: 'Rays', teamKo: '레이스', stadium: 'Tropicana Field', city: 'St. Petersburg, FL', lat: 27.7682, lon: -82.6534, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tb.png&h=200&w=200', color: '#092C5C', division: 'AL East' },

  // American League Central
  { id: 6, team: 'White Sox', teamKo: '화이트삭스', stadium: 'Guaranteed Rate Field', city: 'Chicago, IL', lat: 41.8299, lon: -87.6338, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/chw.png&h=200&w=200', color: '#27251F', division: 'AL Central' },
  { id: 7, team: 'Guardians', teamKo: '가디언스', stadium: 'Progressive Field', city: 'Cleveland, OH', lat: 41.4962, lon: -81.6852, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/cle.png&h=200&w=200', color: '#E31937', division: 'AL Central' },
  { id: 8, team: 'Tigers', teamKo: '타이거스', stadium: 'Comerica Park', city: 'Detroit, MI', lat: 42.3390, lon: -83.0485, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/det.png&h=200&w=200', color: '#0C2340', division: 'AL Central' },
  { id: 9, team: 'Royals', teamKo: '로열스', stadium: 'Kauffman Stadium', city: 'Kansas City, MO', lat: 39.0517, lon: -94.4803, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/kc.png&h=200&w=200', color: '#004687', division: 'AL Central' },
  { id: 10, team: 'Twins', teamKo: '트윈스', stadium: 'Target Field', city: 'Minneapolis, MN', lat: 44.9817, lon: -93.2776, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/min.png&h=200&w=200', color: '#002B5C', division: 'AL Central' },

  // American League West
  { id: 11, team: 'Astros', teamKo: '애스트로스', stadium: 'Minute Maid Park', city: 'Houston, TX', lat: 29.7573, lon: -95.3555, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/hou.png&h=200&w=200', color: '#002D62', division: 'AL West' },
  { id: 12, team: 'Angels', teamKo: '에인절스', stadium: 'Angel Stadium', city: 'Anaheim, CA', lat: 33.8003, lon: -117.8827, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/laa.png&h=200&w=200', color: '#BA0021', division: 'AL West' },
  { id: 13, team: 'Athletics', teamKo: '애슬레틱스', stadium: 'Oakland Coliseum', city: 'Oakland, CA', lat: 37.7516, lon: -122.2005, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/oak.png&h=200&w=200', color: '#003831', division: 'AL West' },
  { id: 14, team: 'Mariners', teamKo: '매리너스', stadium: 'T-Mobile Park', city: 'Seattle, WA', lat: 47.5914, lon: -122.3325, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sea.png&h=200&w=200', color: '#0C2C56', division: 'AL West' },
  { id: 15, team: 'Rangers', teamKo: '레인저스', stadium: 'Globe Life Field', city: 'Arlington, TX', lat: 32.7473, lon: -97.0832, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tex.png&h=200&w=200', color: '#003278', division: 'AL West' },

  // National League East
  { id: 16, team: 'Braves', teamKo: '브레이브스', stadium: 'Truist Park', city: 'Atlanta, GA', lat: 33.8907, lon: -84.4677, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/atl.png&h=200&w=200', color: '#CE1141', division: 'NL East' },
  { id: 17, team: 'Marlins', teamKo: '말린스', stadium: 'loanDepot Park', city: 'Miami, FL', lat: 25.7781, lon: -80.2197, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/mia.png&h=200&w=200', color: '#00A3E0', division: 'NL East' },
  { id: 18, team: 'Mets', teamKo: '메츠', stadium: 'Citi Field', city: 'Queens, NY', lat: 40.7571, lon: -73.8458, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/nym.png&h=200&w=200', color: '#002D72', division: 'NL East' },
  { id: 19, team: 'Phillies', teamKo: '필리스', stadium: 'Citizens Bank Park', city: 'Philadelphia, PA', lat: 39.9061, lon: -75.1665, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/phi.png&h=200&w=200', color: '#E81828', division: 'NL East' },
  { id: 20, team: 'Nationals', teamKo: '내셔널스', stadium: 'Nationals Park', city: 'Washington, DC', lat: 38.8730, lon: -77.0074, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/wsh.png&h=200&w=200', color: '#AB0003', division: 'NL East' },

  // National League Central
  { id: 21, team: 'Cubs', teamKo: '컵스', stadium: 'Wrigley Field', city: 'Chicago, IL', lat: 41.9484, lon: -87.6553, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/chc.png&h=200&w=200', color: '#0E3386', division: 'NL Central' },
  { id: 22, team: 'Reds', teamKo: '레즈', stadium: 'Great American Ball Park', city: 'Cincinnati, OH', lat: 39.0974, lon: -84.5067, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/cin.png&h=200&w=200', color: '#C6011F', division: 'NL Central' },
  { id: 23, team: 'Brewers', teamKo: '브루어스', stadium: 'American Family Field', city: 'Milwaukee, WI', lat: 43.0280, lon: -87.9712, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/mil.png&h=200&w=200', color: '#12284B', division: 'NL Central' },
  { id: 24, team: 'Pirates', teamKo: '파이어리츠', stadium: 'PNC Park', city: 'Pittsburgh, PA', lat: 40.4469, lon: -80.0057, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/pit.png&h=200&w=200', color: '#27251F', division: 'NL Central' },
  { id: 25, team: 'Cardinals', teamKo: '카디널스', stadium: 'Busch Stadium', city: 'St. Louis, MO', lat: 38.6226, lon: -90.1928, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/stl.png&h=200&w=200', color: '#C41E3A', division: 'NL Central' },

  // National League West
  { id: 26, team: 'Dodgers', teamKo: '다저스', stadium: 'Dodger Stadium', city: 'Los Angeles, CA', lat: 34.0739, lon: -118.2400, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/lad.png&h=200&w=200', color: '#005A9C', division: 'NL West' },
  { id: 27, team: 'Diamondbacks', teamKo: '다이아몬드백스', stadium: 'Chase Field', city: 'Phoenix, AZ', lat: 33.4453, lon: -112.0667, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/ari.png&h=200&w=200', color: '#A71930', division: 'NL West' },
  { id: 28, team: 'Giants', teamKo: '자이언츠', stadium: 'Oracle Park', city: 'San Francisco, CA', lat: 37.7786, lon: -122.3893, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sf.png&h=200&w=200', color: '#FD5A1E', division: 'NL West' },
  { id: 29, team: 'Padres', teamKo: '파드리스', stadium: 'Petco Park', city: 'San Diego, CA', lat: 32.7076, lon: -117.1566, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sd.png&h=200&w=200', color: '#2F241D', division: 'NL West' },
  { id: 30, team: 'Rockies', teamKo: '로키스', stadium: 'Coors Field', city: 'Denver, CO', lat: 39.7559, lon: -104.9942, logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/col.png&h=200&w=200', color: '#33006F', division: 'NL West' },
])

const selectedDivision = ref('all')
const selectedStadium = ref(null)
const searchQuery = ref('')
const temperatureUnit = ref('C')
const route = useRoute()

const formatTemperature = (temp) => {
  if (!Number.isFinite(temp)) return '—'
  return temperatureUnit.value === 'F' ? Math.round((temp * 9) / 5 + 32) : Math.round(temp)
}

const divisions = [
  { id: 'all', name: '전체', nameEn: 'All Teams' },
  { id: 'AL East', name: 'AL 동부', nameEn: 'American League East' },
  { id: 'AL Central', name: 'AL 중부', nameEn: 'American League Central' },
  { id: 'AL West', name: 'AL 서부', nameEn: 'American League West' },
  { id: 'NL East', name: 'NL 동부', nameEn: 'National League East' },
  { id: 'NL Central', name: 'NL 중부', nameEn: 'National League Central' },
  { id: 'NL West', name: 'NL 서부', nameEn: 'National League West' },
]

const filteredStadiums = computed(() => {
  if (selectedDivision.value === 'all') {
    return stadiums.value
  }
  return stadiums.value.filter(s => s.division === selectedDivision.value)
})

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (query.length < 1) return []
  return stadiums.value.filter((stadium) =>
    [stadium.team, stadium.teamKo, stadium.stadium, stadium.city, stadium.division]
      .some((value) => value.toLowerCase().includes(query))
  ).slice(0, 6)
})

const selectSearchResult = (stadium) => {
  selectedStadium.value = stadium
  searchQuery.value = stadium.stadium
  selectedDivision.value = 'all'
  requestAnimationFrame(() => document.getElementById(`stadium-${stadium.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}

const fetchWeather = async (stadium) => {
  stadium.weather = await fetchBallparkWeather(stadium)
  stadium.loading = false
}

onMounted(() => {
  stadiums.value.forEach(stadium => {
    stadium.loading = true
    fetchWeather(stadium)
  })
  const requestedId = Number(route.query.stadium)
  if (requestedId) selectedStadium.value = stadiums.value.find((stadium) => stadium.id === requestedId) ?? null
})
</script>

<template>
  <div class="all-stadiums-page">
    <MlbNav />
    <!-- Background -->
    <div class="bg-stadium"></div>

    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <p class="sub-eyebrow"><span></span> BALLPARK NETWORK</p>
        <h1 class="page-title">30 Ballparks</h1>
        <p class="page-subtitle">경기장을 선택하고 현지 컨디션을 확인하세요.</p>
        <div class="header-counter"><strong>{{ filteredStadiums.length }}</strong><span>구장 표시 중</span></div>
      </div>
    </header>

    <!-- Division Filter and ballpark search -->
    <div class="search-band">
      <div class="stadium-search">
        <label for="stadium-search-input">SEARCH BALLPARKS</label>
        <div class="search-input-wrap">
          <span class="search-icon">⌕</span>
          <input id="stadium-search-input" v-model="searchQuery" type="search" placeholder="팀, 구장, 도시 검색..." autocomplete="off" />
          <button v-if="searchQuery" type="button" class="clear-search" aria-label="검색어 지우기" @click="searchQuery = ''">×</button>
        </div>
        <div v-if="searchQuery && searchResults.length" class="search-results">
          <button v-for="stadium in searchResults" :key="stadium.id" type="button" class="search-result" @click="selectSearchResult(stadium)">
            <img :src="stadium.logoUrl" :alt="stadium.team" />
            <span><strong>{{ stadium.team }}</strong><small>{{ stadium.teamKo }} · {{ stadium.stadium }} · {{ stadium.city }}</small></span>
            <b>→</b>
          </button>
        </div>
        <p v-else-if="searchQuery" class="no-results">검색 결과가 없습니다.</p>
      </div>
      <div class="unit-toggle search-unit-toggle" role="group" aria-label="온도 단위"><button :class="{ active: temperatureUnit === 'C' }" @click="temperatureUnit = 'C'">°C</button><button :class="{ active: temperatureUnit === 'F' }" @click="temperatureUnit = 'F'">°F</button></div>
    </div>

    <div class="filter-container">
      <div class="filter-tabs">
        <button
          v-for="div in divisions"
          :key="div.id"
          @click="selectedDivision = div.id"
          :class="['filter-tab', { active: selectedDivision === div.id }]"
        >
          <span class="tab-name">{{ div.name }}</span>
          <span class="tab-name-en">{{ div.nameEn }}</span>
        </button>
      </div>
    </div>

    <!-- Stadiums Grid -->
    <div class="stadiums-container">
      <div class="stadiums-grid">
        <article
          v-for="stadium in filteredStadiums"
          :key="stadium.id"
          :id="`stadium-${stadium.id}`"
          class="stadium-card"
          :style="{ '--team-color': stadium.color }"
          :class="{ selected: selectedStadium?.id === stadium.id }"
          @click="selectedStadium = selectedStadium?.id === stadium.id ? null : stadium"
        >
          <!-- Loading State -->
          <div v-if="stadium.loading" class="card-loading">
            <div class="loading-spinner"></div>
          </div>

          <!-- Weather Content -->
          <div v-else class="card-content">
            <!-- Team Header -->
            <div class="team-header">
              <div class="team-logo">
                <img :src="stadium.logoUrl" :alt="stadium.team" />
              </div>
              <div class="team-info">
                <h3 class="team-name">{{ stadium.team }}</h3>
                <p class="team-name-ko">{{ stadium.teamKo }}</p>
              </div>
            </div>

            <!-- Stadium Info -->
            <div class="stadium-info">
              <div class="stadium-name">{{ stadium.stadium }}</div>
              <div class="stadium-city">📍 {{ stadium.city }}</div>
            </div>

            <!-- Weather Display -->
            <div v-if="stadium.weather" class="weather-display">
              <div class="weather-main">
                <div class="weather-icon-large">{{ stadium.weather.icon }}</div>
                <div class="temperature">{{ formatTemperature(stadium.weather.temp) }}°</div>
              </div>
            </div>
            <div v-else class="weather-display">
              <div class="loading-text">로딩 중...</div>
            </div>

            <!-- Weather Details -->
            <div v-if="stadium.weather" class="weather-details">
              <div class="detail-item">
                <span class="detail-icon">💧</span>
                <span class="detail-value">{{ stadium.weather.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💨</span>
                <span class="detail-value">{{ stadium.weather.wind }} km/h</span>
              </div>
            </div>

            <div v-if="stadium.weather" class="weather-metrics">
              <div><small>강수량</small><strong>{{ stadium.weather.precipitation ?? '—' }} <em>mm</em></strong></div>
              <div><small>자외선</small><strong>{{ stadium.weather.uvIndex ?? '—' }}</strong></div>
              <div><small>PM2.5</small><strong>{{ stadium.weather.pm25?.toFixed?.(1) ?? '—' }} <em>μg</em></strong></div>
              <div><small>PM10</small><strong>{{ stadium.weather.pm10?.toFixed?.(1) ?? '—' }} <em>μg</em></strong></div>
            </div>

            <!-- Division Badge -->
            <div class="division-badge">{{ stadium.division }}</div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.all-stadiums-page {
  min-height: 100vh;
  background: #0a1929;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding-top: 44px;
  position: relative;
}

/* Background Stadium Image */
.bg-stadium {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(180deg, rgba(10, 25, 41, 0.95) 0%, rgba(10, 25, 41, 0.85) 50%, rgba(10, 25, 41, 0.95) 100%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23134520" width="1200" height="800"/><g opacity="0.3"><circle cx="600" cy="400" r="150" fill="none" stroke="%23fff" stroke-width="2"/><path d="M450,400 L600,250 L750,400 L600,550 Z" fill="none" stroke="%23fff" stroke-width="2"/></g></svg>');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  z-index: 0;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(45, 90, 123, 0.9) 100%);
  padding: 80px 20px 60px;
  text-align: center;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.back-link {
  position: absolute;
  top: 32px;
  left: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  transition: all 0.3s;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 24px;
}

.header-content {
  position: relative;
  z-index: 2;
}

.league-badge {
  display: inline-block;
  padding: 10px 28px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: white;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.3em;
  border-radius: 50px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.page-title {
  font-size: 64px;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
}

/* Division Filter */
.filter-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.filter-tab {
  flex-shrink: 0;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.filter-tab.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.tab-name {
  font-size: 17px;
  font-weight: 700;
}

.tab-name-en {
  font-size: 13px;
  opacity: 0.8;
}

/* Stadiums Grid */
.stadiums-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 100px;
  position: relative;
  z-index: 1;
}

.stadiums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

/* Stadium Card */
.stadium-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 6px solid var(--team-color);
}

.stadium-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

/* Loading State */
.card-loading {
  padding: 80px 40px;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--team-color);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Card Content */
.card-content {
  padding: 28px;
}

/* Team Header */
.team-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.team-logo {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 24px;
  font-weight: 900;
  color: var(--team-color);
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.team-name-ko {
  font-size: 14px;
  color: #86868b;
  margin: 0;
  font-weight: 600;
}

/* Stadium Info */
.stadium-info {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 3px solid var(--team-color);
}

.stadium-name {
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.stadium-city {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

/* Weather Display */
.weather-display {
  margin-bottom: 16px;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
  border-radius: 16px;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.weather-icon-large {
  font-size: 56px;
}

.temperature {
  font-size: 56px;
  font-weight: 900;
  color: var(--team-color);
  line-height: 1;
  letter-spacing: -0.03em;
}

/* Weather Details */
.weather-details {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-item {
  flex: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.detail-icon {
  font-size: 24px;
}

.detail-value {
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
}

/* Division Badge */
.division-badge {
  text-align: center;
  padding: 8px;
  background: var(--team-color);
  color: white;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  border-radius: 10px;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 60px 20px 40px;
  }

  .back-link {
    top: 16px;
    left: 16px;
    font-size: 15px;
    padding: 10px 20px;
  }

  .page-title {
    font-size: 48px;
  }

  .page-subtitle {
    font-size: 19px;
  }

  .filter-container {
    padding: 32px 16px;
  }

  .stadiums-container {
    padding: 0 16px 80px;
  }

  .stadiums-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
/* MLB data room overrides */
.all-stadiums-page { padding-top:0; background:#f2f2ef; color:#141a20; }
.bg-stadium { opacity:1; background:linear-gradient(110deg,rgba(7,13,20,.98),rgba(15,31,37,.9)),repeating-linear-gradient(90deg,transparent 0 79px,rgba(255,255,255,.03) 80px); }
.page-header { min-height:360px; padding:132px max(24px,calc((100vw - 1360px)/2)) 58px; text-align:left; background:radial-gradient(circle at 80% 50%,rgba(30,113,91,.32),transparent 30%); backdrop-filter:none; }
.header-content { max-width:1360px; margin:auto; position:relative; }
.sub-eyebrow { display:flex;align-items:center;gap:10px;margin:0 0 13px;color:rgba(255,255,255,.52);font-size:10px;font-weight:800;letter-spacing:.16em}.sub-eyebrow span{width:25px;height:2px;background:#df433a}.page-title{margin:0;font-size:clamp(48px,6vw,78px);line-height:1;letter-spacing:0;color:#fff}.page-subtitle{margin:17px 0 0;color:rgba(255,255,255,.58);font-size:15px}.header-counter{position:absolute;right:0;bottom:0;display:flex;align-items:baseline;gap:10px;color:#fff}.header-counter strong{font-size:50px}.header-counter span{color:rgba(255,255,255,.45);font-size:11px;font-weight:700}.filter-container{position:sticky;top:0;z-index:10;padding:0 max(20px,calc((100vw - 1360px)/2));background:rgba(242,242,239,.93);border-bottom:1px solid #d5d7d4;backdrop-filter:blur(14px)}.filter-tabs{max-width:none;margin:0;display:flex;gap:0;overflow-x:auto}.filter-tab{flex:1;min-width:118px;padding:18px 12px 16px;border:0;border-bottom:2px solid transparent;border-radius:0;background:transparent;color:#757b7f;box-shadow:none}.filter-tab:hover{transform:none;background:#e9eae6}.filter-tab.active{background:transparent;color:#121820;border-bottom-color:#df433a;box-shadow:none}.tab-name{font-size:12px}.tab-name-en{margin-top:5px;font-size:8px;color:inherit;opacity:.65}.stadiums-container{max-width:1400px;padding:46px 28px 100px}.stadiums-grid{grid-template-columns:repeat(3,1fr);gap:14px}.stadium-card{min-width:0;border:1px solid #d9dad6;border-top:0;border-radius:4px;background:#fafaf8;box-shadow:none;transition:transform .2s,box-shadow .2s}.stadium-card::before{height:3px;opacity:1;background:var(--team-color)}.stadium-card:hover{transform:translateY(-4px);box-shadow:0 18px 36px rgba(20,27,31,.12)}.card-content{padding:22px}.team-header{gap:14px;margin:0 0 18px;padding:0 0 16px;border-bottom:1px solid #e0e1dd}.team-logo{width:50px;height:50px}.team-name{font-size:23px;text-shadow:none}.team-name-ko{font-size:11px}.stadium-info{margin:0;padding:0;border:0;border-radius:0;background:transparent}.stadium-name{font-size:13px}.stadium-city{margin-top:4px;font-size:10px}.weather-display{margin:18px 0 0;padding:17px;border:0;border-radius:3px;background:#eff0ec;text-align:left}.weather-main{justify-content:flex-start;gap:12px;margin:0}.weather-icon-large{font-size:31px;animation:none}.temperature{font-size:40px;text-shadow:none}.weather-details{gap:0;margin:0;padding:14px 0 0}.detail-item{justify-content:flex-start;gap:7px;padding:0;border:0;border-radius:0;background:transparent}.detail-icon{font-size:15px}.detail-value{font-size:11px}.division-badge{position:absolute;right:20px;top:21px;padding:5px 7px;border:1px solid #dedfdb;border-radius:0;background:transparent;color:#777d81;font-size:8px}.card-loading{padding:90px 30px}.loading-spinner{width:34px;height:34px;border-width:3px}.back-link,.league-badge{display:none}
.stadium-search{position:relative;max-width:1360px;margin:0 auto;padding:18px 0 12px}.stadium-search label{display:block;margin-bottom:8px;color:#7a8185;font-size:9px;font-weight:800;letter-spacing:.15em}.search-input-wrap{display:flex;align-items:center;max-width:520px;height:46px;border:1px solid #cfd2ce;background:#fafaf8}.search-icon{padding-left:14px;color:#df433a;font-size:25px;line-height:1}.search-input-wrap input{width:100%;height:100%;padding:0 10px;border:0;outline:0;background:transparent;color:#1b232a;font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.search-input-wrap input::placeholder{color:#9da3a5}.clear-search{width:38px;height:100%;border:0;background:transparent;color:#71787c;font-size:21px;cursor:pointer}.search-results{position:absolute;z-index:15;top:82px;width:min(520px,100%);border:1px solid #d2d5d1;background:#fff;box-shadow:0 14px 30px rgba(22,30,34,.16)}.search-result{display:flex;align-items:center;width:100%;gap:12px;padding:11px 14px;border:0;border-bottom:1px solid #e7e8e4;background:#fff;text-align:left;cursor:pointer}.search-result:last-child{border-bottom:0}.search-result:hover{background:#f1f3ef}.search-result img{width:32px;height:32px;object-fit:contain}.search-result span{min-width:0;flex:1}.search-result strong,.search-result small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-result strong{color:#1c252b;font-size:13px}.search-result small{margin-top:3px;color:#7f878b;font-size:10px}.search-result b{color:#df433a;font-size:16px}.no-results{margin:12px 0 5px;color:#858b8f;font-size:12px}.stadium-card.selected{outline:2px solid #df433a;outline-offset:3px}
@media(max-width:980px){.stadiums-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.page-header{min-height:330px;padding:112px 18px 44px}.header-counter{position:static;margin-top:25px}.header-counter strong{font-size:32px}.filter-container{padding:0}.stadium-search{padding:16px 15px 12px}.search-results{top:80px;left:15px;width:calc(100% - 30px)}.filter-tab{min-width:105px}.stadiums-container{padding:32px 15px 80px}.stadiums-grid{grid-template-columns:1fr}.page-title{font-size:48px}}
.search-band{position:relative;z-index:12;display:flex;align-items:end;gap:25px;padding:0 max(20px,calc((100vw - 1360px)/2));background:#fafaf8;border-bottom:1px solid #d5d7d4}.search-band .stadium-search{margin:0;flex:1}.search-unit-toggle{align-self:end;margin:0 0 24px}.unit-toggle{display:inline-flex;padding:2px;border:1px solid #cdd1ce;background:#e8eae6;border-radius:3px}.unit-toggle button{min-width:30px;height:24px;padding:0 7px;border:0;background:transparent;color:#7d8588;font-size:10px;font-weight:800;cursor:pointer}.unit-toggle button.active{background:#17232a;color:#fff;border-radius:2px}@media(max-width:640px){.search-band{padding:0 15px;gap:10px}.search-band .stadium-search{padding:16px 0 12px}.search-unit-toggle{margin-bottom:17px}.search-results{top:80px;left:0;width:100%}}
.filter-container{padding:10px max(20px,calc((100vw - 1360px)/2));background:#e8eae6;border-bottom:1px solid #cfd2ce}.filter-tabs{width:100%;display:flex;align-items:stretch;gap:4px;padding:4px;overflow-x:visible;border:1px solid #d5d7d3;background:#f4f5f2;border-radius:4px}.filter-tab{flex:1;min-width:0;padding:14px 10px;border:0;border-bottom:2px solid transparent;background:transparent}.filter-tab.active{background:#fff;border-bottom-color:#df433a;box-shadow:0 3px 10px rgba(28,36,40,.08)}
@media(max-width:720px){.filter-container{padding:8px 15px}.filter-tabs{overflow-x:auto}.filter-tab{flex:0 0 112px}}
</style>
