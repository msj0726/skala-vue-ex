<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MlbNav from '@/components/mlb/MlbNav.vue'
import MlbBallScene from '@/components/mlb/MlbBallScene.vue'
import { fetchBallparkWeather, fetchTodaysGames } from '@/services/mlbApi'

const router = useRouter()
const todaysGames = ref([])
const gamesLoading = ref(true)
const favoriteTeams = ref(JSON.parse(localStorage.getItem('mlb-favorite-teams') || '[]'))
const favoritePicker = ref('')
const favoriteOptions = [
  { name: 'Los Angeles Dodgers', short: '다저스', logoUrl: 'https://www.mlbstatic.com/team-logos/119.svg' },
  { name: 'New York Yankees', short: '양키스', logoUrl: 'https://www.mlbstatic.com/team-logos/147.svg' },
  { name: 'Boston Red Sox', short: '레드삭스', logoUrl: 'https://www.mlbstatic.com/team-logos/111.svg' },
  { name: 'San Diego Padres', short: '파드리스', logoUrl: 'https://www.mlbstatic.com/team-logos/135.svg' },
  { name: 'Chicago Cubs', short: '컵스', logoUrl: 'https://www.mlbstatic.com/team-logos/112.svg' },
]
const favoriteTeamData = computed(() => favoriteTeams.value.map((name) => favoriteOptions.find((team) => team.name === name)).filter(Boolean))
const toggleFavorite = (team) => {
  favoriteTeams.value = favoriteTeams.value.includes(team.name) ? favoriteTeams.value.filter((name) => name !== team.name) : [...favoriteTeams.value, team.name].slice(-3)
  localStorage.setItem('mlb-favorite-teams', JSON.stringify(favoriteTeams.value))
}
const addFavorite = () => {
  const team = favoriteOptions.find((option) => option.name === favoritePicker.value)
  if (team) toggleFavorite(team)
  favoritePicker.value = ''
}
const formatGameTime = (value) => value ? new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' }).format(new Date(value)) : '시간 미정'
const getGameWeather = (game) => stadiums.value.find((stadium) => game.venue.toLowerCase().includes(stadium.stadium.toLowerCase().split(' ')[0]))?.weather
const viewingScore = (weather) => {
  if (!weather || !Number.isFinite(weather.temp)) return null
  return Math.max(40, Math.min(98, Math.round(92 - (weather.precipitation || 0) * 16 - Math.max(0, (weather.wind || 0) - 20) * 0.8 - Math.abs(weather.temp - 21) * 1.2)))
}
const scoreLabel = (score) => score >= 85 ? '관람하기 좋은 날' : score >= 65 ? '준비하면 괜찮아요' : '날씨를 확인하세요'
const temperatureUnit = ref('C')
const formatTemperature = (temp) => {
  if (!Number.isFinite(temp)) return '—'
  return temperatureUnit.value === 'F' ? Math.round((temp * 9) / 5 + 32) : Math.round(temp)
}

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

const fetchWeather = async (stadium) => {
  stadium.weather = await fetchBallparkWeather(stadium)
  stadium.loading = false
}

onMounted(() => {
  stadiums.value.forEach(stadium => {
    stadium.loading = true
    fetchWeather(stadium)
  })
  fetchTodaysGames().then((games) => { todaysGames.value = games }).catch(() => { todaysGames.value = [] }).finally(() => { gamesLoading.value = false })
})

const navigateToAllStadiums = () => {
  router.push('/personal/all-stadiums')
}

const openStadium = (stadium) => {
  router.push({ path: '/personal/all-stadiums', query: { stadium: stadium.id } })
}

const navigateToStandings = () => {
  router.push('/personal/standings')
}
</script>

