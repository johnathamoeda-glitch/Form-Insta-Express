import React from 'react';
import {
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  MessageCircle,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface HeroProps {
  company: CompanySettings;
  onStartBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ company, onStartBooking }) => {
  const cleanPhone = company.whatsappNumber.replace(/\D/g, '');
  const directWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Olá! Gostaria de saber mais sobre a higienização de estofados.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/60 via-white to-slate-50 pt-8 pb-16 sm:pt-14 sm:pb-24">
      {/* Decorative blurred background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-10 left-1/4 w-80 h-80 bg-cyan-200/50 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Persuasive copy and CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top trust kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-900 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>Tecnologia de Extração Profunda & Secagem Rápida</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Higienização & Blindagem de Estofados{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                em Maceió e Região
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Elimine ácaros, bactérias, manchas e odores no conforto da sua casa.
              Selecione seus estofados, escolha o horário e envie seu agendamento
              direto para o nosso <strong className="text-emerald-700">WhatsApp (82) 99824-0159</strong> em menos de 2 minutos!
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Produtos ANVISA:</strong> Hipoalergênicos e seguros para bebês e pets
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Extração a Vácuo:</strong> Remove 90% da água com secagem rápida
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Atendimento a Domicílio:</strong> Ponta Verde, Jatiúca e toda Maceió
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Pagamento no Final:</strong> Só pague após conferir o resultado
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <button
                onClick={onStartBooking}
                className="w-full sm:w-auto min-h-[50px] flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 rounded-xl shadow-lg shadow-cyan-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Agendar Meu Estofado Online</span>
              </button>

              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[50px] flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-emerald-800 bg-white hover:bg-emerald-50 border-2 border-emerald-500 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp: (82) 99824-0159</span>
              </a>
            </div>

            {/* Social proof metric strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-800 text-sm">4.9/5</span>
                <span>(+3.800 clientes atendidos)</span>
              </div>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Empresa Verificada & Segura</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual hero card with high quality imagery and interactive badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"
                  alt="Sofá higienizado e revitalizado"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Floating pill over image */}
                <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-cyan-700">
                      Higienização Profunda
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Sofá Retrátil, Cama & Colchões
                    </h4>
                    <p className="text-xs text-slate-500">
                      Orçamento transparente sem cobrança oculta
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">a partir de</span>
                    <span className="text-xl font-extrabold text-teal-700">R$ 120</span>
                  </div>
                </div>
              </div>

              {/* Floating fast booking tag */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-teal-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Agendamento em 2 min</div>
                  <div className="text-[11px] text-slate-500">Direto no WhatsApp</div>
                </div>
              </div>

              {/* Floating satisfaction tag */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Secagem Rápida</div>
                  <div className="text-[11px] text-slate-500">Pronto para uso hoje</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
