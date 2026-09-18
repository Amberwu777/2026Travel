import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Utensils, 
  Landmark, 
  ShoppingBag,
  Sparkles,
  X,
  Layers,
  Hotel
} from 'lucide-react';
import { GOOGLE_MAPS_PLACES, GOOGLE_MAPS_SOURCE_URL, GoogleMapsPlace } from '../data/googleMapsData';

interface GoogleMapsListViewProps {
  onJumpToDay?: (day: number) => void;
}

type MainCategory = 'all' | 'spot' | 'food' | 'shopping';

export const GoogleMapsListView: React.FC<GoogleMapsListViewProps> = ({ onJumpToDay }) => {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available Cities
  const cities = useMemo(() => {
    const map = new Map<string, number>();
    GOOGLE_MAPS_PLACES.forEach((p) => {
      // If filtering by category, count within category
      if (activeCategory === 'all' || p.category === activeCategory) {
        map.set(p.city, (map.get(p.city) || 0) + 1);
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [activeCategory]);

  // Counts by category
  const spotCount = useMemo(() => GOOGLE_MAPS_PLACES.filter(p => p.category === 'spot').length, []);
  const foodCount = useMemo(() => GOOGLE_MAPS_PLACES.filter(p => p.category === 'food').length, []);
  const shoppingCount = useMemo(() => GOOGLE_MAPS_PLACES.filter(p => p.category === 'shopping').length, []);
  const allCount = GOOGLE_MAPS_PLACES.length;

  // Filter places
  const filteredPlaces = useMemo(() => {
    return GOOGLE_MAPS_PLACES.filter((place) => {
      // Category filter (spot / food / shopping / all)
      if (activeCategory !== 'all' && place.category !== activeCategory) {
        return false;
      }
      // City filter
      if (selectedCity !== 'all' && place.city !== selectedCity) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = place.title.toLowerCase().includes(q);
        const matchNote = (place.userNote || '').toLowerCase().includes(q);
        const matchCity = place.city.toLowerCase().includes(q);
        const matchSubCat = place.subCategory.toLowerCase().includes(q);
        const matchAddr = place.fullAddress.toLowerCase().includes(q);
        return matchTitle || matchNote || matchCity || matchSubCat || matchAddr;
      }
      return true;
    });
  }, [activeCategory, selectedCity, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const parseDayNumber = (note?: string): number | null => {
    if (!note) return null;
    const match = note.match(/Day\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
  };

  return (
    <div id="google-maps-list-view" className="space-y-3 pb-20">
      {/* Header Bar */}
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#ECE4D8] text-[#715941]">
                Google Maps 清單
              </span>
              <span className="text-[11px] font-mono text-[#7D746A]">
                共 {allCount} 處
              </span>
            </div>
            <h2 className="text-base font-bold text-[#22201F] mt-0.5 font-['Zen_Old_Mincho',serif]">
              2026 奧捷口袋地圖
            </h2>
          </div>

          {/* Direct Google Maps Link */}
          <a
            href={GOOGLE_MAPS_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#433E39] active:scale-95 transition-all shrink-0 flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            title="外開 Google 地圖 App 原清單"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white" />
            <span>開原地圖</span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-[#8F8578] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="搜尋景點、豬腳、煙囪捲、伴手禮、拍照點..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-[#F2EDE4] border border-[#DDD5C7] rounded-xl text-xs text-[#2A2726] placeholder-[#968C7E] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#8F8578] hover:text-[#2A2726]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Category Tabs (景點 / 美食 / 逛街 / 全部) */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#EFEBE3] p-1 rounded-xl border border-[#E3DCD1]">
        <button
          onClick={() => { setActiveCategory('all'); setSelectedCity('all'); }}
          className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeCategory === 'all'
              ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
              : 'text-[#635A4F] hover:text-[#2C2A29] hover:bg-[#FAF8F5]/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>全部 <span className="opacity-75 text-[10px]">({allCount})</span></span>
        </button>

        <button
          onClick={() => { setActiveCategory('spot'); setSelectedCity('all'); }}
          className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeCategory === 'spot'
              ? 'bg-[#265B3E] text-white shadow-xs'
              : 'text-[#286343] hover:bg-[#EAF3EE]'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>景點 <span className="opacity-80 text-[10px]">({spotCount})</span></span>
        </button>

        <button
          onClick={() => { setActiveCategory('food'); setSelectedCity('all'); }}
          className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeCategory === 'food'
              ? 'bg-[#9C4B13] text-white shadow-xs'
              : 'text-[#A05118] hover:bg-[#FDF1E6]'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>美食 <span className="opacity-80 text-[10px]">({foodCount})</span></span>
        </button>

        <button
          onClick={() => { setActiveCategory('shopping'); setSelectedCity('all'); }}
          className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeCategory === 'shopping'
              ? 'bg-[#823372] text-white shadow-xs'
              : 'text-[#863777] hover:bg-[#F7EDF5]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>逛街 <span className="opacity-80 text-[10px]">({shoppingCount})</span></span>
        </button>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setSelectedCity('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
            selectedCity === 'all'
              ? 'bg-[#524B43] text-white'
              : 'bg-[#EDE7DE] text-[#695F53] hover:bg-[#E3DCD1]'
          }`}
        >
          全部城市
        </button>

        {cities.map(([cityName, count]) => {
          const shortCity = cityName.split(' ')[0];
          const isSelected = selectedCity === cityName;
          return (
            <button
              key={cityName}
              onClick={() => setSelectedCity(cityName)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#524B43] text-white'
                  : 'bg-[#EDE7DE] text-[#695F53] hover:bg-[#E3DCD1]'
              }`}
            >
              <span>{shortCity}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Result Counter & Active Filter Summary */}
      <div className="flex items-center justify-between text-xs px-1 text-[#786F64]">
        <span>
          顯示 <strong className="text-[#252220]">{filteredPlaces.length}</strong> 處地點
          {selectedCity !== 'all' && ` · ${selectedCity.split(' ')[0]}`}
        </span>
        {(searchQuery || selectedCity !== 'all') && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedCity('all'); }}
            className="text-[11px] text-[#8C5D38] hover:underline"
          >
            重設篩選
          </button>
        )}
      </div>

      {/* Places List Cards */}
      <div className="space-y-2.5">
        {filteredPlaces.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-8 text-center">
            <MapPin className="w-8 h-8 text-[#A89E90] mx-auto opacity-50 mb-2" />
            <p className="text-sm font-bold text-[#423C36]">查無符合的地點</p>
            <p className="text-xs text-[#7D746A] mt-1">請嘗試變更搜尋關鍵字或城市篩選條件</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCity('all'); setActiveCategory('all'); }}
              className="mt-3 px-3.5 py-1.5 bg-[#2C2A29] text-white rounded-xl text-xs font-medium inline-block"
            >
              清除所有條件
            </button>
          </div>
        ) : (
          filteredPlaces.map((place) => {
            const dayNum = parseDayNumber(place.userNote);
            const isCopied = copiedId === place.id;
            const isSpot = place.category === 'spot';
            const isFood = place.category === 'food';
            const isShopping = place.category === 'shopping';
            const isHotel = place.category === 'hotel';

            return (
              <div
                key={place.id}
                id={place.id}
                className="bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl p-3.5 shadow-2xs hover:border-[#D4CABB] transition-all"
              >
                {/* Card Top: Badges & Day Indicator */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Category badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isFood
                        ? 'bg-[#FDF1E6] text-[#A05118]'
                        : isShopping
                        ? 'bg-[#F7EDF5] text-[#863777]'
                        : isHotel
                        ? 'bg-[#EFECE8] text-[#554F47]'
                        : 'bg-[#EAF3EE] text-[#245E3E]'
                    }`}>
                      {isFood ? (
                        <Utensils className="w-2.5 h-2.5" />
                      ) : isShopping ? (
                        <ShoppingBag className="w-2.5 h-2.5" />
                      ) : isHotel ? (
                        <Hotel className="w-2.5 h-2.5" />
                      ) : (
                        <Landmark className="w-2.5 h-2.5" />
                      )}
                      {isFood ? '美食' : isShopping ? '逛街' : isHotel ? '住宿' : '景點'}
                    </span>

                    {/* SubCategory tag */}
                    <span className="text-[10px] text-[#695F53] bg-[#EFEBE3] px-1.5 py-0.5 rounded">
                      {place.subCategory}
                    </span>

                    {/* City */}
                    <span className="text-[10px] text-[#786E62]">
                      {place.city.split(' ')[0]}
                    </span>
                  </div>

                  {/* Day shortcut button if tied to itinerary day */}
                  {dayNum && onJumpToDay && (
                    <button
                      onClick={() => onJumpToDay(dayNum)}
                      className="text-[10px] font-mono font-bold text-[#FAF8F5] bg-[#3B3530] px-2 py-0.5 rounded hover:bg-[#524B44] transition-colors shrink-0"
                      title={`切換至行程第 ${dayNum} 天`}
                    >
                      Day {dayNum} →
                    </button>
                  )}
                </div>

                {/* Place Title */}
                <h3 className="text-sm font-bold text-[#23201F] mt-1.5 leading-snug">
                  {place.title}
                </h3>

                {/* User's Curated Note / Secret Highlight */}
                {place.userNote && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#F6EFE5] border border-[#E9DECD] text-xs flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#9E5A12] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold tracking-wide text-[#9E5A12] block">
                        {isShopping ? '必買與逛街攻略' : isFood ? '必點美饌與特色' : '私房景觀與拍照點'}
                      </span>
                      <p className="text-xs font-semibold text-[#352F28] mt-0.5 leading-relaxed">
                        {place.userNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Address & Quick Actions */}
                <div className="mt-2.5 pt-2 border-t border-[#ECE5DC] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#7A7165] truncate min-w-0" title={place.fullAddress}>
                    {place.shortAddress || place.fullAddress}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(place.fullAddress, place.id)}
                      className="px-2 py-1 rounded-lg bg-[#EFEBE3] text-[#554D43] hover:bg-[#E3DCD0] text-[11px] font-medium flex items-center gap-1 active:scale-95 transition-all"
                      title="複製地址"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-[#226343]" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{isCopied ? '已複製' : '複製'}</span>
                    </button>

                    <a
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-[#2C2A29] text-white hover:bg-[#433E39] text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
                      title="開啟 Google Maps 導航"
                    >
                      <Navigation className="w-3 h-3 text-[#EFECE8]" />
                      <span>導航</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
