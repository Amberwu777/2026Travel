import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudFog, 
  CloudSun, 
  Droplets, 
  Thermometer, 
  AlertCircle,
  RefreshCw,
  Wind
} from 'lucide-react';
import { DayWeather } from '../types';
import { fetchLiveWeather, getCachedWeather } from '../services/weatherService';

interface WeatherCardProps {
  weather: DayWeather;
  dayNumber?: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather: baselineWeather, dayNumber = 2 }) => {
  // Initialize from cache if present, otherwise baseline
  const [weatherData, setWeatherData] = useState<DayWeather>(() => {
    const cached = getCachedWeather(dayNumber);
    return cached || baselineWeather;
  });
  const [isFetching, setIsFetching] = useState(false);

  // When dayNumber changes, load cached or baseline, then fetch live
  useEffect(() => {
    let isCancelled = false;
    const cached = getCachedWeather(dayNumber);
    if (cached) {
      setWeatherData(cached);
    } else {
      setWeatherData(baselineWeather);
    }

    setIsFetching(true);
    fetchLiveWeather(dayNumber, baselineWeather)
      .then((live) => {
        if (!isCancelled) {
          setWeatherData(live);
          setIsFetching(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsFetching(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [dayNumber, baselineWeather]);

  const handleManualRefresh = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const live = await fetchLiveWeather(dayNumber, baselineWeather);
      setWeatherData(live);
    } finally {
      setIsFetching(false);
    }
  };

  const renderWeatherIcon = () => {
    switch (weatherData.icon) {
      case 'sun':
        return <Sun className="w-6 h-6 text-[#C47A3B]" />;
      case 'rain':
        return <CloudRain className="w-6 h-6 text-[#4D7B99]" />;
      case 'fog':
        return <CloudFog className="w-6 h-6 text-[#7E8C94]" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-[#788896]" />;
      case 'partly-cloudy':
      default:
        return <CloudSun className="w-6 h-6 text-[#B87A4A]" />;
    }
  };

  return (
    <div id="weather-card" className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm transition-all">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] tracking-wider uppercase text-[#8C827A] font-bold">
            即時天氣資訊
          </span>
          <span className="text-[11px] bg-[#EAE4D9] text-[#554E46] px-2 py-0.5 rounded-full font-medium">
            {weatherData.location}
          </span>
          {weatherData.isLive ? (
            <span className="text-[10.5px] bg-[#E8F3EB] text-[#246B3B] border border-[#CDE5D3] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E994E] animate-pulse"></span>
              <span>衛星即時連線</span>
            </span>
          ) : (
            <span className="text-[10.5px] bg-[#EFE9DF] text-[#786D61] border border-[#DDD5C7] px-2 py-0.5 rounded-full font-medium">
              參考氣候
            </span>
          )}
        </div>

        {/* Refresh button & time */}
        <button
          onClick={handleManualRefresh}
          disabled={isFetching}
          title="重新抓取最新衛星氣象"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EFE9DF] hover:bg-[#E5DEC5] text-[#5A5248] text-[11px] transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 text-[#786E64] ${isFetching ? 'animate-spin text-[#8C5D38]' : ''}`} />
          <span>{isFetching ? '連線中...' : (weatherData.lastUpdated ? `${weatherData.lastUpdated} 更新` : '更新天氣')}</span>
        </button>
      </div>

      {/* Main Temp & Condition */}
      <div className="flex items-start justify-between mt-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[#2C2A29] font-mono">
              {weatherData.currentTemp}
            </span>
            <div className="text-xs text-[#78716A] space-y-0.5">
              <div>
                當日區間: <span className="font-medium text-[#4A453F]">{weatherData.tempRange}</span>
              </div>
              {weatherData.feelsLike && (
                <div>
                  體感溫度: <span className="font-medium text-[#4A453F]">{weatherData.feelsLike}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="p-2 bg-[#F2EDE4] rounded-xl flex items-center justify-center shadow-2xs">
            {renderWeatherIcon()}
          </div>
          <span className="text-xs font-semibold text-[#4A453F] mt-1.5">{weatherData.condition}</span>
        </div>
      </div>

      {/* Weather Metrics Bar */}
      <div className="mt-3 pt-3 border-t border-[#EFE9DF] grid grid-cols-3 gap-2 text-xs text-[#6A635B]">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-[#5A87A0] shrink-0" />
          <span>降雨率: <strong className="text-[#325066] font-medium">{weatherData.rainChance}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-[#6E8A7D] shrink-0" />
          <span>濕度: <strong className="text-[#3F594D] font-medium">{weatherData.humidity || '55%'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Thermometer className="w-3.5 h-3.5 text-[#A66738] shrink-0" />
          <span className="truncate">氣候宜人</span>
        </div>
      </div>

      {/* Advisory Alert */}
      {weatherData.advisory && (
        <div className="mt-2.5 bg-[#F3EFE7] border border-[#E5DFD4] rounded-xl px-3 py-2 text-xs text-[#5A544C] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#966838] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{weatherData.advisory}</span>
        </div>
      )}
    </div>
  );
};
