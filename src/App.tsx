/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BookingFlow } from './components/BookingFlow/BookingFlow';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { HowItWorks } from './components/HowItWorks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Booking, CompanySettings } from './types';
import {
  getCompanySettings,
  saveCompanySettings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from './utils/storage';
import { MessageCircle, CalendarCheck, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [company, setCompany] = useState<CompanySettings>(getCompanySettings);
  const [bookings, setBookings] = useState<Booking[]>(getAllBookings);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Sync state on load
    setCompany(getCompanySettings());
    setBookings(getAllBookings());
  }, []);

  const handleSaveSettings = (newSettings: CompanySettings) => {
    saveCompanySettings(newSettings);
    setCompany(newSettings);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    updateBookingStatus(bookingId, status);
    setBookings(getAllBookings());
  };

  const handleDeleteBooking = (bookingId: string) => {
    deleteBooking(bookingId);
    setBookings(getAllBookings());
  };

  const handleBookingComplete = (booking: Booking) => {
    setCompletedBooking(booking);
    setBookings(getAllBookings());
  };

  const scrollToBooking = () => {
    const el = document.getElementById('agendamento-online');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cleanPhone = company.whatsappNumber.replace(/\D/g, '');
  const floatingWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Olá! Gostaria de tirar uma dúvida sobre os serviços de higienização de estofados.'
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <Header
        company={company}
        onOpenBooking={scrollToBooking}
        onOpenAdmin={() => setIsAdminOpen(true)}
        bookingsCount={bookings.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero company={company} onStartBooking={scrollToBooking} />

        {/* Primary Interactive Booking Form */}
        <section id="servicos" className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 uppercase tracking-wider bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 mb-2">
                <CalendarCheck className="w-4 h-4 text-cyan-600" />
                Agendamento Online 24h
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Monte seu agendamento em poucos cliques
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Escolha os itens que deseja higienizar, selecione a melhor data e horário para você
                e envie direto para o nosso WhatsApp.
              </p>
            </div>

            {/* The Stepped Flow */}
            <BookingFlow company={company} onBookingComplete={handleBookingComplete} />
          </div>
        </section>

        {/* Interactive Before & After Slider */}
        <section id="antes-depois" className="py-14 bg-slate-50 border-b border-slate-200/60">
          <BeforeAfterSlider />
        </section>

        {/* How It Works Steps */}
        <HowItWorks />

        {/* Why Choose Us */}
        <section id="vantagens">
          <WhyChooseUs />
        </section>

        {/* Reviews */}
        <ReviewsSection />

        {/* FAQs */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        company={company}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={scrollToBooking}
      />

      {/* Floating WhatsApp Action Button - Mobile First */}
      <aside aria-label="Ações de contato" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-1.5">
        <div className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm hidden sm:flex items-center gap-1.5 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>(82) 99824-0159</span>
        </div>
        <a
          href={floatingWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-90 transition-all font-extrabold text-sm border-2 border-white/20"
          title="Falar no WhatsApp da ExpressCleanMCZ"
        >
          <MessageCircle className="w-6 h-6 fill-white shrink-0" />
          <span className="text-xs sm:text-sm">WhatsApp da Empresa</span>
        </a>
      </aside>

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanelModal
          company={company}
          bookings={bookings}
          onSaveSettings={handleSaveSettings}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Order Complete Success Modal */}
      {completedBooking && (
        <OrderSuccessModal
          booking={completedBooking}
          company={company}
          onClose={() => setCompletedBooking(null)}
        />
      )}
    </div>
  );
}
