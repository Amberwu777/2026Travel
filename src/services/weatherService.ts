import { DayWeather } from '../types';

export interface CityCoordinates {
  cityName: string;
  lat: number;
  lon: number;
  country: string;
}

export const DAY_COORDINATES: Record<number, CityCoordinates> = {
  1: { cityName: '桃園國際機場', lat: 25.0797, lon: 121.2342, country: '台灣' },
  2: { cityName: '帖契 & 布拉格', lat: 50.0755, lon: 14.4378, country: '捷克' },
  3: { cityName: '布拉格市區', lat: 50.0755, lon: 14.4378, country: '捷克' },
  4: { cityName: '布拉格老城區', lat: 50.0875, lon: 14.4212, country: '捷克' },
  5: { cityName: '卡羅維瓦利 / 瑪麗安斯凱', lat: 50.2319, lon: 12.8720, country: '捷克' },
  6: { cityName: '庫倫洛夫 Český Krumlov', lat: 48.8127, lon: 14.3175, country: '捷克' },
  7: { cityName: '哈修塔特 / 聖沃夫岡', lat: 47.7381, lon: 13.4475, country: '奧地利' },
  8: { cityName: '國王湖 & 德奧邊境', lat: 47.5562, lon: 12.9897, country: '德國/奧地利' },
  9: { cityName: '薩爾斯堡 & 維也納', lat: 47.8095, lon: 13.0550, country: '奧地利' },
  10: { cityName: '維也納市區', lat: 48.2082, lon: 16.3738, country: '奧地利' },
  11: { cityName: '維也納 / 熊布朗宮', lat: 48.1858, lon: 16.3128, country: '奧地利' },
  12: { cityName: '台灣桃園國際機場', lat: 25.0797, lon: 121.2342, country: '台灣' },
};

/**
 * Maps WMO weather code to Chinese condition description and standard icon name
 */
export function interpretWmoCode(code: number): {
  condition: string;
  icon: 'sun' | 'cloud' | 'rain' | 'fog' | 'partly-cloudy';
} {
  if (code === 0) return { condition: '晴朗萬里無雲', icon: 'sun' };
  if (code === 1) return { condition: '天晴，陽光普照', icon: 'sun' };
  if (code === 2) return { condition: '晴時多雲', icon: 'partly-cloudy' };
  if (code === 3) return { condition: '多雲陰天', icon: 'cloud' };
  if (code === 45 || code === 48) return { condition: '晨霧瀰漫 / 霧氣', icon: 'fog' };
  if (code >= 51 && code <= 57) return { condition: '局部細雨 / 飄雨', icon: 'rain' };
  if (code >= 61 && code <= 65) return { condition: '陰天降雨', icon: 'rain' };
  if (code >= 66 && code <= 67) return { condition: '凍雨 / 濕冷', icon: 'rain' };
  if (code >= 71 && code <= 77) return { condition: '小雪 / 結霜', icon: 'cloud' };
  if (code >= 80 && code <= 82) return { condition: '午後局部陣雨', icon: 'rain' };
  if (code >= 95 && code <= 99) return { condition: '雷陣雨', icon: 'rain' };
  return { condition: '多雲時晴', icon: 'partly-cloudy' };
}

const CACHE_PREFIX = 'realtime_weather_day_v1_';

interface CachedWeatherData {
  weather: DayWeather;
  timestamp: number;
}

export function getCachedWeather(dayNumber: number): DayWeather | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${dayNumber}`);
    if (!raw) return null;
    const parsed: CachedWeatherData = JSON.parse(raw);
    // Return cached if parsed correctly
    return parsed.weather;
  } catch {
    return null;
  }
}

export function saveCachedWeather(dayNumber: number, weather: DayWeather): void {
  try {
    const record: CachedWeatherData = {
      weather,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${dayNumber}`, JSON.stringify(record));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetch live real-time weather from Open-Meteo API
 */
export async function fetchLiveWeather(
  dayNumber: number,
  fallbackWeather: DayWeather
): Promise<DayWeather> {
  const coord = DAY_COORDINATES[dayNumber];
  if (!coord) return fallbackWeather;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather fetch status: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    if (!current || !daily) {
      throw new Error('Incomplete weather payload');
    }

    const currentTempC = Math.round(current.temperature_2m);
    const minTempC = Math.round(daily.temperature_2m_min?.[0] ?? currentTempC - 4);
    const maxTempC = Math.round(daily.temperature_2m_max?.[0] ?? currentTempC + 4);
    const apparentTempC = Math.round(current.apparent_temperature);
    const rainProbability = daily.precipitation_probability_max?.[0] ?? 0;
    const humidity = current.relative_humidity_2m;
    const weatherCode = current.weather_code ?? 2;

    const { condition, icon } = interpretWmoCode(weatherCode);

    // Format update time (HH:mm)
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Dynamic advisory based on live weather data
    let dynamicAdvisory = fallbackWeather.advisory;
    if (rainProbability >= 40) {
      dynamicAdvisory = `【即時氣象提醒】今日降雨機率達 ${rainProbability}%，外出行程請務必隨身攜帶折傘或防水連帽外套。`;
    } else if (currentTempC < 14) {
      dynamicAdvisory = `【即時氣象提醒】當地目前氣溫偏涼（${currentTempC}°C，體感 ${apparentTempC}°C），請穿著保暖防風外套並注意早晚溫差。`;
    } else if (currentTempC > 28) {
      dynamicAdvisory = `【即時氣象提醒】當地目前陽光充足、氣溫偏高（${currentTempC}°C），戶外活動請注意防曬並隨時補充水分。`;
    }

    const liveResult: DayWeather = {
      location: `${coord.cityName} (${coord.country})`,
      currentTemp: `${currentTempC}°C`,
      tempRange: `${minTempC}°C - ${maxTempC}°C`,
      condition,
      rainChance: `${rainProbability}%`,
      icon,
      advisory: dynamicAdvisory,
      feelsLike: `${apparentTempC}°C`,
      humidity: `${humidity}%`,
      isLive: true,
      lastUpdated: timeStr,
    };

    // Save to cache for instant loading next time
    saveCachedWeather(dayNumber, liveResult);

    return liveResult;
  } catch {
    // If request fails, return cached weather if available, otherwise return fallback
    const cached = getCachedWeather(dayNumber);
    if (cached) {
      return {
        ...cached,
        isLive: true, // Still live data from recent cache
      };
    }
    return {
      ...fallbackWeather,
      isLive: false,
    };
  }
}
