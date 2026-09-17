import React from 'react';
import { Sun, Cloud, CloudRain, CloudFog, CloudSun, Droplets, Thermometer, AlertCircle } from 'lucide-react';
import { DayWeather } from '../types';

interface WeatherCardProps {
  weather: DayWeather;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const renderWeatherIcon = () => {
    switch (weather.icon) {
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
    <div id="weather-card" className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-wider uppercase text-[#8C827A] font-medium">即時天氣資訊</span>
            <span className="text-[11px] bg-[#EAE4D9] text-[#554E46] px-2 py-0.5 rounded-full font-medium">
              {weather.location}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-semibold tracking-tight text-[#2C2A29] font-mono">
              {weather.currentTemp}
            </span>
            <span className="text-xs text-[#78716A]">
              區間: <span className="font-medium text-[#4A453F]">{weather.tempRange}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="p-2 bg-[#F2EDE4] rounded-xl flex items-center justify-center">
            {renderWeatherIcon()}
          </div>
          <span className="text-xs font-medium text-[#4A453F] mt-1.5">{weather.condition}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#EFE9DF] flex items-center justify-between text-xs text-[#6A635B]">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-[#5A87A0]" />
          <span>降雨機率: <strong className="text-[#325066] font-medium">{weather.rainChance}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-[#A66738]" />
          <span>9月初秋宜人</span>
        </div>
      </div>

      {weather.advisory && (
        <div className="mt-2.5 bg-[#F3EFE7] border border-[#E5DFD4] rounded-lg px-2.5 py-1.5 text-[11px] text-[#5A544C] flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#966838] shrink-0 mt-0.5" />
          <span className="leading-snug">{weather.advisory}</span>
        </div>
      )}
    </div>
  );
};
