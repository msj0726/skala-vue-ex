import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNewsStore = defineStore('news', () => {
  const news = ref([])
  const loading = ref(false)

  async function fetchNews() {
    loading.value = true

    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?country=kr&lang=ko&token=${import.meta.env.VITE_GNEWS_API_KEY}`
      )

      if (response.ok) {
        const data = await response.json()
        news.value = data.articles.map(article => ({
          title: article.title,
          url: article.url,
          source: article.source.name,
          publishedAt: new Date(article.publishedAt).toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }))
      } else {
        // Fallback mock data
        news.value = generateMockNews()
      }
    } catch (error) {
      // Fallback mock data
      news.value = generateMockNews()
    } finally {
      loading.value = false
    }
  }

  function generateMockNews() {
    return [
      { title: '최신 기술 동향: AI가 바꾸는 세상', url: '#', source: 'Tech News', publishedAt: '8월 4일 17:30' },
      { title: '글로벌 경제 전망 보고서 발표', url: '#', source: 'Economic Times', publishedAt: '8월 4일 16:45' },
      { title: '새로운 친환경 에너지 정책 시행', url: '#', source: 'Green Daily', publishedAt: '8월 4일 15:20' },
      { title: '스포츠: 한국 팀 국제 대회 우승', url: '#', source: 'Sports Herald', publishedAt: '8월 4일 14:10' },
      { title: '문화: 새로운 전시회 개막', url: '#', source: 'Culture Today', publishedAt: '8월 4일 13:00' },
      { title: '과학: 우주 탐사 새로운 발견', url: '#', source: 'Science Daily', publishedAt: '8월 4일 12:30' },
    ]
  }

  const getTopNews = computed(() => (limit = 6) => news.value.slice(0, limit))

  return {
    news,
    loading,
    fetchNews,
    getTopNews
  }
})
