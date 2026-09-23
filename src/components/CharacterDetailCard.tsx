import React from 'react';
import { Volume2, Edit3, BookOpen, Layers } from 'lucide-react';
import { HanziChar } from '../data/students';
import { speechService } from '../utils/speech';

interface CharacterDetailCardProps {
  charData: HanziChar;
  index: number;
  isActivePractice: boolean;
  isAudioHighlighted: boolean;
  onSelectForPractice: () => void;
}

export const CharacterDetailCard: React.FC<CharacterDetailCardProps> = ({
  charData,
  index,
  isActivePractice,
  isAudioHighlighted,
  onSelectForPractice
}) => {
  if (!charData) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(charData.char, { rate: 0.75 });
  };

  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-200 ${
        isAudioHighlighted 
          ? 'border-red-500 bg-red-50/60 ring-2 ring-red-400 shadow-md transform -translate-y-0.5' 
          : isActivePractice 
            ? 'border-red-300 bg-white ring-1 ring-red-200 shadow-xs' 
            : 'border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-2xs'
      }`}
    >
      {/* Top Header: Character & Pinyin */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Character Box */}
          <div 
            onClick={onSelectForPractice}
            className="w-14 h-14 rounded-lg bg-[#FAF7F2] border border-red-200/70 flex items-center justify-center cursor-pointer hover:bg-red-50/50 transition-colors shadow-2xs group"
            title="Bấm để đưa chữ này vào bảng tập viết"
          >
            <span className="font-chinese text-3xl font-bold text-stone-900 group-hover:text-red-700 transition-colors">
              {charData.char}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-stone-900 tracking-wide">
                {charData.pinyin}
              </span>
              <button
                onClick={handleSpeak}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700 flex items-center justify-center transition-colors"
                title={`Nghe phát âm chữ ${charData.char}`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Hán Việt: <span className="font-medium text-stone-800">{charData.hanViet}</span>
            </div>
          </div>
        </div>

        {/* Practice button */}
        <button
          onClick={onSelectForPractice}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            isActivePractice
              ? 'bg-red-700 text-white shadow-2xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <Edit3 className="w-3 h-3" />
          <span>{isActivePractice ? 'Đang luyện' : 'Tập viết'}</span>
        </button>
      </div>

      {/* Meta Specs: Strokes & Radical */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600">
          <Layers className="w-3.5 h-3.5 text-stone-400" />
          <span>Số nét: <strong className="text-stone-800 font-semibold">{charData.strokeCount} nét</strong></span>
        </div>
        <div className="text-stone-600 truncate" title={charData.radical}>
          <span>Bộ thủ: <strong className="text-stone-800 font-semibold">{charData.radical}</strong></span>
        </div>
      </div>

      {/* Meaning in Vietnamese */}
      <div className="mt-2.5 text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-2.5 rounded-lg border border-stone-100">
        <span className="font-semibold text-stone-800">Ý nghĩa: </span>
        {charData.meaning}
      </div>

      {/* Stroke Names if available */}
      {charData.strokeNames && charData.strokeNames.length > 0 && (
        <div className="mt-2 text-[11px] text-stone-500 leading-tight">
          <span className="text-stone-600 font-medium">Bút thuận: </span>
          <span>{charData.strokeNames.join(' → ')}</span>
        </div>
      )}
    </div>
  );
};
