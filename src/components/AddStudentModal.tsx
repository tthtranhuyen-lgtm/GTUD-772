import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { Student, HanziChar } from '../data/students';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent
}) => {
  const [vietnameseName, setVietnameseName] = useState('');
  const [chineseName, setChineseName] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vietnameseName.trim() || !chineseName.trim()) return;

    // Generate characters
    const chars = Array.from(chineseName.trim());
    const characterBreakdowns: HanziChar[] = chars.map((c, i) => {
      return {
        char: c,
        pinyin: pinyin.split(' ')[i] || '',
        hanViet: vietnameseName.split(' ')[i] || '',
        strokeCount: 8, // fallback
        radical: 'Chữ Hán phổ thông',
        meaning: `Chữ ${c} trong tên ${vietnameseName}`,
      };
    });

    const newStudent: Student = {
      id: `custom-${Date.now()}`,
      vietnameseName: vietnameseName.trim(),
      chineseName: chineseName.trim(),
      pinyin: pinyin.trim() || chineseName.trim(),
      meaningSummary: meaning.trim() || `Tên tiếng Trung của học viên ${vietnameseName}`,
      characters: characterBreakdowns,
      tag: 'Tự thêm'
    };

    onAddStudent(newStudent);
    onClose();
    setVietnameseName('');
    setChineseName('');
    setPinyin('');
    setMeaning('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <UserPlus className="w-5 h-5 text-red-600" />
            <span>Thêm Tên Học Viên Mới</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Họ và tên tiếng Việt <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Hoàng Minh Trí"
              value={vietnameseName}
              onChange={(e) => setVietnameseName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tên chữ Hán (Giản thể / Phồn thể) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: 黄明智"
              value={chineseName}
              onChange={(e) => setChineseName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg font-chinese text-base focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Phiên âm Pinyin
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Huáng Míngzhì"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ý nghĩa tên (Tùy chọn)
            </label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Ánh sáng trí tuệ rạng rỡ và minh triết..."
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm transition-colors"
            >
              Lưu học viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
