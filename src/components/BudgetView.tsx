import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Wallet, 
  Receipt, 
  PieChart, 
  ArrowRightLeft, 
  Check, 
  AlertCircle,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  Calculator
} from 'lucide-react';
import { ExpenseRecord } from '../types';
import { INITIAL_EXPENSES } from '../data/travelInfoData';
import { CurrencyConverterCard } from './CurrencyConverterCard';

export const BudgetView: React.FC = () => {
  // Stored expenses
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('aurora_austria_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EXPENSES;
      }
    }
    return INITIAL_EXPENSES;
  });

  // Exchange rates from storage or default
  const [rateEur, setRateEur] = useState<number>(() => {
    const saved = localStorage.getItem('aurora_rate_eur');
    return saved ? parseFloat(saved) || 35.20 : 35.20;
  });

  const [rateCzk, setRateCzk] = useState<number>(() => {
    const saved = localStorage.getItem('aurora_rate_czk');
    return saved ? parseFloat(saved) || 1.42 : 1.42;
  });

  // Form State for Adding Expense
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'CZK' as 'EUR' | 'CZK' | 'TWD',
    category: 'shopping' as 'food' | 'shopping' | 'transport' | 'ticket' | 'other',
    dayNumber: 2,
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('aurora_austria_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleRatesChange = (newEur: number, newCzk: number) => {
    setRateEur(newEur);
    setRateCzk(newCzk);
  };

  // Calculations
  const toTwd = (amount: number, currency: 'EUR' | 'CZK' | 'TWD') => {
    if (currency === 'TWD') return amount;
    if (currency === 'EUR') return amount * rateEur;
    if (currency === 'CZK') return amount * rateCzk;
    return amount;
  };

  const totalTwd = expenses.reduce((sum, item) => sum + toTwd(item.amount, item.currency), 0);
  const totalEur = totalTwd / rateEur;
  const totalCzk = totalTwd / rateCzk;

  // Category summary
  const categoryTotals: Record<string, number> = {
    food: 0,
    shopping: 0,
    transport: 0,
    ticket: 0,
    other: 0,
  };

  expenses.forEach(item => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + toTwd(item.amount, item.currency);
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formData.amount);
    if (!formData.title.trim() || isNaN(amt) || amt <= 0) return;

    // Automatic tax refund qualification check
    const isTaxRefundable = 
      (formData.currency === 'CZK' && amt >= 2001) ||
      (formData.currency === 'EUR' && amt >= 75.01);

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      dayNumber: Number(formData.dayNumber),
      date: `Day ${formData.dayNumber}`,
      title: formData.title.trim(),
      amount: amt,
      currency: formData.currency,
      category: formData.category,
      isTaxRefundable,
      notes: formData.notes.trim() || undefined,
    };

    setExpenses([newRecord, ...expenses]);
    setFormData({
      title: '',
      amount: '',
      currency: 'CZK',
      category: 'shopping',
      dayNumber: 2,
      notes: '',
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(x => x.id !== id));
  };

  const categoryLabels = {
    food: { label: '餐飲美食', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
    shopping: { label: '購物伴手禮', icon: '🛍️', color: 'bg-emerald-100 text-emerald-800' },
    transport: { label: '交通移動', icon: '🚊', color: 'bg-blue-100 text-blue-800' },
    ticket: { label: '門票體驗', icon: '🎟️', color: 'bg-amber-100 text-amber-800' },
    other: { label: '其他雜項', icon: '💳', color: 'bg-stone-100 text-stone-800' },
  };

  // Tax refund items count
  const refundableItems = expenses.filter(i => i.isTaxRefundable);

  return (
    <div id="budget-view-container" className="space-y-4 pb-20">
      {/* 1. 即時匯率換算器 (支援 EUR / CZK / TWD 互相換算與自訂參考匯率) */}
      <CurrencyConverterCard 
        initialEurRate={rateEur}
        initialCzkRate={rateCzk}
        onRatesChange={handleRatesChange}
      />

      {/* 2. Overview Totals Card */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-[#8C5D38]" />
            <h3 className="text-sm font-bold text-[#2C2A29]">旅遊累積支出總覽</h3>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#70665B] bg-[#EFE8DC] px-2 py-0.5 rounded-lg">
            <span>1€={rateEur.toFixed(1)}</span>
            <span>•</span>
            <span>1Kč={rateCzk.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Display */}
        <div className="mt-3.5 bg-[#F2EDE4] p-3.5 rounded-xl border border-[#E5DFD4]">
          <div className="text-xs text-[#7A7167]">折合新台幣約</div>
          <div className="text-2xl font-bold font-mono text-[#2C2A29] tracking-tight mt-0.5">
            NT$ {Math.round(totalTwd).toLocaleString()}
          </div>
          <div className="mt-2 pt-2 border-t border-[#E3DCD0] flex items-center justify-between text-xs font-mono text-[#5A5248]">
            <span>€ {totalEur.toFixed(1)} EUR</span>
            <span className="text-[#998F82]">|</span>
            <span>{Math.round(totalCzk).toLocaleString()} CZK</span>
            <span className="text-[#998F82]">|</span>
            <span>{expenses.length} 筆明細</span>
          </div>
        </div>

        {/* Tax Refund Alert Box */}
        {refundableItems.length > 0 && (
          <div className="mt-3 bg-[#EAF2ED] border border-[#CDE0D3] rounded-xl p-2.5 text-xs text-[#2A6E44] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2E7A49]" />
              <span>
                偵測到 <strong>{refundableItems.length} 筆</strong> 達退稅門檻消費！
              </span>
            </div>
            <span className="text-[10px] bg-[#D6EADB] px-2 py-0.5 rounded font-mono font-bold">
              記得索取退稅單
            </span>
          </div>
        )}

        {/* Add Record Trigger Button */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#433E3A] active:scale-[0.99] transition-all text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? '取消新增' : '記一筆花費'}</span>
        </button>
      </div>

      {/* Add Form Dropdown */}
      {isAdding && (
        <form 
          onSubmit={handleAddExpense}
          className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm text-xs space-y-3 animate-in fade-in"
        >
          <h4 className="font-bold text-[#2C2A29] text-sm">新增消費紀錄</h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-[#6E6458] block mb-1">消費幣別</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg p-2 font-mono font-bold text-[#2C2A29]"
              >
                <option value="CZK">CZK 捷克克朗</option>
                <option value="EUR">EUR 歐洲歐元</option>
                <option value="TWD">TWD 新台幣</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#6E6458] block mb-1">金額</label>
              <input
                type="number"
                step="any"
                required
                placeholder="例如: 2400"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg p-2 font-mono font-bold text-[#2C2A29]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#6E6458] block mb-1">項目名稱</label>
            <input
              type="text"
              required
              placeholder="例如: 菠丹妮死海泥皂、煙囪捲、熱咖啡"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg p-2 text-[#2C2A29]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-[#6E6458] block mb-1">消費類別</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg p-2 text-[#2C2A29]"
              >
                <option value="shopping">🛍️ 購物伴手禮</option>
                <option value="food">🍽️ 美食餐飲</option>
                <option value="ticket">🎟️ 門票活動</option>
                <option value="transport">🚊 交通車票</option>
                <option value="other">💳 其他雜費</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#6E6458] block mb-1">第幾天行程</label>
              <select
                value={formData.dayNumber}
                onChange={(e) => setFormData({ ...formData, dayNumber: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg p-2 font-mono text-[#2C2A29]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>Day {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#6E6458] block mb-1">備註說明 (選填)</label>
            <input
              type="text"
              placeholder="地點、退稅單編號或同行分帳備註"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg p-2 text-[#2C2A29]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 py-2 rounded-xl bg-[#EFE9E0] text-[#5A5146] font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#2C2A29] text-[#FAF8F5] font-semibold"
            >
              確認儲存
            </button>
          </div>
        </form>
      )}

      {/* Expense History List */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#2C2A29]">支出明細清單</h4>
          <span className="text-xs text-[#78716A] font-mono">{expenses.length} 筆記錄</span>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#8A8177]">
            尚無記帳記錄，點擊上方按鈕記錄第一筆旅費吧！
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((item) => {
              const cat = categoryLabels[item.category] || categoryLabels.other;
              const convertedTwd = Math.round(toTwd(item.amount, item.currency));

              return (
                <div 
                  key={item.id}
                  className="bg-[#F6F2EA] border border-[#E7E1D6] rounded-xl p-3 text-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-base shrink-0 mt-0.5">{cat.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#2C2A29] truncate">{item.title}</span>
                        {item.dayNumber && (
                          <span className="text-[10px] text-[#7A7167] bg-[#EAE3D6] px-1.5 py-0.2 rounded font-mono">
                            Day {item.dayNumber}
                          </span>
                        )}
                        {item.isTaxRefundable && (
                          <span className="text-[10px] text-[#256E42] bg-[#E0EFE5] border border-[#C6E2CD] px-1.5 py-0.2 rounded font-medium">
                            ✓ 達退稅額
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-[#6E665D] mt-0.5 truncate">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-[#2C2A29]">
                        {item.currency === 'EUR' ? '€' : ''}
                        {item.amount.toLocaleString()}{' '}
                        <span className="text-[10px] text-[#78716A]">{item.currency}</span>
                      </div>
                      <div className="text-[10px] text-[#8C8278] font-mono">
                        ≈ NT$ {convertedTwd.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-[#A69C90] hover:text-[#B53E2A] rounded-lg hover:bg-[#EAE4DA] transition-colors"
                      title="刪除記錄"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
