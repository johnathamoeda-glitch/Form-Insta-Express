export type ServiceCategory = 'sofas' | 'colchoes' | 'poltronas' | 'automotivo' | 'tapetes';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  basePrice: number;
  estimatedMinutes: number;
  description: string;
  imageUrl: string;
  popular?: boolean;
  unitLabel?: string; // ex: "unidade", "lugar", "conjunto"
}

export interface AddonOption {
  id: string;
  name: string;
  tagline: string;
  price: number;
  description: string;
  iconName: string;
  recommended?: boolean;
}

export interface SelectedServiceItem {
  serviceId: string;
  service: ServiceItem;
  quantity: number;
  addons: string[]; // addon IDs specifically for this item
}

export interface CustomerAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export interface Booking {
  id: string;
  code: string; // ex: EST-8421
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: CustomerAddress;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., '09:00'
  shift: 'morning' | 'afternoon';
  items: {
    serviceId: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    addons: { id: string; name: string; price: number }[];
  }[];
  globalAddons: { id: string; name: string; price: number }[];
  fabricType?: string;
  stainsNotes?: string;
  hasPets?: boolean;
  paymentMethod: PaymentMethod;
  subtotal: number;
  addonsTotal: number;
  discount: number;
  travelFee: number;
  total: number;
  estimatedDurationMinutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  whatsappNumber: string; // numeric digits only, with country code (e.g. 5511999998888)
  displayPhone: string; // formatted phone
  addressCity: string;
  operatingHours: string;
  travelFeeDefault: number;
  pixDiscountPercent: number;
  pixKey: string;
  pixKeyType: string;
}
