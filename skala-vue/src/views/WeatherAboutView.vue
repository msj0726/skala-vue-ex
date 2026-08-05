<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/personal/')
}
</script>

<template>
  <div class="about-container">
    <h3>ℹ️ 서비스 소개</h3>
    <hr />

    <div class="description-box">
      <p>본 앱은 <strong>Vue 3</strong> 및 <strong>Vue Router 4</strong> 기반 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
      <ul>
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
      </ul>
    </div>

    <button @click="handleGoHome" class="home-btn">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 80px auto 40px;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px 48px;
  border-radius: 18px;
  box-shadow: 0 8px 26px rgba(35, 81, 112, 0.055);
  border: 1px solid rgba(229, 237, 242, 0.8);
  backdrop-filter: blur(10px);
}

.about-container h3 {
  color: #203e54;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.035em;
}

.about-container hr {
  border: none;
  border-top: 2px solid #e5edf2;
  margin: 1.5rem 0;
}

.description-box {
  background: linear-gradient(135deg, #f7fbfd 0%, #e8f4fa 100%);
  padding: 32px 36px;
  border-radius: 14px;
  line-height: 1.8;
  font-size: 1rem;
  border: 1px solid #dceaf3;
  box-shadow: 0 4px 12px rgba(35, 81, 112, 0.06);
}

.description-box p {
  color: #728897;
  margin-bottom: 1.5rem;
}

.description-box strong {
  color: #176fa7;
  font-weight: 700;
}

ul {
  padding-left: 28px;
  margin: 0;
}

li {
  margin-bottom: 12px;
  color: #506b7e;
  line-height: 1.6;
}

code {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe9a6 100%);
  padding: 4px 8px;
  border-radius: 6px;
  color: #c86400;
  font-weight: 600;
  font-size: 0.9em;
  border: 1px solid #ffe0a0;
}

.home-btn {
  width: 100%;
  margin-top: 2rem;
  padding: 14px 24px;
  background: linear-gradient(135deg, #176fa7 0%, #3997cf 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(23, 111, 167, 0.25);
  transition: all 0.2s;
}

.home-btn:hover {
  background: linear-gradient(135deg, #124f79 0%, #176fa7 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 111, 167, 0.35);
}

@media (max-width: 768px) {
  .about-container {
    margin: 70px 20px 30px;
    padding: 28px 24px;
  }

  .description-box {
    padding: 24px 20px;
  }
}
</style>