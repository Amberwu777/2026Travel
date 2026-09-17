import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Hotel, 
  PhoneCall, 
  Receipt, 
  CheckSquare, 
  Phone, 
  ExternalLink, 
  MapPin, 
  AlertTriangle, 
  Check, 
  Copy, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Luggage,
  Sparkles
} from 'lucide-react';
import { 
  FLIGHT_LEGS, 
  BAGGAGE_RULES, 
  HOTELS_LIST, 
  EMERGENCY_CONTACTS, 
  DIALING_GUIDE, 
  TAX_REFUND_RULES 
} from '../data/travelInfoData';
import { LineGroupBannerCard, LINE_GROUP_URL, LineIcon } from './LineGroupButton';
import { ChecklistView } from './ChecklistView';

interface TravelInfoViewProps {
  onNavigateToNotes?: () => void;
}

export const TravelInfoView: React.FC<TravelInfoViewProps> = ({ onNavigateToNotes }) => {
  const [activeTab, setActiveTab] = useState<'flight' | 'hotel' | 'emergency' | 'tax' | 'checklist'>('flight');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div id="travel-info-container" className="space-y-4 pb-20">
      {/* Sub-navigation Tabs */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] p-1.5 rounded-2xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar shadow-sm">
        <button
          onClick={() => setActiveTab('flight')}
          className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === 'flight'
              ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#F0EBE2]'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>航班</span>
        </button>

        <button
          onClick={() => setActiveTab('hotel')}
          className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === 'hotel'
              ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#F0EBE2]'
          }`}
        >
          <Hotel className="w-3.5 h-3.5" />
          <span>住宿</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === 'emergency'
              ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#F0EBE2]'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>求助</span>
        </button>

        <button
          onClick={() => setActiveTab('tax')}
          className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === 'tax'
              ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#F0EBE2]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>退稅</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeTab === 'checklist'
              ? 'bg-[#2C2A29] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#F0EBE2]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>清單</span>
        </button>
      </div>

      {/* 1. 航班資訊 (Flight Info) */}
      {activeTab === 'flight' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#3B7094]"></span>
              <h3 className="text-sm font-bold text-[#2C2A29]">長榮航空往返班機時刻</h3>
            </div>

            <div className="space-y-3">
              {FLIGHT_LEGS.map((flight, idx) => (
                <div key={idx} className="bg-[#F4EFE7] border border-[#E6DFC0]/50 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2C2A29] flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#E4DDD0] text-[#4A433A] text-[10px]">
                        {flight.type}
                      </span>
                      {flight.flightNo}
                    </span>
                    <span className="text-[11px] text-[#736A60] font-mono">{flight.date}</span>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-[#1F3D52]">
                    {flight.route}
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 bg-[#FAF8F5] p-2 rounded-lg border border-[#E9E4DC] font-mono text-[11px]">
                    <div>
                      <span className="text-[#877E74] block text-[10px]">起飛時間</span>
                      <span className="font-bold text-[#2C2A29]">{flight.departureTime}</span>
                    </div>
                    <div>
                      <span className="text-[#877E74] block text-[10px]">抵達時間</span>
                      <span className="font-bold text-[#2C2A29]">{flight.arrivalTime}</span>
                    </div>
                  </div>

                  {flight.meetingTime && (
                    <div className="mt-2.5 pt-2 border-t border-[#E3DCCF] text-[11px] text-[#63594F]">
                      <div className="font-semibold text-[#914D2E] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {flight.meetingTime}
                      </div>
                      <div className="text-[10px] text-[#70665A] mt-0.5">{flight.meetingPlace}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 行李與飛安法規 */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-[#8C5E3B]" />
              <h3 className="text-sm font-bold text-[#2C2A29]">長榮航空免費行李限額規定</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F4EFE7] border border-[#EAE3D7]">
                <div className="font-bold text-[#3B342C] text-xs">經濟艙 (Economy)</div>
                <div className="mt-1 text-[11px] text-[#5A5248]">託運：{BAGGAGE_RULES.economy.checked}</div>
                <div className="text-[11px] text-[#5A5248]">手提：{BAGGAGE_RULES.economy.carryOn}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4EFE7] border border-[#EAE3D7]">
                <div className="font-bold text-[#3B342C] text-xs">商務艙 (Business)</div>
                <div className="mt-1 text-[11px] text-[#5A5248]">託運：{BAGGAGE_RULES.business.checked}</div>
                <div className="text-[11px] text-[#5A5248]">手提：{BAGGAGE_RULES.business.carryOn}</div>
              </div>
            </div>

            <div className="bg-[#F8EFEA] border border-[#EED7CB] rounded-xl p-3 text-xs space-y-1.5">
              <div className="font-bold text-[#9C3828] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>特別安全規定（違者最高罰款10萬元）</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#69483E] leading-relaxed">
                {BAGGAGE_RULES.restrictions.map((res, i) => (
                  <li key={i}>{res}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. 住宿資訊 (Hotel Info) */}
      {activeTab === 'hotel' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* 典藏精選 5 大星級飯店規格 */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#2C2A29]">典藏精選 5 大星級飯店規格</h3>
                <p className="text-[11px] text-[#78716A]">奧捷湖區嚴選五星及歷史特色酒店詳細資訊與導航</p>
              </div>
              <span className="text-xs bg-[#EAE4DA] text-[#554D44] px-2.5 py-1 rounded-full font-medium">
                全館大廳皆有免費 WiFi
              </span>
            </div>

            <div className="space-y-3">
              {HOTELS_LIST.map((h) => (
                <div key={h.id} className="bg-[#F5F0E8] border border-[#E6E0D5] rounded-xl p-3 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#FAF8F5] bg-[#8C5D38] px-2 py-0.5 rounded">
                          {h.days}
                        </span>
                        <span className="text-[10px] font-bold text-[#8C5D38] bg-[#EAE2D5] px-2 py-0.5 rounded">
                          {h.city}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#242220] mt-1.5 flex items-center gap-1">
                        {h.name}
                        <span className="text-amber-600 text-xs">{'★'.repeat(h.stars)}</span>
                      </h4>
                      <p className="text-[11px] text-[#6E665D] font-mono mt-0.5">{h.dates}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`tel:${h.tel.replace(/\s/g, '')}`}
                        className="p-2 rounded-lg bg-[#E7DFD2] text-[#4A433A] hover:bg-[#DCD3C4] active:scale-95 transition-all"
                        title="撥打電話"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.navQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#45403D] active:scale-95 transition-all flex items-center gap-1"
                        title="Google 地圖導航"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#E3DCcf] space-y-1 text-[11px] text-[#554E46]">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[#877E74]">TEL:</span>
                      <span className="font-semibold text-[#2C2A29]">{h.tel}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#877E74] shrink-0">地址:</span>
                      <span className="leading-snug">{h.address}</span>
                    </div>
                  </div>

                  <div className="mt-2 bg-[#FAF8F5] p-2 rounded-lg border border-[#E9E4DC] text-[11px] text-[#554E46] space-y-0.5">
                    {h.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-1">
                        <span className="text-[#8C5D38]">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 歐洲住宿貼心須知 */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-[#2C2A29] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8C5D38]" />
              領隊住宿叮嚀小常識
            </h4>
            <div className="space-y-1.5 text-[11px] text-[#5A5248] leading-relaxed">
              <p>• <strong>床頭小費</strong>：歐洲地區每房以 1 歐元（EUR）計，置於床頭枕頭上。</p>
              <p>• <strong>水龍頭冷水生飲</strong>：捷克與奧地利冷水皆符合國家生飲標準，可直接裝取飲用；熱水為鍋爐水請勿生飲。</p>
              <p>• <strong>環保政策</strong>：飯店不保證提供個人牙刷、牙膏與拖鞋，敬請貴賓自備。</p>
              <p>• <strong>熱水鍋爐供應</strong>：歐洲老建築多採大型鍋爐加熱熱水，若遇同時間洗澡人多可能熱水稍弱，請稍後30分鐘待水溫回升即可。</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 緊急電話 (Emergency Contacts) */}
      {activeTab === 'emergency' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* LINE Group Join Card */}
          <LineGroupBannerCard />

          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C2A29] mb-1">隨團領隊與緊急聯絡網絡</h3>
            <p className="text-[11px] text-[#78716A] mb-3">若遇緊急狀況，可點擊按鈕直接撥號或複製電話</p>

            <div className="space-y-2.5">
              {EMERGENCY_CONTACTS.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border transition-all ${
                    item.important 
                      ? 'bg-[#FDF7F2] border-[#F2DACF]' 
                      : 'bg-[#F5F0E8] border-[#E6E0D5]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.important ? 'bg-[#F4D7CC] text-[#9E3922]' : 'bg-[#E7DFD2] text-[#554E46]'
                      }`}>
                        {item.role}
                      </span>
                      <div className="text-sm font-bold text-[#2C2A29] mt-1">{item.name}</div>
                      <div className="text-xs font-mono font-bold text-[#7E3825] mt-0.5">{item.displayPhone}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(item.phone, `phone-${idx}`)}
                        className="p-2 rounded-lg bg-[#FAF8F5] text-[#554E46] border border-[#E2DBD0] hover:bg-[#EBE5DA] active:scale-95 transition-all text-xs"
                        title="複製電話"
                      >
                        {copiedKey === `phone-${idx}` ? <Check className="w-3.5 h-3.5 text-[#2E6B45]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <a
                        href={`tel:${item.phone}`}
                        className="px-2.5 py-2 rounded-lg bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#47413D] active:scale-95 transition-all text-xs font-medium flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>撥打</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-[#696056] leading-relaxed">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 國際撥號教學 */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm text-xs space-y-2.5">
            <h4 className="font-bold text-[#2C2A29]">國際電話撥打方式教學</h4>
            
            <div className="space-y-2 text-[11px] text-[#554E46]">
              <div className="p-2.5 bg-[#F5F0E8] rounded-xl border border-[#E6E0D5]">
                <div className="font-bold text-[#3B342C]">由國外撥回台灣：</div>
                <p className="mt-0.5 leading-relaxed">{DIALING_GUIDE.fromAbroadToTaiwan}</p>
              </div>

              <div className="p-2.5 bg-[#F5F0E8] rounded-xl border border-[#E6E0D5]">
                <div className="font-bold text-[#3B342C]">由台灣撥往國外：</div>
                <p className="mt-0.5 leading-relaxed">{DIALING_GUIDE.fromTaiwanToAbroad}</p>
              </div>
            </div>

            {/* 國碼速查表 */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#6E6457] block mb-1.5">國際國碼速查</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {DIALING_GUIDE.codes.map((c, i) => (
                  <div key={i} className="bg-[#EFEAE2] p-2 rounded-lg flex items-center justify-between border border-[#E3DDD1]">
                    <span className="text-[#3E3933]">{c.country}</span>
                    <span className="text-[#783925] font-bold">+{c.countryCode}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 退稅指南 (Tax Refund) */}
      {activeTab === 'tax' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C2A29] mb-1">歐洲購物退稅規範 (TAX FREE)</h3>
            <p className="text-xs text-[#6B635A] leading-relaxed mb-3">
              {TAX_REFUND_RULES.summary}
            </p>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#7A6F62] uppercase tracking-wider block">各國最低退稅門檻金額</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TAX_REFUND_RULES.minAmounts.map((m, i) => (
                  <div key={i} className="p-2.5 bg-[#F4EFE7] border border-[#E6DFD3] rounded-xl text-xs">
                    <div className="font-bold text-[#3B352E]">{m.country}</div>
                    <div className="text-sm font-mono font-bold text-[#8C3A23] mt-0.5">{m.amount}</div>
                    <div className="text-[10px] text-[#7A7168] mt-0.5">{m.approxTwd}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 機場退稅步驟圖解流程 */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#2C2A29]">維也納機場退稅5部曲</h4>
            
            <div className="space-y-2.5">
              {TAX_REFUND_RULES.steps.map((s) => (
                <div key={s.step} className="flex items-start gap-3 p-2.5 bg-[#F7F3EB] rounded-xl border border-[#EAE3D6] text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#2C2A29] text-[#FAF8F5] flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <div className="font-bold text-[#2E2924]">{s.title}</div>
                    <p className="text-[11px] text-[#554E46] leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#FCF6EE] border border-[#ECD9C3] rounded-xl text-[11px] text-[#7D4518] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>至關重要：</strong>海關窗口蓋章（離境章）是退稅最核心步驟！未蓋海關章的退稅單寄回一律無法退款，請務必現場確認每張單據均已蓋妥清楚印章。
              </span>
            </div>

            {onNavigateToNotes && (
              <button
                onClick={onNavigateToNotes}
                className="mt-2 w-full py-2 px-3 rounded-xl bg-[#F4EFE7] hover:bg-[#EBE3D7] active:scale-[0.99] text-[#8C5D38] text-xs font-semibold flex items-center justify-between transition-all border border-[#E8DFCFC0]"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>管理我的伴手禮採購清單與各店退稅備忘</span>
                </span>
                <span className="text-[11px] font-mono">隨身筆記 →</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. 行前檢查表 (Packing Checklist) */}
      {activeTab === 'checklist' && (
        <div className="animate-in fade-in duration-200">
          <ChecklistView />
        </div>
      )}
    </div>
  );
};
