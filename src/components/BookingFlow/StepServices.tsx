import React, { useState, useMemo } from 'react';
import {
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Search,
  Check,
  Clock,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';
import { ServiceItem, ServiceCategory, AddonOption, SelectedServiceItem } from '../../types';
import { SERVICES_CATALOG, ADDON_OPTIONS } from '../../data/services';

interface StepServicesProps {
  selectedItems: Record<string, number>;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  selectedAddons: string[];
  onToggleAddon: (addonId: string) => void;
  onProceed: () => void;
}

const CATEGORIES: { id: ServiceCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos os Serviços' },
  { id: 'sofas', label: '🛋️ Sofás' },
  { id: 'colchoes', label: '🛏️ Colchões' },
  { id: 'poltronas', label: '🪑 Poltronas & Cadeiras' },
  { id: 'automotivo', label: '🚗 Automotivo' },
  { id: 'tapetes', label: '✨ Tapetes & Carpetes' },
];

export const StepServices: React.FC<StepServicesProps> = ({
  selectedItems,
  onUpdateQuantity,
  selectedAddons,
  onToggleAddon,
  onProceed,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = useMemo(() => {
    return SERVICES_CATALOG.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Totals calculation
  const totalItemsCount = Object.values(selectedItems).reduce((sum, q) => sum + q, 0);

  const subtotalServices = Object.entries(selectedItems).reduce((sum, [serviceId, quantity]) => {
    const service = SERVICES_CATALOG.find((s) => s.id === serviceId);
    return sum + (service ? service.basePrice * quantity : 0);
  }, 0);

  const totalAddonsPrice = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDON_OPTIONS.find((a) => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const estimatedMinutes = Object.entries(selectedItems).reduce((sum, [serviceId, quantity]) => {
    const service = SERVICES_CATALOG.find((s) => s.id === serviceId);
    return sum + (service ? service.estimatedMinutes * quantity : 0);
  }, 0);

  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` : `${minutes}min`;

  return (
    <div className="space-y-8">
      {/* Introduction instructions */}
      <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Passo 1: Selecione os itens para higienização
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Adicione um ou mais estofados clicando nos botões <strong>+</strong>. Você pode combinar
            sofá, colchão, poltronas ou bancos de carro no mesmo agendamento!
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por sofá retrátil, colchão queen, cadeiras..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const qty = selectedItems[service.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={service.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 bg-white ${
                isSelected
                  ? 'border-cyan-500 ring-2 ring-cyan-500/10 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {service.popular && (
                    <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs">
                      Popular
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-cyan-700 uppercase tracking-wider">
                      {service.categoryLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {service.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{service.estimatedMinutes} min de atendimento</span>
                  </div>
                </div>
              </div>

              {/* Price & Quantity Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">A partir de</span>
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                    R$ {service.basePrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Counter buttons - 44px min touch target for mobile thumb */}
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="flex items-center bg-cyan-50 border border-cyan-200 rounded-xl p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(service.id, qty - 1)}
                        className="w-11 h-11 sm:w-9 sm:h-9 rounded-lg bg-white text-cyan-800 flex items-center justify-center hover:bg-cyan-100 transition-colors shadow-xs active:scale-90 cursor-pointer"
                        title="Diminuir"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2.5]" />
                      </button>
                      <span className="w-9 sm:w-8 text-center text-base sm:text-sm font-black text-cyan-950">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(service.id, qty + 1)}
                        className="w-11 h-11 sm:w-9 sm:h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-700 transition-colors shadow-xs active:scale-90 cursor-pointer"
                        title="Aumentar"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(service.id, 1)}
                      className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">
            Nenhum serviço encontrado para "{searchTerm}".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className="mt-2 text-xs font-semibold text-cyan-600 hover:underline cursor-pointer"
          >
            Ver todos os serviços
          </button>
        </div>
      )}

      {/* Addons / Upsell Protection Section */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Proteção Extra & Opcionais Recomendados
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Turbine o cuidado dos seus estofados
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ADDON_OPTIONS.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);

            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddon(addon.id)}
                className={`relative flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-cyan-50/50 border-cyan-500 ring-2 ring-cyan-500/10 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-1 border transition-colors ${
                    isChecked
                      ? 'bg-cyan-600 border-cyan-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 leading-tight">
                      {addon.name}
                    </span>
                    <span className="text-xs font-extrabold text-teal-700 shrink-0">
                      +R$ {addon.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-800 font-medium mt-0.5">{addon.tagline}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{addon.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Order Bar - Optimized for Mobile Thumb Navigation */}
      <div className="sticky bottom-3 z-30 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">
              {totalItemsCount === 0
                ? 'Selecione pelo menos 1 item'
                : `${totalItemsCount} ${totalItemsCount === 1 ? 'item selecionado' : 'itens selecionados'}`}
              {totalItemsCount > 0 && ` · ~${timeFormatted}`}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-cyan-400">
                R$ {(subtotalServices + totalAddonsPrice).toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                5% OFF no PIX
              </span>
            </div>
          </div>

          <div className="sm:hidden text-right">
            <span className="text-[11px] text-slate-400 block">Atendimento</span>
            <span className="text-xs font-bold text-teal-400">Maceió / AL</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onProceed}
          disabled={totalItemsCount === 0}
          className={`w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
            totalItemsCount > 0
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/30 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Escolher Dia & Horário</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
