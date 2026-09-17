import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Utensils, 
  Camera, 
  Compass, 
  Sparkles, 
  Coffee, 
  Cake, 
  Landmark, 
  Filter, 
  Tag, 
  Building,
  Eye,
  Hotel
} from 'lucide-react';
import { GOOGLE_MAPS_PLACES, GOOGLE_MAPS_SOURCE_URL, GoogleMapsPlace } from '../data/googleMapsData';

interface GoogleMapsListViewProps {
  onJumpToDay?: (day: number) => void;
}

export const GoogleMapsListView: React.FC<GoogleMapsListViewProps> = ({ onJumpToDay }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'spot' | 'food' | 'hotel'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [onlyWithNotes, setOnlyWithNotes] = useState<boolean>(false);

  // Available Cities
  const cities = useMemo(() => {
    const map = new Map<string, number>();
    GOOGLE_MAPS_PLACES.forEach((p) => {
      map.set(p.city, (map.get(p.city) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  // Filter logic
  const filteredPlaces = useMemo(() => {
    return GOOGLE_MAPS_PLACES.filter((place) => {
      // Category filter
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }
      // City filter
      if (selectedCity !== 'all' && place.city !== selectedCity) {
        return false;
      }
      // Only with notes
      if (onlyWithNotes && !place.userNote) {
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
  }, [selectedCategory, selectedCity, searchQuery, onlyWithNotes]);

  const spotCount = useMemo(() => GOOGLE_MAPS_PLACES.filter(p => p.category === 'spot').length, []);
  const foodCount = useMemo(() => GOOGLE_MAPS_PLACES.filter(p => p.category === 'food').length, []);
  const hotelCount = useMemo(() => GOOGLE_MAPS_PLACES.filter(p => p.category === 'hotel').length, []);

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
    <div id="google-maps-list-view" className="space-y-4 pb-20">
      {/* Top Banner Card */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#EDE5D8] text-[#6E5842]">
                Google Maps 彙整清單
              </span>
              <span className="text-[10px] font-mono text-[#7D746A]">
                共 {GOOGLE_MAPS_PLACES.length} 處私房地點
              </span>
            </div>
            <h2 className="text-base font-bold text-[#22201F] mt-1 font-['Zen_Old_Mincho',serif]">
              2026 奧捷家旅口袋清單
            </h2>
            <p className="text-[11px] text-[#6B635B] mt-0.5 leading-relaxed">
              依「景點巡禮」、「美食美饌」與「精選住宿」精準分類，包含私房拍攝角度、必點餐點推薦與即時導航。
            </p>
          </div>

          <a
            href={GOOGLE_MAPS_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#453F3A] active:scale-95 transition-all shrink-0 flex items-center gap-1 text-[11px] font-medium"
            title="開啟原 Google Maps 清單"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">開原地圖</span>
          </a>
        </div>

        {/* Search Box */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-[#8C8276] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋景點、香蕉煎餅、油封鴨、豬腳、拍照點..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F3EFE7] border border-[#E0D9CD] rounded-xl text-xs text-[#2C2A29] placeholder-[#948A7D] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
          />
        </div>

        {/* Primary Classification Tabs: 全部 / 景點 / 美食 / 住宿 */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-[#EAE4D9]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`py-2 px-1 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
                : 'bg-[#F2ECE3] text-[#554E46] hover:bg-[#EAE2D5]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>全部 ({GOOGLE_MAPS_PLACES.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('spot')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              selectedCategory === 'spot'
                ? 'bg-[#2E6B47] text-[#FFFFFF] shadow-xs'
                : 'bg-[#EBF3ED] text-[#256841] hover:bg-[#DEEDE2]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>景點 ({spotCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('food')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              selectedCategory === 'food'
                ? 'bg-[#B84E34] text-[#FFFFFF] shadow-xs'
                : 'bg-[#FDF1EB] text-[#B84E34] hover:bg-[#F9E2D8]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>美食 ({foodCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('hotel')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              selectedCategory === 'hotel'
                ? 'bg-[#8C5D38] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F5EFE8] text-[#8C5D38] hover:bg-[#ECE4D8]'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>住宿 ({hotelCount})</span>
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
              selectedCity === 'all'
                ? 'bg-[#524B43] text-[#FAF8F5]'
                : 'bg-[#EDE7DE] text-[#61574C] hover:bg-[#E2DAD0]'
            }`}
          >
            全部城市
          </button>
          {cities.map(([cityName, count]) => (
            <button
              key={cityName}
              onClick={() => setSelectedCity(cityName)}
              className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
                selectedCity === cityName
                  ? 'bg-[#524B43] text-[#FAF8F5]'
                  : 'bg-[#EDE7DE] text-[#61574C] hover:bg-[#E2DAD0]'
              }`}
            >
              {cityName.split(' ')[0]} ({count})
            </button>
          ))}
        </div>

        {/* Toggle only with notes */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#696155] pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyWithNotes}
              onChange={(e) => setOnlyWithNotes(e.target.checked)}
              className="rounded border-[#C5BDB0] text-[#2C2A29] focus:ring-0"
            />
            <span>僅顯示附私房備註/招牌菜點位</span>
          </label>

          <span className="font-mono text-[#807669]">
            目前顯示 {filteredPlaces.length} 筆
          </span>
        </div>
      </div>

      {/* Places List */}
      <div className="space-y-3">
        {filteredPlaces.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-8 text-center text-xs text-[#8A8177]">
            無符合條件的地點，請調整篩選器或關鍵字。
          </div>
        ) : (
          filteredPlaces.map((place) => {
            const isFood = place.category === 'food';
            const isHotel = place.category === 'hotel';
            const dayNum = parseDayNumber(place.userNote);

            return (
              <article
                key={place.id}
                id={`gmap-card-${place.originalIndex}`}
                className={`bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm transition-all duration-150 ${
                  isFood 
                    ? 'border-l-[3px] border-l-[#C25B40]' 
                    : isHotel
                    ? 'border-l-[3px] border-l-[#8C5D38]'
                    : 'border-l-[3px] border-l-[#4A7D58]'
                }`}
              >
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Category tag */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                      isFood 
                        ? 'bg-[#FDF1EB] text-[#B84E34] border border-[#F7D8CB]' 
                        : isHotel
                        ? 'bg-[#F5EFE8] text-[#8C5D38] border border-[#EADFD0]'
                        : 'bg-[#EBF2EC] text-[#2F6B48] border border-[#D1E3D5]'
                    }`}>
                      {isFood ? (
                        <Utensils className="w-3 h-3" />
                      ) : isHotel ? (
                        <Hotel className="w-3 h-3" />
                      ) : (
                        <Landmark className="w-3 h-3" />
                      )}
                      {isFood ? '美食' : isHotel ? '住宿' : '景點'}
                    </span>

                    {/* Subcategory */}
                    <span className="text-[10px] text-[#61584D] bg-[#EFE9DF] px-2 py-0.5 rounded-md font-medium">
                      {place.subCategory}
                    </span>

                    {/* City pill */}
                    <span className="text-[10px] text-[#7A7165] font-medium">
                      {place.city}
                    </span>
                  </div>

                  {/* Optional Day Jump Button */}
                  {dayNum && onJumpToDay && (
                    <button
                      onClick={() => onJumpToDay(dayNum)}
                      className="text-[10px] font-mono font-bold text-[#FAF8F5] bg-[#2C2A29] px-2 py-0.5 rounded hover:bg-[#48423E] transition-colors"
                      title={`切換至行程第 ${dayNum} 天`}
                    >
                      Day {dayNum} →
                    </button>
                  )}
                </div>

                {/* Place Name */}
                <div className="mt-2">
                  <h3 className="text-sm font-bold text-[#252322] leading-snug">
                    {place.title}
                  </h3>
                </div>

                {/* User's Curated Note / Secret Highlight */}
                {place.userNote && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#F6EFE5] border border-[#E9DECة] text-xs flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#A86418] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86418] block">
                        私房推薦 ＆ 攻略備註
                      </span>
                      <p className="text-xs font-bold text-[#3B342B] leading-relaxed mt-0.5">
                        {place.userNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Address & Navigation bar */}
                <div className="mt-2.5 pt-2 border-t border-[#EDE7DD] flex items-center justify-between gap-2">
                  <div className="flex items-start gap-1.5 min-w-0 text-xs text-[#6B6258]">
                    <MapPin className="w-3.5 h-3.5 text-[#8C5D38] shrink-0 mt-0.5" />
                    <span className="truncate text-[11px]">
                      {place.shortAddress || place.fullAddress}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(place.fullAddress || place.title, place.id)}
                      title="複製地址"
                      className="p-1.5 rounded-lg bg-[#EFE9DF] text-[#554E46] hover:bg-[#E5DFD4] active:scale-95 transition-all text-xs flex items-center"
                    >
                      {copiedId === place.id ? (
                        <Check className="w-3.5 h-3.5 text-[#2E6B45]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#443E3B] active:scale-95 transition-all text-xs font-medium flex items-center gap-1 shadow-xs"
                    >
                      <Navigation className="w-3 h-3 text-[#F2EDE4]" />
                      <span>導航</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
