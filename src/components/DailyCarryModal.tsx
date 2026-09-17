import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Share2, 
  CheckSquare, 
  Square, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  ShieldAlert,
  Footprints,
  Church,
  ShoppingBag,
  Plane,
  Ship,
  ThermometerSnowflake,
  Utensils,
  Landmark
} from 'lucide-react';
import { DAILY_CARRY_PLANS } from '../data/dailyCarryData';
import { ActivityTagType, DailyCarryItem } from '../types';

interface DailyCarryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  onSelectDay?: (day: number) => void;
}

const getActivityBadge = (type: ActivityTagType, label: string) => {
  switch (type) {
    case 'church':
      return {
        icon: Church,
        bg: 'bg-[#F2ECE4] text-[#8C5D38] border-[#E5DACE]',
        label: `⛪ ${label}`,
      };
    case 'hiking':
      return {
        icon: Footprints,
        bg: 'bg-[#EAF3EC] text-[#2C6B43] border-[#CDE5D3]',
        label: `🌲 ${label}`,
      };
    case 'cave':
      return {
        icon: ThermometerSnowflake,
        bg: 'bg-[#EBF1F8] text-[#1E5785] border-[#CBDDF0]',
        label: `❄️ ${label}`,
      };
    case 'boat':
      return {
        icon: Ship,
        bg: 'bg-[#E8F4F8] text-[#186481] border-[#C8E4EE]',
        label: `🚢 ${label}`,
      };
    case 'shopping':
      return {
        icon: ShoppingBag,
        bg: 'bg-[#FAF0E6] text-[#9E5D2A] border-[#F0DBC7]',
        label: `🛍️ ${label}`,
      };
    case 'flight':
      return {
        icon: Plane,
        bg: 'bg-[#EFEBF4] text-[#5C3E8A] border-[#DCD3E8]',
        label: `✈️ ${label}`,
      };
    case 'dining':
      return {
        icon: Utensils,
        bg: 'bg-[#FDF2E8] text-[#9A5722] border-[#F6DECA]',
        label: `🍽️ ${label}`,
      };
    case 'palace':
    default:
      return {
        icon: Landmark,
        bg: 'bg-[#F5EFE8] text-[#694D33] border-[#E8DC CE]',
        label: `🏛️ ${label}`,
      };
  }
};

const getCategoryBadge = (category: DailyCarryItem['category']) => {
  switch (category) {
    case 'essential':
      return { label: '必備證件', color: 'bg-[#FBEBE8] text-[#BA3C28] border-[#F6D0C8]' };
    case 'outfit':
      return { label: '衣著裝備', color: 'bg-[#EEF3EB] text-[#2F6B42] border-[#D4E4CE]' };
    case 'activity':
      return { label: '活動專用', color: 'bg-[#EFF3F8] text-[#255E88] border-[#CFDFEE]' };
    case 'convenience':
    default:
      return { label: '實用便利', color: 'bg-[#F5F0E8] text-[#7A6145] border-[#E7DDCE]' };
  }
};

