import React from 'react';
import {
  ShieldCheck,
  Zap,
  Leaf,
  Clock,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Extratoras Industriais de Alto Vácuo',
      desc: 'Equipamentos potentes que injetam solução sanitizante e sugam até 90% da umidade, garantindo limpeza nas camadas mais profundas da espuma.',
    },
    {
      icon: Leaf,
      title: 'Química Ecológica Certificada ANVISA',
      desc: 'Produtos dermatologicamente testados, atóxicos e biodegradáveis. Não deixam cheiro forte e são 100% seguros para bebês e animais domésticos.',
    },
    {
      icon: ShieldCheck,
      title: 'Garantia de Qualidade de 7 Dias',
      desc: 'Se alguma mancha tratada ressurgir durante o período de secagem, nossa equipe retorna para reaplicar o produto sem nenhum custo adicional.',
    },
    {
      icon: Clock,
      title: 'Secagem Turbo no Mesmo Dia',
      desc: 'Graças ao alto poder de sucção, seu estofado fica apenas levemente umedecido e seca por completo em poucas horas no próprio ambiente.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Diferenciais de Excelência
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Por que escolher nossa higienização?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Cuidado profissional que renova o visual, elimina micróbios e devolve a saúde para o
            seu lar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-cyan-300 hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
