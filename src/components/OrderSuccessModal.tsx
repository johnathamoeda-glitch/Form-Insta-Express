import React from 'react';
import {
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Calendar,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Booking, CompanySettings } from '../types';
import { formatWhatsAppMessage, getWhatsAppUrl, formatDateBr } from '../utils/whatsapp';

interface OrderSuccessModalProps {
  booking: Booking;
  company: CompanySettings;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  booking,
  company,
  onClose,
}) => {
  const formattedMessage = formatWhatsAppMessage(booking, company);
  const waUrl = getWhatsAppUrl(company.whatsappNumber, formattedMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Protocolo #{booking.code}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Agendamento Enviado!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Seu pedido foi registrado no sistema e encaminhado para o WhatsApp de nossa equipe.
            </p>
          </div>

          {/* Key Recap Box */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Cliente:</span>
              <span className="font-bold text-slate-900">{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data & Horário:</span>
              <span className="font-bold text-slate-900">
                {formatDateBr(booking.date)} às {booking.timeSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Valor Estimado:</span>
              <span className="font-bold text-teal-700">
                R$ {booking.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pagamento:</span>
              <span className="font-medium text-slate-800">{booking.paymentMethod.toUpperCase()}</span>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div className="space-y-2 text-left bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Confirmação rápida:</strong> Nossa equipe responde pelo WhatsApp em poucos
                minutos para validar o itinerário da van.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Garantia e Segurança:</strong> O pagamento só é realizado na sua casa após
                o serviço pronto e aprovado.
              </span>
            </div>
          </div>

          {/* Re-open WhatsApp CTA */}
          <div className="pt-2 space-y-2">
            <a
              href={waUrl}
              className="w-full min-h-[50px] flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white shrink-0" />
              <span>Abrir no WhatsApp ({company.displayPhone})</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
            >
              Concluir e Voltar ao Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
