import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  Clock,
  MapPin,
  CalendarCheck,
  Settings,
  MessageCircle,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface HeaderProps {
  company: CompanySettings;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  bookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  company,
  onOpenBooking,
  onOpenAdmin,
  bookingsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = company.whatsappNumber.replace(/\D/g, '');
  const directWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Olá! Estava no site da ' + company.companyName + ' e gostaria de tirar uma dúvida sobre higienização de estofados.'
  )}`;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Atendimento em {company.addressCity}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {company.operatingHours}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Agenda Aberta para esta semana
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs group"
              title="Acessar painel de gerenciamento e alterar WhatsApp"
            >
              <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span>Painel do Dono {bookingsCount > 0 && `(${bookingsCount})`}</span>
            </button>
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{company.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {company.companyName}
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Higienização & Blindagem
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('servicos')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Serviços & Preços
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('antes-depois')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Antes & Depois
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Dúvidas
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Agendar Online</span>
            </button>
          </div>

          {/* Mobile quick actions: WhatsApp button + Agendar + Hamburger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <a
              href={directWaUrl}
              className="flex items-center justify-center p-2 rounded-xl bg-emerald-500 text-white shadow-xs active:scale-95"
              title="Falar no WhatsApp"
              aria-label="Falar no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>
            <button
              onClick={onOpenBooking}
              className="px-3 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 active:scale-95 rounded-xl shadow-xs"
            >
              Agendar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={() => scrollToSection('servicos')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              Serviços & Preços
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('antes-depois')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              Antes & Depois
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              Depoimentos de Clientes
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              Perguntas Frequentes
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-md"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Agendar Agora Online</span>
            </button>

            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Falar no WhatsApp ({company.displayPhone})</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Painel do Dono da Empresa (WhatsApp: {company.whatsappNumber})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
