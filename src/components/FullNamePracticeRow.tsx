import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Download, Eye, EyeOff, Sparkles, Volume2 } from 'lucide-react';
import { Student } from '../data/students';
import { speechService } from '../utils/speech';

interface FullNamePracticeRowProps {
  student: Student;
}

export const FullNamePracticeRow: React.FC<FullNamePracticeRowProps> = ({ student }) => {
  const chars = student?.characters || [];
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [clearTrigger, setClearTrigger] = useState<number>(0);

  // Canvas refs for each character box
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const isDrawingMap = useRef<{ [key: number]: boolean }>({});
  const strokeHistoryMap = useRef<{ [key: number]: { x: number; y: number }[][] }>({});

  const boxSize = 220; // High-res coordinate size

  // Setup/Redraw each box
  useEffect(() => {
    if (!chars || chars.length === 0) return;
    chars.forEach((c, idx) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, boxSize, boxSize);

      // Paper background
      ctx.fillStyle = '#FCFAF6';
      ctx.fillRect(0, 0, boxSize, boxSize);

      // Grid border
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, boxSize - 12, boxSize - 12);

      // Dashed crosshairs
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.lineWidth = 1;

      // Cross
      ctx.beginPath();
      ctx.moveTo(boxSize / 2, 6);
      ctx.lineTo(boxSize / 2, boxSize - 6);
      ctx.moveTo(6, boxSize / 2);
      ctx.lineTo(boxSize - 6, boxSize / 2);
      // Diagonals
      ctx.moveTo(6, 6);
      ctx.lineTo(boxSize - 6, boxSize - 6);
      ctx.moveTo(boxSize - 6, 6);
      ctx.lineTo(6, boxSize - 6);
      ctx.stroke();
      ctx.setLineDash([]);

      // Watermark
      if (showGuides) {
        ctx.font = `600 ${Math.floor(boxSize * 0.72)}px "Noto Serif SC", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(185, 28, 28, 0.2)';
        ctx.fillText(c.char, boxSize / 2, boxSize / 2 + 10);
      }

      // Replay existing strokes for this box if any
      const strokes = strokeHistoryMap.current[idx] || [];
      ctx.strokeStyle = '#18181B';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      strokes.forEach(stroke => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });
    });
  }, [chars, showGuides, clearTrigger]);

  const handlePointerDown = (idx: number, e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingMap.current[idx] = true;
    setActiveCharIndex(idx);

    const canvas = canvasRefs.current[idx];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = boxSize / rect.width;

    let cx = 0, cy = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }

    const point = { x: (cx - rect.left) * scale, y: (cy - rect.top) * scale };
    if (!strokeHistoryMap.current[idx]) strokeHistoryMap.current[idx] = [];
    strokeHistoryMap.current[idx].push([point]);
  };

  const handlePointerMove = (idx: number, e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingMap.current[idx]) return;
    e.preventDefault();

    const canvas = canvasRefs.current[idx];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = boxSize / rect.width;

    let cx = 0, cy = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }

    const point = { x: (cx - rect.left) * scale, y: (cy - rect.top) * scale };
    const strokes = strokeHistoryMap.current[idx];
    if (strokes && strokes.length > 0) {
      const currentStroke = strokes[strokes.length - 1];
      const prevPoint = currentStroke[currentStroke.length - 1];
      currentStroke.push(point);

      // Fast incremental draw
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }
  };

  const handlePointerUp = (idx: number, e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingMap.current[idx] = false;
  };

  const clearBox = (idx: number) => {
    speechService.playEffect('clear');
    strokeHistoryMap.current[idx] = [];
    setClearTrigger(prev => prev + 1);
  };

  const clearAllBoxes = () => {
    speechService.playEffect('clear');
    strokeHistoryMap.current = {};
    setClearTrigger(prev => prev + 1);
  };

  const downloadFullSheet = () => {
    const totalBoxes = chars.length;
    const padding = 30;
    const combinedW = totalBoxes * boxSize + (totalBoxes - 1) * 16 + padding * 2;
    const combinedH = boxSize + padding * 2 + 60;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = combinedW;
    exportCanvas.height = combinedH;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Parchment bg
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, combinedW, combinedH);

    // Frame
    ctx.strokeStyle = '#8B2522';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(padding - 10, padding - 10, combinedW - (padding - 10) * 2, combinedH - (padding - 10) * 2);

    // Copy each box
    chars.forEach((_, idx) => {
      const canvas = canvasRefs.current[idx];
      if (canvas) {
        const destX = padding + idx * (boxSize + 16);
        const destY = padding;
        ctx.drawImage(canvas, destX, destY, boxSize, boxSize);
      }
    });

    // Caption
    ctx.fillStyle = '#44403C';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${student.vietnameseName} · ${student.chineseName} (${student.pinyin})`, padding, combinedH - 24);

    const a = document.createElement('a');
    a.href = exportCanvas.toDataURL('image/png');
    a.download = `BaiLuyenViet_${student.vietnameseName.replace(/\s+/g, '_')}.png`;
    a.click();
    speechService.playEffect('bell');
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <span>Luyện Viết Cả Tên Liên Hoàn</span>
            <span className="text-xs font-normal text-stone-500">
              (Viết nối tiếp từng chữ theo thứ tự)
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Mỗi chữ Hán nằm trọn vẹn trong một ô Mễ Tự Cách vuông vắn
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide toggle */}
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              showGuides 
                ? 'border-red-200 bg-red-50 text-red-700' 
                : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {showGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showGuides ? 'Hiện nét mờ' : 'Tự viết'}</span>
          </button>

          {/* Clear all */}
          <button
            onClick={clearAllBoxes}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors"
            title="Xóa toàn bộ các ô để viết lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa hết viết lại</span>
          </button>

          {/* Download */}
          <button
            onClick={downloadFullSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
            title="Tải ảnh toàn bộ tên đã viết"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lưu cả bảng</span>
          </button>
        </div>
      </div>

      {/* Grid of character boxes */}
      <div className="overflow-x-auto pb-3 pt-1">
        <div className="flex items-start gap-4 min-w-max justify-center sm:justify-start mx-auto">
          {chars.map((c, idx) => (
            <div key={`${c.char}-${idx}`} className="flex flex-col items-center gap-2">
              {/* Character Header Label */}
              <div className="flex items-center justify-between w-full px-1">
                <span className="text-xs font-bold text-stone-800 font-chinese text-sm">
                  {c.char} <span className="text-stone-500 font-sans font-normal text-xs">({c.pinyin})</span>
                </span>
                <button
                  onClick={() => speechService.speak(c.char, { rate: 0.75 })}
                  className="w-5 h-5 rounded-full hover:bg-red-50 text-stone-500 hover:text-red-700 flex items-center justify-center transition-colors"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>

              {/* Canvas square */}
              <div className="relative border-2 border-stone-300 rounded-xl overflow-hidden shadow-2xs touch-none bg-[#FCFAF6]">
                <canvas
                  ref={(el) => { canvasRefs.current[idx] = el; }}
                  width={boxSize}
                  height={boxSize}
                  onMouseDown={(e) => handlePointerDown(idx, e)}
                  onMouseMove={(e) => handlePointerMove(idx, e)}
                  onMouseUp={(e) => handlePointerUp(idx, e)}
                  onMouseLeave={(e) => handlePointerUp(idx, e)}
                  onTouchStart={(e) => handlePointerDown(idx, e)}
                  onTouchMove={(e) => handlePointerMove(idx, e)}
                  onTouchEnd={(e) => handlePointerUp(idx, e)}
                  className="w-40 h-40 sm:w-48 sm:h-48 cursor-crosshair block touch-none"
                />
              </div>

              {/* Individual clear button for this character */}
              <button
                onClick={() => clearBox(idx)}
                className="text-[11px] text-stone-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors mt-0.5"
                title={`Xóa chỉ riêng chữ ${c.char} để viết lại`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Xóa ô này</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
