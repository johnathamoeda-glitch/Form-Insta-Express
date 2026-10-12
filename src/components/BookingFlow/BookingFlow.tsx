import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  MessageCircle,
  Check,
  CheckCircle,
} from 'lucide-react';
import { StepServices } from './StepServices';
import { StepDateTime } from './StepDateTime';
import { StepCustomerInfo } from './StepCustomerInfo';
import { StepSummaryAndWhatsApp } from './StepSummaryAndWhatsApp';
import {
  Booking,
  CustomerAddress,
  PaymentMethod,
  CompanySettings,
} from '../../types';
import { SERVICES_CATALOG, ADDON_OPTIONS } from '../../data/services';
import { generateBookingCode } from '../../utils/whatsapp';
import { saveBooking } from '../../utils/storage';

interface BookingFlowProps {
  company: CompanySettings;
  onBookingComplete: (booking: Booking) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ company, onBookingComplete }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Services and Addons
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({
    'sofa-3l': 1, // Default selected so user starts with a preview
  });
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['impermeabilizacao']);

  // Step 2 State: Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00');
  const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon'>('morning');

  // Step 3 State: Customer & Address
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [address, setAddress] = useState<CustomerAddress>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: company.addressCity.includes('Maceió') ? 'Maceió' : 'Maceió',
    state: 'AL',
    reference: '',
  });
  const [stainsNotes, setStainsNotes] = useState<string>('');
  const [hasPets, setHasPets] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  // Step 4 Generated Booking
  const [generatedBooking, setGeneratedBooking] = useState<Booking | null>(null);

  // Quantity handlers
  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[serviceId];
      } else {
        updated[serviceId] = quantity;
      }
      return updated;
    });
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSelectTimeSlot = (slot: string, shift: 'morning' | 'afternoon') => {
    setSelectedTimeSlot(slot);
    setSelectedShift(shift);
  };

  // Compile full booking object
  const compileBooking = (): Booking => {
    const itemsList = Object.entries(selectedItems).map(([serviceId, quantity]) => {
      const service = SERVICES_CATALOG.find((s) => s.id === serviceId)!;
      return {
        serviceId,
        serviceName: service.name,
        quantity,
        unitPrice: service.basePrice,
        subtotal: service.basePrice * quantity,
        addons: [],
      };
    });

    const globalAddonsList = selectedAddons.map((addonId) => {
      const addon = ADDON_OPTIONS.find((a) => a.id === addonId)!;
      return {
        id: addon.id,
        name: addon.name,
        price: addon.price,
      };
    });

    const subtotal = itemsList.reduce((sum, item) => sum + item.subtotal, 0);
    const addonsTotal = globalAddonsList.reduce((sum, a) => sum + a.price, 0);
    const travelFee = company.travelFeeDefault;

    // PIX discount calculation
    let discount = 0;
    if (paymentMethod === 'pix' && company.pixDiscountPercent > 0) {
      discount = (subtotal + addonsTotal) * (company.pixDiscountPercent / 100);
    }

    const total = Math.max(0, subtotal + addonsTotal + travelFee - discount);

    const estimatedDurationMinutes = Object.entries(selectedItems).reduce(
      (sum, [serviceId, quantity]) => {
        const s = SERVICES_CATALOG.find((x) => x.id === serviceId);
        return sum + (s ? s.estimatedMinutes * quantity : 0);
      },
      0
    );

    return {
      id: `booking-${Date.now()}`,
      code: generateBookingCode(),
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      address,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      shift: selectedShift,
      items: itemsList,
      globalAddons: globalAddonsList,
      stainsNotes: stainsNotes || undefined,
      hasPets,
      paymentMethod,
      subtotal,
      addonsTotal,
      discount,
      travelFee,
      total,
      estimatedDurationMinutes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  };

  // Step transitions
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
    scrollToBookingTop();
  };

  const handleProceedToStep3 = () => {
    setCurrentStep(3);
    scrollToBookingTop();
  };

  const handleProceedToStep4 = () => {
    const booking = compileBooking();
    setGeneratedBooking(booking);
    saveBooking(booking); // Save to local database
    setCurrentStep(4);
    scrollToBookingTop();
  };

  const handleFinalBookingSubmitted = () => {
    if (generatedBooking) {
      onBookingComplete(generatedBooking);
    }
  };

  const scrollToBookingTop = () => {
    const el = document.getElementById('agendamento-online');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalMinutes = Object.entries(selectedItems).reduce((sum, [serviceId, qty]) => {
    const s = SERVICES_CATALOG.find((x) => x.id === serviceId);
    return sum + (s ? s.estimatedMinutes * qty : 0);
  }, 0);

  const stepsConfig = [
    { num: 1, title: 'Serviços', icon: Sparkles },
    { num: 2, title: 'Data & Hora', icon: Calendar },
    { num: 3, title: 'Endereço', icon: MapPin },
    { num: 4, title: 'WhatsApp', icon: MessageCircle },
  ];

  return (
    <div id="agendamento-online" className="scroll-mt-24">
      {/* Stepper Header Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
          {stepsConfig.map((s, index) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const IconComponent = s.icon;

            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : isCurrent
                        ? 'bg-cyan-600 text-white ring-4 ring-cyan-100 shadow-cyan-600/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-2 text-center ${
                      isCurrent
                        ? 'text-cyan-700'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>

                {index < stepsConfig.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                      currentStep > index + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-slate-50/50 rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xs">
        {currentStep === 1 && (
          <StepServices
            selectedItems={selectedItems}
            onUpdateQuantity={handleUpdateQuantity}
            selectedAddons={selectedAddons}
            onToggleAddon={handleToggleAddon}
            onProceed={handleProceedToStep2}
          />
        )}

        {currentStep === 2 && (
          <StepDateTime
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={handleSelectTimeSlot}
            onBack={() => setCurrentStep(1)}
            onProceed={handleProceedToStep3}
            estimatedMinutes={totalMinutes}
          />
        )}

        {currentStep === 3 && (
          <StepCustomerInfo
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            address={address}
            setAddress={setAddress}
            stainsNotes={stainsNotes}
            setStainsNotes={setStainsNotes}
            hasPets={hasPets}
            setHasPets={setHasPets}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            company={company}
            onBack={() => setCurrentStep(2)}
            onProceed={handleProceedToStep4}
          />
        )}

        {currentStep === 4 && generatedBooking && (
          <StepSummaryAndWhatsApp
            booking={generatedBooking}
            company={company}
            onBack={() => setCurrentStep(3)}
            onBookingSubmitted={handleFinalBookingSubmitted}
          />
        )}
      </div>
    </div>
  );
};
