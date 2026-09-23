import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Gauge, 
  Sliders, 
  AudioWaveform,
  ChevronDown
} from 'lucide-react';
import { speechService, ChineseVoice } from '../utils/speech';
import { Student } from '../data/students';

interface AudioPlayerControlsProps {
  student: Student;
  onActiveCharHighlight?: (index: number | null) => void;
}

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  student,
  onActiveCharHighlight
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingMode, setPlayingMode] = useState<'full' | 'step' | null>(null);
  const [speed, setSpeed] = useState<number>(0.8); // Default 0.8x is gentle and easy to understand
  const [pitch, setPitch] = useState<number>(1.0);
  const [voices, setVoices] = useState<ChineseVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Load voices on mount
  useEffect(() => {
    const updateVoices = () => {
      const v = speechService.getChineseVoices() || [];
      setVoices(v);
      if (Array.isArray(v) && v.length > 0 && !selectedVoice) {
        // Preferred natural voice
        const preferred = v.find(voice => 
          voice.name.includes('Xiaoxiao') || 
          voice.name.includes('Natural') || 
          voice.name.includes('Google') ||
          voice.lang === 'zh-CN'
        ) || v[0];
        if (preferred) setSelectedVoice(preferred.name);
      }
    };

    updateVoices();
    // Voices might load asynchronously
    const timer = setTimeout(updateVoices, 300);
    return () => clearTimeout(timer);
  }, [selectedVoice]);

  // Handle Play Full Name
  const playFullName = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setPlayingMode(null);
      onActiveCharHighlight?.(null);
      return;
    }

    setIsPlaying(true);
    setPlayingMode('full');

    speechService.speak(student?.chineseName || '', {
      rate: speed,
      pitch: pitch,
      voiceName: selectedVoice || undefined,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setPlayingMode(null);
        onActiveCharHighlight?.(null);
      },
      onError: () => {
        setIsPlaying(false);
        setPlayingMode(null);
        onActiveCharHighlight?.(null);
      }
    });
  };

  // Handle Play Character By Character with Interval and Highlight
  const playStepByStep = async () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setPlayingMode(null);
      onActiveCharHighlight?.(null);
      return;
    }

    setIsPlaying(true);
    setPlayingMode('step');

    const chars = student?.characters || [];
    for (let i = 0; i < chars.length; i++) {
      onActiveCharHighlight?.(i);
      await new Promise<void>((resolve) => {
        speechService.speak(chars[i].char, {
          rate: Math.min(speed, 0.8), // Keep deliberate pace for single syllables
          pitch: pitch,
          voiceName: selectedVoice || undefined,
          onEnd: () => {
            // Pause 450ms between characters so tones can be clearly distinguished
            setTimeout(() => resolve(), 450);
          },
          onError: () => resolve()
        });
      });
    }

    onActiveCharHighlight?.(null);
    setIsPlaying(false);
    setPlayingMode(null);
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setPlayingMode(null);
    onActiveCharHighlight?.(null);
  };

  const speedPresets = [
    { label: '0.5x (Rất chậm)', val: 0.5 },
    { label: '0.75x (Chậm dễ nghe)', val: 0.75 },
    { label: '1.0x (Tự nhiên)', val: 1.0 },
    { label: '1.25x (Nhanh)', val: 1.25 },
  ];

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header and Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Luyện Nghe Phát Âm Tên
            </h3>
            <p className="text-xs text-stone-500">
              Giọng đọc chuẩn tiếng Trung phổ thông (Mandarin)
            </p>
          </div>
        </div>

        {/* Live Audio indicator when playing */}
        {isPlaying && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium animate-pulse">
            <AudioWaveform className="w-3.5 h-3.5" />
            <span>Đang đọc...</span>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Play Full */}
        <button
          onClick={playFullName}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-medium text-sm transition-all shadow-xs ${
            isPlaying && playingMode === 'full'
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white'
          }`}
        >
          {isPlaying && playingMode === 'full' ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>Dừng đọc cả tên</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Nghe đọc toàn bộ tên</span>
            </>
          )}
        </button>

        {/* Play Step by step */}
        <button
          onClick={playStepByStep}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-medium text-sm border transition-all ${
            isPlaying && playingMode === 'step'
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
          }`}
        >
          {isPlaying && playingMode === 'step' ? (
            <>
              <Square className="w-4 h-4 fill-stone-700" />
              <span>Dừng đọc từng chữ</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-stone-700" />
              <span>Đọc chậm từng chữ một</span>
            </>
          )}
        </button>
      </div>

      {/* Speed Controls (Nhanh / Chậm) */}
      <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-stone-700 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-stone-500" />
            <span>Tốc độ đọc (Nói nhanh / chậm):</span>
          </span>
          <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs">
            {speed.toFixed(2)}x
          </span>
        </div>

        {/* Speed presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {speedPresets.map(preset => {
            const isCurrent = Math.abs(speed - preset.val) < 0.05;
            return (
              <button
                key={preset.val}
                onClick={() => {
                  setSpeed(preset.val);
                  speechService.playEffect('stroke');
                }}
                className={`py-1.5 px-2 text-xs rounded-lg border transition-all text-center ${
                  isCurrent
                    ? 'border-red-600 bg-red-50 text-red-700 font-semibold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Fine-tune speed slider */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[11px] text-stone-400">0.4x (Cực chậm)</span>
          <input
            type="range"
            min="0.4"
            max="1.4"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="flex-1 accent-red-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
          />
          <span className="text-[11px] text-stone-400">1.4x (Nhanh)</span>
        </div>
      </div>

      {/* Advanced Audio Options Toggle (Voice choice & pitch) */}
      <div className="pt-2 border-t border-stone-100">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs text-stone-500 hover:text-stone-800 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Chọn giọng đọc & cao độ âm điệu</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="mt-3 flex flex-col gap-3 pt-2 text-xs">
            {/* Voice Dropdown */}
            {voices.length > 0 && (
              <div>
                <label className="block text-stone-600 mb-1 font-medium">
                  Giọng đọc tiếng Trung (Web Speech):
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:ring-1 focus:ring-red-600 focus:outline-hidden"
                >
                  {voices.map((v, i) => (
                    <option key={`${v.name}-${i}`} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pitch Slider */}
            <div>
              <div className="flex justify-between items-center text-stone-600 mb-1">
                <span>Cao độ giọng đọc (Pitch):</span>
                <span className="font-semibold text-stone-800">{pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-red-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