<template>
  <div class="mlbx-page">
    <MlbNav />
    <header class="home-hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> BALLPARK INTELLIGENCE</p>
        <h1>Every pitch.<br><strong>Every forecast.</strong></h1>
        <p class="hero-description">30개 메이저리그 구장의 날씨와 팀 흐름을 한 화면에서 확인하세요. 경기의 변수를 가장 빠르게 읽습니다.</p>
        <div class="hero-actions">
          <button class="primary-action" @click="navigateToAllStadiums">구장 날씨 보기 <span>↗</span></button>
          <button class="text-action" @click="navigateToStandings">리그 순위 <span>→</span></button>
        </div>
        <div class="hero-stats">
          <div><strong>30</strong><span>ACTIVE PARKS</span></div>
          <div><strong>6</strong><span>DIVISIONS</span></div>
          <div><strong>LIVE</strong><span>WEATHER FEED</span></div>
        </div>
      </div>
      <MlbBallScene class="hero-scene" />
    </header>

    <section class="personal-dashboard">
      <div class="dashboard-section-heading">
        <div><p class="eyebrow"><span></span> GAME DAY CONTROL ROOM</p><h2>오늘의 야구를 골라보세요</h2></div>
        <span class="dashboard-date">{{ new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) }}</span>
      </div>
      <div class="dashboard-grid">
        <article class="dashboard-panel games-panel">
          <div class="panel-heading"><div><span class="panel-kicker">TODAY'S GAMES</span><h3>오늘의 경기 일정</h3></div><span class="live-dot">{{ todaysGames.length }} GAMES</span></div>
          <div v-if="gamesLoading" class="panel-empty">경기 일정을 불러오는 중입니다...</div>
          <div v-else-if="!todaysGames.length" class="panel-empty">오늘 예정된 경기가 없습니다.</div>
          <div v-else class="game-list">
            <div v-for="game in todaysGames.slice(0, 5)" :key="game.id" class="game-row">
              <div class="game-time"><strong>{{ formatGameTime(game.startTime) }}</strong><small>{{ game.status }}</small></div>
              <div class="game-team"><img :src="game.away.logoUrl" :alt="game.away.name"><strong>{{ game.away.name }}</strong></div><span class="versus">@</span><div class="game-team home"><img :src="game.home.logoUrl" :alt="game.home.name"><strong>{{ game.home.name }}</strong></div>
              <small class="game-venue">{{ game.venue }}</small>
            </div>
          </div>
        </article>
        <article class="dashboard-panel favorites-panel">
          <div class="panel-heading"><div><span class="panel-kicker">MY TEAMS</span><h3>즐겨찾는 팀</h3></div><span class="favorite-count">{{ favoriteTeams.length }}/3</span></div>
          <div v-if="favoriteTeamData.length" class="favorite-list"><button v-for="team in favoriteTeamData" :key="team.name" class="favorite-team" @click="toggleFavorite(team)"><img :src="team.logoUrl" :alt="team.name"><span><strong>{{ team.short }}</strong><small>{{ team.name }}</small></span><b>★</b></button></div>
          <p v-else class="favorite-hint">좋아하는 팀을 추가하면 메인 화면에서 바로 확인할 수 있어요.</p>
          <div class="favorite-add"><select v-model="favoritePicker" aria-label="즐겨찾기 팀 선택"><option value="">팀 선택...</option><option v-for="team in favoriteOptions.filter((option) => !favoriteTeams.includes(option.name))" :key="team.name" :value="team.name">{{ team.short }} · {{ team.name }}</option></select><button type="button" @click="addFavorite" :disabled="!favoritePicker || favoriteTeams.length >= 3">추가</button></div>
        </article>
        <article class="dashboard-panel score-panel">
          <div class="panel-heading"><div><span class="panel-kicker">BALLPARK COMFORT</span><h3>오늘의 관람 적합도</h3></div><span class="score-badge">LIVE</span></div>
          <div class="score-content"><div class="score-ring"><strong>{{ viewingScore(stadiums[0]?.weather) ?? '—' }}</strong><small>점</small></div><div><h4>{{ scoreLabel(viewingScore(stadiums[0]?.weather)) }}</h4><p>{{ stadiums[0]?.team }} 경기장 기준 · {{ stadiums[0]?.weather?.icon || '🌤️' }} {{ stadiums[0]?.weather?.temp ?? '—' }}°C</p></div></div>
          <div class="score-factors"><span>☔ 강수 {{ stadiums[0]?.weather?.precipitation ?? '—' }} mm</span><span>💨 바람 {{ stadiums[0]?.weather?.wind ?? '—' }} km/h</span><span>🌡 체감 {{ stadiums[0]?.weather?.feelsLike ?? '—' }}°</span></div>
        </article>
      </div>
    </section>

    <main class="home-content">
      <div class="content-heading">
        <div><p class="eyebrow dark"><span></span> TODAY'S CONDITIONS</p><h2>주요 구장</h2></div>
        <div class="heading-actions"><div class="unit-toggle" role="group" aria-label="온도 단위"><button :class="{ active: temperatureUnit === 'C' }" @click="temperatureUnit = 'C'">°C</button><button :class="{ active: temperatureUnit === 'F' }" @click="temperatureUnit = 'F'">°F</button></div><button class="all-link" @click="navigateToAllStadiums">30개 구장 전체보기 <span>→</span></button></div>
      </div>
      <div class="home-grid">
        <article v-for="stadium in stadiums.slice(0, 6)" :key="stadium.id" class="home-card" :style="{ '--team-color': stadium.color }" @click="openStadium(stadium)">
          <div class="card-accent"></div>
          <div class="card-top">
            <div class="logo-frame"><img :src="stadium.logoUrl" :alt="stadium.team"></div>
            <span class="division-label">{{ stadium.division }}</span>
          </div>
          <div class="card-team"><h3>{{ stadium.team }}</h3><span>{{ stadium.teamKo }}</span></div>
          <p class="park-name">{{ stadium.stadium }}</p>
          <p class="park-city"><i></i>{{ stadium.city }}</p>
          <div v-if="stadium.weather" class="condition-row">
            <div class="weather-reading"><span>{{ stadium.weather.icon }}</span><strong>{{ formatTemperature(stadium.weather.temp) }}°</strong></div>
            <div class="weather-meta"><span>HUM {{ stadium.weather.humidity }}%</span><span>WIND {{ stadium.weather.wind }} KM/H</span><span>RAIN {{ stadium.weather.precipitation }} MM</span></div>
          </div>
          <div v-else class="card-skeleton"><i></i><i></i></div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.mlb-page {
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
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23134520" width="1200" height="800"/><g opacity="0.3"><circle cx="600" cy="400" r="150" fill="none" stroke="%23fff" stroke-width="2"/><path d="M450,400 L600,250 L750,400 L600,550 Z" fill="none" stroke="%23fff" stroke-width="2"/><circle cx="300" cy="600" r="5" fill="%23fff"/><circle cx="900" cy="200" r="5" fill="%23fff"/><circle cx="200" cy="300" r="5" fill="%23fff"/><circle cx="1000" cy="500" r="5" fill="%23fff"/></g></svg>');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  z-index: 0;
}

