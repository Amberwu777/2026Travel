import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Utensils, 
  ShoppingBag, 
  Ticket, 
  BookOpen, 
  Bookmark, 
  MapPin, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  Gift
} from 'lucide-react';
import { ITINERARY_DAYS } from '../data/itineraryData';
import { ItineraryCard } from '../types';

interface GuideHubViewProps {
  onJumpToDay: (day: number) => void;
  onNavigateToNotes?: () => void;
}

export const GuideHubView: React.FC<GuideHubViewProps> = ({ onJumpToDay, onNavigateToNotes }) => {
  const [filterType, setFilterType] = useState<'all' | 'mustEat' | 'mustOrder' | 'mustBuy' | 'reservation' | 'stories'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all compiled guide items
  const compiledData = useMemo(() => {
    const list: {
      dayNumber: number;
      dayCity: string;
      card: ItineraryCard;
    }[] = [];

    ITINERARY_DAYS.forEach((day) => {
      day.cards.forEach((card) => {
        list.push({
          dayNumber: day.dayNumber,
          dayCity: day.city,
          card,
        });
      });
    });

    return list;
  }, []);

  const filteredItems = useMemo(() => {
    return compiledData.filter(({ card, dayCity }) => {
      // Type filtering
      if (filterType === 'mustEat' && (!card.highlights?.mustEat || card.highlights.mustEat.length === 0)) return false;
      if (filterType === 'mustOrder' && (!card.highlights?.mustOrder || card.highlights.mustOrder.length === 0)) return false;
      if (filterType === 'mustBuy' && (!card.highlights?.mustBuy || card.highlights.mustBuy.length === 0)) return false;
      if (filterType === 'reservation' && !card.highlights?.reservationCode && !card.highlights?.ticketInfo) return false;
      if (filterType === 'stories' && !card.story) return false;

      // Query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = card.title.toLowerCase().includes(q);
        const matchCity = dayCity.toLowerCase().includes(q);
        const matchStory = (card.story || '').toLowerCase().includes(q);
        const matchMustEat = (card.highlights?.mustEat || []).some(m => m.toLowerCase().includes(q));
        const matchMustBuy = (card.highlights?.mustBuy || []).some(m => m.toLowerCase().includes(q));
        const matchMustOrder = (card.highlights?.mustOrder || []).some(m => m.toLowerCase().includes(q));
        return matchTitle || matchCity || matchStory || matchMustEat || matchMustBuy || matchMustOrder;
      }

      return true;
    });
  }, [compiledData, filterType, searchQuery]);

  return (
    <div id="guide-hub-container" className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8C5D38]" />
          <div>
            <h3 className="text-sm font-bold text-[#2C2A29]">導遊職責：深度攻略與必買必吃庫</h3>
            <p className="text-[11px] text-[#78716A] mt-0.5">匯集12天奧捷湖區典藏行程之景點歷史故事、美食、伴手禮與預約代號</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-[#8C8276] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋景點、莫札特巧克力、菠丹妮、生牛肉、門票..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F3EFE7] border border-[#E0D9CD] rounded-xl text-xs text-[#2C2A29] placeholder-[#948A7D] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              filterType === 'all'
                ? 'bg-[#2C2A29] text-[#FAF8F5]'
                : 'bg-[#EFEAE2] text-[#635B51] hover:bg-[#E5DFD4]'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterType('mustEat')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              filterType === 'mustEat'
                ? 'bg-[#BA4230] text-[#FFFFFF]'
                : 'bg-[#F9ECE8] text-[#B83E28] border border-[#F2D0C7]'
            }`}
          >
            必吃
          </button>
          <button
            onClick={() => setFilterType('mustOrder')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              filterType === 'mustOrder'
                ? 'bg-[#B06E1A] text-[#FFFFFF]'
                : 'bg-[#FDF2E4] text-[#A86418] border border-[#F7DFBF]'
            }`}
          >
            必點
          </button>
          <button
            onClick={() => setFilterType('mustBuy')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              filterType === 'mustBuy'
                ? 'bg-[#2B6D45] text-[#FFFFFF]'
                : 'bg-[#EAF4ED] text-[#287044] border border-[#CEE5D3]'
            }`}
          >
            必買
          </button>
          <button
            onClick={() => setFilterType('reservation')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              filterType === 'reservation'
                ? 'bg-[#255C82] text-[#FFFFFF]'
                : 'bg-[#EBF1F7] text-[#255C82] border border-[#CADFED]'
            }`}
          >
            預約
          </button>
          <button
            onClick={() => setFilterType('stories')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              filterType === 'stories'
                ? 'bg-[#7A5B38] text-[#FFFFFF]'
                : 'bg-[#F4ECE3] text-[#7A5B38] border border-[#E8DACB]'
            }`}
          >
            典故
          </button>
        </div>

        {/* Quick shortcut to Personal Souvenirs / Memos */}
        {onNavigateToNotes && (
          <button
            onClick={onNavigateToNotes}
            className="mt-2.5 w-full py-2 px-3 rounded-xl bg-[#F4EFE7] hover:bg-[#EBE3D7] active:scale-[0.99] text-[#8C5D38] text-xs font-semibold flex items-center justify-between transition-all border border-[#E8DFCFC0]"
          >
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" />
              <span>管理個人伴手禮與備忘錄</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* Filtered Cards List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-8 text-center text-xs text-[#8A8177]">
            無符合搜尋條件的攻略項目，請嘗試其他關鍵字。
          </div>
        ) : (
          filteredItems.map(({ dayNumber, dayCity, card }) => (
            <div
              key={card.id}
              className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm space-y-2.5 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#2C2A29] text-[#FAF8F5]">
                    Day {dayNumber}
                  </span>
                  <span className="text-xs text-[#7A7167] font-medium">{dayCity}</span>
                </div>

                <button
                  onClick={() => onJumpToDay(dayNumber)}
                  className="text-[11px] text-[#786D61] hover:text-[#2C2A29] flex items-center gap-0.5"
                >
                  <span>查看當日</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Spot Title */}
              <div>
                <h4 className="text-sm font-bold text-[#2C2A29] leading-snug">{card.title}</h4>
                {card.subtitle && (
                  <p className="text-[11px] text-[#6E665D] mt-0.5">{card.subtitle}</p>
                )}
              </div>

              {/* Badges Highlight Section */}
              {card.highlights && (
                <div className="space-y-1.5 pt-1">
                  {card.highlights.mustEat && card.highlights.mustEat.length > 0 && (
                    <div className="flex items-start gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#B83E28] bg-[#F9ECE8] px-1.5 py-0.5 rounded border border-[#F2D0C7]">
                        必吃
                      </span>
                      {card.highlights.mustEat.map((m, i) => (
                        <span key={i} className="text-xs font-bold text-[#8C2E1B] bg-[#FFF8F6] px-2 py-0.5 rounded border border-[#F4DCD6]">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {card.highlights.mustOrder && card.highlights.mustOrder.length > 0 && (
                    <div className="flex items-start gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#A86418] bg-[#FDF2E4] px-1.5 py-0.5 rounded border border-[#F7DFBF]">
                        必點
                      </span>
                      {card.highlights.mustOrder.map((m, i) => (
                        <span key={i} className="text-xs font-bold text-[#8A4E0B] bg-[#FFFAF2] px-2 py-0.5 rounded border border-[#F5E6D3]">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {card.highlights.mustBuy && card.highlights.mustBuy.length > 0 && (
                    <div className="flex items-start gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#287044] bg-[#EAF4ED] px-1.5 py-0.5 rounded border border-[#CEE5D3]">
                        伴手禮
                      </span>
                      {card.highlights.mustBuy.map((m, i) => (
                        <span key={i} className="text-xs font-bold text-[#1E5232] bg-[#F7FCF8] px-2 py-0.5 rounded border border-[#DAEBDD]">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {card.highlights.reservationCode && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#255C82] bg-[#EBF1F7] px-1.5 py-0.5 rounded border border-[#CADFED]">
                        預約號
                      </span>
                      <span className="text-xs font-mono font-bold text-[#194766] bg-[#F4F8FB] px-2 py-0.5 rounded border border-[#D6E6F2]">
                        {card.highlights.reservationCode}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Story / Lore */}
              {card.story && (
                <div className="bg-[#F6F2EA] border-l-2 border-[#A88863] rounded-r-xl p-3 text-xs text-[#443E37] leading-relaxed whitespace-pre-line">
                  {card.story}
                </div>
              )}

              {/* Navigation link */}
              <div className="pt-1 flex justify-end">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(card.navQuery || card.locationName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-[#4A433A] hover:text-[#2C2A29] flex items-center gap-1 px-2.5 py-1 bg-[#F0EBE2] rounded-lg"
                >
                  <MapPin className="w-3 h-3 text-[#8C5D38]" />
                  <span>{card.locationName} 導航</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
