import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWeatherStore = defineStore('weather', () => {
  const weatherData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchWeather(city) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&lang=kr`
      )

      if (response.ok) {
        weatherData.value = await response.json()
      } else {
        // Fallback mock data
        weatherData.value = {
          name: city,
          main: { temp: 22, feels_like: 20, humidity: 65 },
          weather: [{ description: '맑음', icon: '01d' }],
          wind: { speed: 3.5 }
        }
      }
    } catch (err) {
      error.value = err.message
      // Fallback mock data
      weatherData.value = {
        name: city,
        main: { temp: 22, feels_like: 20, humidity: 65 },
        weather: [{ description: '맑음', icon: '01d' }],
        wind: { speed: 3.5 }
      }
    } finally {
      loading.value = false
    }
  }

  return {
    weatherData,
    loading,
    error,
    fetchWeather
  }
})