/* Header */
.mlb-header {
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(45, 90, 123, 0.9) 100%);
  padding: 100px 20px 80px;
  text-align: center;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.mlb-header::before {
  content: '⚾';
  position: absolute;
  font-size: 400px;
  opacity: 0.03;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  filter: blur(2px);
}

.header-content {
  position: relative;
  z-index: 2;
}

.league-badge {
  display: inline-block;
  padding: 12px 32px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: white;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.3em;
  border-radius: 50px;
  margin-bottom: 32px;
  box-shadow:
    0 8px 24px rgba(255, 107, 53, 0.4),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.main-title {
  font-size: 80px;
  font-weight: 900;
  color: white;
  margin: 0 0 20px 0;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.2);
  background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-subtitle {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.view-all-btn {
  padding: 16px 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: 19px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.view-all-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Stadiums Container */
.stadiums-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 20px 100px;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 48px;
  font-weight: 900;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.section-subtitle {
  font-size: 21px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.stadiums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 32px;
}

/* Stadium Card */
.stadium-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 28px;
  overflow: hidden;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 8px solid var(--team-color);
  position: relative;
}

.stadium-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg,
    var(--team-color) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    var(--team-color) 100%);
  opacity: 0;
  transition: opacity 0.4s;
}

.stadium-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stadium-card:hover::before {
  opacity: 1;
}

/* Loading State */
.card-loading {
  padding: 100px 40px;
  text-align: center;
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border: 5px solid rgba(0, 0, 0, 0.1);
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
  padding: 36px;
  position: relative;
}

/* Team Header */
.team-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 3px solid rgba(0, 0, 0, 0.05);
}

