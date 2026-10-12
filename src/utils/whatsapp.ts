import { Booking, CompanySettings } from '../types';

export function formatWhatsAppMessage(booking: Booking, company: CompanySettings): string {
  const dateFormatted = formatDateBr(booking.date);
  
  const itemsText = booking.items
    .map(i => {
      const addonsText = i.addons.length > 0 
        ? `\n    └ Adicionais: ${i.addons.map(a => a.name).join(', ')}`
        : '';
      return `• *${i.quantity}x ${i.serviceName}* - R$ ${i.subtotal.toFixed(2).replace('.', ',')}${addonsText}`;
    })
    .join('\n');

  const globalAddonsText = booking.globalAddons.length > 0
    ? `\n🛡️ *Opcionais Inclusos:*\n${booking.globalAddons.map(a => `• ${a.name} (+R$ ${a.price.toFixed(2).replace('.', ',')})`).join('\n')}`
    : '';

  const addressFormatted = `${booking.address.street}, Nº ${booking.address.number}${booking.address.complement ? ` (${booking.address.complement})` : ''} - ${booking.address.neighborhood}, ${booking.address.city}/${booking.address.state} (CEP: ${booking.address.cep})${booking.address.reference ? `\n📍 *Ref:* ${booking.address.reference}` : ''}`;

  const paymentLabels: Record<string, string> = {
    pix: `PIX (com ${company.pixDiscountPercent}% de desconto)`,
    credit_card: 'Cartão de Crédito (na entrega do serviço)',
    debit_card: 'Cartão de Débito (na entrega do serviço)',
    cash: 'Dinheiro (na entrega do serviço)',
  };

  const paymentText = paymentLabels[booking.paymentMethod] || 'A combinar';

  const stainsText = booking.stainsNotes ? `\n📝 *Detalhes/Manchas do Estofado:*\n"${booking.stainsNotes}"\n` : '';
  const petsText = booking.hasPets ? '🐾 *Possui animais domésticos:* Sim\n' : '';

  return `✨ *SOLICITAÇÃO DE AGENDAMENTO DE HIGIENIZAÇÃO* ✨
Protocolo: *#${booking.code}*
${company.companyName}
━━━━━━━━━━━━━━━━━━━━━━━━

👤 *DADOS DO CLIENTE:*
• *Nome:* ${booking.customerName}
• *WhatsApp:* ${booking.customerPhone}
${booking.customerEmail ? `• *E-mail:* ${booking.customerEmail}\n` : ''}
📍 *ENDEREÇO DE ATENDIMENTO:*
${addressFormatted}

📅 *DATA & HORÁRIO PREFERENCIAIS:*
• *Data:* ${dateFormatted}
• *Horário:* ${booking.timeSlot}
• *Tempo Estimado:* ~${booking.estimatedDurationMinutes} minutos

🛋️ *SERVIÇOS SELECIONADOS:*
${itemsText}${globalAddonsText}
${petsText}${stainsText}
💰 *RESUMO DE VALORES:*
• *Subtotal dos Serviços:* R$ ${booking.subtotal.toFixed(2).replace('.', ',')}
${booking.addonsTotal > 0 ? `• *Adicionais:* R$ ${booking.addonsTotal.toFixed(2).replace('.', ',')}\n` : ''}${booking.discount > 0 ? `• *Desconto Aplicado:* -R$ ${booking.discount.toFixed(2).replace('.', ',')}\n` : ''}• *Taxa de Deslocamento:* ${booking.travelFee === 0 ? 'Grátis' : `R$ ${booking.travelFee.toFixed(2).replace('.', ',')}`}
💳 *VALOR FINAL ESTIMADO: R$ ${booking.total.toFixed(2).replace('.', ',')}*
• *Forma de Pagamento:* ${paymentText}

━━━━━━━━━━━━━━━━━━━━━━━━
Olá! Realizei meu agendamento pelo site. Poderiam confirmar a disponibilidade da equipe para esta data e horário? Obrigado!`;
}

export function getWhatsAppUrl(phoneDigits: string, text: string): string {
  let cleanPhone = phoneDigits.replace(/\D/g, '');
  if (!cleanPhone.startsWith('55')) {
    cleanPhone = `55${cleanPhone}`;
  }
  const encodedText = encodeURIComponent(text);
  // api.whatsapp.com triggers universal app links directly on iOS and Android devices
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

export function formatDateBr(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EST-${random}`;
}

/**
 * Creates a clean SVG QR code representation for wa.me links
 * using a reliable Google Chart API or standard visual fallback
 */
export function getQrCodeUrl(targetUrl: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&margin=8`;
}
