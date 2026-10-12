import React, { useState } from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';

interface Props {
  beforeImg?: string;
  afterImg?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSlider: React.FC<Props> = ({
  beforeImg = 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
  afterImg = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  title = 'O Poder da Extração Profunda',
  subtitle = 'Arraste a barra para comparar o tecido antes e depois da higienização industrial',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - container.left) / container.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          Resultado Comprovado
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-1">
          {subtitle}
        </p>
      </div>

      <div
        className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl select-none cursor-ew-resize border border-slate-200"
        onMouseMove={(e) => isDragging && handleSliderMove(e)}
        onTouchMove={(e) => isDragging && handleSliderMove(e)}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleSliderMove(e);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleSliderMove(e);
        }}
        onMouseUp={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* AFTER Image (Full background) */}
        <img
          src={afterImg}
          alt="Estofado limpo higienizado"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm pointer-events-none">
          Depois (Higienizado) ✨
        </div>

        {/* BEFORE Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none transition-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImg}
            alt="Estofado antes da limpeza"
            className="absolute inset-0 w-full h-full object-cover max-w-none filter brightness-75 contrast-125 sepia-20"
            style={{ width: '100%', minWidth: '100%', objectFit: 'cover' }}
          />
          <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm pointer-events-none">
            Antes (Poeira e Manchas)
          </div>
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none transform -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Drag Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white text-cyan-700 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-600 cursor-grab active:cursor-grabbing">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
        <span>Arraste para a esquerda</span>
        <span className="font-medium text-cyan-800">Interativo: deslize para comparar</span>
        <span>Arraste para a direita</span>
      </div>
    </div>
  );
};
