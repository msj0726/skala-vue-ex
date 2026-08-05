import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStockStore = defineStore('stock', () => {
  const stocks = ref([])
  const loading = ref(false)

  async function fetchStocks() {
    loading.value = true

    try {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']
      const apiKey = import.meta.env.VITE_FINNHUB_API_KEY

      const promises = symbols.map(symbol =>
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
          .then(res => res.json())
          .then(data => ({
            symbol,
            price: data.c?.toFixed(2) || '0.00',
            change: data.d || 0,
            changePercent: data.dp?.toFixed(2) || '0.00'
          }))
          .catch(() => null)
      )

      const results = await Promise.all(promises)
      stocks.value = results.filter(Boolean)

      if (stocks.value.length === 0) {
        stocks.value = generateMockStocks()
      }
    } catch (error) {
      stocks.value = generateMockStocks()
    } finally {
      loading.value = false
    }
  }

  function generateMockStocks() {
    return [
      { symbol: 'AAPL', price: '185.42', change: 2.34, changePercent: '1.28' },
      { symbol: 'GOOGL', price: '142.18', change: -1.52, changePercent: '-1.06' },
      { symbol: 'MSFT', price: '378.91', change: 4.15, changePercent: '1.11' },
      { symbol: 'TSLA', price: '248.23', change: -3.67, changePercent: '-1.46' },
    ]
  }

  const getTopStocks = computed(() => (limit = 4) => stocks.value.slice(0, limit))

  return {
    stocks,
    loading,
    fetchStocks,
    getTopStocks
  }
})
