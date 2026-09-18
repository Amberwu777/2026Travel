import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

export const DualClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format local Taiwan time (UTC+8)
  const taipeiTime = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(time);

  // Austria/Czech summer time is UTC+2 (Vienna/Prague), difference is -6 hours
  const centralEuropeTime = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Europe/Vienna',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(time);

  return (
    <div 
      id="dual-clock-widget" 
      className="bg-[#EFECE6] border border-[#E3DED5] rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between text-xs text-[#524E48] gap-1.5 sm:gap-2 w-full max-w-full box-border"
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <Clock className="w-3.5 h-3.5 text-[#8C827A] shrink-0" />
        <span className="font-semibold text-[#2C2A29] whitespace-nowrap text-xs">時差</span>
        <span className="text-[10.5px] text-[#78716A] bg-[#DFD9CE] px-1.5 py-0.5 rounded whitespace-nowrap font-medium">
          奧捷 -6h
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono shrink-0 ml-auto">
        <div className="flex items-center gap-1">
          <span className="text-[11px] sm:text-xs text-[#6E675F] whitespace-nowrap">奧捷:</span>
          <span className="font-bold text-[#2C2A29] text-xs sm:text-sm tracking-tight">{centralEuropeTime}</span>
        </div>
        <div className="w-[1px] h-3 bg-[#D4CDC3] shrink-0"></div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] sm:text-xs text-[#6E675F] whitespace-nowrap">台北:</span>
          <span className="font-bold text-[#2C2A29] text-xs sm:text-sm tracking-tight">{taipeiTime}</span>
        </div>
      </div>
    </div>
  );
};
