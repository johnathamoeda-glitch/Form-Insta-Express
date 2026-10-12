import React from 'react';
import { Sofa, CalendarCheck, MessageCircle, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Escolha os Estofados',
      description:
        'Selecione sofás, colchões, poltronas ou bancos automotivos e turbine com impermeabilização ou sanitização.',
      icon: Sofa,
    },
    {
      step: '02',
      title: 'Selecione Dia & Horário',
      description:
        'Indique a data que melhor se encaixa na sua rotina e o período preferido (manhã ou tarde).',
      icon: CalendarCheck,
    },
    {
      step: '03',
      title: 'Agendamento no WhatsApp',
      description:
        'Com 1 clique, sua solicitação detalhada chega ao WhatsApp do operador para confirmação imediata da van.',
      icon: MessageCircle,
    },
    {
      step: '04',
      title: 'Higienização a Domicílio',
      description:
        'Nossa equipe especializada vai até sua casa com maquinário de ponta. Você só paga após conferir o serviço!',
      icon: Sparkles,
    },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            Processo Simples & Transparente
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Como funciona o agendamento?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Sem cadastro longo ou burocracia. Em menos de 2 minutos você agenda a higienização do
            seu estofado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 transition-all hover:shadow-md hover:bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
