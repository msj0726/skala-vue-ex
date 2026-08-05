<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const stocks = ref([])
const loading = ref(false)

const stockItems = computed(() => {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '185.42', change: 2.34, changePercent: '1.28' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '142.18', change: -1.52, changePercent: '-1.06' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '378.91', change: 4.15, changePercent: '1.11' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '248.23', change: -3.67, changePercent: '-1.46' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '178.35', change: 2.87, changePercent: '1.64' },
    { symbol: 'META', name: 'Meta Platforms', price: '489.57', change: -2.14, changePercent: '-0.44' },
  ]
})
</script>

<template>
  <div class="stocks-page">
    <!-- Header -->
    <header class="stocks-header">
      <RouterLink to="/personal/" class="back-link">
        <span class="back-icon">←</span>
        홈으로
      </RouterLink>
      <h1 class="page-title">주식 시세</h1>
      <p class="page-subtitle">실시간 주요 종목 시세를 확인하세요</p>
    </header>

    <!-- Stocks Grid -->
    <div class="stocks-container">
      <div class="stocks-grid">
        <div
          v-for="stock in stockItems"
          :key="stock.symbol"
          class="stock-card"
        >
          <div class="stock-header">
            <div class="stock-symbol">{{ stock.symbol }}</div>
            <div class="stock-name">{{ stock.name }}</div>
          </div>
          <div class="stock-body">
            <div class="stock-price">${{ stock.price }}</div>
            <div :class="['stock-change', parseFloat(stock.changePercent) >= 0 ? 'positive' : 'negative']">
              {{ parseFloat(stock.changePercent) >= 0 ? '▲' : '▼' }}
              {{ Math.abs(parseFloat(stock.changePercent)) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="disclaimer">
        <p><strong>투자 유의사항</strong></p>
        <p>이 데이터는 참고용이며 실제 투자 결정 시 전문가와 상담하시기 바랍니다.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stocks-page {
  min-height: 100vh;
  background: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding-top: 44px;
}

/* Header */
.stocks-header {
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

/* Stocks Container */
.stocks-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.stock-card {
  background: white;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.stock-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stock-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f7;
}

.stock-symbol {
  font-size: 28px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.stock-name {
  font-size: 15px;
  color: #86868b;
}

.stock-body {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.stock-price {
  font-size: 40px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.02em;
}

.stock-change {
  font-size: 21px;
  font-weight: 600;
}

.stock-change.positive {
  color: #34c759;
}

.stock-change.negative {
  color: #ff3b30;
}

/* Disclaimer */
.disclaimer {
  background: white;
  border-radius: 18px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.disclaimer p {
  margin: 0 0 8px;
  font-size: 17px;
  color: #1d1d1f;
}

.disclaimer p:last-child {
  margin: 0;
  font-size: 15px;
  color: #86868b;
}

.disclaimer strong {
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .stocks-header {
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

  .stocks-container {
    padding: 24px 16px 60px;
  }

  .stocks-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 40px;
  }

  .stock-card {
    padding: 24px;
  }

  .stock-symbol {
    font-size: 24px;
  }

  .stock-price {
    font-size: 32px;
  }

  .stock-change {
    font-size: 17px;
  }

  .disclaimer {
    padding: 24px;
  }
}
</style>
