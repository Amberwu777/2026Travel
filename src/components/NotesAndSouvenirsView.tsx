import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gift, 
  FileText, 
  Plus, 
  Check, 
  Trash2, 
  Pin, 
  Share2, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  User, 
  MapPin, 
  Tag, 
  Copy, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Store
} from 'lucide-react';
import { SouvenirItem, PersonalMemo } from '../types';
import { 
  INITIAL_SOUVENIRS, 
  INITIAL_MEMOS, 
  SOUVENIR_QUICK_INSPIRATIONS, 
  MEMO_TAG_OPTIONS 
} from '../data/notesAndSouvenirsData';

const SOUVENIR_STORAGE_KEY = 'austria_czech_souvenirs_v1';
const MEMO_STORAGE_KEY = 'austria_czech_memos_v1';

export const NotesAndSouvenirsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'souvenirs' | 'memos'>('souvenirs');

  // ---------- SOUVENIRS STATE ----------
  const [souvenirs, setSouvenirs] = useState<SouvenirItem[]>(() => {
    try {
      const saved = localStorage.getItem(SOUVENIR_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SOUVENIRS;
  });

  const [souvenirFilter, setSouvenirFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [souvenirSearch, setSouvenirSearch] = useState('');
  const [isAddingSouvenir, setIsAddingSouvenir] = useState(false);
  const [editingSouvenirId, setEditingSouvenirId] = useState<string | null>(null);

  // New Souvenir Form State
  const [souvName, setSouvName] = useState('');
  const [souvRecipient, setSouvRecipient] = useState('');
  const [souvQuantity, setSouvQuantity] = useState('1');
  const [souvPrice, setSouvPrice] = useState('');
  const [souvLocation, setSouvLocation] = useState('');
  const [souvNote, setSouvNote] = useState('');

  // ---------- MEMOS STATE ----------
  const [memos, setMemos] = useState<PersonalMemo[]>(() => {
    try {
      const saved = localStorage.getItem(MEMO_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEMOS;
  });

  const [memoTagFilter, setMemoTagFilter] = useState<string>('all');
  const [memoSearch, setMemoSearch] = useState('');
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);

  // New Memo Form State
  const [memoTitle, setMemoTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');
  const [memoTag, setMemoTag] = useState('重要交代');
  const [memoPinned, setMemoPinned] = useState(false);

  // Feedback State
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SOUVENIR_STORAGE_KEY, JSON.stringify(souvenirs));
    } catch (e) {
      console.error(e);
    }
  }, [souvenirs]);

  useEffect(() => {
    try {
      localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
    } catch (e) {
      console.error(e);
    }
  }, [memos]);

  const triggerCopyNotice = (msg: string) => {
    setCopiedNotice(msg);
    setTimeout(() => setCopiedNotice(null), 2200);
  };

  // ---------- SOUVENIR HANDLERS ----------
  const handleToggleSouvenir = (id: string) => {
    setSouvenirs(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteSouvenir = (id: string) => {
    if (window.confirm('確定要移除此伴手禮筆記嗎？')) {
      setSouvenirs(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSaveSouvenir = (e: React.FormEvent) => {
    e.preventDefault();
    if (!souvName.trim()) return;

    if (editingSouvenirId) {
      setSouvenirs(prev => prev.map(item => {
        if (item.id === editingSouvenirId) {
          return {
            ...item,
            name: souvName.trim(),
            recipient: souvRecipient.trim() || '親友',
            quantity: souvQuantity.trim(),
            priceEstimate: souvPrice.trim(),
            cityOrStore: souvLocation.trim(),
            note: souvNote.trim(),
          };
        }
        return item;
      }));
      setEditingSouvenirId(null);
    } else {
      const newItem: SouvenirItem = {
        id: `souv-${Date.now()}`,
        name: souvName.trim(),
        recipient: souvRecipient.trim() || '親友',
        quantity: souvQuantity.trim() || '1',
        priceEstimate: souvPrice.trim(),
        cityOrStore: souvLocation.trim(),
        note: souvNote.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setSouvenirs(prev => [newItem, ...prev]);
    }

    // Reset Form
    setSouvName('');
    setSouvRecipient('');
    setSouvQuantity('1');
    setSouvPrice('');
    setSouvLocation('');
    setSouvNote('');
    setIsAddingSouvenir(false);
  };

  const handleStartEditSouvenir = (item: SouvenirItem) => {
    setEditingSouvenirId(item.id);
    setSouvName(item.name);
    setSouvRecipient(item.recipient);
    setSouvQuantity(item.quantity || '1');
    setSouvPrice(item.priceEstimate || '');
    setSouvLocation(item.cityOrStore || '');
    setSouvNote(item.note || '');
    setIsAddingSouvenir(true);
  };

  const handleAddQuickInspiration = (insp: { name: string; city: string; price: string }) => {
    const exists = souvenirs.some(s => s.name.toLowerCase() === insp.name.toLowerCase());
    if (exists) {
      triggerCopyNotice(`「${insp.name}」已在清單中囉！`);
      return;
    }

    const newItem: SouvenirItem = {
      id: `souv-${Date.now()}`,
      name: insp.name,
      recipient: '待定',
      quantity: '1',
      priceEstimate: insp.price,
      cityOrStore: insp.city,
      note: '奧捷經典名品推薦，記得採購滿額領取退稅單。',
      completed: false,
      createdAt: Date.now(),
    };
    setSouvenirs(prev => [newItem, ...prev]);
    triggerCopyNotice(`已加入「${insp.name}」到採購筆記！`);
  };

  const handleCopySouvenirsList = () => {
    const lines = [
      '【🎁 2026 奧捷湖區旅行．伴手禮採購清單】',
      `統計進度：已購得 ${completedSouvenirsCount} / ${souvenirs.length} 件`,
      '--------------------------',
      ...souvenirs.map((s, idx) => {
        const check = s.completed ? '[已買]' : '[待買]';
        const rec = s.recipient ? `（送：${s.recipient}）` : '';
        const qty = s.quantity ? `x${s.quantity}` : '';
        const loc = s.cityOrStore ? ` @${s.cityOrStore}` : '';
        const price = s.priceEstimate ? `【${s.priceEstimate}】` : '';
        return `${idx + 1}. ${check} ${s.name} ${qty} ${rec}${loc} ${price}`;
      }),
      '--------------------------',
      '由 2026 奧捷湖區隨行手冊整理'
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      triggerCopyNotice('伴手禮清單已複製！可貼至 LINE 群組');
    });
  };

  // ---------- MEMO HANDLERS ----------
  const handleDeleteMemo = (id: string) => {
    if (window.confirm('確定要刪除這則備忘錄嗎？')) {
      setMemos(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleTogglePinMemo = (id: string) => {
    setMemos(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  const handleSaveMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoTitle.trim() || !memoContent.trim()) return;

    const now = new Date();
    const timeString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (editingMemoId) {
      setMemos(prev => prev.map(m => {
        if (m.id === editingMemoId) {
          return {
            ...m,
            title: memoTitle.trim(),
            content: memoContent.trim(),
            tag: memoTag,
            isPinned: memoPinned,
            updatedAt: timeString,
          };
        }
        return m;
      }));
      setEditingMemoId(null);
    } else {
      const newMemo: PersonalMemo = {
        id: `memo-${Date.now()}`,
        title: memoTitle.trim(),
        content: memoContent.trim(),
        tag: memoTag,
        isPinned: memoPinned,
        updatedAt: timeString,
      };
      setMemos(prev => [newMemo, ...prev]);
    }

    // Reset Form
    setMemoTitle('');
    setMemoContent('');
    setMemoTag('重要交代');
    setMemoPinned(false);
    setIsAddingMemo(false);
  };

  const handleStartEditMemo = (memo: PersonalMemo) => {
    setEditingMemoId(memo.id);
    setMemoTitle(memo.title);
    setMemoContent(memo.content);
    setMemoTag(memo.tag);
    setMemoPinned(memo.isPinned);
    setIsAddingMemo(true);
  };

  const handleCopyMemoContent = (memo: PersonalMemo) => {
    const text = `${memo.title}\n\n${memo.content}\n\n（記錄時間：${memo.updatedAt}）`;
    navigator.clipboard.writeText(text).then(() => {
      triggerCopyNotice('備忘錄內容已複製！');
    });
  };

  // ---------- FILTERED DATA & STATS ----------
  const completedSouvenirsCount = useMemo(() => souvenirs.filter(s => s.completed).length, [souvenirs]);
  const souvenirProgressPct = souvenirs.length > 0 ? Math.round((completedSouvenirsCount / souvenirs.length) * 100) : 0;

  const filteredSouvenirs = useMemo(() => {
    return souvenirs.filter(item => {
      if (souvenirFilter === 'pending' && item.completed) return false;
      if (souvenirFilter === 'completed' && !item.completed) return false;
      if (souvenirSearch.trim()) {
        const q = souvenirSearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchRec = (item.recipient || '').toLowerCase().includes(q);
        const matchLoc = (item.cityOrStore || '').toLowerCase().includes(q);
        const matchNote = (item.note || '').toLowerCase().includes(q);
        return matchName || matchRec || matchLoc || matchNote;
      }
      return true;
    });
  }, [souvenirs, souvenirFilter, souvenirSearch]);

  const filteredMemos = useMemo(() => {
    return memos
      .filter(item => {
        if (memoTagFilter !== 'all' && item.tag !== memoTagFilter) return false;
        if (memoSearch.trim()) {
          const q = memoSearch.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchContent = item.content.toLowerCase().includes(q);
          return matchTitle || matchContent;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
  }, [memos, memoTagFilter, memoSearch]);

  return (
    <div id="notes-and-souvenirs-container" className="space-y-4 pb-20">
      {/* Toast Notice */}
      {copiedNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2C2A29] text-[#FAF8F5] text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <Check className="w-4 h-4 text-[#8CBE7A]" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F0EBE1] text-[#8C5D38]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2C2A29] font-['Zen_Old_Mincho',serif]">
                隨身筆記與伴手禮
              </h2>
              <p className="text-[11px] text-[#78716A] mt-0.5">
                個人旅行備忘錄、領隊叮嚀紀錄與親友送禮採購清單
              </p>
            </div>
          </div>

          {activeSubTab === 'souvenirs' && souvenirs.length > 0 && (
            <button
              onClick={handleCopySouvenirsList}
              title="複製採購清單至 LINE"
              className="p-2 rounded-xl bg-[#EFE9DF] hover:bg-[#E4DDD1] text-[#4A433A] text-xs flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8C5D38]" />
              <span className="text-[11px] font-medium hidden sm:inline">複製清單</span>
            </button>
          )}
        </div>

        {/* SubTab Toggle Bar */}
        <div className="grid grid-cols-2 gap-1.5 mt-3.5 p-1 bg-[#F1EBE1] rounded-xl border border-[#E5DFD4]">
          <button
            onClick={() => setActiveSubTab('souvenirs')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'souvenirs'
                ? 'bg-[#FFFFFF] text-[#8C5D38] shadow-xs'
                : 'text-[#70675D] hover:text-[#2C2A29]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>伴手禮 ({souvenirs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('memos')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'memos'
                ? 'bg-[#FFFFFF] text-[#2E6B47] shadow-xs'
                : 'text-[#70675D] hover:text-[#2C2A29]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>備忘錄 ({memos.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. 伴手禮採購筆記 TAB                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'souvenirs' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Progress Card */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C2A29] flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#8C5D38]" />
                <span>伴手禮採購進度</span>
              </span>
              <span className="font-mono text-[#8C5D38] font-bold">
                {completedSouvenirsCount} / {souvenirs.length} 件完成 ({souvenirProgressPct}%)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#EFE9E0] rounded-full mt-2.5 overflow-hidden">
              <div 
                className="h-full bg-[#8C5D38] transition-all duration-300 rounded-full"
                style={{ width: `${souvenirProgressPct}%` }}
              />
            </div>
          </div>

          {/* Quick Inspirations Carousel */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#4A433A] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B06E1A]" />
                <span>經典捷奧必買伴手禮（點擊一鍵加入清單）</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {SOUVENIR_QUICK_INSPIRATIONS.map((insp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddQuickInspiration(insp)}
                  className="shrink-0 text-left bg-[#F5EFE7] hover:bg-[#EBE2D5] border border-[#E8DFCFC0] rounded-xl px-2.5 py-1.5 transition-colors group"
                >
                  <div className="text-[11px] font-bold text-[#2C2A29] group-hover:text-[#8C5D38] flex items-center gap-1">
                    <span>+ {insp.name}</span>
                  </div>
                  <div className="text-[10px] text-[#7A7165] flex items-center gap-1 mt-0.5 font-mono">
                    <span>{insp.city}</span>
                    <span>•</span>
                    <span className="text-[#8C5D38] font-medium">{insp.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Bar: Search & Filter & Add Button */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-3 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8C8276] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜尋伴手禮名稱、對象、購買地點..."
                  value={souvenirSearch}
                  onChange={(e) => setSouvenirSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F3EFE7] border border-[#E0D9CD] rounded-xl text-xs text-[#2C2A29] placeholder-[#948A7D] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingSouvenirId(null);
                  setSouvName('');
                  setSouvRecipient('');
                  setSouvQuantity('1');
                  setSouvPrice('');
                  setSouvLocation('');
                  setSouvNote('');
                  setIsAddingSouvenir(!isAddingSouvenir);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  isAddingSouvenir 
                    ? 'bg-[#EAE4D9] text-[#4A433A]' 
                    : 'bg-[#8C5D38] text-[#FFFFFF] shadow-xs hover:bg-[#784E2E]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingSouvenir ? '取消' : '新增'}</span>
              </button>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-[#EDE7DD] text-xs">
              <button
                onClick={() => setSouvenirFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  souvenirFilter === 'all'
                    ? 'bg-[#2C2A29] text-[#FAF8F5]'
                    : 'bg-[#EFEAE2] text-[#6B635A] hover:bg-[#E5DFD4]'
                }`}
              >
                全部 ({souvenirs.length})
              </button>
              <button
                onClick={() => setSouvenirFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  souvenirFilter === 'pending'
                    ? 'bg-[#BA4230] text-[#FFFFFF]'
                    : 'bg-[#FBECE8] text-[#BA4230] hover:bg-[#F6DDD7]'
                }`}
              >
                待買 ({souvenirs.length - completedSouvenirsCount})
              </button>
              <button
                onClick={() => setSouvenirFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  souvenirFilter === 'completed'
                    ? 'bg-[#2F6B48] text-[#FFFFFF]'
                    : 'bg-[#EBF3ED] text-[#2F6B48] hover:bg-[#DEEDE2]'
                }`}
              >
                已買 ({completedSouvenirsCount})
              </button>
            </div>
          </div>

          {/* Add / Edit Souvenir Form Collapsible */}
          {isAddingSouvenir && (
            <form 
              onSubmit={handleSaveSouvenir}
              className="bg-[#FCFAF7] border-2 border-[#8C5D38]/30 rounded-2xl p-4 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between border-b border-[#EDE7DD] pb-2">
                <span className="text-xs font-bold text-[#8C5D38] flex items-center gap-1.5">
                  <Gift className="w-4 h-4" />
                  <span>{editingSouvenirId ? '編輯伴手禮筆記' : '新增伴手禮購買計畫'}</span>
                </span>
                <span className="text-[11px] text-[#7A7165]">保存在隨身手機中</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                  伴手禮品項名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：菠丹妮 死海泥手工皂、莫札特金球巧克力..."
                  value={souvName}
                  onChange={(e) => setSouvName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                    送禮對象 / 給誰
                  </label>
                  <input
                    type="text"
                    placeholder="例如：爸媽、辦公室、好友、自己"
                    value={souvRecipient}
                    onChange={(e) => setSouvRecipient(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                  />
                  {/* Quick recipient tags */}
                  <div className="flex items-center gap-1 mt-1 overflow-x-auto no-scrollbar">
                    {['家人', '同事', '好友', '自己', '長輩'].map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setSouvRecipient(tag)}
                        className="text-[10px] px-1.5 py-0.5 bg-[#EFE9DF] text-[#554E46] rounded hover:bg-[#E3DCB1]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                    數量 / 單位
                  </label>
                  <input
                    type="text"
                    placeholder="例如：4 盒、2 隻、5 塊"
                    value={souvQuantity}
                    onChange={(e) => setSouvQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                    購買地點 / 店家
                  </label>
                  <input
                    type="text"
                    placeholder="例如：布拉格提恩中庭、維也納超市"
                    value={souvLocation}
                    onChange={(e) => setSouvLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                  />
                  <div className="flex items-center gap-1 mt-1 overflow-x-auto no-scrollbar">
                    {['布拉格', '維也納', '庫倫洛夫', '超市', '機場'].map(loc => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => setSouvLocation(loc)}
                        className="text-[10px] px-1.5 py-0.5 bg-[#EFE9DF] text-[#554E46] rounded hover:bg-[#E3DCB1]"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                    預估預算 / 標價
                  </label>
                  <input
                    type="text"
                    placeholder="例如：125 CZK 或 8.5 EUR"
                    value={souvPrice}
                    onChange={(e) => setSouvPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                  採購備忘叮嚀（選填）
                </label>
                <textarea
                  rows={2}
                  placeholder="例如：滿 2001 克朗記得請店員開退稅單、要買草莓榛果口味..."
                  value={souvNote}
                  onChange={(e) => setSouvNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#8C5D38]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EDE7DD]">
                <button
                  type="button"
                  onClick={() => setIsAddingSouvenir(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B635A] hover:bg-[#EAE4D9]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#8C5D38] hover:bg-[#784E2E] text-[#FFFFFF] text-xs font-bold shadow-xs"
                >
                  {editingSouvenirId ? '儲存變更' : '新增品項'}
                </button>
              </div>
            </form>
          )}

          {/* Souvenirs List */}
          <div className="space-y-2.5">
            {filteredSouvenirs.length === 0 ? (
              <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-8 text-center text-[#8C8276] space-y-2">
                <Gift className="w-8 h-8 mx-auto opacity-30 text-[#8C5D38]" />
                <p className="text-xs font-medium">沒有符合條件的伴手禮項目</p>
                <p className="text-[11px] text-[#A3998E]">可點擊上方「經典捷奧必買」或「新增伴手禮」開始規劃！</p>
              </div>
            ) : (
              filteredSouvenirs.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-[#FAF8F5] border rounded-2xl p-3.5 shadow-sm transition-all duration-150 ${
                    item.completed 
                      ? 'border-[#E0D8CB] bg-[#F7F5F0]/80 opacity-80' 
                      : 'border-[#E8E3DA] hover:border-[#D6CCC0]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleSouvenir(item.id)}
                      className="shrink-0 mt-0.5 text-[#8C5D38] hover:scale-110 transition-transform"
                      title={item.completed ? '標記為未完成' : '標記為已購得'}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2F6B48] fill-[#2F6B48]/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#8C7E70]" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className={`text-xs font-bold ${item.completed ? 'line-through text-[#80766B]' : 'text-[#2C2A29]'}`}>
                          {item.name}
                        </span>

                        {/* Recipient Badge */}
                        <div className="flex items-center gap-1.5">
                          {item.quantity && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#4A433A]">
                              數量: {item.quantity}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#F5EDE1] text-[#8C5D38] border border-[#E8DCCB] flex items-center gap-0.5">
                            <User className="w-3 h-3" />
                            <span>{item.recipient}</span>
                          </span>
                        </div>
                      </div>

                      {/* Location & Price */}
                      <div className="flex items-center gap-3 text-[11px] text-[#6B635A] mt-1 flex-wrap">
                        {item.cityOrStore && (
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3 text-[#8C5D38]" />
                            <span>{item.cityOrStore}</span>
                          </span>
                        )}
                        {item.priceEstimate && (
                          <span className="font-mono text-[#8C5D38] font-semibold">
                            💰 {item.priceEstimate}
                          </span>
                        )}
                      </div>

                      {/* Note */}
                      {item.note && (
                        <p className="text-[11px] text-[#7A7165] mt-1.5 bg-[#F4EFE7]/70 p-2 rounded-xl border border-[#ECE4D8]/60 leading-relaxed">
                          💡 {item.note}
                        </p>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center justify-end gap-2 mt-2 pt-1.5 border-t border-[#EFEAE2]">
                        <button
                          onClick={() => handleStartEditSouvenir(item)}
                          className="p-1 rounded-lg text-[#7A7165] hover:text-[#2C2A29] hover:bg-[#EAE4D9] text-[11px] flex items-center gap-0.5"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>編輯</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSouvenir(item.id)}
                          className="p-1 rounded-lg text-[#995240] hover:bg-[#F9ECE8] text-[11px] flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>刪除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 個人隨行備忘錄 TAB                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'memos' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Action Bar: Search & Tag Filter & Add Button */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-3 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8C8276] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜尋隨身備忘錄標題、內容、房間密碼..."
                  value={memoSearch}
                  onChange={(e) => setMemoSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F3EFE7] border border-[#E0D9CD] rounded-xl text-xs text-[#2C2A29] placeholder-[#948A7D] focus:outline-none focus:ring-1 focus:ring-[#2E6B47]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingMemoId(null);
                  setMemoTitle('');
                  setMemoContent('');
                  setMemoTag('重要交代');
                  setMemoPinned(false);
                  setIsAddingMemo(!isAddingMemo);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  isAddingMemo 
                    ? 'bg-[#EAE4D9] text-[#4A433A]' 
                    : 'bg-[#2E6B47] text-[#FFFFFF] shadow-xs hover:bg-[#255739]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingMemo ? '取消' : '新增'}</span>
              </button>
            </div>

            {/* Tag Filter Chips */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-[#EDE7DD] overflow-x-auto no-scrollbar py-0.5 text-xs">
              <button
                onClick={() => setMemoTagFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-colors ${
                  memoTagFilter === 'all'
                    ? 'bg-[#2C2A29] text-[#FAF8F5]'
                    : 'bg-[#EFEAE2] text-[#6B635A] hover:bg-[#E5DFD4]'
                }`}
              >
                全部 ({memos.length})
              </button>
              {MEMO_TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setMemoTagFilter(tag)}
                  className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-colors ${
                    memoTagFilter === tag
                      ? 'bg-[#2E6B47] text-[#FFFFFF]'
                      : 'bg-[#EFEAE2] text-[#6B635A] hover:bg-[#E5DFD4]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Add / Edit Memo Form Collapsible */}
          {isAddingMemo && (
            <form 
              onSubmit={handleSaveMemo}
              className="bg-[#FCFAF7] border-2 border-[#2E6B47]/30 rounded-2xl p-4 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between border-b border-[#EDE7DD] pb-2">
                <span className="text-xs font-bold text-[#2E6B47] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{editingMemoId ? '編輯隨身備忘錄' : '新增個人隨身備忘'}</span>
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#4A433A]">
                  <input
                    type="checkbox"
                    checked={memoPinned}
                    onChange={(e) => setMemoPinned(e.target.checked)}
                    className="rounded text-[#2E6B47] focus:ring-[#2E6B47]"
                  />
                  <Pin className={`w-3.5 h-3.5 ${memoPinned ? 'text-[#B06E1A] fill-[#B06E1A]' : 'text-[#8C8276]'}`} />
                  <span className="text-[11px] font-medium">重要置頂</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                  備忘標題 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：布拉格飯店 WiFi 與房號、領隊集合通知..."
                  value={memoTitle}
                  onChange={(e) => setMemoTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2E6B47]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                  分類標籤
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {MEMO_TAG_OPTIONS.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setMemoTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        memoTag === tag
                          ? 'bg-[#2E6B47] text-[#FFFFFF]'
                          : 'bg-[#EFE9DF] text-[#554E46] hover:bg-[#E3DCB1]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A433A] mb-1">
                  詳細內容 *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="可輸入條列式備忘、注意事項、密碼、集合地點或個人心得..."
                  value={memoContent}
                  onChange={(e) => setMemoContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DED6C8] rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2E6B47]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EDE7DD]">
                <button
                  type="button"
                  onClick={() => setIsAddingMemo(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B635A] hover:bg-[#EAE4D9]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2E6B47] hover:bg-[#255739] text-[#FFFFFF] text-xs font-bold shadow-xs"
                >
                  {editingMemoId ? '儲存變更' : '儲存備忘錄'}
                </button>
              </div>
            </form>
          )}

          {/* Memos List */}
          <div className="space-y-3">
            {filteredMemos.length === 0 ? (
              <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-8 text-center text-[#8C8276] space-y-2">
                <FileText className="w-8 h-8 mx-auto opacity-30 text-[#2E6B47]" />
                <p className="text-xs font-medium">目前沒有符合的備忘錄</p>
                <p className="text-[11px] text-[#A3998E]">點擊上方「寫新備忘」隨時記錄旅途中的重要細節！</p>
              </div>
            ) : (
              filteredMemos.map((memo) => (
                <div 
                  key={memo.id}
                  className={`bg-[#FAF8F5] border rounded-2xl p-4 shadow-sm transition-all duration-150 relative ${
                    memo.isPinned 
                      ? 'border-[#B88746]/60 bg-[#FCFBF8] border-l-4 border-l-[#B88746]' 
                      : 'border-[#E8E3DA] hover:border-[#D6CCC0]'
                  }`}
                >
                  {/* Top Bar: Title & Tag & Pin Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {memo.isPinned && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#FDF2E2] text-[#B06E1A] border border-[#F4DCBE] flex items-center gap-0.5">
                            <Pin className="w-3 h-3 fill-[#B06E1A]" />
                            <span>置頂</span>
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#EBF3ED] text-[#2F6B48] border border-[#D5E6D9]">
                          {memo.tag}
                        </span>
                        <span className="text-[10px] font-mono text-[#8C8276]">
                          {memo.updatedAt}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-[#2C2A29] mt-1.5 leading-snug">
                        {memo.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleTogglePinMemo(memo.id)}
                        title={memo.isPinned ? '取消置頂' : '設為置頂'}
                        className="p-1 rounded-lg text-[#8C8276] hover:text-[#B06E1A] hover:bg-[#F2ECE3] transition-colors"
                      >
                        <Pin className={`w-3.5 h-3.5 ${memo.isPinned ? 'text-[#B06E1A] fill-[#B06E1A]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="mt-2.5 text-xs text-[#4A433A] whitespace-pre-line leading-relaxed bg-[#F7F4EE]/70 p-3 rounded-xl border border-[#ECE4D8]/70">
                    {memo.content}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EFEAE2] text-[11px] text-[#7A7165]">
                    <span className="text-[10px] text-[#8C8276]">已保存於本機</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyMemoContent(memo)}
                        className="p-1 rounded-lg hover:text-[#2C2A29] hover:bg-[#EAE4D9] flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>複製</span>
                      </button>
                      <button
                        onClick={() => handleStartEditMemo(memo)}
                        className="p-1 rounded-lg hover:text-[#2C2A29] hover:bg-[#EAE4D9] flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>編輯</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMemo(memo.id)}
                        className="p-1 rounded-lg text-[#995240] hover:bg-[#F9ECE8] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>刪除</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
