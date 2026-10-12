import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Search,
  Loader2,
  FileText,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Dog,
} from 'lucide-react';
import { CustomerAddress, PaymentMethod, CompanySettings } from '../../types';

interface StepCustomerInfoProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  address: CustomerAddress;
  setAddress: React.Dispatch<React.SetStateAction<CustomerAddress>>;
  stainsNotes: string;
  setStainsNotes: (notes: string) => void;
  hasPets: boolean;
  setHasPets: (hasPets: boolean) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (pm: PaymentMethod) => void;
  company: CompanySettings;
  onBack: () => void;
  onProceed: () => void;
}

export const StepCustomerInfo: React.FC<StepCustomerInfoProps> = ({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerEmail,
  setCustomerEmail,
  address,
  setAddress,
  stainsNotes,
  setStainsNotes,
  hasPets,
  setHasPets,
  paymentMethod,
  setPaymentMethod,
  company,
  onBack,
  onProceed,
}) => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  // Format Brazilian phone mask (XX) XXXXX-XXXX
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 2 && digits.length <= 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
    setCustomerPhone(formatted);
  };

  // Format Brazilian CEP mask 00000-000 and auto fetch ViaCEP
  const handleCepChange = async (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    setAddress((prev) => ({ ...prev, cep: formatted }));
    setCepError('');

    if (digits.length === 8) {
      fetchViaCep(digits);
    }
  };

  const fetchViaCep = async (cleanCep: string) => {
    setLoadingCep(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError('CEP não encontrado. Por favor, preencha o endereço manualmente.');
      } else {
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch (e) {
      setCepError('Não foi possível consultar o CEP automaticamente. Preencha abaixo.');
    } finally {
      setLoadingCep(false);
    }
  };

  const isFormValid =
    customerName.trim().length >= 3 &&
    customerPhone.replace(/\D/g, '').length >= 10 &&
    address.street.trim().length >= 3 &&
    address.number.trim().length >= 1 &&
    address.neighborhood.trim().length >= 2 &&
    address.city.trim().length >= 2;

  return (
    <div className="space-y-8">
      {/* Intro info box */}
      <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Passo 3: Dados de Contato e Endereço de Atendimento
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Informe onde nossa equipe deve comparecer e seu número de WhatsApp para alinharmos os
            detalhes da chegada.
          </p>
        </div>
      </div>

      {/* Contact fields */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <User className="w-4 h-4 text-cyan-600" />
          <span>Seus Dados de Contato</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Maria dos Santos"
                className="w-full min-h-[46px] pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seu WhatsApp <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={customerPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(82) 99999-9999"
                className="w-full min-h-[46px] pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-medium"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Com DDD (ex: 82 para Maceió e região)
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail (Opcional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full min-h-[46px] pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address fields with auto CEP */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <MapPin className="w-4 h-4 text-cyan-600" />
          <span>Endereço Onde Será Feita a Limpeza</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              CEP (Busca Automática)
            </label>
            <div className="relative">
              <input
                type="text"
                value={address.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {loadingCep ? (
                  <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>
            {cepError && <span className="text-[11px] text-amber-600 mt-1 block">{cepError}</span>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rua / Avenida <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address.street}
              onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="Ex: Av. Paulista"
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Número <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address.number}
              onChange={(e) => setAddress((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="123"
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Complemento</label>
            <input
              type="text"
              value={address.complement || ''}
              onChange={(e) => setAddress((prev) => ({ ...prev, complement: e.target.value }))}
              placeholder="Apto 42, Bloco B, Casa 2..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bairro <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address.neighborhood}
              onChange={(e) => setAddress((prev) => ({ ...prev, neighborhood: e.target.value }))}
              placeholder="Ex: Pinheiros"
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cidade <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address.city}
              onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Ex: São Paulo"
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estado (UF)</label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))}
              placeholder="SP"
              maxLength={2}
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 uppercase font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ponto de Referência (Opcional)
          </label>
          <input
            type="text"
            value={address.reference || ''}
            onChange={(e) => setAddress((prev) => ({ ...prev, reference: e.target.value }))}
            placeholder="Ex: Próximo à padaria central / Condomínio das Palmeiras"
            className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Details & Stains & Pets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <FileText className="w-4 h-4 text-cyan-600" />
          <span>Detalhes dos Estofados & Observações</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Manchas ou cuidados especiais? (Café, vinho, urina, tecido delicado...)
          </label>
          <textarea
            rows={2}
            value={stainsNotes}
            onChange={(e) => setStainsNotes(e.target.value)}
            placeholder="Ex: O sofá possui uma mancha de café no assento esquerdo. Tecido parece linho ou suede..."
            className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none"
          />
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={hasPets}
            onChange={(e) => setHasPets(e.target.checked)}
            className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
          />
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
            <Dog className="w-4 h-4 text-cyan-700" />
            <span>Possui animais domésticos (cães ou gatos) na residência?</span>
          </div>
        </label>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <CreditCard className="w-4 h-4 text-cyan-600" />
          <span>Forma de Pagamento Preferida (Pago somente após o término do serviço)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PIX */}
          <div
            onClick={() => setPaymentMethod('pix')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              paymentMethod === 'pix'
                ? 'bg-cyan-50/50 border-cyan-500 ring-2 ring-cyan-500/10 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">PIX</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {company.pixDiscountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Desconto promocional aplicado no total final
              </p>
            </div>
          </div>

          {/* Cartão de Crédito */}
          <div
            onClick={() => setPaymentMethod('credit_card')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              paymentMethod === 'credit_card'
                ? 'bg-cyan-50/50 border-cyan-500 ring-2 ring-cyan-500/10 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">Cartão de Crédito</span>
              <p className="text-xs text-slate-500 mt-0.5">
                Na maquininha móvel em até 12x no término
              </p>
            </div>
          </div>

          {/* Cartão de Débito */}
          <div
            onClick={() => setPaymentMethod('debit_card')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              paymentMethod === 'debit_card'
                ? 'bg-cyan-50/50 border-cyan-500 ring-2 ring-cyan-500/10 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">Cartão de Débito</span>
              <p className="text-xs text-slate-500 mt-0.5">
                Aproxime ou insira na maquininha móvel
              </p>
            </div>
          </div>

          {/* Dinheiro */}
          <div
            onClick={() => setPaymentMethod('cash')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              paymentMethod === 'cash'
                ? 'bg-cyan-50/50 border-cyan-500 ring-2 ring-cyan-500/10 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">Dinheiro</span>
              <p className="text-xs text-slate-500 mt-0.5">
                Diretamente para o técnico responsável
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Horários</span>
        </button>

        <button
          type="button"
          onClick={onProceed}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            isFormValid
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/25 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Revisar & Enviar para WhatsApp</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
