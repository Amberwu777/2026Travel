import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  Coins, 
  TrendingUp, 
  Check, 
  Sparkles, 
  Info,
  Sliders,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Landmark
} from 'lucide-react';

export interface CurrencyConverterProps {
  initialEurRate?: number;
  initialCzkRate?: number;
  onRatesChange?: (eurRate: number, czkRate: number) => void;
}

// Default benchmark reference rates
const BENCHMARK_RATES = {
  EUR: 35.20,
  CZK: 1.42,
  CZK_TO_EUR: 24.78, // 1 EUR ≈ 24.78 CZK
  lastUpdated: '2026/09/16 台灣銀行 / 歐央行即時現鈔與現金賣出參考價'
};

export const CurrencyConverterCard: React.FC<CurrencyConverterProps> = ({
  initialEurRate = 35.20,
  initialCzkRate = 1.42,
  onRatesChange
}) => {
  // Rates state
  const [eurRate, setEurRate] = useState<number>(() => {
    const saved = localStorage.getItem('aurora_rate_eur');
    return saved ? parseFloat(saved) || initialEurRate : initialEurRate;
  });

  const [czkRate, setCzkRate] = useState<number>(() => {
    const saved = localStorage.getItem('aurora_rate_czk');
    return saved ? parseFloat(saved) || initialCzkRate : initialCzkRate;
  });

  // Source input state
  const [sourceCurrency, setSourceCurrency] = useState<'EUR' | 'CZK' | 'TWD'>('CZK');
  const [inputAmount, setInputAmount] = useState<string>('500');
  const [showCustomRates, setShowCustomRates] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  // Sync rates to localStorage and notify parent
  useEffect(() => {
    localStorage.setItem('aurora_rate_eur', eurRate.toString());
    localStorage.setItem('aurora_rate_czk', czkRate.toString());
    if (onRatesChange) {
      onRatesChange(eurRate, czkRate);
    }
  }, [eurRate, czkRate, onRatesChange]);

  const numAmount = parseFloat(inputAmount) || 0;

  // Conversions
  let twdResult = 0;
  let eurResult = 0;
  let czkResult = 0;

  if (sourceCurrency === 'EUR') {
    eurResult = numAmount;
    twdResult = numAmount * eurRate;
    czkResult = czkRate > 0 ? (numAmount * eurRate) / czkRate : 0;
  } else if (sourceCurrency === 'CZK') {
    czkResult = numAmount;
    twdResult = numAmount * czkRate;
    eurResult = eurRate > 0 ? (numAmount * czkRate) / eurRate : 0;
  } else {
    // TWD
    twdResult = numAmount;
    eurResult = eurRate > 0 ? numAmount / eurRate : 0;
    czkResult = czkRate > 0 ? numAmount / czkRate : 0;
  }

  // Preset quick chips based on selected currency (including 10 and 20)
  const quickChips = sourceCurrency === 'CZK' 
    ? [10, 20, 50, 100, 250, 500, 1000, 2001] // 2001 is tax refund threshold
    : sourceCurrency === 'EUR'
    ? [5, 10, 20, 50, 75.01, 100] // 75.01 is tax refund threshold
    : [10, 20, 100, 500, 1000, 3000, 5000];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(key);
      setTimeout(() => setIsCopied(null), 2000);
    });
  };

  const resetToBenchmark = () => {
    setEurRate(BENCHMARK_RATES.EUR);
    setCzkRate(BENCHMARK_RATES.CZK);
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#EBE4D8] text-[#8C5D38]">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2C2A29] flex items-center gap-1.5 flex-wrap">
              <span>即時外幣匯率試算</span>
              <span className="text-[10px] bg-[#E7E0D2] text-[#695F54] px-1.5 py-0.2 rounded font-mono">
                EUR ． CZK ． TWD
              </span>
            </h3>
            <p className="text-[11px] text-[#78716A]">歐元、捷克克朗與新台幣三向快速換算</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Bank of Taiwan Official Rates Link */}
          <a
            href="https://rate.bot.com.tw/xrt?Lang=zh-TW"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EAE3D6] text-[#4F463D] hover:bg-[#DDD4C5] active:scale-95 transition-all flex items-center gap-1 shrink-0"
            title="開啟台灣銀行即時牌告匯率網站"
          >
            <Landmark className="w-3 h-3 text-[#8C5D38]" />
            <span>台銀牌告</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <button
            type="button"
            onClick={() => setShowCustomRates(!showCustomRates)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all shrink-0 ${
              showCustomRates 
                ? 'bg-[#2C2A29] text-[#FAF8F5]' 
                : 'bg-[#EFE8DD] text-[#554E46] hover:bg-[#E3DCcf]'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{showCustomRates ? '收合匯率' : '調整匯率'}</span>
            {showCustomRates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Currency Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F0EBE1] rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setSourceCurrency('CZK');
            if (sourceCurrency === 'EUR') setInputAmount('500');
            else if (sourceCurrency === 'TWD') setInputAmount('500');
          }}
          className={`py-2 rounded-lg transition-all flex flex-col items-center justify-center ${
            sourceCurrency === 'CZK'
              ? 'bg-[#FAF8F5] text-[#2C2A29] shadow-sm font-bold'
              : 'text-[#696055] hover:text-[#2C2A29]'
          }`}
        >
          <span className="text-xs">捷克克朗 CZK</span>
          <span className="text-[10px] font-mono opacity-70">1 Kč ≈ NT${czkRate.toFixed(2)}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSourceCurrency('EUR');
            if (sourceCurrency === 'CZK') setInputAmount('20');
            else if (sourceCurrency === 'TWD') setInputAmount('50');
          }}
          className={`py-2 rounded-lg transition-all flex flex-col items-center justify-center ${
            sourceCurrency === 'EUR'
              ? 'bg-[#FAF8F5] text-[#2C2A29] shadow-sm font-bold'
              : 'text-[#696055] hover:text-[#2C2A29]'
          }`}
        >
          <span className="text-xs">歐元 EUR</span>
          <span className="text-[10px] font-mono opacity-70">1 € ≈ NT${eurRate.toFixed(2)}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSourceCurrency('TWD');
            if (inputAmount === '20' || inputAmount === '500') setInputAmount('1000');
          }}
          className={`py-2 rounded-lg transition-all flex flex-col items-center justify-center ${
            sourceCurrency === 'TWD'
              ? 'bg-[#FAF8F5] text-[#2C2A29] shadow-sm font-bold'
              : 'text-[#696055] hover:text-[#2C2A29]'
          }`}
        >
          <span className="text-xs">新台幣 TWD</span>
          <span className="text-[10px] font-mono opacity-70">台幣原幣試算</span>
        </button>
      </div>

      {/* Input Field & Quick Chips */}
      <div className="bg-[#FCFAF7] border border-[#E8E1D5] rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#70665B]">
          <label className="font-medium">
            輸入欲換算之 {sourceCurrency === 'CZK' ? '捷克克朗 (CZK)' : sourceCurrency === 'EUR' ? '歐元 (EUR)' : '新台幣 (TWD)'} 金額：
          </label>
          <span className="font-mono text-[11px] text-[#8C8074]">
            {sourceCurrency === 'CZK' ? 'Kč' : sourceCurrency === 'EUR' ? '€' : 'NT$'}
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="number"
            inputMode="decimal"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="請輸入金額"
            className="w-full bg-[#FFFFFF] border border-[#D5CDC0] focus:border-[#2C2A29] focus:ring-0 rounded-xl py-2.5 px-3 text-lg font-mono font-bold text-[#2C2A29] outline-none transition-all pr-16"
          />
          <span className="absolute right-3 font-bold font-mono text-xs text-[#80766B] pointer-events-none">
            {sourceCurrency}
          </span>
        </div>

        {/* Quick Amount Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] text-[#8C8175] shrink-0">常用額度:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setInputAmount(chip.toString())}
              className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border transition-all shrink-0 ${
                inputAmount === chip.toString()
                  ? 'bg-[#2C2A29] text-[#FAF8F5] border-[#2C2A29]'
                  : 'bg-[#F2ECE1] text-[#554E46] border-[#E5DECة] hover:bg-[#E7DFCة]'
              }`}
            >
              {sourceCurrency === 'EUR' ? `€${chip}` : sourceCurrency === 'CZK' ? `${chip} Kč` : `$${chip}`}
              {chip === 2001 && sourceCurrency === 'CZK' && ' (退稅門檻)'}
              {chip === 75.01 && sourceCurrency === 'EUR' && ' (退稅門檻)'}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Output Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Main Target: TWD */}
        <div 
          onClick={() => handleCopy(Math.round(twdResult).toString(), 'twd')}
          className="p-3.5 rounded-xl bg-[#F4EFE7] border border-[#E3DCD0] flex items-center justify-between cursor-pointer hover:bg-[#EEE7DC] transition-colors"
          title="點擊複製新台幣金額"
        >
          <div>
            <div className="text-[11px] text-[#7A7165] font-medium flex items-center gap-1">
              <span>折合新台幣 (TWD)</span>
              {isCopied === 'twd' && <span className="text-[10px] text-[#2E6B45]">✓ 已複製</span>}
            </div>
            <div className="text-xl font-mono font-bold text-[#2C2A29] tracking-tight mt-0.5">
              NT$ {Math.round(twdResult).toLocaleString()}
            </div>
            <div className="text-[10px] text-[#8C8276] font-mono mt-0.5">
              {sourceCurrency === 'CZK' 
                ? `${numAmount} × ${czkRate} (匯率)` 
                : sourceCurrency === 'EUR'
                ? `${numAmount} × ${eurRate} (匯率)`
                : '基準幣值'}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-[#8C5D38] bg-[#EAE2D5] px-2 py-1 rounded-lg">
              TWD 新台幣
            </span>
          </div>
        </div>

        {/* Counterpart Foreign Currency */}
        <div 
          onClick={() => {
            const val = sourceCurrency === 'CZK' ? eurResult.toFixed(2) : Math.round(czkResult).toString();
            handleCopy(val, 'cross');
          }}
          className="p-3.5 rounded-xl bg-[#F4EFE7] border border-[#E3DCD0] flex items-center justify-between cursor-pointer hover:bg-[#EEE7DC] transition-colors"
          title="點擊複製交叉換算金額"
        >
          <div>
            <div className="text-[11px] text-[#7A7165] font-medium flex items-center gap-1">
              <span>
                {sourceCurrency === 'CZK' ? '歐元跨幣換算 (EUR)' : sourceCurrency === 'EUR' ? '克朗跨幣換算 (CZK)' : '折合外幣參考'}
              </span>
              {isCopied === 'cross' && <span className="text-[10px] text-[#2E6B45]">✓ 已複製</span>}
            </div>
            <div className="text-xl font-mono font-bold text-[#2C2A29] tracking-tight mt-0.5">
              {sourceCurrency === 'CZK' ? (
                <>€ {eurResult.toFixed(2)}</>
              ) : sourceCurrency === 'EUR' ? (
                <>{Math.round(czkResult).toLocaleString()} Kč</>
              ) : (
                <>€ {eurResult.toFixed(1)} / {Math.round(czkResult)} Kč</>
              )}
            </div>
            <div className="text-[10px] text-[#8C8276] font-mono mt-0.5">
              {sourceCurrency === 'CZK' ? (
                `1 EUR ≈ ${(eurRate / (czkRate || 1)).toFixed(2)} CZK`
              ) : sourceCurrency === 'EUR' ? (
                `1 EUR ≈ ${(eurRate / (czkRate || 1)).toFixed(2)} CZK`
              ) : (
                `依當前自訂參考價換算`
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-[#4B6B82] bg-[#E0EBF0] px-2 py-1 rounded-lg">
              {sourceCurrency === 'CZK' ? 'EUR 歐元' : sourceCurrency === 'EUR' ? 'CZK 克朗' : 'EUR / CZK'}
            </span>
          </div>
        </div>
      </div>

      {/* Tax Refund Quick Notice if qualifies */}
      {((sourceCurrency === 'CZK' && numAmount >= 2001) || (sourceCurrency === 'EUR' && numAmount >= 75.01)) && (
        <div className="bg-[#E9F3EC] border border-[#C5E2CD] rounded-xl p-2.5 text-xs text-[#28663E] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#2E7A49] shrink-0" />
            <span>
              <strong>恭喜！此金額已達到退稅門檻</strong>
              {sourceCurrency === 'CZK' ? '（捷克單筆滿 2,001 CZK）' : '（奧地利單筆滿 75.01 EUR）'}
            </span>
          </div>
          <span className="text-[10px] bg-[#D4EADB] px-2 py-0.5 rounded font-mono font-bold shrink-0">
            記得向店員索取退稅單
          </span>
        </div>
      )}

      {/* Expandable Rate Customization Settings */}
      {showCustomRates && (
        <div className="p-3.5 bg-[#F2EDE4] border border-[#E3DCD0] rounded-xl text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="font-bold text-[#3B352D] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#8C5D38]" />
              <span>自訂當日參考匯率（對新台幣 TWD）</span>
            </div>
            <button
              type="button"
              onClick={resetToBenchmark}
              className="text-[10px] text-[#736A5E] hover:text-[#2C2A29] flex items-center gap-1 px-2 py-0.5 rounded bg-[#E4DDD1] transition-colors"
              title="還原為台灣銀行基準參考價"
            >
              <RefreshCw className="w-3 h-3" />
              <span>還原基準價</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* EUR Rate Input */}
            <div className="space-y-1">
              <label className="text-[11px] text-[#696155] font-medium block">
                1 歐元 (EUR) =
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.05"
                  value={eurRate}
                  onChange={(e) => setEurRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FFFFFF] border border-[#D5CDC0] focus:border-[#2C2A29] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#2C2A29] outline-none"
                />
                <span className="text-[11px] text-[#696156] font-mono font-semibold shrink-0">TWD</span>
              </div>
              <span className="text-[9px] text-[#8C8074] block">
                基準參考：約 35.20 TWD
              </span>
            </div>

            {/* CZK Rate Input */}
            <div className="space-y-1">
              <label className="text-[11px] text-[#696155] font-medium block">
                1 捷克克朗 (CZK) =
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  value={czkRate}
                  onChange={(e) => setCzkRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FFFFFF] border border-[#D5CDC0] focus:border-[#2C2A29] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#2C2A29] outline-none"
                />
                <span className="text-[11px] text-[#696156] font-mono font-semibold shrink-0">TWD</span>
              </div>
              <span className="text-[9px] text-[#8C8074] block">
                基準參考：約 1.42 TWD
              </span>
            </div>
          </div>

          {/* Quick Info & BOT Link */}
          <div className="pt-2 border-t border-[#DED7CB] text-[10px] text-[#7A7165] space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3 text-[#8C5D38] shrink-0" />
                <span>修改後匯率自動儲存，並同步套用於旅遊記帳總額換算。</span>
              </div>
              <a
                href="https://rate.bot.com.tw/xrt?Lang=zh-TW"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C5D38] hover:text-[#5E3E24] font-medium flex items-center gap-0.5 underline underline-offset-2 shrink-0"
              >
                <span>查閱台灣銀行即時牌告匯率表</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[#968D81] leading-relaxed">
              * 基準參考來源：台灣銀行（BOT）牌告現鈔與即期賣出均價、歐洲中央銀行（ECB）參考匯率。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
