/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ChevronRight,
  Share2,
  Award,
  PenTool,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_STUDENTS, Student } from './data/students';
import { Header } from './components/Header';
import { StudentNavigation } from './components/StudentNavigation';
import { CalligraphyCanvas } from './components/CalligraphyCanvas';
import { AudioPlayerControls } from './components/AudioPlayerControls';
import { CharacterDetailCard } from './components/CharacterDetailCard';
import { FullNamePracticeRow } from './components/FullNamePracticeRow';
import { AddStudentModal } from './components/AddStudentModal';
import { speechService } from './utils/speech';

export default function App() {
  // Students state with localStorage hydration
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('chinese_name_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(
            (s: unknown): s is Student => Boolean(s && typeof s === 'object' && Array.isArray((s as Student).characters) && (s as Student).characters.length > 0)
          );
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudent, setCurrentStudent] = useState<Student>(() => {
    return students && students.length > 0 ? students[0] : INITIAL_STUDENTS[0];
  });
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const [audioHighlightIndex, setAudioHighlightIndex] = useState<number | null>(null);
  const [practiceMode, setPracticeMode] = useState<'single' | 'full'>('single');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('practice');

  // Keep localStorage updated when students change
  useEffect(() => {
    try {
      localStorage.setItem('chinese_name_students', JSON.stringify(students));
    } catch {
      // Ignore storage errors
    }
  }, [students]);

  // Fallback safe student to ensure characters is always a valid non-empty array
  const safeStudent: Student = 
    (currentStudent && Array.isArray(currentStudent.characters) && currentStudent.characters.length > 0)
      ? currentStudent
      : (students && students.length > 0 && Array.isArray(students[0].characters) ? students[0] : INITIAL_STUDENTS[0]);

  const characters = safeStudent.characters || [];
  const currentCharData = characters[selectedCharIndex] || characters[0];

  // Reset selected character when switching student
  const handleSelectStudent = (student: Student) => {
    if (!student) return;
    setCurrentStudent(student);
    setSelectedCharIndex(0);
    speechService.stop();
    setAudioHighlightIndex(null);
  };

  const handleAddStudent = (newStudent: Student) => {
    if (!newStudent) return;
    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudent(newStudent);
    setSelectedCharIndex(0);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col text-stone-900 selection:bg-red-100 selection:text-red-900">
      {/* 3-Zone Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      {/* Sticky Student Directory & Search Navigation */}
      <StudentNavigation
        students={students}
        currentStudent={safeStudent}
        onSelectStudent={handleSelectStudent}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* Student Banner / Hero Card */}
        <section className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle traditional watermarked character in background */}
          <div className="pointer-events-none select-none absolute right-4 -bottom-10 text-[180px] font-chinese font-bold text-stone-900/[0.03] leading-none">
            {safeStudent.chineseName}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              {/* Kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-red-700 uppercase tracking-wider mb-1.5">
                <span>Học viên</span>
                <span aria-hidden="true">·</span>
                <span>Tiếng Trung chuẩn</span>
              </div>

              {/* Full Vietnamese Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900">
                {safeStudent.vietnameseName}
              </h1>

              {/* Large Chinese Calligraphy & Pinyin */}
              <div className="mt-3 flex flex-wrap items-baseline gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-chinese text-4xl sm:text-5xl font-bold text-red-800 tracking-wide">
                    {safeStudent.chineseName}
                  </span>
                  <button
                    onClick={() => speechService.speak(safeStudent.chineseName, { rate: 0.8 })}
                    className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-700 flex items-center justify-center transition-colors shadow-2xs"
                    title="Nghe phát âm chuẩn cả tên"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-lg sm:text-xl font-medium text-stone-600 tracking-wide">
                  [{safeStudent.pinyin}]
                </div>
              </div>

              {/* Cultural meaning summary */}
              <p className="mt-4 text-sm text-stone-600 max-w-2xl leading-relaxed">
                <strong className="text-stone-800 font-semibold">Ý nghĩa tên: </strong>
                {safeStudent.meaningSummary}
              </p>
            </div>

            {/* Quick Stats Seal */}
            <div className="flex md:flex-col items-center md:items-end gap-3 self-stretch md:self-auto justify-between border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Tổng số chữ:</span>
                <span className="font-bold text-stone-900 font-mono text-sm">
                  {characters.length} chữ Hán
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Tổng số nét:</span>
                <span className="font-bold text-stone-900 font-mono text-sm">
                  {characters.reduce((acc, c) => acc + (c?.strokeCount || 0), 0)} nét bút
                </span>
              </div>
              <div className="px-3 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium">
                {safeStudent.tag || 'Lớp tiếng Trung'}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Audio Pronunciation Station */}
        <section id="section-audio" className="scroll-mt-20">
          <AudioPlayerControls
            student={safeStudent}
            onActiveCharHighlight={(idx) => setAudioHighlightIndex(idx)}
          />
        </section>

        {/* Section 2: Calligraphy Practice Studio */}
        <section id="section-practice" className="scroll-mt-20 flex flex-col gap-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPracticeMode('single')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  practiceMode === 'single'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Luyện từng chữ chi tiết</span>
              </button>
              <button
                onClick={() => setPracticeMode('full')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  practiceMode === 'full'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Luyện cả dãy họ tên</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hỗ trợ xóa đi viết lại không giới hạn</span>
            </div>
          </div>

          {/* Mode 1: Focus Single Character Writing with rich canvas */}
          {practiceMode === 'single' && currentCharData && (
            <CalligraphyCanvas
              char={currentCharData.char}
              pinyin={currentCharData.pinyin}
              hanViet={currentCharData.hanViet}
              studentName={safeStudent.vietnameseName}
              allChars={characters.map(c => c.char)}
              selectedCharIndex={selectedCharIndex}
              onSelectCharIndex={(idx) => setSelectedCharIndex(idx)}
            />
          )}

          {/* Mode 2: Full Name Multi-Grid Sequence */}
          {practiceMode === 'full' && (
            <FullNamePracticeRow student={safeStudent} />
          )}
        </section>

        {/* Section 3: In-Depth Character Analysis & Stroke Sequences */}
        <section id="section-details" className="scroll-mt-20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>Phân Tích Chi Tiết Từng Chữ Trong Tên</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Bấm vào thẻ chữ để nghe phát âm riêng hoặc chuyển nhanh vào bảng tập viết
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((c, idx) => (
              <CharacterDetailCard
                key={`${c.char}-${idx}`}
                charData={c}
                index={idx}
                isActivePractice={practiceMode === 'single' && selectedCharIndex === idx}
                isAudioHighlighted={audioHighlightIndex === idx}
                onSelectForPractice={() => {
                  setSelectedCharIndex(idx);
                  setPracticeMode('single');
                  handleNavigateSection('section-practice');
                }}
              />
            ))}
          </div>
        </section>

        {/* Quick Student Switcher Grid (All 9 Students Directory) */}
        <section className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Toàn Bộ Danh Sách Học Viên ({students.length})
              </h3>
              <p className="text-xs text-stone-500">
                Chọn học viên để chuyển ngay sang bài học tương ứng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((st) => {
              const isCurrent = st.id === currentStudent.id;
              return (
                <div
                  key={st.id}
                  onClick={() => handleSelectStudent(st)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-red-600 bg-red-50/60 shadow-2xs ring-1 ring-red-300'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-sm font-semibold text-stone-900 truncate">
                      {st.vietnameseName}
                    </div>
                    <div className="text-xs text-stone-500 font-chinese tracking-wide mt-0.5">
                      {st.chineseName} · <span className="font-sans">{st.pinyin}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speechService.speak(st.chineseName, { rate: 0.8 });
                    }}
                    className="w-8 h-8 rounded-full bg-white hover:bg-red-100 text-stone-600 hover:text-red-700 border border-stone-200 flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                    title="Nghe tên này"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            Ứng dụng Luyện Nghe & Viết Tên Chữ Hán Học Viên · Tiếng Trung Giao Tiếp
          </div>
          <div className="flex items-center gap-4">
            <span>9 Học viên chuẩn</span>
            <span>·</span>
            <span>Mễ Tự Cách (米字格)</span>
            <span>·</span>
            <span>Giọng đọc Mandarin tự nhiên</span>
          </div>
        </div>
      </footer>

      {/* Add Custom Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}
