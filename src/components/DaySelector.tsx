import React, { useRef, useEffect } from 'react';
import { ITINERARY_DAYS } from '../data/itineraryData';

interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDay, onSelectDay }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeBtnRef.current;
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedDay]);

  return (
    <div className="relative border-b border-[#E8E3DA] bg-[#FAF8F5]">
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto py-2.5 px-3 no-scrollbar scroll-smooth"
      >
        {ITINERARY_DAYS.map((day) => {
          const isActive = day.dayNumber === selectedDay;
          return (
            <button
              key={day.dayNumber}
              ref={isActive ? activeBtnRef : null}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`shrink-0 flex flex-col items-center justify-center px-3.5 py-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-sm scale-[1.02]'
                  : 'bg-[#F1EDE5] text-[#554E46] hover:bg-[#E7E2D8]'
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className={`text-xs font-bold ${isActive ? 'text-[#FAF8F5]' : 'text-[#3E3933]'}`}>
                  Day {day.dayNumber}
                </span>
                <span className={`text-[11px] ${isActive ? 'text-[#D8D2C9]' : 'text-[#7D746A]'}`}>
                  {day.date}
                </span>
              </div>
              <span className={`text-[11px] truncate max-w-[80px] mt-0.5 ${
                isActive ? 'text-[#C7BFB5]' : 'text-[#6E665D]'
              }`}>
                {day.city.split('/')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
