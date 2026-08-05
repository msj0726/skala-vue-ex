import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function formatTemperature(temp) {
    if (unit.value === 'fahrenheit') {
      return `${Math.round(temp * 9/5 + 32)}℉`
    }
    return `${Math.round(temp)}℃`
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
    formatTemperature
  }
})
