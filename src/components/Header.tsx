import React from 'react';
import { Volume2, BookOpen, PenTool, UserPlus } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  activeSection,
  onNavigateSection
}) => {
  return (
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white font-chinese text-xl font-bold shadow-xs">
            名
          </div>
          <span className="text-lg font-bold tracking-tight text-stone-900 font-chinese">
            Luyện Viết & Phát Âm Tên Chữ Hán
          </span>
        </div>

        {/* Zone 2: 4-6 nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigateSection('section-practice')}
            className={`transition-colors hover:text-stone-900 ${
              activeSection === 'practice' ? 'text-red-700 font-semibold' : ''
            }`}
          >
            Bảng tập viết Mễ Tự
          </button>
          <button
            onClick={() => onNavigateSection('section-audio')}
            className={`transition-colors hover:text-stone-900 ${
              activeSection === 'audio' ? 'text-red-700 font-semibold' : ''
            }`}
          >
            Luyện nghe giọng chuẩn
          </button>
          <button
            onClick={() => onNavigateSection('section-fullname')}
            className={`transition-colors hover:text-stone-900 ${
              activeSection === 'fullname' ? 'text-red-700 font-semibold' : ''
            }`}
          >
            Luyện viết cả họ tên
          </button>
          <button
            onClick={() => onNavigateSection('section-details')}
            className={`transition-colors hover:text-stone-900 ${
              activeSection === 'details' ? 'text-red-700 font-semibold' : ''
            }`}
          >
            Ý nghĩa & Bút thuận
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm học viên</span>
          </button>
        </div>
      </div>
    </header>
  );
};
