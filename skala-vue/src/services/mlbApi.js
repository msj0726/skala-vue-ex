const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5'

const WEATHER_ICONS = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 95: '⛈️', 96: '⛈️', 99: '⛈️',
}

const getAirQuality = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
  if (!apiKey || apiKey.includes('여기에_')) return {}
  try {
    const response = await fetch(`${OPENWEATHER_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    if (!response.ok) return {}
    const current = (await response.json()).list?.[0]
    return { pm25: current?.components?.pm2_5 ?? null, pm10: current?.components?.pm10 ?? null, airQualityIndex: current?.main?.aqi ?? null }
  } catch { return {} }
}

export const fetchBallparkWeather = async (stadium) => {
  const params = new URLSearchParams({ latitude: stadium.lat, longitude: stadium.lon, current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index', timezone: 'auto' })
  try {
    const response = await fetch(`${OPEN_METEO_URL}?${params}`)
    if (!response.ok) throw new Error('weather request failed')
    const current = (await response.json()).current
    const air = await getAirQuality(stadium.lat, stadium.lon)
    return {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      precipitation: Number(current.precipitation ?? current.rain ?? 0).toFixed(1),
      uvIndex: Number(current.uv_index ?? 0).toFixed(1),
      wind: Math.round(current.wind_speed_10m),
      windDirection: Math.round(current.wind_direction_10m),
      icon: WEATHER_ICONS[current.weather_code] ?? '🌤️',
      description: current.weather_code <= 3 ? 'Clear / partly cloudy' : 'Variable conditions',
      ...air,
    }
  } catch {
    return { temp: null, feelsLike: null, humidity: null, precipitation: null, uvIndex: null, wind: null, windDirection: null, icon: '🌤️', description: 'Weather unavailable', pm25: null, pm10: null }
  }
}

export const fetchCurrentMlbStandings = async (season = new Date().getFullYear()) => {
  const params = new URLSearchParams({ leagueId: '103,104', season: String(season), standingsTypes: 'regularSeason', hydrate: 'team,division' })
  const response = await fetch(`https://statsapi.mlb.com/api/v1/standings?${params}`)
  if (!response.ok) throw new Error('MLB standings request failed')
  const data = await response.json()
  const result = {}
  for (const record of data.records ?? []) {
    const division = record.division?.nameShort ?? record.division?.name
    if (!division) continue
    result[division] = (record.teamRecords ?? []).map((item) => {
      const team = item.team ?? {}
      const wins = item.wins ?? 0
      const losses = item.losses ?? 0
      const pct = Number(item.winningPercentage ?? (wins + losses ? wins / (wins + losses) : 0))
      return { team: team.name, teamKo: team.name, teamId: team.id, logoUrl: `https://www.mlbstatic.com/team-logos/${team.id}.svg`, color: '#52606d', wins, losses, pct, gb: item.gamesBack ?? '-', division }
    })
  }
  return result
}
