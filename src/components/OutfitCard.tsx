import React, { useState } from 'react';
import { Shirt, ChevronDown, ChevronUp, Sparkles, ShieldAlert } from 'lucide-react';
import { DayOutfit } from '../types';

interface OutfitCardProps {
  outfit: DayOutfit;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="daily-outfit-card" className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EFE9DE] flex items-center justify-center text-[#786350]">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] tracking-wider uppercase text-[#8C827A] font-medium">當日穿搭指南</div>
            <div className="text-sm font-semibold text-[#2C2A29] leading-tight mt-0.5">{outfit.summary}</div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#7A7065] hover:text-[#2C2A29] flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[#F0EBE2] transition-colors"
        >
          <span>{expanded ? '收合詳情' : '展開細節'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick scannable preview */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#F3EEE6] rounded-xl p-2 border border-[#EBE3D8]">
          <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] font-medium block">上半身洋蔥層</span>
          <p className="text-[#3E3933] text-[11px] font-medium mt-0.5 truncate">{outfit.inner} + {outfit.outer}</p>
        </div>
        <div className="bg-[#F3EEE6] rounded-xl p-2 border border-[#EBE3D8]">
          <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] font-medium block">下裝 ＆ 步履</span>
          <p className="text-[#3E3933] text-[11px] font-medium mt-0.5 truncate">{outfit.bottom}</p>
        </div>
      </div>

      {/* Expanded detailed onion layers */}
      {expanded && (
        <div className="mt-3.5 pt-3 border-t border-[#EFE9DF] space-y-2.5 text-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <span className="w-12 shrink-0 text-[11px] text-[#8C8074] font-medium py-0.5 bg-[#EEE8DE] rounded text-center">內層</span>
            <span className="text-[#3E3933] leading-relaxed">{outfit.inner}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-12 shrink-0 text-[11px] text-[#8C8074] font-medium py-0.5 bg-[#EEE8DE] rounded text-center">中層</span>
            <span className="text-[#3E3933] leading-relaxed">{outfit.mid}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-12 shrink-0 text-[11px] text-[#8C8074] font-medium py-0.5 bg-[#EEE8DE] rounded text-center">外層</span>
            <span className="text-[#3E3933] leading-relaxed">{outfit.outer}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-12 shrink-0 text-[11px] text-[#8C8074] font-medium py-0.5 bg-[#EEE8DE] rounded text-center">下裝</span>
            <span className="text-[#3E3933] leading-relaxed">{outfit.bottom}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-12 shrink-0 text-[11px] text-[#8C8074] font-medium py-0.5 bg-[#EEE8DE] rounded text-center">鞋履</span>
            <span className="text-[#3E3933] leading-relaxed">{outfit.shoes}</span>
          </div>
        </div>
      )}

      {/* Special Attire / Venue Notice */}
      {outfit.specialNotice && (
        <div className="mt-3 bg-[#EBE7DF] border border-[#DDD5C7] rounded-xl p-2.5 text-[11px] text-[#4A443B] flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#91653B] shrink-0 mt-0.5" />
          <span className="leading-normal">{outfit.specialNotice}</span>
        </div>
      )}
    </div>
  );
};
