import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Utensils, 
  Train, 
  Hotel, 
  Compass, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Ticket, 
  Clock, 
  Info
} from 'lucide-react';
import { ItineraryCard, CardCategory } from '../types';
import { MealNoteSection } from './MealNoteSection';

interface ItineraryCardItemProps {
  card: ItineraryCard;
}

export const ItineraryCardItem: React.FC<ItineraryCardItemProps> = ({ card }) => {
  const [showStory, setShowStory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Category Theme Config
  const categoryConfig: Record<CardCategory, {
    label: string;
    badgeBg: string;
    badgeText: string;
    borderAccent: string;
    icon: React.ReactNode;
  }> = {
    spot: {
      label: '景點巡禮',
      badgeBg: 'bg-[#EBF2EC] text-[#2F6B48] border-[#D1E3D5]',
      badgeText: 'text-[#2F6B48]',
      borderAccent: 'border-l-[3px] border-l-[#4A7D58]',
      icon: <Compass className="w-4 h-4 text-[#3C6E4A]" />,
    },
    restaurant: {
      label: '美饌饗宴',
      badgeBg: 'bg-[#FDF1EB] text-[#B84E34] border-[#F7D8CB]',
      badgeText: 'text-[#B84E34]',
      borderAccent: 'border-l-[3px] border-l-[#C25B40]',
      icon: <Utensils className="w-4 h-4 text-[#B84E34]" />,
    },
    transport: {
      label: '交通轉移',
      badgeBg: 'bg-[#EBF2F7] text-[#2C5F80] border-[#D1E2EE]',
      badgeText: 'text-[#2C5F80]',
      borderAccent: 'border-l-[3px] border-l-[#366B8E]',
      icon: <Train className="w-4 h-4 text-[#2C5F80]" />,
    },
    hotel: {
      label: '奢華下榻',
      badgeBg: 'bg-[#F7F2EB] text-[#7A5A35] border-[#E8DDCE]',
      badgeText: 'text-[#7A5A35]',
      borderAccent: 'border-l-[3px] border-l-[#8A6A45]',
      icon: <Hotel className="w-4 h-4 text-[#7A5A35]" />,
    },
  };

  const currentTheme = categoryConfig[card.category] || categoryConfig.spot;
  const isMeal = card.category === 'restaurant';

  const hasVisibleHighlights = card.highlights && (
    (!isMeal && ((card.highlights.mustEat?.length ?? 0) > 0 || (card.highlights.mustOrder?.length ?? 0) > 0)) ||
    (card.highlights.mustBuy?.length ?? 0) > 0 ||
    Boolean(card.highlights.reservationCode)
  );

  const handleOpenLocation = () => {
    // Open exact Google Maps place pinpoint / location marker
    if (card.mapsUrl) {
      window.open(card.mapsUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (card.navQuery && (card.navQuery.startsWith('http://') || card.navQuery.startsWith('https://'))) {
      window.open(card.navQuery, '_blank', 'noopener,noreferrer');
      return;
    }
    const query = encodeURIComponent(card.navQuery || card.locationName);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLocation = () => {
    const textToCopy = `${card.locationName} (${card.navQuery || ''})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article 
      id={`itinerary-card-${card.id}`}
      className={`bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm transition-all duration-150 ${currentTheme.borderAccent}`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${currentTheme.badgeBg} flex items-center gap-1`}>
            {currentTheme.icon}
            {currentTheme.label}
          </span>

          {card.distanceKm && (
            <span className="text-[10px] text-[#78716A] bg-[#EFE9DE] px-2 py-0.5 rounded-full font-mono">
              🚗 車程 {card.distanceKm} km
            </span>
          )}

          {card.highlights?.ticketInfo && (
            <span className="text-[10px] text-[#2B5A40] bg-[#E2EDE4] border border-[#CCE0CF] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Ticket className="w-3 h-3 text-[#2B5A40]" />
              {card.highlights.ticketInfo}
            </span>
          )}
        </div>

        {card.timeSlot && (
          <div className="flex items-center gap-1 text-[11px] text-[#736B63] font-mono shrink-0">
            <Clock className="w-3 h-3" />
            <span>{card.timeSlot}</span>
          </div>
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div className="mt-2.5">
        <h3 className="text-base font-bold text-[#252322] tracking-tight leading-snug">
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="text-xs text-[#6B635B] mt-0.5 font-medium leading-relaxed">
            {card.subtitle}
          </p>
        )}
      </div>

      {/* Location & One-Tap Navigation Section (Hidden for meals/restaurants) */}
      {!isMeal && (
        <div className="mt-3 bg-[#F2EDE4] border border-[#E5DFD4] rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-start gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-[#8C4A32] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#2E2A27] truncate">
                {card.locationName}
              </div>
              <div className="text-[10px] text-[#7A7167] font-mono truncate">
                {card.navQuery}
              </div>
            </div>
          </div>

          {/* Action Buttons: 景點定位 (Google Maps Pinpoint) & Copy */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id={`copy-btn-${card.id}`}
              onClick={handleCopyLocation}
              title="複製地址"
              className="p-1.5 rounded-lg bg-[#EAE3D6] text-[#554E46] hover:bg-[#E0D8C8] active:scale-95 transition-all text-[11px] flex items-center"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E6B45]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              id={`nav-btn-${card.id}`}
              onClick={handleOpenLocation}
              title="在 Google Maps 查看該景點定位點"
              className="px-2.5 py-1.5 rounded-lg bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#433E3B] active:scale-95 transition-all text-xs font-medium flex items-center gap-1 shadow-sm shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F2EDE4]" />
              <span>景點定位</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </button>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="mt-2.5 text-xs text-[#4A453F] leading-relaxed">
        {card.description}
      </p>

      {/* Self-Recorded Meal Note (自行記錄做筆記 - for lunch and dinner meals) */}
      {isMeal && (
        <MealNoteSection cardId={card.id} mealTitle={card.title} />
      )}

      {/* Tour Guide Highlighting Tags (必吃美食、必點菜單 for non-meals only; 必買伴手禮、重要預約代號) */}
      {hasVisibleHighlights && card.highlights && (
        <div className="mt-3.5 pt-3 border-t border-[#EDE7DC] space-y-2">
          {/* 🏷️ 必吃美食 (非正餐行程時顯示) */}
          {!isMeal && card.highlights.mustEat && card.highlights.mustEat.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAECE8] text-[#B83E28] border border-[#F2D0C7] tracking-wider">
                🏷️ 必吃美食
              </span>
              <div className="flex flex-wrap gap-1.5">
                {card.highlights.mustEat.map((food, idx) => (
                  <span key={idx} className="text-xs font-semibold text-[#8F2E1B] bg-[#FFF8F6] px-2 py-0.5 rounded-md border border-[#F5DDD7]">
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 🍽️ 必點菜單 (非正餐行程時顯示) */}
          {!isMeal && card.highlights.mustOrder && card.highlights.mustOrder.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FBF2E6] text-[#A86418] border border-[#F5DCBC] tracking-wider">
                🍽️ 必點菜單
              </span>
              <div className="flex flex-wrap gap-1.5">
                {card.highlights.mustOrder.map((order, idx) => (
                  <span key={idx} className="text-xs font-semibold text-[#8C4E0B] bg-[#FFFAF2] px-2 py-0.5 rounded-md border border-[#F5E6D3]">
                    {order}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 🎁 必買伴手禮 */}
          {card.highlights.mustBuy && card.highlights.mustBuy.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF3EC] text-[#2A6E44] border border-[#CEE4D3] tracking-wider">
                🎁 必買伴手禮
              </span>
              <div className="flex flex-wrap gap-1.5">
                {card.highlights.mustBuy.map((gift, idx) => (
                  <span key={idx} className="text-xs font-semibold text-[#1F5434] bg-[#F7FCF8] px-2 py-0.5 rounded-md border border-[#DAEBDD]">
                    {gift}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 🔖 重要預約代號 */}
          {card.highlights.reservationCode && (
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF0F6] text-[#255C82] border border-[#C9DEEC] tracking-wider">
                🔖 重要預約
              </span>
              <span className="text-xs font-mono font-bold text-[#194665] bg-[#F4F8FB] px-2.5 py-0.5 rounded-md border border-[#D5E5F2] tracking-wide">
                {card.highlights.reservationCode}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Guide's Story & Lore (導遊私房講堂 / 典故解說) */}
      {card.story && (
        <div className="mt-3">
          <button
            onClick={() => setShowStory(!showStory)}
            className="w-full flex items-center justify-between text-xs font-medium text-[#5B544C] py-1.5 px-3 bg-[#F0EBE0] hover:bg-[#E8E2D5] rounded-xl transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8A633F]" />
              <span>導遊私房故事 ＆ 深度攻略</span>
            </div>
            {showStory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showStory && (
            <div className="mt-2 bg-[#F6F2EB] border-l-2 border-[#A88863] rounded-r-xl p-3 text-xs text-[#3E3831] leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
              {card.story}
            </div>
          )}
        </div>
      )}

      {/* Tips list */}
      {card.tips && card.tips.length > 0 && (
        <div className="mt-2.5 space-y-1 bg-[#F5EFE6] rounded-xl p-2.5 border border-[#EAE2D5]">
          {card.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#554E46]">
              <Info className="w-3 h-3 text-[#947657] shrink-0 mt-0.5" />
              <span className="leading-snug">{tip}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};
