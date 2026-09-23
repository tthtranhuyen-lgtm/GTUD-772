import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  RotateCcw, 
  Download, 
  Eye, 
  EyeOff, 
  Grid, 
  Brush, 
  PenTool, 
  Undo2,
  Redo2,
  Sparkles
} from 'lucide-react';
import { speechService } from '../utils/speech';

interface Point {
  x: number;
  y: number;
  time: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  brushType: 'calligraphy' | 'ink';
}

interface CalligraphyCanvasProps {
  char: string;
  pinyin: string;
  hanViet: string;
  studentName: string;
  allChars?: string[];
  selectedCharIndex?: number;
  onSelectCharIndex?: (idx: number) => void;
}

export const CalligraphyCanvas: React.FC<CalligraphyCanvasProps> = ({
  char,
  pinyin,
  hanViet,
  studentName,
  allChars = [],
  selectedCharIndex = 0,
  onSelectCharIndex
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Canvas drawing state
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastPointRef = useRef<Point | null>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStrokes, setRedoStrokes] = useState<Stroke[]>([]);
  const [hasDrawnNotice, setHasDrawnNotice] = useState<boolean>(false);

  // Settings
  const [gridType, setGridType] = useState<'mige' | 'tianzige' | 'none'>('mige');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.22);
  const [brushType, setBrushType] = useState<'calligraphy' | 'ink'>('calligraphy');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [brushColor, setBrushColor] = useState<string>('#18181B'); // Chinese ink black
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 440, height: 440 });

  const colors = [
    { label: 'Mực Tàu', value: '#18181B', bg: 'bg-[#18181B]' },
    { label: 'Đỏ Chu Sa', value: '#B91C1C', bg: 'bg-[#B91C1C]' },
    { label: 'Lam Chàm', value: '#1E3A8A', bg: 'bg-[#1E3A8A]' },
    { label: 'Nâu Cổ Điển', value: '#78350F', bg: 'bg-[#78350F]' },
  ];

  // Adjust canvas size to parent container
  useEffect(() => {
    const updateSize = () => {
      try {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const minSide = Math.min(rect.width - 32, 460);
          const side = Math.max(minSide, 280);
          setCanvasDimensions({ width: side, height: side });
        }
      } catch (e) {
        console.warn('Canvas resize error', e);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Redraw canvas background, grid, trace watermark, and completed strokes
  const redraw = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvasDimensions;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Paper Background
      ctx.fillStyle = '#FCFAF6';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Grid (Mige / Tianzige)
      if (gridType !== 'none') {
        ctx.save();
        const padding = 12;
        const boxSize = width - padding * 2;
        const x0 = padding;
        const y0 = padding;
        const x1 = width - padding;
        const y1 = height - padding;
        const midX = width / 2;
        const midY = height / 2;

        // Outer border (Solid red-ochre)
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x0, y0, boxSize, boxSize);

        // Inner thin grid
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.45)';

        // Crosshairs (+ center)
        ctx.beginPath();
        ctx.moveTo(midX, y0);
        ctx.lineTo(midX, y1);
        ctx.moveTo(x0, midY);
        ctx.lineTo(x1, midY);
        ctx.stroke();

        // Diagonals (X center for Mige)
        if (gridType === 'mige') {
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.moveTo(x1, y0);
          ctx.lineTo(x0, y1);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 3. Draw Watermark Character (Trace Guide)
      if (showWatermark && char) {
        ctx.save();
        ctx.font = `600 ${Math.floor(width * 0.72)}px "Noto Serif SC", "Songti SC", "SimSun", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(185, 28, 28, ${watermarkOpacity})`;
        ctx.fillText(char, width / 2, height / 2 + (width * 0.04));
        ctx.restore();
      }

      // 4. Draw User Strokes safely
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      strokes.forEach(stroke => {
        if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) return;
        ctx.save();
        ctx.strokeStyle = stroke.color || '#18181B';
        ctx.fillStyle = stroke.color || '#18181B';

        if (stroke.points.length === 1) {
          ctx.beginPath();
          ctx.arc(stroke.points[0].x, stroke.points[0].y, (stroke.size || 8) / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (stroke.brushType === 'ink') {
          ctx.lineWidth = stroke.size || 8;
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            const p = stroke.points[i];
            if (p) ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        } else {
          // Dynamic calligraphy stroke
          for (let i = 1; i < stroke.points.length; i++) {
            const p1 = stroke.points[i - 1];
            const p2 = stroke.points[i];
            if (!p1 || !p2) continue;

            const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            const time = Math.max(p2.time - p1.time, 1);
            const speed = dist / time;

            const baseSize = stroke.size || 8;
            const dynamicSize = Math.max(baseSize * 0.45, Math.min(baseSize * 1.5, baseSize * (1.1 - speed * 0.3)));

            ctx.lineWidth = dynamicSize;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        ctx.restore();
      });
    } catch (err) {
      console.error('Error drawing canvas:', err);
    }
  }, [canvasDimensions, gridType, showWatermark, watermarkOpacity, char, strokes]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // When changing character, reset canvas state safely
  useEffect(() => {
    setStrokes([]);
    setRedoStrokes([]);
    setHasDrawnNotice(false);
    isDrawingRef.current = false;
    currentStrokeRef.current = null;
    lastPointRef.current = null;
  }, [char]);

  // Get pointer coordinates relative to canvas safely
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return null;

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        const touch = e.touches[0] || ('changedTouches' in e ? e.changedTouches[0] : null);
        if (!touch) return null;
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (typeof clientX !== 'number' || typeof clientY !== 'number' || isNaN(clientX) || isNaN(clientY)) {
        return null;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
        time: Date.now()
      };
    } catch {
      return null;
    }
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
    const point = getCoordinates(e);
    if (!point) return;

    isDrawingRef.current = true;
    setHasDrawnNotice(true);

    const newStroke: Stroke = {
      points: [point],
      color: brushColor,
      size: brushSize,
      brushType: brushType
    };

    currentStrokeRef.current = newStroke;
    lastPointRef.current = point;

    // Draw single dot on canvas directly (Zero delay, no React state trigger)
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.fillStyle = brushColor;
        ctx.beginPath();
        ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current || !lastPointRef.current) return;
    if (e.cancelable) e.preventDefault();

    const point = getCoordinates(e);
    if (!point) return;

    const p1 = lastPointRef.current;
    const p2 = point;

    // Append to current stroke in memory (NOT triggering React re-render per pixel!)
    currentStrokeRef.current.points.push(p2);
    lastPointRef.current = p2;

    // Incremental direct 2D context draw - Instant 120fps smooth performance
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;

        if (brushType === 'ink') {
          ctx.lineWidth = brushSize;
        } else {
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const time = Math.max(p2.time - p1.time, 1);
          const speed = dist / time;
          ctx.lineWidth = Math.max(brushSize * 0.45, Math.min(brushSize * 1.5, brushSize * (1.1 - speed * 0.3)));
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const handlePointerUp = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    if (e.cancelable) e.preventDefault();
    isDrawingRef.current = false;

    // Commit completed stroke to state ONCE when pen lifts
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      const finishedStroke = { ...currentStrokeRef.current };
      setStrokes(prev => [...prev, finishedStroke]);
      setRedoStrokes([]);
    }

    currentStrokeRef.current = null;
    lastPointRef.current = null;
  };

  // Actions
  const handleClear = () => {
    speechService.playEffect('clear');
    setStrokes([]);
    setRedoStrokes([]);
    currentStrokeRef.current = null;
    lastPointRef.current = null;
    isDrawingRef.current = false;
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const lastStroke = strokes[strokes.length - 1];
    setRedoStrokes(prev => [...prev, lastStroke]);
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStrokes.length === 0) return;
    const strokeToRestore = redoStrokes[redoStrokes.length - 1];
    setStrokes(prev => [...prev, strokeToRestore]);
    setRedoStrokes(prev => prev.slice(0, -1));
  };

  const handleDownload = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const exportCanvas = document.createElement('canvas');
      const border = 40;
      exportCanvas.width = canvas.width + border * 2;
      exportCanvas.height = canvas.height + border * 2 + 50;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#F5F2EB';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Frame
      ctx.strokeStyle = '#8B2522';
      ctx.lineWidth = 3;
      ctx.strokeRect(border - 10, border - 10, canvas.width + 20, canvas.height + 20);

      // Draw main writing
      ctx.drawImage(canvas, border, border);

      // Footer signature / Student Name & Pinyin
      ctx.fillStyle = '#44403C';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${studentName} · ${char} (${pinyin})`, border, exportCanvas.height - 24);

      // Traditional red seal emblem on bottom right
      const sealX = exportCanvas.width - border - 46;
      const sealY = exportCanvas.height - 48;
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(sealX, sealY, 36, 36);
      ctx.strokeStyle = '#FEE2E2';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sealX + 2, sealY + 2, 32, 32);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('学', sealX + 18, sealY + 18);

      const dataUrl = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `LuyenViet_${char}_${studentName.replace(/\s+/g, '_')}.png`;
      a.click();
      speechService.playEffect('bell');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Bar for Character Selector in Name */}
      {Array.isArray(allChars) && allChars.length > 0 && onSelectCharIndex && (
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Chọn chữ để luyện:
            </span>
            <div className="flex items-center gap-1.5">
              {allChars.map((c, idx) => {
                const isActive = idx === selectedCharIndex;
                return (
                  <button
                    key={`${c}-${idx}`}
                    onClick={() => onSelectCharIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-red-700 text-white font-semibold shadow-sm' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="font-chinese text-base">{c}</span>
                    <span className="text-xs opacity-90">({idx + 1})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
            <span>Âm đọc: <strong className="text-stone-800 font-medium">{pinyin}</strong></span>
            <span>·</span>
            <span>Hán-Việt: <strong className="text-stone-800 font-medium">{hanViet}</strong></span>
          </div>
        </div>
      )}

      {/* Main Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Column */}
        <div 
          ref={containerRef} 
          className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-white border border-stone-200/80 rounded-2xl shadow-sm"
        >
          {/* Header Controls for Canvas */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>Bảng Viết Mễ Tự Cách (米字格)</span>
            </div>

            {/* Quick Trace Guide Toggle */}
            <button
              onClick={() => setShowWatermark(!showWatermark)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors ${
                showWatermark 
                  ? 'border-red-200 bg-red-50 text-red-700' 
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
              title="Bật/Tắt chữ mờ làm mẫu"
            >
              {showWatermark ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showWatermark ? 'Hiện nét mờ mẫu' : 'Tự viết (Ẩn mẫu)'}</span>
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div 
            className="relative rounded-xl overflow-hidden shadow-inner border-2 border-stone-300 select-none bg-[#FCFAF6]"
            style={{ touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              onTouchCancel={handlePointerUp}
              className="cursor-crosshair block"
              style={{
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`,
                touchAction: 'none'
              }}
            />

            {/* Subtle empty hint when no strokes drawn */}
            {!hasDrawnNotice && strokes.length === 0 && (
              <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-[11px] bg-white/90 backdrop-blur-xs text-stone-500 px-3 py-1 rounded-full border border-stone-200 shadow-xs">
                  Dùng ngón tay hoặc chuột để tập viết vào ô
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: XÓA ĐI VIẾT LẠI, HOÀN TÁC, TẢI VỀ */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-2">
              {/* PRIMARY: Xóa đi viết lại */}
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-red-500"
                title="Xóa toàn bộ nét vẽ để viết lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xóa đi viết lại</span>
              </button>

              {/* Undo */}
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors"
                title="Hoàn tác nét vừa viết"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hoàn tác</span>
              </button>

              {/* Redo */}
              <button
                onClick={handleRedo}
                disabled={redoStrokes.length === 0}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors"
                title="Làm lại nét đã hoàn tác"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export image */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors"
              title="Tải ảnh chữ đã viết"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Lưu nét chữ</span>
            </button>
          </div>
        </div>

        {/* Tools & Adjustment Deck */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Tool Card: Bút & Mực */}
          <div className="p-4 bg-white border border-stone-200/80 rounded-xl shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <Brush className="w-3.5 h-3.5 text-stone-600" />
              <span>Công cụ cọ & mực</span>
            </h4>

            {/* Brush Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setBrushType('calligraphy')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  brushType === 'calligraphy' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Brush className="w-3.5 h-3.5 text-red-600" />
                <span>Bút lông thư pháp</span>
              </button>
              <button
                onClick={() => setBrushType('ink')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  brushType === 'ink' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-stone-700" />
                <span>Bút nét đều</span>
              </button>
            </div>

            {/* Brush Thickness */}
            <div>
              <div className="flex justify-between items-center text-xs text-stone-600 mb-1.5">
                <span>Độ dày nét cọ:</span>
                <span className="font-semibold text-stone-800">{brushSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                {[4, 8, 12, 18].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`flex-1 py-1.5 text-xs rounded-md border text-center transition-all ${
                      brushSize === size 
                        ? 'border-red-600 bg-red-50 text-red-700 font-semibold' 
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    {size === 4 && 'Mảnh'}
                    {size === 8 && 'Vừa'}
                    {size === 12 && 'Đậm'}
                    {size === 18 && 'Đại'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ink Colors */}
            <div>
              <div className="text-xs text-stone-600 mb-1.5">Màu mực:</div>
              <div className="flex items-center gap-2.5">
                {colors.map(c => {
                  const isSelected = brushColor === c.value;
                  return (
                    <button
                      key={c.value}
                      onClick={() => setBrushColor(c.value)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                        isSelected 
                          ? 'border-stone-800 bg-stone-100 font-semibold text-stone-900 shadow-2xs' 
                          : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bg} shrink-0`}></span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid & Guide Settings */}
          <div className="p-4 bg-white border border-stone-200/80 rounded-xl shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <Grid className="w-3.5 h-3.5 text-stone-600" />
              <span>Khung lưới tập viết</span>
            </h4>

            {/* Grid Style Toggle */}
            <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setGridType('mige')}
                className={`py-1.5 text-xs font-medium rounded-md text-center transition-all ${
                  gridType === 'mige' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Mễ Tự (米)
              </button>
              <button
                onClick={() => setGridType('tianzige')}
                className={`py-1.5 text-xs font-medium rounded-md text-center transition-all ${
                  gridType === 'tianzige' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Điền Tự (田)
              </button>
              <button
                onClick={() => setGridType('none')}
                className={`py-1.5 text-xs font-medium rounded-md text-center transition-all ${
                  gridType === 'none' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Không lưới
              </button>
            </div>

            {/* Watermark Opacity Slider */}
            {showWatermark && (
              <div className="pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center text-xs text-stone-600 mb-1">
                  <span>Độ mờ chữ mẫu:</span>
                  <span className="font-semibold text-stone-800">{Math.round(watermarkOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.45"
                  step="0.02"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Quick Tip for Chinese stroke practice */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950 mb-0.5">Quy tắc viết bút thuận:</p>
              <p className="text-amber-800">
                Từ trên xuống dưới · Từ trái sang phải · Ngang trước sổ sau · Ngoài trước trong sau · Vào trước đóng sau.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