.team-logo {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
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
  font-size: 36px;
  font-weight: 900;
  color: var(--team-color);
  margin: 0 0 6px 0;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.team-name-ko {
  font-size: 17px;
  color: #86868b;
  margin: 0;
  font-weight: 600;
}

/* Stadium Info */
.stadium-info {
  margin-bottom: 32px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 16px 20px;
  border-radius: 16px;
  border-left: 4px solid var(--team-color);
}

.stadium-name {
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 6px;
}

.stadium-city {
  font-size: 15px;
  color: #6c757d;
  font-weight: 500;
}

/* Weather Display */
.weather-display {
  background: linear-gradient(135deg,
    rgba(0, 0, 0, 0.03) 0%,
    rgba(0, 0, 0, 0.01) 100%);
  border-radius: 20px;
  padding: 36px;
  margin-bottom: 24px;
  text-align: center;
  border: 2px solid rgba(0, 0, 0, 0.05);
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-bottom: 16px;
}

.weather-icon-large {
  font-size: 88px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.temperature {
  font-size: 88px;
  font-weight: 900;
  color: var(--team-color);
  line-height: 1;
  letter-spacing: -0.04em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.weather-desc {
  font-size: 17px;
  color: #6c757d;
  text-transform: capitalize;
  font-weight: 600;
}

/* Weather Details */
.weather-details {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  flex: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.detail-value {
  font-size: 21px;
  font-weight: 700;
  color: #1d1d1f;
}

/* Division Badge */
.division-badge {
  text-align: center;
  padding: 10px;
  background: var(--team-color);
  color: white;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  border-radius: 12px;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 768px) {
  .mlb-header {
    padding: 80px 20px 60px;
  }

  .league-badge {
    font-size: 24px;
    padding: 10px 28px;
  }

  .main-title {
    font-size: 56px;
  }

  .main-subtitle {
    font-size: 21px;
    margin-bottom: 32px;
  }

  .view-all-btn {
    font-size: 17px;
    padding: 14px 32px;
  }

  .stadiums-container {
    padding: 60px 16px 80px;
  }

  .section-title {
    font-size: 36px;
  }

  .section-subtitle {
    font-size: 17px;
  }

  .stadiums-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .card-content {
    padding: 28px;
  }

  .team-logo {
    font-size: 64px;
  }

  .team-name {
    font-size: 32px;
  }

  .weather-icon-large {
    font-size: 72px;
  }

  .temperature {
    font-size: 72px;
  }
}
/* 2026 MLB experience */
.mlbx-page { min-height:100vh; background:#f2f2ef; color:#121820; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
.home-hero { min-height:720px; padding:108px max(24px,calc((100vw - 1360px)/2)) 48px; display:grid; grid-template-columns:minmax(420px,.9fr) minmax(480px,1.1fr); align-items:center; position:relative; overflow:hidden; color:#fff; background:radial-gradient(circle at 76% 40%,rgba(34,101,89,.5),transparent 28%),linear-gradient(120deg,#080d14 0%,#111d27 52%,#0a1818 100%); }
.home-hero::before { content:''; position:absolute; inset:0; opacity:.07; background-image:linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px); background-size:64px 64px; mask-image:linear-gradient(90deg,#000,transparent 68%); }
.hero-copy,.hero-scene { position:relative; z-index:2; }.hero-copy { max-width:650px; }
.eyebrow { display:flex; align-items:center; gap:10px; margin:0 0 22px; color:rgba(255,255,255,.56); font-size:11px; font-weight:800; letter-spacing:.16em; }.eyebrow span { width:24px; height:2px; background:#e2443a; }.eyebrow.dark { color:#687078; margin-bottom:10px; }
.hero-copy h1 { margin:0; font-size:clamp(58px,6.2vw,96px); line-height:.94; letter-spacing:0; font-weight:800; }.hero-copy h1 strong { color:#e9e5da; font-weight:300; }
.hero-description { max-width:570px; margin:28px 0 30px; color:rgba(255,255,255,.65); font-size:16px; line-height:1.8; word-break:keep-all; }
.hero-actions { display:flex; align-items:center; gap:28px; }.hero-actions button { min-height:48px; cursor:pointer; font-weight:800; border:0; }.primary-action { padding:0 20px; color:#fff; background:#dc4038; border-radius:3px; box-shadow:0 12px 28px rgba(220,64,56,.2); }.primary-action span,.text-action span,.all-link span { margin-left:12px; }.text-action { color:#fff; background:transparent; border-bottom:1px solid rgba(255,255,255,.3)!important; }
.hero-stats { display:flex; gap:0; margin-top:48px; }.hero-stats div { min-width:120px; padding-right:28px; margin-right:28px; border-right:1px solid rgba(255,255,255,.14); }.hero-stats div:last-child { border:0; }.hero-stats strong,.hero-stats span { display:block; }.hero-stats strong { font-size:19px; }.hero-stats span { margin-top:6px; color:rgba(255,255,255,.4); font-size:8px; font-weight:800; letter-spacing:.14em; }
.home-content { max-width:1400px; margin:0 auto; padding:80px 28px 110px; }.content-heading { display:flex; justify-content:space-between; align-items:end; margin-bottom:28px; }.content-heading h2 { margin:0; font-size:38px; letter-spacing:0; }.heading-actions{display:flex;align-items:center;gap:22px}.unit-toggle{display:inline-flex;padding:2px;border:1px solid #cdd1ce;background:#e8eae6;border-radius:3px}.unit-toggle button{min-width:30px;height:24px;padding:0 7px;border:0;background:transparent;color:#7d8588;font-size:10px;font-weight:800;cursor:pointer}.unit-toggle button.active{background:#17232a;color:#fff;border-radius:2px}.all-link { padding:0 0 7px; border:0; border-bottom:1px solid #b7b9b8; background:transparent; color:#252a2e; font-weight:700; cursor:pointer; }
.home-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }.home-card { position:relative; min-width:0; padding:24px; overflow:hidden; border:1px solid #d9dad6; border-radius:4px; background:#fafaf8; transition:transform .25s,box-shadow .25s; }.home-card:hover { transform:translateY(-5px); box-shadow:0 18px 36px rgba(24,30,33,.11); }.card-accent { position:absolute; inset:0 auto 0 0; width:3px; background:var(--team-color); }.card-top { display:flex; align-items:start; justify-content:space-between; }.logo-frame { width:58px; height:58px; display:grid; place-items:center; }.logo-frame img { max-width:100%; max-height:100%; filter:drop-shadow(0 7px 8px rgba(0,0,0,.12)); }.division-label { padding:5px 7px; color:#70767b; border:1px solid #dedfdb; font-size:9px; font-weight:800; }.card-team { display:flex; gap:9px; align-items:baseline; margin-top:20px; }.card-team h3 { margin:0; font-size:24px; line-height:1; }.card-team span { color:#8b9094; font-size:12px; }.park-name { margin:12px 0 4px; color:#444b50; font-size:13px; font-weight:700; }.park-city { display:flex; align-items:center; gap:7px; margin:0; color:#8b9094; font-size:11px; }.park-city i { width:6px;height:6px;border-radius:50%;background:#dc4038; }.condition-row { display:flex; justify-content:space-between; align-items:end; margin-top:24px; padding-top:18px; border-top:1px solid #e2e2df; }.weather-reading { display:flex; align-items:center; gap:9px; }.weather-reading span { font-size:27px; }.weather-reading strong { font-size:35px; line-height:1; }.weather-meta { display:grid; gap:5px; color:#858b8f; font-size:8px; font-weight:800; text-align:right; letter-spacing:.06em; }.card-skeleton { height:56px; margin-top:24px; padding-top:18px; border-top:1px solid #e2e2df; }.card-skeleton i { display:block; height:8px; width:50%; margin:5px 0; background:#e6e6e2; animation:blink 1.4s infinite alternate; }
@keyframes blink { to { opacity:.35; } }
 .personal-dashboard { max-width:1400px; margin:0 auto; padding:48px 28px 0; }
.dashboard-section-heading { display:flex; justify-content:space-between; align-items:end; margin-bottom:18px; }.dashboard-section-heading h2 { margin:0; color:#17232a; font-size:32px; }.dashboard-date { color:#7c8588; font-size:12px; font-weight:700; }
.dashboard-grid { display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:14px; }.dashboard-panel { min-height:260px; padding:22px; border:1px solid #d9dad6; border-radius:5px; background:#fff; box-shadow:0 10px 26px rgba(30,40,40,.04); }.panel-heading { display:flex; justify-content:space-between; align-items:start; padding-bottom:16px; border-bottom:1px solid #ecece8; }.panel-kicker { color:#9a9f9d; font-size:9px; font-weight:900; letter-spacing:.14em; }.panel-heading h3 { margin:5px 0 0; color:#17232a; font-size:20px; }.live-dot,.favorite-count,.score-badge { color:#d8493e; font-size:9px; font-weight:900; letter-spacing:.08em; }.live-dot::before { content:' '; display:inline-block; width:6px; height:6px; margin-right:5px; border-radius:50%; background:#d8493e; }.panel-empty,.favorite-hint { padding:36px 4px; color:#899195; font-size:13px; }.game-list { display:grid; }.game-row { display:grid; grid-template-columns:62px minmax(105px,1fr) 16px minmax(105px,1fr); gap:8px; align-items:center; padding:13px 0; border-bottom:1px solid #f0f0ec; }.game-row:last-child { border:0; }.game-time strong,.game-time small { display:block; }.game-time strong { color:#17232a; font-size:12px; }.game-time small,.game-venue { color:#949b9d; font-size:9px; }.game-team { display:flex; align-items:center; gap:7px; min-width:0; }.game-team img { width:25px; height:25px; object-fit:contain; }.game-team strong { overflow:hidden; color:#323b40; font-size:11px; text-overflow:ellipsis; white-space:nowrap; }.game-team.home { justify-content:flex-end; text-align:right; }.versus { color:#d8493e; font-size:11px; font-weight:900; }.game-venue { grid-column:2 / -1; margin-top:-5px; }.favorite-list { display:grid; gap:6px; padding:13px 0; }.favorite-team { display:flex; align-items:center; gap:10px; width:100%; padding:7px; border:0; background:#f7f8f5; text-align:left; cursor:pointer; }.favorite-team img { width:30px; height:30px; object-fit:contain; }.favorite-team span { flex:1; }.favorite-team strong,.favorite-team small { display:block; }.favorite-team strong { color:#263238; font-size:12px; }.favorite-team small { color:#949b9d; font-size:9px; }.favorite-team b { color:#dfa82f; }.favorite-add { display:flex; gap:6px; margin-top:auto; }.favorite-add select { flex:1; min-width:0; padding:8px; border:1px solid #dfe2de; color:#596367; background:#fff; font-size:11px; }.favorite-add button { padding:0 12px; border:0; color:#fff; background:#17232a; font-size:11px; font-weight:700; cursor:pointer; }.favorite-add button:disabled { opacity:.4; cursor:not-allowed; }.score-content { display:flex; align-items:center; gap:16px; padding:20px 0 14px; }.score-ring { width:94px; height:94px; display:grid; place-content:center; flex-shrink:0; border:7px solid #d8e6db; border-top-color:#4d9c70; border-right-color:#4d9c70; border-radius:50%; text-align:center; }.score-ring strong { color:#347956; font-size:31px; line-height:1; }.score-ring small { color:#71907c; font-size:10px; }.score-content h4 { margin:0 0 5px; color:#293936; font-size:15px; }.score-content p { margin:0; color:#8c9795; font-size:10px; line-height:1.5; }.score-factors { display:flex; flex-wrap:wrap; gap:7px; padding-top:13px; border-top:1px solid #ecece8; color:#77817f; font-size:9px; }
@media(max-width:980px){.home-hero{grid-template-columns:1fr; padding-top:110px}.hero-copy{padding-top:35px}.hero-scene{margin-top:-10px}.dashboard-grid{grid-template-columns:1fr 1fr}.games-panel{grid-column:span 2}.home-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.home-hero{min-height:auto;padding:98px 18px 30px}.hero-copy h1{font-size:48px}.hero-description{font-size:14px}.hero-stats div{min-width:0;flex:1;margin-right:12px;padding-right:12px}.hero-actions{gap:18px}.personal-dashboard{padding:38px 16px 0}.dashboard-section-heading{display:block}.dashboard-section-heading h2{font-size:25px}.dashboard-date{display:block;margin-top:8px}.dashboard-grid{grid-template-columns:1fr}.games-panel{grid-column:auto}.dashboard-panel{padding:18px}.game-row{grid-template-columns:55px minmax(80px,1fr) 12px minmax(80px,1fr)}.game-team strong{font-size:10px}.home-content{padding:58px 16px 80px}.content-heading{align-items:start}.content-heading h2{font-size:30px}.heading-actions{gap:10px;align-items:end;flex-direction:column}.all-link{font-size:11px}.home-grid{grid-template-columns:1fr}.home-card{padding:21px}}
</style>
