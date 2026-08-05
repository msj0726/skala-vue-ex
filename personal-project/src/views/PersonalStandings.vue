<script setup>
import { ref, onMounted } from 'vue'
import MlbNav from '@/components/mlb/MlbNav.vue'
import { fetchCurrentMlbStandings } from '@/services/mlbApi'

// MLB 2024 시즌 순위 데이터 (예시)
const standings = ref({
  'AL East': [
    { team: 'Yankees', teamKo: '양키스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/nyy.png&h=200&w=200', color: '#003087', wins: 95, losses: 67, pct: 0.586, gb: '-' },
    { team: 'Orioles', teamKo: '오리올스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/bal.png&h=200&w=200', color: '#DF4601', wins: 92, losses: 70, pct: 0.568, gb: '3.0' },
    { team: 'Red Sox', teamKo: '레드삭스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/bos.png&h=200&w=200', color: '#BD3039', wins: 85, losses: 77, pct: 0.525, gb: '10.0' },
    { team: 'Blue Jays', teamKo: '블루제이스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tor.png&h=200&w=200', color: '#134A8E', wins: 78, losses: 84, pct: 0.481, gb: '17.0' },
    { team: 'Rays', teamKo: '레이스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tb.png&h=200&w=200', color: '#092C5C', wins: 75, losses: 87, pct: 0.463, gb: '20.0' },
  ],
  'AL Central': [
    { team: 'Guardians', teamKo: '가디언스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/cle.png&h=200&w=200', color: '#E31937', wins: 88, losses: 74, pct: 0.543, gb: '-' },
    { team: 'Twins', teamKo: '트윈스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/min.png&h=200&w=200', color: '#002B5C', wins: 85, losses: 77, pct: 0.525, gb: '3.0' },
    { team: 'Royals', teamKo: '로열스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/kc.png&h=200&w=200', color: '#004687', wins: 82, losses: 80, pct: 0.506, gb: '6.0' },
    { team: 'Tigers', teamKo: '타이거스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/det.png&h=200&w=200', color: '#0C2340', wins: 78, losses: 84, pct: 0.481, gb: '10.0' },
    { team: 'White Sox', teamKo: '화이트삭스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/chw.png&h=200&w=200', color: '#27251F', wins: 65, losses: 97, pct: 0.401, gb: '23.0' },
  ],
  'AL West': [
    { team: 'Astros', teamKo: '애스트로스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/hou.png&h=200&w=200', color: '#002D62', wins: 91, losses: 71, pct: 0.562, gb: '-' },
    { team: 'Mariners', teamKo: '매리너스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sea.png&h=200&w=200', color: '#0C2C56', wins: 87, losses: 75, pct: 0.537, gb: '4.0' },
    { team: 'Rangers', teamKo: '레인저스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/tex.png&h=200&w=200', color: '#003278', wins: 84, losses: 78, pct: 0.519, gb: '7.0' },
    { team: 'Angels', teamKo: '에인절스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/laa.png&h=200&w=200', color: '#BA0021', wins: 72, losses: 90, pct: 0.444, gb: '19.0' },
    { team: 'Athletics', teamKo: '애슬레틱스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/oak.png&h=200&w=200', color: '#003831', wins: 68, losses: 94, pct: 0.420, gb: '23.0' },
  ],
  'NL East': [
    { team: 'Braves', teamKo: '브레이브스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/atl.png&h=200&w=200', color: '#CE1141', wins: 93, losses: 69, pct: 0.574, gb: '-' },
    { team: 'Phillies', teamKo: '필리스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/phi.png&h=200&w=200', color: '#E81828', wins: 90, losses: 72, pct: 0.556, gb: '3.0' },
    { team: 'Mets', teamKo: '메츠', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/nym.png&h=200&w=200', color: '#002D72', wins: 86, losses: 76, pct: 0.531, gb: '7.0' },
    { team: 'Nationals', teamKo: '내셔널스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/wsh.png&h=200&w=200', color: '#AB0003', wins: 74, losses: 88, pct: 0.457, gb: '19.0' },
    { team: 'Marlins', teamKo: '말린스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/mia.png&h=200&w=200', color: '#00A3E0', wins: 70, losses: 92, pct: 0.432, gb: '23.0' },
  ],
  'NL Central': [
    { team: 'Cubs', teamKo: '컵스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/chc.png&h=200&w=200', color: '#0E3386', wins: 89, losses: 73, pct: 0.549, gb: '-' },
    { team: 'Brewers', teamKo: '브루어스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/mil.png&h=200&w=200', color: '#12284B', wins: 87, losses: 75, pct: 0.537, gb: '2.0' },
    { team: 'Cardinals', teamKo: '카디널스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/stl.png&h=200&w=200', color: '#C41E3A', wins: 82, losses: 80, pct: 0.506, gb: '7.0' },
    { team: 'Reds', teamKo: '레즈', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/cin.png&h=200&w=200', color: '#C6011F', wins: 78, losses: 84, pct: 0.481, gb: '11.0' },
    { team: 'Pirates', teamKo: '파이어리츠', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/pit.png&h=200&w=200', color: '#27251F', wins: 72, losses: 90, pct: 0.444, gb: '17.0' },
  ],
  'NL West': [
    { team: 'Dodgers', teamKo: '다저스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/lad.png&h=200&w=200', color: '#005A9C', wins: 98, losses: 64, pct: 0.605, gb: '-' },
    { team: 'Diamondbacks', teamKo: '다이아몬드백스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/ari.png&h=200&w=200', color: '#A71930', wins: 91, losses: 71, pct: 0.562, gb: '7.0' },
    { team: 'Padres', teamKo: '파드리스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sd.png&h=200&w=200', color: '#2F241D', wins: 88, losses: 74, pct: 0.543, gb: '10.0' },
    { team: 'Giants', teamKo: '자이언츠', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/sf.png&h=200&w=200', color: '#FD5A1E', wins: 82, losses: 80, pct: 0.506, gb: '16.0' },
    { team: 'Rockies', teamKo: '로키스', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/col.png&h=200&w=200', color: '#33006F', wins: 68, losses: 94, pct: 0.420, gb: '30.0' },
  ],
})

const divisions = [
  { id: 'AL East', name: 'AL 동부', nameEn: 'American League East' },
  { id: 'AL Central', name: 'AL 중부', nameEn: 'American League Central' },
  { id: 'AL West', name: 'AL 서부', nameEn: 'American League West' },
  { id: 'NL East', name: 'NL 동부', nameEn: 'National League East' },
  { id: 'NL Central', name: 'NL 중부', nameEn: 'National League Central' },
  { id: 'NL West', name: 'NL 서부', nameEn: 'National League West' },
]

const currentSeason = new Date().getFullYear()
const isLiveLoading = ref(true)
const liveError = ref(false)
const normalizeDivision = (name) => ({
  'American League East': 'AL East', 'American League Central': 'AL Central', 'American League West': 'AL West',
  'National League East': 'NL East', 'National League Central': 'NL Central', 'National League West': 'NL West',
}[name] ?? name)

onMounted(async () => {
  try {
    const liveStandings = await fetchCurrentMlbStandings(currentSeason)
    for (const [name, teams] of Object.entries(liveStandings)) {
      const division = normalizeDivision(name)
      if (standings.value[division] && teams.length) standings.value[division] = teams
    }
  } catch {
    liveError.value = true
  } finally {
    isLiveLoading.value = false
  }
})
</script>

<template>
  <div class="standings-page">
    <MlbNav />
    <!-- Background -->
    <div class="bg-stadium"></div>

    <!-- Header -->
    <div class="standings-header">
      <p class="sub-eyebrow"><span></span> LEAGUE TABLE</p>
      <h1 class="main-title">{{ currentSeason }} Standings</h1>
      <p class="main-subtitle">6개 지구, 30개 팀의 정규 시즌 기록</p>
      <p class="live-note">{{ isLiveLoading ? 'MLB Stats API에서 최신 순위를 가져오는 중...' : liveError ? 'API 연결 실패 · 마지막 표시 데이터를 유지합니다.' : 'MLB Stats API · 최신 정규 시즌 기준' }}</p>
    </div>

    <!-- Standings Container -->
    <div class="standings-container">
      <div
        v-for="division in divisions"
        :key="division.id"
        class="division-section"
      >
        <div class="division-header">
          <h2 class="division-title">{{ division.name }}</h2>
          <p class="division-subtitle">{{ division.nameEn }}</p>
        </div>

        <div class="standings-table">
          <!-- Table Header -->
          <div class="table-header">
            <div class="col-rank">#</div>
            <div class="col-team">팀</div>
            <div class="col-stat">승</div>
            <div class="col-stat">패</div>
            <div class="col-stat">승률</div>
            <div class="col-stat">GB</div>
          </div>

          <!-- Table Rows -->
          <div
            v-for="(team, index) in standings[division.id]"
            :key="team.team"
            class="table-row"
            :style="{ '--team-color': team.color }"
          >
            <div class="col-rank">
              <span class="rank-number">{{ index + 1 }}</span>
            </div>
            <div class="col-team">
              <div class="team-logo-small">
                <img :src="team.logoUrl" :alt="team.team" />
              </div>
              <div class="team-name-container">
                <span class="team-name">{{ team.team }}</span>
                <span class="team-name-ko">{{ team.teamKo }}</span>
              </div>
            </div>
            <div class="col-stat stat-wins">{{ team.wins }}</div>
            <div class="col-stat stat-losses">{{ team.losses }}</div>
            <div class="col-stat stat-pct">{{ team.pct.toFixed(3) }}</div>
            <div class="col-stat stat-gb">{{ team.gb }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.standings-page {
  min-height: 100vh;
  background: #0a1929;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  position: relative;
}

/* Background */
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
.standings-header {
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(45, 90, 123, 0.9) 100%);
  padding: 80px 20px 60px;
  text-align: center;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.back-button {
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-4px);
}

.main-title {
  font-size: 56px;
  font-weight: 900;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.main-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

/* Standings Container */
.standings-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px 100px;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 40px;
}

/* Division Section */
.division-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.division-header {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%);
  padding: 24px 32px;
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}

.division-title {
  font-size: 28px;
  font-weight: 900;
  color: white;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.division-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

/* Standings Table */
.standings-table {
  padding: 0;
}

.table-header {
  display: grid;
  grid-template-columns: 50px 1fr 70px 70px 80px 70px;
  gap: 12px;
  padding: 16px 32px;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 700;
  font-size: 13px;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row {
  display: grid;
  grid-template-columns: 50px 1fr 70px 70px 80px 70px;
  gap: 12px;
  padding: 20px 32px;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.2s;
  align-items: center;
}

.table-row:hover {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--team-color, #000) 5%, rgba(255, 255, 255, 0) 100%);
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transform: translateX(4px);
}

.table-row:last-child {
  border-bottom: none;
}

/* Columns */
.col-rank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-number {
  font-size: 20px;
  font-weight: 900;
  color: var(--team-color);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%);
  border-radius: 8px;
}

.col-team {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-logo-small {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.team-logo-small img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.team-name-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.team-name {
  font-size: 18px;
  font-weight: 700;
  color: #212529;
}

.team-name-ko {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.col-stat {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #495057;
}

.stat-wins {
  color: #28a745;
}

.stat-losses {
  color: #dc3545;
}

.stat-pct {
  font-weight: 700;
  color: #212529;
}

.stat-gb {
  color: #6c757d;
}

@media (max-width: 768px) {
  .standings-container {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 40px 1fr 60px 60px 70px 60px;
    gap: 8px;
    padding: 16px 20px;
    font-size: 14px;
  }

  .team-logo-small {
    width: 36px;
    height: 36px;
  }

  .team-name {
    font-size: 16px;
  }

  .main-title {
    font-size: 36px;
  }
}
/* MLB league table overrides */
.standings-page{background:#f2f2ef;color:#141a20}.bg-stadium{opacity:1;background:linear-gradient(110deg,rgba(7,13,20,.98),rgba(22,34,40,.9)),repeating-linear-gradient(90deg,transparent 0 79px,rgba(255,255,255,.03) 80px)}.standings-header{min-height:360px;padding:137px max(24px,calc((100vw - 1360px)/2)) 58px;text-align:left;background:radial-gradient(circle at 78% 45%,rgba(39,103,86,.35),transparent 29%);backdrop-filter:none}.sub-eyebrow{display:flex;align-items:center;gap:10px;margin:0 0 13px;color:rgba(255,255,255,.52);font-size:10px;font-weight:800;letter-spacing:.16em}.sub-eyebrow span{width:25px;height:2px;background:#df433a}.main-title{margin:0;font-size:clamp(48px,6vw,78px);line-height:1;letter-spacing:0}.main-subtitle{margin-top:17px;color:rgba(255,255,255,.58);font-size:15px}.live-note{margin-top:20px;color:#66d39a;font-size:10px;font-weight:800;letter-spacing:.06em}.back-button{display:none}.standings-container{max-width:1400px;padding:48px 28px 100px;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.division-section{border:1px solid #d8dad6;border-radius:4px;background:#fafaf8;box-shadow:none}.division-header{padding:20px 24px;background:#111a21;border-bottom:2px solid #df433a}.division-title{font-size:21px;letter-spacing:0}.division-subtitle{font-size:10px;color:rgba(255,255,255,.48);letter-spacing:.05em}.table-header,.table-row{grid-template-columns:36px minmax(155px,1fr) 50px 50px 62px 46px;gap:8px;padding-left:20px;padding-right:20px}.table-header{padding-top:12px;padding-bottom:12px;background:#e9eae6;border-bottom:1px solid #d5d7d3;font-size:9px;color:#777d81;letter-spacing:.08em}.table-row{min-height:68px;padding-top:10px;padding-bottom:10px;border-bottom:1px solid #e1e2de}.table-row:hover{transform:none;background:linear-gradient(90deg,color-mix(in srgb,var(--team-color) 8%,transparent),transparent 35%);background-size:auto}.rank-number{width:25px;height:25px;border-radius:2px;background:#ecece8;font-size:12px}.team-logo-small{width:38px;height:38px}.col-team{gap:11px}.team-name{font-size:14px}.team-name-ko{font-size:9px}.col-stat{font-size:12px}.stat-wins{color:#198358}.stat-losses{color:#bf4741}.stat-pct{color:#141a20}.stat-gb{color:#777d81}
@media(max-width:1050px){.standings-container{grid-template-columns:1fr}}
@media(max-width:640px){.standings-header{min-height:330px;padding:115px 18px 45px}.main-title{font-size:47px}.standings-container{padding:30px 12px 80px;gap:12px}.division-section{overflow-x:auto}.standings-table{min-width:550px}.table-header,.table-row{grid-template-columns:32px minmax(145px,1fr) 45px 45px 58px 42px;padding-left:14px;padding-right:14px}}
</style>
