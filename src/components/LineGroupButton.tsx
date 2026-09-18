import React from 'react';
import { ExternalLink, Users, Copy, Check } from 'lucide-react';

export const LINE_GROUP_URL = 'https://line.me/ti/g/j3nhPSkP_J';

// Official LINE speech bubble vector icon
export const LineIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

interface LineHeaderButtonProps {
  className?: string;
}

export const LineHeaderButton: React.FC<LineHeaderButtonProps> = ({ className = "" }) => {
  return (
    <a
      id="header-line-group-btn"
      href={LINE_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="外開加入 LINE 旅遊群組"
      aria-label="外開加入 LINE 旅遊群組"
      className={`p-2 rounded-xl bg-[#06C755] text-white hover:bg-[#05B34C] active:scale-95 transition-all flex items-center justify-center shadow-xs ${className}`}
    >
      <LineIcon className="w-4 h-4 text-white" />
    </a>
  );
};

export const LineGroupBannerCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(LINE_GROUP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="line-group-banner-card" className="bg-[#FAF8F5] border border-[#D5EED9] rounded-2xl p-4 shadow-sm relative overflow-hidden bg-gradient-to-r from-[#F1F9F3] to-[#FAF8F5]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-[#06C755] text-white shrink-0 shadow-sm">
            <LineIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#06C755]/15 text-[#068A3E]">
                團員即時交流
              </span>
              <span className="text-[10px] text-[#7A7167]">隨團互動</span>
            </div>
            <h4 className="text-sm font-bold text-[#232120] mt-0.5 truncate">
              奧捷同行 LINE 群組
            </h4>
            {!compact && (
              <p className="text-[11px] text-[#635A50] mt-0.5 leading-relaxed">
                分享美照、集合提醒、私房探店討論，點擊立即外開加入
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            title="複製 LINE 群組邀請連結"
            className="p-2 rounded-xl bg-[#E8F3EA] text-[#0A7B39] hover:bg-[#DDF0E0] active:scale-95 transition-all text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#06C755]" /> : <Copy className="w-4 h-4" />}
          </button>

          <a
            id="banner-line-group-join-btn"
            href={LINE_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-[#06C755] text-white hover:bg-[#05B34C] active:scale-95 transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <span>加入群組</span>
            <ExternalLink className="w-3 h-3 opacity-90" />
          </a>
        </div>
      </div>
    </div>
  );
};
