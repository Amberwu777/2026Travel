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
    second: '2-digit',
    hour12: false,
  }).format(time);

  // Austria/Czech summer time is UTC+2 (Vienna/Prague), difference is -6 hours
  const centralEuropeTime = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Europe/Vienna',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(time);

  return (
    <div id="dual-clock-widget" className="bg-[#EFECE6] border border-[#E3DED5] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-[#524E48]">
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-[#8C827A]" />
        <span className="font-medium text-[#2C2A29]">時差同步</span>
        <span className="text-[10px] text-[#78716A] bg-[#DFD9CE] px-1.5 py-0.5 rounded">奧捷 -6hr</span>
      </div>

      <div className="flex items-center gap-3 font-mono">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#6E675F]">奧捷:</span>
          <span className="font-semibold text-[#2C2A29]">{centralEuropeTime}</span>
        </div>
        <div className="w-[1px] h-3 bg-[#D4CDC3]"></div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#6E675F]">台北:</span>
          <span className="font-semibold text-[#2C2A29]">{taipeiTime}</span>
        </div>
      </div>
    </div>
  );
};
