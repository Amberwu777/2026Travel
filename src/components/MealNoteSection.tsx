import React, { useState, useEffect } from 'react';
import { 
  PenLine, 
  Check, 
  Trash2, 
  Star, 
  Edit3, 
  Utensils, 
  Tag, 
  X 
} from 'lucide-react';

interface MealNote {
  content: string;
  rating: number; // 0 - 5
  tags: string[];
  updatedAt: string;
}

interface MealNoteSectionProps {
  cardId: string;
  mealTitle: string;
}

const STORAGE_PREFIX = 'travel_meal_note_v1_';

const QUICK_TAGS = [
  '😋 招牌美味',
  '🍺 推薦在地啤酒',
  '🥩 肉質鮮嫩',
  '🦆 經典烤鴨',
  '🍰 甜點驚豔',
  '☕️ 附餐咖啡棒',
  '💶 個人自費加點',
  '🌟 服務熱情',
];

export const MealNoteSection: React.FC<MealNoteSectionProps> = ({ cardId, mealTitle }) => {
  const storageKey = `${STORAGE_PREFIX}${cardId}`;

  const [note, setNote] = useState<MealNote | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [contentInput, setContentInput] = useState('');
  const [ratingInput, setRatingInput] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when entering edit mode
  const handleStartEdit = () => {
    if (note) {
      setContentInput(note.content);
      setRatingInput(note.rating || 0);
      setSelectedTags(note.tags || []);
    } else {
      setContentInput('');
      setRatingInput(5);
      setSelectedTags([]);
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!contentInput.trim() && selectedTags.length === 0 && ratingInput === 0) {
      // Nothing entered, cancel
      setIsEditing(false);
      return;
    }

    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newNote: MealNote = {
      content: contentInput.trim(),
      rating: ratingInput,
      tags: selectedTags,
      updatedAt: timeStr,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(newNote));
      // Also update master list of meal notes for the Notes tab
      const allMealNotesKey = 'travel_all_meal_notes_index_v1';
      const existingList: Record<string, any> = JSON.parse(localStorage.getItem(allMealNotesKey) || '{}');
      existingList[cardId] = {
        title: mealTitle,
        ...newNote
      };
      localStorage.setItem(allMealNotesKey, JSON.stringify(existingList));
    } catch (e) {
      console.error(e);
    }

    setNote(newNote);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('確定要清除這筆用餐筆記嗎？')) {
      try {
        localStorage.removeItem(storageKey);
        const allMealNotesKey = 'travel_all_meal_notes_index_v1';
        const existingList: Record<string, any> = JSON.parse(localStorage.getItem(allMealNotesKey) || '{}');
        delete existingList[cardId];
        localStorage.setItem(allMealNotesKey, JSON.stringify(existingList));
      } catch (e) {
        console.error(e);
      }
      setNote(null);
      setIsEditing(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#EDE7DC]">
      {/* View Mode: Note exists */}
      {!isEditing && note && (
        <div className="bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#EFE4D2] text-[#78542C] flex items-center gap-1">
                <Utensils className="w-3 h-3 text-[#996C3B]" />
                用餐筆記
              </span>
              {/* Star Rating */}
              {note.rating > 0 && (
                <div className="flex items-center gap-0.5 text-[#D97706] ml-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= note.rating ? 'fill-[#D97706]' : 'text-[#D1C9BE]'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleStartEdit}
                className="text-[11px] text-[#6B5A49] hover:text-[#2C2A29] px-2 py-0.5 rounded bg-[#EFE9DF] hover:bg-[#E4DCCF] transition-colors flex items-center gap-1 font-medium"
                title="編輯此餐筆記"
              >
                <Edit3 className="w-3 h-3" />
                <span>編輯</span>
              </button>
              <button
                onClick={handleDelete}
                className="text-[11px] text-[#A35248] hover:text-[#7A2B22] p-1 rounded hover:bg-[#FBEBE8] transition-colors"
                title="刪除筆記"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Note content */}
          {note.content && (
            <p className="text-xs text-[#3C3732] leading-relaxed whitespace-pre-wrap font-sans">
              {note.content}
            </p>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10.5px] font-medium bg-[#F0E8DC] text-[#635240] px-2 py-0.5 rounded-md border border-[#E3D7C5]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp */}
          {note.updatedAt && (
            <div className="text-[10px] text-[#91877B] text-right pt-0.5">
              記錄於 {note.updatedAt}
            </div>
          )}
        </div>
      )}

      {/* View Mode: No note yet */}
      {!isEditing && !note && (
        <button
          onClick={handleStartEdit}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#F6F2EA] hover:bg-[#EFE9DE] border border-[#E8E0D2] border-dashed text-[#6E6153] hover:text-[#2C2A29] transition-all text-xs group"
        >
          <div className="flex items-center gap-2">
            <PenLine className="w-3.5 h-3.5 text-[#917658] group-hover:scale-110 transition-transform" />
            <span className="font-medium">自行記錄用餐筆記</span>
          </div>
          <span className="text-[11px] text-[#8C7B6B] bg-[#ECE4D6] px-2 py-0.5 rounded-md font-normal">
            ＋ 新增筆記
          </span>
        </button>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="bg-[#FAF7F2] border border-[#DDD3C3] rounded-xl p-3.5 shadow-sm space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#916738]" />
              <span className="text-xs font-bold text-[#2C2A29]">
                記錄「{mealTitle}」
              </span>
            </div>
            {/* Star Rating Select */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#7A6E60]">美味評分:</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star === ratingInput ? 0 : star)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        star <= ratingInput
                          ? 'fill-[#D97706] text-[#D97706]'
                          : 'text-[#D1C8BC]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tags Chips */}
          <div>
            <div className="text-[11px] text-[#7A7065] mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#9E8E7C]" />
              <span>快速心得標籤（點擊選取）：</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[10.5px] px-2 py-0.5 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-[#8C5D38] text-white font-medium shadow-2xs'
                        : 'bg-[#EDE5D8] text-[#5C5042] hover:bg-[#E3D9CA]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              rows={3}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="寫下今天這餐點了什麼、推薦菜色、用餐心得或是自費花費（例如：點了黑啤酒 75 CZK、鴨肉皮脆肉嫩超推薦...）"
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5CABE] bg-white focus:outline-none focus:ring-1.5 focus:ring-[#8C5D38] text-[#2C2A29] placeholder-[#A3998D] leading-relaxed resize-y"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1.5 text-xs text-[#6B6154] hover:bg-[#EDE5D8] rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 text-xs bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#453F3B] active:scale-95 rounded-lg transition-all font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>儲存筆記</span>
            </button>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="mt-1.5 text-[11px] text-[#2E6B45] font-medium flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>用餐筆記已成功儲存！</span>
        </div>
      )}
    </div>
  );
};
