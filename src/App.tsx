import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Filter, 
  Utensils, 
  Train, 
  Hotel, 
  Sparkles, 
  Calendar,
  Share2,
  Check,
  Backpack
} from 'lucide-react';
import { ITINERARY_DAYS } from './data/itineraryData';
import { DAILY_CARRY_PLANS } from './data/dailyCarryData';
import { CardCategory } from './types';
import { DaySelector } from './components/DaySelector';
import { WeatherCard } from './components/WeatherCard';
import { OutfitCard } from './components/OutfitCard';
import { ItineraryCardItem } from './components/ItineraryCardItem';
import { TravelInfoView } from './components/TravelInfoView';
import { BudgetView } from './components/BudgetView';
import { GuideHubView } from './components/GuideHubView';
import { GoogleMapsListView } from './components/GoogleMapsListView';
import { NotesAndSouvenirsView } from './components/NotesAndSouvenirsView';
import { DailyCarryModal } from './components/DailyCarryModal';
import { BottomNav, MainTabType } from './components/BottomNav';
import { DualClock } from './components/DualClock';
import { LineHeaderButton } from './components/LineGroupButton';
import appIcon from './assets/images/app-icon.png';

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('itinerary');
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default to Day 2 (first active day in Europe)
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDailyCarryOpen, setIsDailyCarryOpen] = useState(false);

  const currentDayData = ITINERARY_DAYS.find((d) => d.dayNumber === selectedDay) || ITINERARY_DAYS[0];
  const todayCarryPlan = DAILY_CARRY_PLANS[selectedDay];

  // Filter cards for the day
  const displayedCards = currentDayData.cards.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

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

  const handleJumpToDayFromHub = (day: number) => {
    setSelectedDay(day);
    setActiveMainTab('itinerary');
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#2C2A29] flex flex-col items-center">
      {/* Mobile-First Frame Container (Max Width centered for tablet/desktop) */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF9F6] shadow-xl flex flex-col relative border-x border-[#EAE4DC]">
        
        {/* Sticky App Header */}
        <header id="main-header" className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D6] px-4 pt-3 pb-2.5">
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
                  <span className="text-[10px] tracking-widest font-semibold text-[#8C5D38] uppercase bg-[#F3ECE3] px-2 py-0.5 rounded">
                    吉光旅遊 典藏行程
                  </span>
                  <span className="text-[10px] text-[#7A7167] font-mono">
                    2026/09/19 - 09/30
                  </span>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-[#22201F] mt-0.5 flex items-center gap-1.5 font-['Zen_Old_Mincho',serif]">
                  奧地利．捷克湖區 12日
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <LineHeaderButton />

              <a
                href="tel:+886921450066"
                title="緊急聯絡領隊張智惠"
                className="p-2 rounded-xl bg-[#F0EBE1] text-[#4A433A] hover:bg-[#E5DFD4] transition-colors text-xs flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C5D38]" />
                <span className="hidden sm:inline text-[11px] font-medium">領隊</span>
              </a>

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
              <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

              <div className="px-4 space-y-3.5">
                {/* Day Header Banner */}
                <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2C2A29] text-[#FAF8F5]">
                          DAY {currentDayData.dayNumber}
                        </span>
                        <span className="text-xs text-[#70675D] font-mono">
                          {currentDayData.date} ({currentDayData.dayOfWeek})
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-[#2C2A29] mt-1.5 leading-snug">
                        {currentDayData.routeTitle}
                      </h2>
                    </div>

                    <button
                      onClick={() => setIsDailyCarryOpen(true)}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-[#F0EBE1] text-[#7A4E2A] hover:bg-[#E5DFD4] transition-all border border-[#E3D8CA] active:scale-95 shrink-0 shadow-2xs"
                      title="開啟今日隨身必帶清單"
                    >
                      <Backpack className="w-3.5 h-3.5 text-[#8C5D38]" />
                      <span>每日必帶</span>
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

                  {/* Daily Carry Recommendation Banner */}
                  {todayCarryPlan && (
                    <button
                      onClick={() => setIsDailyCarryOpen(true)}
                      className="mt-3 w-full py-2 px-3 rounded-xl bg-[#F4EFE7] hover:bg-[#EAE2D6] active:scale-[0.99] text-[#2C2A29] text-xs font-semibold flex items-center justify-between transition-all border border-[#E5DACB] shadow-2xs"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <div className="w-7 h-7 rounded-lg bg-[#8C5D38] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Backpack className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#2C2A29]">今日隨身必帶</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EAE2D5] text-[#756658] font-mono">
                              {todayCarryPlan.items.length} 項活動推薦
                            </span>
                          </div>
                          <p className="text-[10.5px] text-[#73685C] font-normal truncate max-w-[200px] sm:max-w-xs mt-0.5">
                            活動：{todayCarryPlan.activities.map(a => a.label).join(' · ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-[#8C5D38] text-white px-2.5 py-1 rounded-lg font-medium shrink-0 ml-1 shadow-2xs">
                        檢查清單 →
                      </span>
                    </button>
                  )}

                  {/* Shortcut to Google Maps 89 items pocket list */}
                  <button
                    onClick={() => setActiveMainTab('mapsList')}
                    className="mt-2 w-full py-1.5 px-3 rounded-xl bg-[#F2EDE4] hover:bg-[#E9E2D7] active:scale-[0.99] text-[#4A433A] text-xs font-medium flex items-center justify-between transition-all border border-[#E5DFD4]"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C5D38]" />
                      <span>查看「2026奧捷家旅」89 處景點＆美食口袋清單</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                {/* 1. 即時天氣資訊 (Weather Card) */}
                <WeatherCard weather={currentDayData.weather} />

                {/* 2. 每日穿搭指南 (Outfit Card - Situated right below weather as requested) */}
                <OutfitCard outfit={currentDayData.outfit} />

                {/* Category Filter Chips for Day Cards */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-[#2C2A29] text-[#FAF8F5]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      全部行程 ({currentDayData.cards.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory('spot')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === 'spot'
                          ? 'bg-[#356B48] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      景點
                    </button>
                    <button
                      onClick={() => setSelectedCategory('restaurant')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === 'restaurant'
                          ? 'bg-[#B54D34] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      餐廳
                    </button>
                    <button
                      onClick={() => setSelectedCategory('transport')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === 'transport'
                          ? 'bg-[#2F5E7D] text-[#FFFFFF]'
                          : 'bg-[#EDE7DC] text-[#63594F] hover:bg-[#E2DBCF]'
                      }`}
                    >
                      交通
                    </button>
                    <button
                      onClick={() => setSelectedCategory('hotel')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
                  {displayedCards.map((card) => (
                    <ItineraryCardItem key={card.id} card={card} />
                  ))}
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
                    onClick={() => setSelectedDay(selectedDay - 1)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-medium text-[#4A433A] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#EFE9DF] transition-colors"
                  >
                    ← 前一天 (Day {selectedDay - 1})
                  </button>

                  <span className="text-xs text-[#80766B] font-mono">
                    {selectedDay} / 12
                  </span>

                  <button
                    disabled={selectedDay >= 12}
                    onClick={() => setSelectedDay(selectedDay + 1)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-medium text-[#4A433A] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#EFE9DF] transition-colors"
                  >
                    下一天 (Day {selectedDay + 1}) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMainTab === 'mapsList' && (
            <div className="px-4 pt-3">
              <GoogleMapsListView onJumpToDay={handleJumpToDayFromHub} />
            </div>
          )}

          {activeMainTab === 'guide' && (
            <div className="px-4 pt-3">
              <GuideHubView 
                onJumpToDay={handleJumpToDayFromHub} 
                onNavigateToNotes={() => setActiveMainTab('notes')}
              />
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

        {/* Daily Carry Modal */}
        <DailyCarryModal 
          isOpen={isDailyCarryOpen} 
          onClose={() => setIsDailyCarryOpen(false)} 
          dayNumber={selectedDay}
          onSelectDay={(day) => setSelectedDay(day)}
        />

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeMainTab} onChangeTab={setActiveMainTab} />
      </div>
    </div>
  );
}
