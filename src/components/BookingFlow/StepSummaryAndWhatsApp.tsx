import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  QrCode,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  PhoneCall,
  Info,
} from 'lucide-react';
import { Booking, CompanySettings } from '../../types';
import {
  formatWhatsAppMessage,
  getWhatsAppUrl,
  getQrCodeUrl,
  formatDateBr,
} from '../../utils/whatsapp';

interface StepSummaryAndWhatsAppProps {
  booking: Booking;
  company: CompanySettings;
  onBack: () => void;
  onBookingSubmitted: () => void;
}

export const StepSummaryAndWhatsApp: React.FC<StepSummaryAndWhatsAppProps> = ({
  booking,
  company,
  onBack,
  onBookingSubmitted,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const formattedMessage = useMemo(() => {
    return formatWhatsAppMessage(booking, company);
  }, [booking, company]);

  const waUrl = useMemo(() => {
    return getWhatsAppUrl(company.whatsappNumber, formattedMessage);
  }, [company.whatsappNumber, formattedMessage]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    onBookingSubmitted();
    // Open in new tab or app
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Intro celebration header */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-200/60 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Tudo Pronto!
            </span>
            <span className="text-xs font-mono font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
              Protocolo #{booking.code}
            </span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-slate-900 mt-0.5">
            Envie seu agendamento para o WhatsApp da {company.companyName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Clique no botão abaixo para abrir a conversa com nossa equipe. Todos os detalhes
            já foram organizados para confirmação imediata!
          </p>
        </div>
      </div>

      {/* Primary WhatsApp Action Card */}
      <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-xl shadow-emerald-500/10 text-center space-y-5">
        <div className="max-w-md mx-auto space-y-3">
          <a
            href={waUrl}
            onClick={onBookingSubmitted}
            className="w-full min-h-[58px] flex items-center justify-center gap-3 px-6 py-4 sm:py-5 text-base sm:text-lg font-black text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer group"
          >
            <MessageCircle className="w-7 h-7 fill-white group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-center">ENVIAR AGENDAMENTO NO WHATSAPP</span>
          </a>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Abre direto no WhatsApp <strong>{company.displayPhone}</strong></span>
          </div>
        </div>

        {/* Action tools: Copy & QR code */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopyMessage}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Mensagem Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Texto da Mensagem</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowQrCode(!showQrCode)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-slate-500" />
            <span>{showQrCode ? 'Ocultar QR Code' : 'Escanear com Celular (QR Code)'}</span>
          </button>
        </div>

        {/* QR Code Container for Desktop users */}
        {showQrCode && (
          <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-xs mx-auto animate-in fade-in zoom-in-95 duration-200">
            <p className="text-xs font-semibold text-slate-700 mb-3">
              Aponte a câmera do seu smartphone para abrir no WhatsApp:
            </p>
            <div className="bg-white p-3 rounded-xl shadow-sm inline-block border border-slate-200">
              <img
                src={getQrCodeUrl(waUrl, 200)}
                alt="QR Code WhatsApp Agendamento"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Direciona diretamente para {company.displayPhone}
            </p>
          </div>
        )}
      </div>

      {/* Appointment Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Details summary */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
            <span>Resumo do Atendimento</span>
            <span className="text-xs font-semibold text-cyan-700">Protocolo #{booking.code}</span>
          </h4>

          {/* Date & Time pill */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>
                <strong>Data:</strong> {formatDateBr(booking.date)}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>
                <strong>Horário:</strong> {booking.timeSlot} (~{booking.estimatedDurationMinutes} min)
              </span>
            </div>
          </div>

          {/* Address pill */}
          <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-800">
            <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Endereço de Atendimento:</span>
              <p className="text-slate-600 mt-0.5">
                {booking.address.street}, Nº {booking.address.number}
                {booking.address.complement && ` (${booking.address.complement})`} -{' '}
                {booking.address.neighborhood}, {booking.address.city}/{booking.address.state}
              </p>
              {booking.address.reference && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ref: {booking.address.reference}
                </p>
              )}
            </div>
          </div>

          {/* Items List */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Itens Selecionados ({booking.items.length}):
            </span>
            <div className="space-y-2">
              {booking.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 text-xs sm:text-sm"
                >
                  <span className="font-semibold text-slate-800">
                    {item.quantity}x {item.serviceName}
                  </span>
                  <span className="font-bold text-slate-900">
                    R$ {item.subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}

              {booking.globalAddons.map((addon, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-teal-100 bg-teal-50/40 text-xs sm:text-sm"
                >
                  <span className="font-semibold text-teal-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    {addon.name}
                  </span>
                  <span className="font-bold text-teal-900">
                    +R$ {addon.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal dos serviços:</span>
              <span>R$ {booking.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {booking.addonsTotal > 0 && (
              <div className="flex justify-between text-teal-700">
                <span>Proteção e Opcionais:</span>
                <span>+R$ {booking.addonsTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            {booking.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Desconto PIX ({company.pixDiscountPercent}%):</span>
                <span>-R$ {booking.discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Taxa de deslocamento:</span>
              <span>{booking.travelFee === 0 ? 'Grátis' : `R$ ${booking.travelFee.toFixed(2).replace('.', ',')}`}</span>
            </div>
            <div className="flex justify-between text-slate-950 font-extrabold text-base sm:text-lg pt-2 border-t border-slate-200">
              <span>Valor Total Estimado:</span>
              <span className="text-teal-700">
                R$ {booking.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 text-right">
              Forma de pagamento escolhida: {booking.paymentMethod.toUpperCase()} (pago no término)
            </p>
          </div>
        </div>

        {/* Right: WhatsApp message live simulated bubble */}
        <div className="md:col-span-5 flex flex-col">
          <div className="bg-[#e5ddd5] rounded-3xl p-4 sm:p-5 shadow-inner border border-slate-300 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/10">
              <div className="w-8 h-8 rounded-full bg-[#075e54] text-white flex items-center justify-center font-bold text-xs">
                EC
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-none">
                  {company.companyName}
                </div>
                <div className="text-[10px] text-slate-600">Prévia da mensagem pronta</div>
              </div>
            </div>

            {/* Chat Bubble */}
            <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm text-[12px] sm:text-[13px] text-slate-800 font-sans leading-relaxed whitespace-pre-wrap break-words border border-slate-200/60 max-h-96 overflow-y-auto">
              {formattedMessage}
            </div>

            <div className="mt-3 text-center">
              <span className="text-[11px] text-slate-600">
                👆 Esta mensagem já está pronta para envio com 1 clique!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar e editar informações</span>
        </button>
      </div>
    </div>
  );
};
