export type CardCategory = 'spot' | 'restaurant' | 'transport' | 'hotel';

export interface CardHighlights {
  mustEat?: string[];      // 必吃美食
  mustOrder?: string[];    // 必點菜單
  mustBuy?: string[];      // 必買伴手禮
  reservationCode?: string;// 重要預約代號
  ticketInfo?: string;     // 門票狀態
}

export interface ItineraryCard {
  id: string;
  category: CardCategory;
  title: string;
  subtitle?: string;
  timeSlot?: string;
  locationName: string;
  navQuery: string; // Used for 1-tap Google Maps Navigation
  mapsUrl?: string; // Direct Google Maps place link / short link
  description: string;
  story?: string;   // 景點典故與導遊私房故事
  tips?: string[];
  highlights?: CardHighlights;
  distanceKm?: number;
}

export interface DayWeather {
  location: string;
  tempRange: string;
  currentTemp: string;
  condition: string;
  rainChance: string;
  icon: 'sun' | 'cloud' | 'rain' | 'fog' | 'partly-cloudy';
  advisory: string;
  feelsLike?: string;
  humidity?: string;
  isLive?: boolean;
  lastUpdated?: string;
}

export interface DayOutfit {
  summary: string;
  inner: string;
  mid: string;
  outer: string;
  bottom: string;
  shoes: string;
  specialNotice?: string;
}

export interface DayScheduleMeta {
  wakeUpTime?: string;
  luggageTime?: string;
  breakfastTime?: string;
  departureTime?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  dayOfWeek: string;
  routeTitle: string;
  city: string;
  hotelSummary: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  weather: DayWeather;
  outfit: DayOutfit;
  scheduleMeta?: DayScheduleMeta;
  dayLocations?: Array<{ name: string; url: string }>;
  cards: ItineraryCard[];
}

export interface HotelDetails {
  id: string;
  days: string;
  dayRange?: number[];
  dates: string;
  city: string;
  name: string;
  stars: number;
  address: string;
  tel: string;
  wifiNote: string;
  features: string[];
  navQuery: string;
}

export interface FlightLeg {
  type: '去程' | '回程';
  date: string;
  route: string;
  flightNo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraftNote: string;
  meetingTime?: string;
  meetingPlace?: string;
}

export interface ExpenseRecord {
  id: string;
  dayNumber?: number;
  date: string;
  title: string;
  amount: number;
  currency: 'EUR' | 'CZK' | 'TWD';
  category: 'food' | 'shopping' | 'transport' | 'ticket' | 'other';
  isTaxRefundable?: boolean;
  notes?: string;
}

export type ChecklistCategory = 
  | '隨身包用品'
  | '文件、門票、證明'
  | '支付類'
  | '電子用品'
  | '衣物_收納'
  | '配件_收納/衣物'
  | '藥品'
  | '保養品 / 盥洗用品'
  | '化妝品'
  | '飾品'
  | '食物'
  | '旅遊前置'
  | '家_設備檢查';

export type ChecklistTiming = 
  | '出國前兩週'
  | '出國前一週'
  | '出國前一天'
  | '出國當天';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory | string;
  timing: ChecklistTiming | string;
  text: string;
  checked: boolean;
  important?: boolean;
  note?: string;
  badge?: string;
}

export interface SouvenirItem {
  id: string;
  name: string;
  recipient: string;
  quantity?: string;
  priceEstimate?: string;
  cityOrStore?: string;
  note?: string;
  completed: boolean;
  createdAt: number;
}

export interface PersonalMemo {
  id: string;
  title: string;
  content: string;
  tag: string;
  isPinned: boolean;
  updatedAt: string;
}

export type ActivityTagType = 'church' | 'hiking' | 'dining' | 'shopping' | 'flight' | 'boat' | 'cave' | 'palace';

export interface ActivityTag {
  label: string;
  type: ActivityTagType;
}

export interface DailyCarryItem {
  id: string;
  name: string;
  category: 'essential' | 'outfit' | 'activity' | 'convenience';
  reason: string;
  isMustHave?: boolean;
}

export interface DailyCarryPlan {
  dayNumber: number;
  date: string;
  themeTitle: string;
  activities: ActivityTag[];
  summaryHint: string;
  items: DailyCarryItem[];
}
