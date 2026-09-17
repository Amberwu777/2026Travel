import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Search, 
  X, 
  Filter, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  Zap, 
  Layers, 
  Shield, 
  HeartPulse, 
  Smile, 
  Gem, 
  UtensilsCrossed, 
  CalendarCheck, 
  Home, 
  AlertTriangle, 
  CheckSquare, 
  Square,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
} from 'lucide-react';
import { ChecklistItem, ChecklistCategory, ChecklistTiming } from '../types';
import { INITIAL_CHECKLIST, CHECKLIST_CATEGORIES, CategoryMeta } from '../data/checklistData';

const LOCAL_STORAGE_KEY = 'aurora_austria_checklist_v2';

const CATEGORY_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  FileText,
  CreditCard,
  Zap,
  Layers,
  Shield,
  HeartPulse,
  Sparkles,
  Smile,
  Gem,
  UtensilsCrossed,
  CalendarCheck,
  Home,
};

export const ChecklistView: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_CHECKLIST;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTiming, setSelectedTiming] = useState<string>('all');
  const [onlyUnchecked, setOnlyUnchecked] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Accordion state: set of category IDs that are collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Toggle single category collapse
  const toggleCategoryCollapse = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  // Collapse all or Expand all
  const collapseAll = () => {
    const all = new Set(CHECKLIST_CATEGORIES.map(c => c.id));
    setCollapsedCategories(all);
    showToast('已折疊所有分類卡片');
  };

  const expandAll = () => {
    setCollapsedCategories(new Set());
    showToast('已展開所有分類卡片');
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checklist));
  }, [checklist]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Toggle single item
  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Group check / uncheck
  const toggleCategoryGroup = (categoryName: string, shouldCheck: boolean) => {
    setChecklist(prev => prev.map(item => 
      item.category === categoryName ? { ...item, checked: shouldCheck } : item
    ));
    showToast(shouldCheck ? `已全選【${categoryName}】` : `已取消全選【${categoryName}】`);
  };

  // Reset to initial PDF defaults
  const resetToDefaults = () => {
    if (window.confirm('確定要將檢查表還原為檔案預設的勾選狀態嗎？')) {
      setChecklist(INITIAL_CHECKLIST);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CHECKLIST));
      showToast('已還原為出國檢查表檔案狀態');
    }
  };

  // Select all / Clear all
  const setAllItems = (checked: boolean) => {
    setChecklist(prev => prev.map(item => ({ ...item, checked })));
    showToast(checked ? '已全選所有檢查項目' : '已清除所有勾選項目');
  };

  // Stats
  const totalCount = checklist.length;
  const checkedCount = checklist.filter(item => item.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Timings list
  const timings: ChecklistTiming[] = ['出國前兩週', '出國前一週', '出國前一天', '出國當天'];

  // Filtered items
  const filteredList = useMemo(() => {
    return checklist.filter(item => {
      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Timing
      if (selectedTiming !== 'all' && item.timing !== selectedTiming) {
        return false;
      }
      // Unchecked
      if (onlyUnchecked && item.checked) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = item.text.toLowerCase().includes(q);
        const matchNote = (item.note || '').toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchTiming = item.timing.toLowerCase().includes(q);
        return matchText || matchNote || matchCat || matchTiming;
      }
      return true;
    });
  }, [checklist, selectedCategory, selectedTiming, onlyUnchecked, searchQuery]);

  // Group by category for structured layout
  const groupedCategories = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    filteredList.forEach(item => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });

    // Sort according to CHECKLIST_CATEGORIES order
    const ordered: { meta?: CategoryMeta; category: string; items: ChecklistItem[] }[] = [];
    CHECKLIST_CATEGORIES.forEach(meta => {
      if (map.has(meta.id)) {
        ordered.push({
          meta,
          category: meta.id,
          items: map.get(meta.id)!,
        });
        map.delete(meta.id);
      }
    });

    // Leftovers if any
    map.forEach((items, category) => {
      ordered.push({
        category,
        items,
      });
    });

    return ordered;
  }, [filteredList]);

  return (
    <div id="packing-checklist-view" className="space-y-4 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2C2A29] text-[#FAF8F5] text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-[#E8E3DA]/20 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#4BB543]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Stats & Progress Card */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#EDE5D8] text-[#6E5842]">
                出國檢查表
              </span>
              <span className="text-[10px] text-[#7A7167]">依時間點與大項完整分類</span>
            </div>
            <h3 className="text-base font-bold text-[#2C2A29] mt-1 font-['Zen_Old_Mincho',serif]">
              2026 奧捷行李整備清單
            </h3>
            <p className="text-[11px] text-[#6B635B] mt-0.5 leading-relaxed">
              共收錄 {totalCount} 項物品與準備事項，包含隨身包、電子電源、禦寒衣物與常備藥品。
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-mono font-bold text-[#2C2A29]">
              {checkedCount}
              <span className="text-xs font-normal text-[#8A8177]"> / {totalCount}</span>
            </div>
            <span className="text-[10px] text-[#70675D] font-mono block">
              完成率 {progressPercent}%
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#EAE4D9] h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#2E6B47] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Actions row: Reset, Check All, Clear All */}
        <div className="flex items-center justify-between pt-1 border-t border-[#EAE4D9] text-xs">
          <button
            onClick={resetToDefaults}
            className="text-[11px] text-[#70675D] hover:text-[#2C2A29] font-medium flex items-center gap-1 p-1 rounded hover:bg-[#EFE8DD] transition-all"
            title="還原為原檔案的打勾狀態"
          >
            <RotateCcw className="w-3 h-3" />
            <span>還原預設</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAllItems(true)}
              className="text-[11px] text-[#2E6B47] hover:bg-[#E8F3EB] px-2 py-0.5 rounded font-medium transition-all"
            >
              全選
            </button>
            <span className="text-[#D8D2C6]">|</span>
            <button
              onClick={() => setAllItems(false)}
              className="text-[11px] text-[#8C3A23] hover:bg-[#FCEEEA] px-2 py-0.5 rounded font-medium transition-all"
            >
              全部清除
            </button>
          </div>
        </div>
      </div>

      {/* Flight Safety & Customs Regulations Notice */}
      <div className="bg-[#FAF5EE] border border-[#EBDCC8] rounded-2xl p-3.5 text-xs text-[#7A4B1A] space-y-1.5 shadow-xs">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#6F3F10]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#A86418] shrink-0" />
          <span>航空安全與海關防呆提醒</span>
        </div>
        <ul className="text-[11px] space-y-1 leading-relaxed text-[#6E4822] pl-1">
          <li>
            • <strong>行動電源 & 鋰電池</strong>：<strong>嚴禁放行李箱託運！</strong>依長榮航空及國際航警法規，必須放入隨身手提包，每人限帶 2 顆（100Wh 以內）。
          </li>
          <li>
            • <strong>指甲剪、修眉剪與瑞士刀</strong>：必須放行李箱<strong>【託運】</strong>，隨身攜帶過安檢將直接被查扣。
          </li>
          <li>
            • <strong>液體規範</strong>：隨身液體每瓶需在 100ml 以內，裝入 1 公升透明密封夾鏈袋；其餘大瓶保養品請妥善包裹放託運行李。
          </li>
          <li>
            • <strong>泡麵食物</strong>：歐洲海關嚴查肉類製品，攜帶泡麵請確認<strong>不含未高溫滅菌之實體肉塊</strong>，避免受罰。
          </li>
        </ul>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-3.5 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C8276] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋物品名稱、備註（如：行動電源、泡麵、護照、轉接頭）..."
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

        {/* Execution Timing Filter (時程篩選) */}
        <div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#6D6357] mb-1.5">
            <Clock className="w-3 h-3 text-[#8C5D38]" />
            <span>執行時間點篩選</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <button
              onClick={() => setSelectedTiming('all')}
              className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
                selectedTiming === 'all'
                  ? 'bg-[#2C2A29] text-[#FAF8F5]'
                  : 'bg-[#EDE7DE] text-[#61574C] hover:bg-[#E2DAD0]'
              }`}
            >
              全部
            </button>
            {timings.map(timing => (
              <button
                key={timing}
                onClick={() => setSelectedTiming(timing)}
                className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
                  selectedTiming === timing
                    ? 'bg-[#2C2A29] text-[#FAF8F5]'
                    : 'bg-[#EDE7DE] text-[#61574C] hover:bg-[#E2DAD0]'
                }`}
              >
                {timing}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills (大項篩選) */}
        <div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#6D6357] mb-1.5">
            <Filter className="w-3 h-3 text-[#8C5D38]" />
            <span>大項分類快速切換</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#524B43] text-[#FAF8F5]'
                  : 'bg-[#EDE7DE] text-[#61574C] hover:bg-[#E2DAD0]'
              }`}
            >
              全部 ({totalCount})
            </button>
            {CHECKLIST_CATEGORIES.map(cat => {
              const count = checklist.filter(c => c.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#524B43] text-[#FAF8F5]'
                      : 'bg-[#EDE7DE] text-[#61574C] hover:bg-[#E2DAD0]'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle only unchecked & Collapse / Expand All controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EDE7DD] text-[11px] text-[#696155]">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyUnchecked}
              onChange={(e) => setOnlyUnchecked(e.target.checked)}
              className="rounded border-[#C5BDB0] text-[#2C2A29] focus:ring-0"
            />
            <span>僅顯示尚未準備完成之品項</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[#807669] text-[10px]">
              共 {filteredList.length} 項
            </span>
            <div className="flex items-center border border-[#E2DDD3] rounded-lg overflow-hidden bg-[#FAF7F2]">
              <button
                type="button"
                onClick={expandAll}
                className="px-2 py-0.5 text-[10px] text-[#554E44] hover:bg-[#EAE4D9] transition-colors"
                title="全部展開"
              >
                全部展開
              </button>
              <div className="w-[1px] h-3 bg-[#E2DDD3]"></div>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2 py-0.5 text-[10px] text-[#554E44] hover:bg-[#EAE4D9] transition-colors"
                title="全部收合"
              >
                全部收合
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Category Sections */}
      <div className="space-y-3">
        {groupedCategories.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-8 text-center text-xs text-[#8A8177]">
            無符合搜尋或篩選條件的檢查項目，請調整關鍵字。
          </div>
        ) : (
          groupedCategories.map(({ meta, category, items }) => {
            const groupChecked = items.filter(i => i.checked).length;
            const isAllGroupChecked = items.length > 0 && groupChecked === items.length;
            const IconComponent = (meta && CATEGORY_ICON_MAP[meta.iconName]) || Sparkles;
            const isCollapsed = collapsedCategories.has(category);

            return (
              <section
                key={category}
                id={`checklist-group-${category}`}
                className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl shadow-sm transition-all overflow-hidden"
              >
                {/* Group Header (Click anywhere or on the toggle button to open/close) */}
                <div className="p-3.5 flex items-center justify-between gap-2 bg-[#FAF8F5] hover:bg-[#F6F2EB] transition-colors cursor-pointer select-none">
                  <div 
                    onClick={() => toggleCategoryCollapse(category)}
                    className="flex items-center gap-2.5 min-w-0 flex-1"
                  >
                    <div 
                      className="p-2 rounded-xl shrink-0"
                      style={{ 
                        backgroundColor: meta?.bgLight || '#F2ECE1',
                        color: meta?.color || '#2C2A29'
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-[#2C2A29]">
                          {meta?.label || category}
                        </h4>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                          isAllGroupChecked 
                            ? 'bg-[#E5EFE7] text-[#2E683E]' 
                            : 'bg-[#EFE9DF] text-[#70675D]'
                        }`}>
                          {groupChecked}/{items.length} 完成
                        </span>
                      </div>
                      {meta?.description && (
                        <p className="text-[10px] text-[#78716A] truncate mt-0.5">
                          {meta.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Group bulk toggle + Accordion toggle arrow */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleCategoryGroup(category, !isAllGroupChecked)}
                      className="text-[11px] font-medium px-2 py-1 rounded-lg bg-[#EFE8DD] text-[#554E46] hover:bg-[#E3DCcf] active:scale-95 transition-all"
                    >
                      {isAllGroupChecked ? '取消全選' : '一鍵全選'}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCategoryCollapse(category)}
                      className="p-1.5 rounded-lg text-[#6E6457] hover:bg-[#EBE4D8] transition-colors"
                      title={isCollapsed ? '展開卡片' : '收合卡片'}
                      aria-label={isCollapsed ? '展開' : '收合'}
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Items in this category (Collapsible body) */}
                {!isCollapsed && (
                  <div className="p-3.5 pt-0 border-t border-[#EFE9DF] space-y-1.5 bg-[#FCFAF7]/50 animate-in fade-in duration-150">
                    <div className="pt-2 space-y-1.5">
                      {items.map((item) => (
                        <label
                          key={item.id}
                          id={`item-${item.id}`}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                            item.checked
                              ? 'bg-[#F2ECE1]/50 border-[#E8E1D5] opacity-75'
                              : 'bg-[#FCFAF7] border-[#ECE5DB] hover:bg-[#F5EFE5]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                            className="mt-0.5 rounded border-[#C8BFB2] text-[#2C2A29] focus:ring-0 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-xs leading-snug font-medium ${
                                  item.checked
                                    ? 'line-through text-[#8A8277]'
                                    : 'text-[#2C2A29]'
                                }`}
                              >
                                {item.text}
                              </span>

                              {item.important && (
                                <span className="text-[10px] text-[#A0351D] bg-[#FDECE8] px-1.5 py-0.2 rounded font-bold shrink-0">
                                  必備
                                </span>
                              )}

                              <span className="text-[9px] text-[#80766B] bg-[#EFE9DF] px-1.5 py-0.2 rounded font-mono shrink-0">
                                {item.timing}
                              </span>
                            </div>

                            {item.note && (
                              <p className="text-[11px] text-[#786E64] mt-1 leading-relaxed pl-0.5">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
