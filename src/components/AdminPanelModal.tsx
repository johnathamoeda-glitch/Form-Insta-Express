import React, { useState } from 'react';
import {
  X,
  Phone,
  Settings,
  Calendar,
  MessageCircle,
  CheckCircle,
  Clock,
  Trash2,
  Download,
  Save,
  Check,
  MapPin,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { Booking, CompanySettings } from '../types';
import { formatDateBr } from '../utils/whatsapp';

interface AdminPanelModalProps {
  company: CompanySettings;
  bookings: Booking[];
  onSaveSettings: (settings: CompanySettings) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  company,
  bookings,
  onSaveSettings,
  onUpdateBookingStatus,
  onDeleteBooking,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings');
  const [formData, setFormData] = useState<CompanySettings>({ ...company });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure numeric format for whatsapp
    const cleanNumber = formData.whatsappNumber.replace(/\D/g, '');
    const updated = {
      ...formData,
      whatsappNumber: cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`,
    };
    onSaveSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCsv = () => {
    if (bookings.length === 0) return;
    const headers = 'Protocolo,Data,Horario,Cliente,Telefone,Cidade,Bairro,Total,Status\n';
    const rows = bookings
      .map(
        (b) =>
          `"${b.code}","${b.date}","${b.timeSlot}","${b.customerName}","${b.customerPhone}","${b.address.city}","${b.address.neighborhood}","${b.total}","${b.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agendamentos-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadges: Record<Booking['status'], { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    confirmed: { label: 'Confirmado', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    completed: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    cancelled: { label: 'Cancelado', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
              Painel de Controle
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Gerenciamento da Empresa
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendamentos Recebidos ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurar Meu WhatsApp & Empresa</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'bookings' ? (
            <div className="space-y-4">
              {/* Filter and Export Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por cliente, código, bairro..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="pending">Pendentes</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="completed">Concluídos</option>
                    <option value="cancelled">Cancelados</option>
                  </select>

                  <button
                    onClick={exportCsv}
                    disabled={bookings.length === 0}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-semibold text-sm">
                    Nenhum agendamento encontrado
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Quando um cliente finalizar um agendamento no site, ele aparecerá aqui e no seu
                    WhatsApp!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => {
                    const cleanCustPhone = b.customerPhone.replace(/\D/g, '');
                    const customerWaUrl = `https://wa.me/55${cleanCustPhone}?text=${encodeURIComponent(
                      `Olá ${b.customerName}, tudo bem? Sou da ${company.companyName} sobre seu agendamento de estofados (#${b.code}) para o dia ${formatDateBr(b.date)}.`
                    )}`;

                    return (
                      <div
                        key={b.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                              #{b.code}
                            </span>
                            <span className="font-bold text-slate-900 text-sm sm:text-base">
                              {b.customerName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                statusBadges[b.status].color
                              }`}
                            >
                              {statusBadges[b.status].label}
                            </span>

                            <select
                              value={b.status}
                              onChange={(e) =>
                                onUpdateBookingStatus(b.id, e.target.value as Booking['status'])
                              }
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
                            >
                              <option value="pending">Marcar Pendente</option>
                              <option value="confirmed">Marcar Confirmado</option>
                              <option value="completed">Marcar Concluído</option>
                              <option value="cancelled">Marcar Cancelado</option>
                            </select>

                            <button
                              onClick={() => onDeleteBooking(b.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Booking specifics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              📅 Data & Horário:
                            </span>
                            <span>
                              {formatDateBr(b.date)} às {b.timeSlot}
                            </span>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-800 block">
                              📍 Local de Atendimento:
                            </span>
                            <span>
                              {b.address.street}, {b.address.number} - {b.address.neighborhood},{' '}
                              {b.address.city}
                            </span>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-800 block">💰 Total:</span>
                            <span className="font-bold text-teal-700 text-sm">
                              R$ {b.total.toFixed(2).replace('.', ',')}
                            </span>{' '}
                            ({b.paymentMethod.toUpperCase()})
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700">
                          <span className="font-semibold">Itens: </span>
                          {b.items.map((it) => `${it.quantity}x ${it.serviceName}`).join(', ')}
                          {b.globalAddons.length > 0 && (
                            <span className="text-teal-700 font-medium">
                              {' '}
                              + {b.globalAddons.map((a) => a.name).join(', ')}
                            </span>
                          )}
                          {b.stainsNotes && (
                            <div className="text-slate-500 italic mt-1">
                              Obs: "{b.stainsNotes}"
                            </div>
                          )}
                        </div>

                        {/* Customer WhatsApp Action */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-slate-500">
                            Telefone: <strong>{b.customerPhone}</strong>
                          </span>

                          <a
                            href={customerWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Chamar Cliente no WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Settings Tab */
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 text-xs sm:text-sm text-cyan-900">
                <strong>💡 Importante:</strong> O número de WhatsApp informado abaixo é onde
                todos os clientes enviarão os agendamentos ao finalizar no site. Insira o DDD +
                Telefone (apenas números ou formatado).
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seu WhatsApp da Empresa (onde chegam os agendamentos) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                      }
                      placeholder="Ex: 5511987654321"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Ex: 5511999998888 (com DDI 55 + DDD)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefone para Exibição Pública
                    </label>
                    <input
                      type="text"
                      value={formData.displayPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, displayPhone: e.target.value }))
                      }
                      placeholder="(82) 99824-0159"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                    }
                    placeholder="ExpressCleanMCZ"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Região / Cidades de Atendimento
                    </label>
                    <input
                      type="text"
                      value={formData.addressCity}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, addressCity: e.target.value }))
                      }
                      placeholder="Maceió e Região Metropolitana (AL)"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Horário de Funcionamento
                    </label>
                    <input
                      type="text"
                      value={formData.operatingHours}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, operatingHours: e.target.value }))
                      }
                      placeholder="Segunda a Sábado, das 08h às 19h"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Desconto no PIX (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={formData.pixDiscountPercent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pixDiscountPercent: Number(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Taxa Padrão de Deslocamento (R$)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.travelFeeDefault}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          travelFeeDefault: Number(e.target.value),
                        }))
                      }
                      placeholder="0 para Grátis"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chave PIX da Empresa (opcional para o cliente)
                  </label>
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pixKey: e.target.value }))}
                    placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {settingsSaved ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Configurações salvas com sucesso!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Salvo no navegador deste dispositivo</span>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
