import React from 'react';
import {
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  Settings,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  company: CompanySettings;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ company, onOpenAdmin, onOpenBooking }) => {
  const cleanPhone = company.whatsappNumber.replace(/\D/g, '');
  const directWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Olá! Estava no site da ' + company.companyName + ' e gostaria de tirar uma dúvida.'
  )}`;

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">{company.companyName}</span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs sm:text-sm leading-relaxed">
              {company.tagline}. Atendimento a domicílio com tecnologia industrial de extração a
              vácuo e sanitização profunda com produtos registrados na ANVISA.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia de 7 dias e pagamento seguro pós-atendimento</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Serviços Principais</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Higienização de Sofás (2 a 6 lugares)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Limpeza Profunda de Colchões
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Blindagem & Impermeabilização
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Higienização de Bancos Automotivos
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Cadeiras de Jantar & Poltronas
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Atendimento & Contato</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Atendimento a domicílio em: {company.addressCity}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{company.operatingHours}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  WhatsApp: {company.displayPhone}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configurar WhatsApp da Empresa</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {company.companyName}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido para agendamentos rápidos via WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
