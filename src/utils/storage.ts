import { Booking, CompanySettings } from '../types';
import { INITIAL_COMPANY_SETTINGS } from '../data/services';

const STORAGE_KEYS = {
  BOOKINGS: 'expressclean_bookings_v2',
  SETTINGS: 'expressclean_settings_v2',
};

export function getCompanySettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...INITIAL_COMPANY_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load company settings from localStorage', e);
  }
  return INITIAL_COMPANY_SETTINGS;
}

export function saveCompanySettings(settings: CompanySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save company settings to localStorage', e);
  }
}

export function getAllBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e);
  }
  return [];
}

export function saveBooking(booking: Booking): void {
  try {
    const existing = getAllBookings();
    const updated = [booking, ...existing.filter(b => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save booking to localStorage', e);
  }
}

export function updateBookingStatus(bookingId: string, status: Booking['status']): void {
  try {
    const bookings = getAllBookings().map(b => (b.id === bookingId ? { ...b, status } : b));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to update booking status', e);
  }
}

export function deleteBooking(bookingId: string): void {
  try {
    const bookings = getAllBookings().filter(b => b.id !== bookingId);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to delete booking', e);
  }
}
