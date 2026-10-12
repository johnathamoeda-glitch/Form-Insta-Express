import React, { useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sun,
  Sunset,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AVAILABLE_TIME_SLOTS } from '../../data/services';
import { formatDateBr } from '../../utils/whatsapp';

interface StepDateTimeProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  selectedTimeSlot: string; // e.g., '09:00'
  onSelectTimeSlot: (slot: string, shift: 'morning' | 'afternoon') => void;
  onBack: () => void;
  onProceed: () => void;
  estimatedMinutes: number;
}

export const StepDateTime: React.FC<StepDateTimeProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  onBack,
  onProceed,
  estimatedMinutes,
}) => {
  // Generate the next 18 available days
  const availableDays = useMemo(() => {
    const days: { dateStr: string; label: string; weekday: string; isSunday: boolean }[] = [];
    const now = new Date();

    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    for (let i = 0; i < 21; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayOfWeek = d.getDay();
      const isSunday = dayOfWeek === 0;

      let label = `${day} ${monthNames[d.getMonth()]}`;
      if (i === 0) label = 'Hoje';
      if (i === 1) label = 'Amanhã';

      days.push({
        dateStr,
        label,
        weekday: weekdayNames[dayOfWeek],
        isSunday,
      });
    }

    return days;
  }, []);

  const morningSlots = AVAILABLE_TIME_SLOTS.filter((s) => s.shift === 'morning');
  const afternoonSlots = AVAILABLE_TIME_SLOTS.filter((s) => s.shift === 'afternoon');

  const isValid = Boolean(selectedDate && selectedTimeSlot);

  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;
  const timeFormatted =
    hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` : `${minutes}min`;

  return (
    <div className="space-y-8">
      {/* Header instructions */}
      <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Passo 2: Escolha a Data e o Horário do Atendimento
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Nossa equipe vai até a sua residência no horário selecionado. Tempo estimado do
            serviço: <strong>~{timeFormatted}</strong>.
          </p>
        </div>
      </div>

      {/* Date Picker Horizontal Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-cyan-600" />
            <span>Selecione o Dia:</span>
          </label>
          {selectedDate && (
            <span className="text-xs font-semibold text-cyan-700">
              Selecionado: {formatDateBr(selectedDate)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
          {availableDays.map((d) => {
            const isSelected = selectedDate === d.dateStr;

            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => onSelectDate(d.dateStr)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-cyan-500/30'
                    : d.isSunday
                    ? 'bg-slate-50/60 border-slate-200 text-slate-400 hover:border-slate-300'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/20'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold tracking-wide uppercase ${
                    isSelected ? 'text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  {d.weekday}
                </span>
                <span className="text-sm font-extrabold mt-0.5 leading-none">{d.label}</span>
                {d.isSunday && (
                  <span className="text-[10px] text-amber-600/80 mt-1 font-medium">Plantão</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker */}
      <div className="space-y-6 pt-2">
        <div>
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Selecione o Horário de Início:</span>
          </label>
        </div>

        {/* Morning Turn */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Período da Manhã (08h às 12h)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {morningSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onSelectTimeSlot(slot.time, slot.shift)}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm ring-2 ring-cyan-500/20'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-cyan-300 hover:bg-cyan-50/20'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                  <span>{slot.time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Afternoon Turn */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sunset className="w-4 h-4 text-amber-600" />
            <span>Período da Tarde / Noite (13h às 19h)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {afternoonSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onSelectTimeSlot(slot.time, slot.shift)}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm ring-2 ring-cyan-500/20'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-cyan-300 hover:bg-cyan-50/20'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                  <span>{slot.time}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Time banner */}
      {isValid && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            Agendamento marcado para{' '}
            <strong>{formatDateBr(selectedDate)}</strong> às <strong>{selectedTimeSlot}</strong>.
            Equipe chegará com tolerância máxima de 15 minutos.
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Serviços</span>
        </button>

        <button
          type="button"
          onClick={onProceed}
          disabled={!isValid}
          className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            isValid
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/25 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continuar para Endereço</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