export const DailyCarryModal: React.FC<DailyCarryModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  onSelectDay,
}) => {
  const [currentDay, setCurrentDay] = useState(dayNumber);
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Sync internal day with prop when opened
  useEffect(() => {
    setCurrentDay(dayNumber);
  }, [dayNumber, isOpen]);

  // Load checked items from LocalStorage for current day
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem(`daily_carry_day_${currentDay}`);
      if (stored) {
        setCheckedItemIds(JSON.parse(stored));
      } else {
        setCheckedItemIds([]);
      }
    } catch {
      setCheckedItemIds([]);
    }
  }, [currentDay, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const plan = DAILY_CARRY_PLANS[currentDay] || DAILY_CARRY_PLANS[1];
  const items = plan.items || [];
  const checkedCount = items.filter(it => checkedItemIds.includes(it.id)).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const isAllChecked = totalCount > 0 && checkedCount === totalCount;

  const toggleItem = (id: string) => {
    const next = checkedItemIds.includes(id)
      ? checkedItemIds.filter(i => i !== id)
      : [...checkedItemIds, id];
    setCheckedItemIds(next);
    try {
      localStorage.setItem(`daily_carry_day_${currentDay}`, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    setCheckedItemIds([]);
    try {
      localStorage.removeItem(`daily_carry_day_${currentDay}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckAll = () => {
    const allIds = items.map(it => it.id);
    setCheckedItemIds(allIds);
    try {
      localStorage.setItem(`daily_carry_day_${currentDay}`, JSON.stringify(allIds));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyList = async () => {
    const lines = [
      `🎒【奧捷 12 日】DAY ${plan.dayNumber} 每日必帶清單`,
      `📅 日期：${plan.date}`,
      `📍 行程：${plan.themeTitle}`,
      `💡 活動要點：${plan.summaryHint}`,
      '',
      '【隨身攜帶清單】',
      ...items.map((it, idx) => {
        const isChecked = checkedItemIds.includes(it.id);
        const mark = isChecked ? '✅' : '⬜';
        const mustTag = it.isMustHave ? '【必帶】' : '';
        return `${idx + 1}. ${mark} ${it.name} ${mustTag}\n   ↳ 原因：${it.reason}`;
      }),
      '',
      `進度：${checkedCount}/${totalCount} 件 (${progressPercent}%)`,
      '出門前記得隨手核對，祝今日旅途平安順心！✨',
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 1) {
      const nextDay = currentDay - 1;
      setCurrentDay(nextDay);
      onSelectDay?.(nextDay);
    }
  };

  const handleNextDay = () => {
    if (currentDay < 12) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      onSelectDay?.(nextDay);
    }
  };

  return (
    <div 
      id="daily-carry-modal-overlay"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="daily-carry-modal-container"
        className="bg-[#FAF8F5] w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E8E2D6] animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#FAF8F5] border-b border-[#E8E2D6] px-4 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#2C2A29] text-[#FAF8F5] flex items-center justify-center text-xs font-mono font-bold shadow-xs">
              D{plan.dayNumber}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#2C2A29] leading-tight">
                  每日必帶物品
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#786D61] font-mono">
                  {plan.date}
                </span>
              </div>
              <p className="text-[11px] text-[#786D61] truncate max-w-[210px] sm:max-w-xs">
                {plan.themeTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyList}
              title="複製今日隨身清單至剪貼簿"
              className="p-2 rounded-xl bg-[#F0EBE1] hover:bg-[#E5DFD4] text-[#4A433A] text-xs font-medium transition-colors flex items-center gap-1 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E6B45]" />
                  <span className="text-[11px] text-[#2E6B45] font-bold">已複製</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#8C5D38]" />
                  <span className="text-[11px] text-[#8C5D38]">分享</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#786D61] hover:bg-[#EAE4D9] hover:text-[#2C2A29] transition-colors"
              aria-label="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Switcher Pill Bar */}
        <div className="px-4 py-2 bg-[#F3EFE9] border-b border-[#E8E2D6] flex items-center justify-between">
          <button
            onClick={handlePrevDay}
            disabled={currentDay <= 1}
            className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg transition-all ${
              currentDay <= 1 
                ? 'opacity-30 cursor-not-allowed text-[#9E958A]' 
                : 'text-[#4A433A] hover:bg-[#E8E1D5]'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>前一天</span>
          </button>

          <span className="text-xs font-semibold text-[#5A5045]">
            第 {currentDay} 天 / 共 12 天
          </span>

          <button
            onClick={handleNextDay}
            disabled={currentDay >= 12}
            className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg transition-all ${
              currentDay >= 12 
                ? 'opacity-30 cursor-not-allowed text-[#9E958A]' 
                : 'text-[#4A433A] hover:bg-[#E8E1D5]'
            }`}
          >
            <span>後一天</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5">
          {/* Activity Tags Banner */}
          <div className="bg-[#FFFFFF] border border-[#E8E2D6] p-3 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-[#7A6E62] flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C5D38]" />
              <span>今日行程活動重點推薦</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {plan.activities.map((act, i) => {
                const badge = getActivityBadge(act.type, act.label);
                return (
                  <span
                    key={i}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1 shadow-2xs ${badge.bg}`}
                  >
                    <span>{badge.label}</span>
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-[#52493F] leading-relaxed bg-[#F8F5F0] p-2.5 rounded-xl border border-[#ECE5DA]">
              💡 <strong>行前重點：</strong>{plan.summaryHint}
            </p>
          </div>

          {/* Checklist Progress Bar */}
          <div className="bg-[#FFFFFF] border border-[#E8E2D6] p-3 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#2C2A29]">
                隨身準備進度
              </span>
              <span className="font-mono font-bold text-[#8C5D38]">
                {checkedCount} / {totalCount} 件 ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-[#EFE9DF] h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  isAllChecked ? 'bg-[#2E6B45]' : 'bg-[#8C5D38]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {isAllChecked && (
              <div className="mt-2 text-center text-xs font-semibold text-[#2E6B45] bg-[#EAF5EE] py-1 px-2 rounded-lg border border-[#CDE5D3] animate-in fade-in">
                ✨ 太棒了！今日出門隨身物品已全數確認齊全，安心出發！
              </div>
            )}
          </div>

          {/* Action Quick Buttons */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#84796E]">
              點擊項目即可打勾核對
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckAll}
                className="text-[#8C5D38] hover:underline font-medium"
              >
                全部打勾
              </button>
              <span className="text-[#D3CBBF]">•</span>
              <button
                onClick={handleReset}
                className="text-[#877E73] hover:text-[#4A433A] flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重設</span>
              </button>
            </div>
          </div>

          {/* Carry Items List */}
          <div className="space-y-2">
            {items.map((item) => {
              const isChecked = checkedItemIds.includes(item.id);
              const catBadge = getCategoryBadge(item.category);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                    isChecked
                      ? 'bg-[#F5F2ED]/70 border-[#E2DDD3] opacity-75'
                      : item.isMustHave
                      ? 'bg-[#FFFFFF] border-[#E8D4C8] hover:border-[#D6B5A0] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E8E2D6] hover:border-[#D3CBBF] shadow-2xs'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isChecked ? (
                      <div className="w-5 h-5 rounded-md bg-[#2E6B45] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-[#C7BEB2] bg-white flex items-center justify-center hover:border-[#8C5D38] transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold ${isChecked ? 'line-through text-[#847B71]' : 'text-[#2C2A29]'}`}>
                        {item.name}
                      </span>
                      {item.isMustHave && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#BA3C28] text-white">
                          必帶
                        </span>
                      )}
                      <span className={`text-[9.5px] px-1.5 py-0.5 rounded border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>
                    </div>

                    <p className={`text-[11px] mt-1 leading-relaxed ${isChecked ? 'text-[#9A9187]' : 'text-[#61574C]'}`}>
                      ↳ <span className="font-medium text-[#7D4D28]">原因：</span>{item.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice footer inside scroll */}
          <div className="bg-[#FAF4ED] border border-[#E9DECF] p-3 rounded-xl text-[11px] text-[#7A5531] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#9E5D2A] mt-0.5" />
            <span>
              <strong>溫馨提醒：</strong>護照、歐元/克朗現金與貴重物品請放胸前隨身包或貼身防搶袋，切勿置於雙肩後背包外袋，尤其在查理大橋、廣場等人潮密集景點。
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FAF8F5] border-t border-[#E8E2D6] px-4 py-3 flex items-center justify-between gap-2">
          <button
            onClick={handleCopyList}
            className="py-2 px-3 rounded-xl border border-[#DACFBF] bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#4A433A] text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-[#8C5D38]" />
            <span>{copied ? '已複製到剪貼簿' : '一鍵複製清單'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1918] text-[#FAF8F5] text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            完成核對
          </button>
        </div>
      </div>
    </div>
  );
};
