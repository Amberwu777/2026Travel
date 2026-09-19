import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  ChevronRight, 
  Filter, 
  Utensils, 
  Train, 
  Hotel, 
  Sparkles, 
  Calendar,
  Share2,
  Check,
  ExternalLink,
  CheckSquare,
  Search,
  X
} from 'lucide-react';
import { ITINERARY_DAYS } from './data/itineraryData';
import { CardCategory } from './types';
import { DaySelector } from './components/DaySelector';
import { WeatherCard } from './components/WeatherCard';
import { OutfitCard } from './components/OutfitCard';
import { ItineraryCardItem } from './components/ItineraryCardItem';
import { TravelInfoView } from './components/TravelInfoView';
import { BudgetView } from './components/BudgetView';
import { NotesAndSouvenirsView } from './components/NotesAndSouvenirsView';
import { DailyCarryModal } from './components/DailyCarryModal';
import { BottomNav, MainTabType } from './components/BottomNav';
import { DualClock } from './components/DualClock';
import { LineHeaderButton } from './components/LineGroupButton';
import { getTodayDayNumber, isTodayDay } from './utils/dateUtils';
import appIcon from './assets/images/app-icon.png';

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('itinerary');
  const [selectedDay, setSelectedDay] = useState<number>(() => getTodayDayNumber());
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all' | 'highlights'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDailyCarryOpen, setIsDailyCarryOpen] = useState(false);

  // Auto-detect and switch to today's day whenever entering or returning to the app
  useEffect(() => {
    const handleReEnterApp = () => {
      if (document.visibilityState === 'visible') {
        const todayDay = getTodayDayNumber();
        setSelectedDay(todayDay);
      }
    };

    document.addEventListener('visibilitychange', handleReEnterApp);
    window.addEventListener('focus', handleReEnterApp);
    return () => {
      document.removeEventListener('visibilitychange', handleReEnterApp);
      window.removeEventListener('focus', handleReEnterApp);
    };
  }, []);

  const currentDayData = ITINERARY_DAYS.find((d) => d.dayNumber === selectedDay) || ITINERARY_DAYS[0];

  // Filter cards for the day based on category and search query
  const displayedCards = useMemo(() => {
    return currentDayData.cards.filter((c) => {
      // Category filter
      if (selectedCategory === 'highlights') {
        const hasHighlights = (c.highlights?.mustEat && c.highlights.mustEat.length > 0) ||
          (c.highlights?.mustOrder && c.highlights.mustOrder.length > 0) ||
          (c.highlights?.mustBuy && c.highlights.mustBuy.length > 0) ||
          Boolean(c.story);
        if (!hasHighlights) return false;
      } else if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchSub = (c.subtitle || '').toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchStory = (c.story || '').toLowerCase().includes(q);
        const matchMustEat = (c.highlights?.mustEat || []).some(m => m.toLowerCase().includes(q));
        const matchMustOrder = (c.highlights?.mustOrder || []).some(m => m.toLowerCase().includes(q));
        const matchMustBuy = (c.highlights?.mustBuy || []).some(m => m.toLowerCase().includes(q));
        return matchTitle || matchSub || matchDesc || matchStory || matchMustEat || matchMustOrder || matchMustBuy;
      }

      return true;
    });
  }, [currentDayData, selectedCategory, searchQuery]);

  // Search matches across other days
  const otherDayMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { dayNumber: number; city: string; count: number }[] = [];

    ITINERARY_DAYS.forEach((d) => {
      if (d.dayNumber === selectedDay) return;
      const matchingCount = d.cards.filter((c) => {
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchSub = (c.subtitle || '').toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchStory = (c.story || '').toLowerCase().includes(q);
        const matchMustEat = (c.highlights?.mustEat || []).some(m => m.toLowerCase().includes(q));
        const matchMustOrder = (c.highlights?.mustOrder || []).some(m => m.toLowerCase().includes(q));
        const matchMustBuy = (c.highlights?.mustBuy || []).some(m => m.toLowerCase().includes(q));
        return matchTitle || matchSub || matchDesc || matchStory || matchMustEat || matchMustOrder || matchMustBuy;
      }).length;

      if (matchingCount > 0) {
        results.push({ dayNumber: d.dayNumber, city: d.city, count: matchingCount });
      }
    });

    return results;
  }, [searchQuery, selectedDay]);

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: '奧捷12日隨行旅遊手冊',
        text: '吉光旅遊 奧地利捷克湖區典藏12日手機版隨身助手',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      });
    }
  };

  const handleSelectDay = (day: number, scrollToTop = true) => {
    setSelectedDay(day);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (typeof document !== 'undefined') {
        document.documentElement?.scrollTo({ top: 0, behavior: 'smooth' });
        document.body?.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#2C2A29] flex flex-col items-center">
      {/* Mobile-First Frame Container (Max Width centered for tablet/desktop) */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF9F6] shadow-xl flex flex-col relative border-x border-[#EAE4DC] overflow-x-hidden">
        
        {/* Sticky App Header */}
        <header id="main-header" className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D6] px-3.5 sm:px-4 pt-3 pb-2.5 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={appIcon}
                alt="奧捷12日 App 圖示"
                className="w-10 h-10 rounded-xl object-cover shadow-xs border border-[#E8DFCFC0] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] tracking-widest font-semibold text-[#8C5D38] uppercase bg-[#F3ECE3] px-1.5 py-0.5 rounded whitespace-nowrap">
                    吉光旅遊
                  </span>
                  <span className="text-[10px] text-[#7A7167] font-mono whitespace-nowrap">
                    2026/09/19 - 09/30
                  </span>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-[#22201F] mt-0.5 flex items-center gap-1.5 font-['Zen_Old_Mincho',serif]">
                  奧地利．捷克 12日
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <LineHeaderButton />

              <button
                onClick={handleShareApp}
                title="分享手冊"
                className="p-2 rounded-xl bg-[#F0EBE1] text-[#4A433A] hover:bg-[#E5DFD4] transition-colors"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-[#2E6B45]" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Dual Clock Widget (Local Time vs Taiwan Time) */}
          <div className="mt-2.5">
            <DualClock />
          </div>
        </header>

        {/* Content Views */}
        <main className="flex-1">
          {activeMainTab === 'itinerary' && (
            <div className="space-y-4 pb-20">
              {/* Day Selector Pill Bar */}
              <DaySelector selectedDay={selectedDay} onSelectDay={(day) => handleSelectDay(day, true)} />

              <div className="px-4 space-y-3.5">
                {/* Day Header Banner */}
                <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2C2A29] text-[#FAF8F5]">
                          DAY {currentDayData.dayNumber}
                        </span>
                        <span className="text-xs text-[#70675D] font-mono">
                          {currentDayData.date} ({currentDayData.dayOfWeek})
                        </span>
                        {isTodayDay(currentDayData.dayNumber) ? (
                          <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-[#8C5D38] text-white tracking-wide shadow-2xs">
                            今日行程
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectDay(getTodayDayNumber(), true)}
                            className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-[#ECE5DA] text-[#6E553F] hover:bg-[#DFD5C6] transition-colors"
                            title="快速跳轉回今日行程"
                          >
                            跳回今天
                          </button>
                        )}
                      </div>
                      <h2 className="text-base font-bold text-[#2C2A29] mt-1.5 leading-snug">
                        {currentDayData.routeTitle}
                      </h2>
                    </div>

                    <button
                      onClick={() => setIsDailyCarryOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F0EBE1] text-[#7A4E2A] hover:bg-[#E5DFD4] transition-all border border-[#E3D8CA] active:scale-95 shrink-0 shadow-2xs"
                      title="開啟今日隨身檢查清單"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-[#8C5D38]" />
                      <span>檢查清單</span>
                    </button>
                  </div>

                  {currentDayData.scheduleMeta && (
                    <div className="mt-2.5 pt-2 border-t border-[#EAE4D9] flex items-center justify-between text-[11px] text-[#736A60] font-mono">
                      {currentDayData.scheduleMeta.departureTime && (
                        <span>⏰ {currentDayData.scheduleMeta.departureTime}</span>
                      )}
                      {currentDayData.scheduleMeta.wakeUpTime && (
                        <span>🌅 起床: {currentDayData.scheduleMeta.wakeUpTime}</span>
                      )}
                    </div>
                  )}

                  {/* Shortcut to Google Maps shared list */}
                  <a
                    href="https://maps.app.goo.gl/ssoZCbstUkmeKpK56"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-[#F2EDE4] hover:bg-[#E9E2D7] active:scale-[0.99] text-[#3D352E] text-xs font-semibold flex items-center justify-between transition-all border border-[#E5DFD4] shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C5D38]" />
                      <span>查看 Google Maps 分享清單（景點．美食．逛街）</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 text-[#8C5D38]" />
                  </a>
                </div>

                {/* 1. 即時天氣資訊 (Weather Card - Auto live update via Open-Meteo) */}
                <WeatherCard weather={currentDayData.weather} dayNumber={selectedDay} />

                {/* 2. 每日穿搭指南 (Outfit Card - Situated right below weather as requested) */}
                <OutfitCard outfit={currentDayData.outfit} />

                {/* Search & Category Filter Section */}
                <div className="space-y-2 pt-1">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8C8276] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜尋景點、莫札特、伴手禮、必吃、生牛肉..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-[#F3EFE7] border border-[#E0D9CD] rounded-xl text-xs text-[#2C2A29] placeholder-[#948A7D] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8C8276] hover:text-[#2C2A29]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Matches in other days */}
                  {otherDayMatches.length > 0 && (
                    <div className="bg-[#FAF6F0] border border-[#EAE0D2] rounded-xl p-2.5 text-xs text-[#6B5E4F]">
                      <div className="font-semibold text-[#8C5D38] mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>其他天數也找到相關項目（點擊跳轉）：</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {otherDayMatches.map((m) => (
                          <button
                            key={m.dayNumber}
                            onClick={() => handleSelectDay(m.dayNumber, true)}
                            className="px-2 py-0.5 rounded-lg bg-[#EFE8DC] hover:bg-[#E2D6C5] text-[#4A433A] font-medium text-[11px] border border-[#E0D5C3] transition-all"
                          >
                            Day {m.dayNumber} {m.city.split('/')[0]} ({m.count}處)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Filter Chips for Day Cards */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedCategory === 'all'
                          ? 'bg-[#2C2A29] text-[#FAF8F5]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      全部行程 ({currentDayData.cards.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory('highlights')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedCategory === 'highlights'
                          ? 'bg-[#8C5D38] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      必吃・必買
                    </button>
                    <button
                      onClick={() => setSelectedCategory('spot')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedCategory === 'spot'
                          ? 'bg-[#356B48] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      景點
                    </button>
                    <button
                      onClick={() => setSelectedCategory('restaurant')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedCategory === 'restaurant'
                          ? 'bg-[#B54D34] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      餐廳
                    </button>
                    <button
                      onClick={() => setSelectedCategory('transport')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedCategory === 'transport'
                          ? 'bg-[#2F5E7D] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      交通
                    </button>
                    <button
                      onClick={() => setSelectedCategory('hotel')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedCategory === 'hotel'
                          ? 'bg-[#7A5B36] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      飯店
                    </button>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3.5">
                  {displayedCards.length === 0 ? (
                    <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-6 text-center text-xs text-[#8A8177]">
                      此篩選條件下無項目，請嘗試清除搜尋或選擇其他分類。
                    </div>
                  ) : (
                    displayedCards.map((card) => (
                      <ItineraryCardItem key={card.id} card={card} />
                    ))
                  )}
                </div>

                {/* Day Meals & Lodging Summary Box */}
                <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#2C2A29]">
                    <Utensils className="w-3.5 h-3.5 text-[#8C5D38]" />
                    <span>當日餐食與飯店一覽</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-[#F5EFE7] border border-[#EBE3D7]">
                      <span className="text-[#877E73] block text-[10px]">早餐</span>
                      <span className="font-medium text-[#2C2A29] leading-tight block mt-0.5">
                        {currentDayData.meals.breakfast}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F5EFE7] border border-[#EBE3D7]">
                      <span className="text-[#877E73] block text-[10px]">午餐</span>
                      <span className="font-medium text-[#2C2A29] leading-tight block mt-0.5">
                        {currentDayData.meals.lunch}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F5EFE7] border border-[#EBE3D7]">
                      <span className="text-[#877E73] block text-[10px]">晚餐</span>
                      <span className="font-medium text-[#2C2A29] leading-tight block mt-0.5">
                        {currentDayData.meals.dinner}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#EDE7DD] flex items-center justify-between text-[11px]">
                    <span className="text-[#877E73]">今晚下榻：</span>
                    <span className="font-bold text-[#3B342C]">{currentDayData.hotelSummary}</span>
                  </div>
                </div>

                {/* Day Switcher Quick Buttons */}
                <div className="flex items-center justify-between pt-2 pb-6">
                  <button
                    disabled={selectedDay <= 1}
                    onClick={() => handleSelectDay(selectedDay - 1, true)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-medium text-[#4A433A] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#EFE9DF] transition-colors active:scale-95"
                  >
                    ← 前一天 (Day {selectedDay - 1})
                  </button>

                  <span className="text-xs text-[#80766B] font-mono">
                    {selectedDay} / 12
                  </span>

                  <button
                    disabled={selectedDay >= 12}
                    onClick={() => handleSelectDay(selectedDay + 1, true)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-medium text-[#4A433A] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#EFE9DF] transition-colors active:scale-95"
                  >
                    下一天 (Day {selectedDay + 1}) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMainTab === 'notes' && (
            <div className="px-4 pt-3">
              <NotesAndSouvenirsView />
            </div>
          )}

          {activeMainTab === 'travelInfo' && (
            <div className="px-4 pt-3">
              <TravelInfoView onNavigateToNotes={() => setActiveMainTab('notes')} />
            </div>
          )}

          {activeMainTab === 'budget' && (
            <div className="px-4 pt-3">
              <BudgetView />
            </div>
          )}
        </main>

        {/* Daily Carry Checklist Modal */}
        <DailyCarryModal 
          isOpen={isDailyCarryOpen} 
          onClose={() => setIsDailyCarryOpen(false)} 
          dayNumber={selectedDay}
          onSelectDay={(day) => handleSelectDay(day, true)}
        />

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeMainTab} onChangeTab={setActiveMainTab} />
      </div>
    </div>
  );
}
