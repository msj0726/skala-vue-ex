<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const mockDetails = {
  city_01: { name: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s' },
  city_02: { name: '경기도 수원시 영통구', temp: 24, status: '비', humidity: '85%', wind: '4.1m/s' },
  city_03: { name: '부산광역시 해운대구', temp: 26, status: '구름', humidity: '65%', wind: '5.0m/s' },
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ cityData.temp }}°C</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button @click="router.push('/personal/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 80px auto 40px;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px 48px;
  border-radius: 18px;
  box-shadow: 0 8px 26px rgba(35, 81, 112, 0.055);
  border: 1px solid rgba(229, 237, 242, 0.8);
  backdrop-filter: blur(10px);
}

.detail-container h3 {
  color: #203e54;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.035em;
}

.detail-container hr {
  border: none;
  border-top: 2px solid #e5edf2;
  margin: 1.5rem 0;
}

.info-card {
  background: linear-gradient(135deg, #f7fbfd 0%, #e8f4fa 100%);
  padding: 32px 36px;
  border-radius: 14px;
  margin: 24px 0;
  border: 1px solid #dceaf3;
  box-shadow: 0 4px 12px rgba(35, 81, 112, 0.06);
}

.info-card h4 {
  color: #176fa7;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.info-card p {
  color: #728897;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 12px;
}

.info-card p strong {
  color: #203e54;
  font-weight: 700;
  font-size: 1.1rem;
}

.detail-container > div > p {
  color: #a05252;
  font-size: 0.95rem;
  text-align: center;
  padding: 2rem;
}

.back-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #176fa7 0%, #3997cf 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(23, 111, 167, 0.25);
  transition: all 0.2s;
  margin-top: 1.5rem;
}

.back-btn:hover {
  background: linear-gradient(135deg, #124f79 0%, #176fa7 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 111, 167, 0.35);
}

@media (max-width: 768px) {
  .detail-container {
    margin: 70px 20px 30px;
    padding: 28px 24px;
  }

  .info-card {
    padding: 24px 20px;
  }
}
</style>