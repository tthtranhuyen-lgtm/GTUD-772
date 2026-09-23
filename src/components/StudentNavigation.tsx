import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, UserPlus, Users } from 'lucide-react';
import { Student } from '../data/students';

interface StudentNavigationProps {
  students: Student[];
  currentStudent: Student;
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
}

export const StudentNavigation: React.FC<StudentNavigationProps> = ({
  students,
  currentStudent,
  onSelectStudent,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const currentIndex = students.findIndex(s => s.id === currentStudent.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectStudent(students[currentIndex - 1]);
    } else {
      onSelectStudent(students[students.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      onSelectStudent(students[currentIndex + 1]);
    } else {
      onSelectStudent(students[0]);
    }
  };

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.vietnameseName.toLowerCase().includes(q) ||
      s.chineseName.toLowerCase().includes(q) ||
      s.pinyin.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search Bar & Count */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên học viên, chữ Hán, Pinyin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white transition-all"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 whitespace-nowrap">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-700">{students.length}</span>
            <span>học viên</span>
          </div>
        </div>

        {/* Right: Prev/Next & Quick Jump */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          {/* Stepper buttons */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-md bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center shadow-2xs transition-colors"
              title="Học viên trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-medium text-stone-600 px-2 min-w-16 text-center tabular-nums">
              {currentIndex + 1} / {students.length}
            </span>

            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-md bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center shadow-2xs transition-colors"
              title="Học viên tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add Student Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm tên</span>
          </button>
        </div>
      </div>

      {/* Student horizontal quick tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {filteredStudents.map((s) => {
            const isSelected = s.id === currentStudent.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectStudent(s)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-red-700 text-white font-semibold shadow-xs'
                    : 'bg-stone-100/80 hover:bg-stone-200 text-stone-700 border border-stone-200/60'
                }`}
              >
                <span>{s.vietnameseName}</span>
                <span className={`font-chinese text-sm ${isSelected ? 'text-red-100' : 'text-stone-500'}`}>
                  {s.chineseName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
