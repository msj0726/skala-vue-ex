<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'

const news = ref([])
const isLoading = ref(false)

const newsItems = computed(() => {
  return [
    { title: '최신 기술 동향: AI가 바꾸는 세상', url: '#', source: 'Tech News', publishedAt: '8월 4일 17:30' },
    { title: '글로벌 경제 전망 보고서 발표', url: '#', source: 'Economic Times', publishedAt: '8월 4일 16:45' },
    { title: '새로운 친환경 에너지 정책 시행', url: '#', source: 'Green Daily', publishedAt: '8월 4일 15:20' },
    { title: '스포츠: 한국 팀 국제 대회 우승', url: '#', source: 'Sports Herald', publishedAt: '8월 4일 14:10' },
    { title: '문화: 새로운 전시회 개막', url: '#', source: 'Culture Today', publishedAt: '8월 4일 13:00' },
    { title: '과학: 우주 탐사 새로운 발견', url: '#', source: 'Science Daily', publishedAt: '8월 4일 12:30' },
    { title: '테크: 새로운 스마트폰 출시', url: '#', source: 'Tech Review', publishedAt: '8월 4일 11:15' },
    { title: '정치: 새로운 정책 발표', url: '#', source: 'Political News', publishedAt: '8월 4일 10:00' },
  ]
})
</script>

<template>
  <div class="news-page">
    <!-- Header -->
    <header class="news-header">
      <RouterLink to="/personal/" class="back-link">
        <span class="back-icon">←</span>
        홈으로
      </RouterLink>
      <h1 class="page-title">오늘의 뉴스</h1>
      <p class="page-subtitle">최신 뉴스와 트렌드를 확인하세요</p>
    </header>

    <!-- News List -->
    <div class="news-container">
      <div class="news-list">
        <a
          v-for="(item, index) in newsItems"
          :key="index"
          :href="item.url"
          target="_blank"
          class="news-item"
        >
          <span class="news-number">{{ index + 1 }}</span>
          <div class="news-content">
            <h3 class="news-title">{{ item.title }}</h3>
            <p class="news-meta">{{ item.source }} · {{ item.publishedAt }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-page {
  min-height: 100vh;
  background: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding-top: 44px;
}

/* Header */
.news-header {
  background: white;
  padding: 48px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-link {
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0071e3;
  text-decoration: none;
  font-size: 17px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.7;
}

.back-icon {
  font-size: 24px;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 12px 0;
  letter-spacing: -0.03em;
}

.page-subtitle {
  font-size: 21px;
  color: #86868b;
  margin: 0;
}

/* News Container */
.news-container {
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 20px;
}

.news-list {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.news-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
  border-bottom: 1px solid #f5f5f7;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background: #f5f5f7;
}

.news-number {
  font-size: 28px;
  font-weight: 700;
  color: #d2d2d7;
  flex-shrink: 0;
  width: 48px;
  text-align: center;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  font-size: 19px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.news-meta {
  font-size: 15px;
  color: #86868b;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .news-header {
    padding: 32px 20px;
  }

  .back-link {
    top: 16px;
    left: 16px;
    font-size: 15px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 17px;
  }

  .news-container {
    padding: 24px 16px;
  }

  .news-item {
    padding: 20px 24px;
    gap: 16px;
  }

  .news-number {
    font-size: 24px;
    width: 40px;
  }

  .news-title {
    font-size: 17px;
  }

  .news-meta {
    font-size: 14px;
  }
}
</style>
