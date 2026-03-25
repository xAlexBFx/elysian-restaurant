export interface Reservation {
  id: string;
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  tableType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface TimeSlotAvailability {
  time: string;
  booked: number;
  totalCapacity: number;
  isAlmostFull: boolean;
}

const STORAGE_KEY = 'elysian_reservations';
const STORAGE_KEY_AVAILABILITY = 'elysian_availability';

// Generate unique ID with fallback for older browsers
const generateUniqueId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Generate professional confirmation code
export const generateConfirmationCode = (): string => {
  const year = new Date().getFullYear();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  const randomLetters = Array.from({ length: 2 }, () => 
    letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  
  const randomNumbers = Array.from({ length: 4 }, () => 
    numbers[Math.floor(Math.random() * numbers.length)]
  ).join('');
  
  return `EL${year}-${randomLetters}${randomNumbers}`;
};

// Get all reservations from localStorage
export const getReservations = (): Reservation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading reservations:', error);
    return [];
  }
};

// Save a new reservation
export const saveReservation = (reservation: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt' | 'status'>): Reservation => {
  const reservations = getReservations();
  const newReservation: Reservation = {
    ...reservation,
    id: generateUniqueId(),
    confirmationCode: generateConfirmationCode(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  reservations.push(newReservation);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    updateAvailability(reservation.reservationTime, 1);
  } catch (error) {
    console.error('Error saving reservation:', error);
  }

  return newReservation;
};

// Get reservation by confirmation code
export const getReservationByCode = (code: string): Reservation | null => {
  const reservations = getReservations();
  return reservations.find(r => r.confirmationCode === code) || null;
};

// Update reservation status
export const updateReservationStatus = (id: string, status: Reservation['status']): boolean => {
  const reservations = getReservations();
  const index = reservations.findIndex(r => r.id === id);
  
  if (index === -1) return false;
  
  reservations[index].status = status;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    return true;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return false;
  }
};

// Delete reservation
export const deleteReservation = (id: string): boolean => {
  const reservations = getReservations();
  const index = reservations.findIndex(r => r.id === id);
  
  if (index === -1) return false;
  
  const reservation = reservations[index];
  reservations.splice(index, 1);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    updateAvailability(reservation.reservationTime, -1);
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return false;
  }
};

// Get or initialize availability data
export const getAvailabilityData = (): TimeSlotAvailability[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_AVAILABILITY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading availability data:', error);
  }

  // Initialize with default availability
  const defaultSlots: TimeSlotAvailability[] = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ].map(time => ({
    time,
    booked: 0, // Start with no fake bookings
    totalCapacity: 8,
    isAlmostFull: false,
  }));

  try {
    localStorage.setItem(STORAGE_KEY_AVAILABILITY, JSON.stringify(defaultSlots));
  } catch (error) {
    console.error('Error initializing availability data:', error);
  }

  return defaultSlots;
};

// Update availability for a time slot
export const updateAvailability = (time: string, change: number): void => {
  const availability = getAvailabilityData();
  const slot = availability.find(s => s.time === time);
  
  if (slot) {
    slot.booked = Math.max(0, Math.min(slot.totalCapacity, slot.booked + change));
    slot.isAlmostFull = slot.booked >= slot.totalCapacity - 1;
    
    try {
      localStorage.setItem(STORAGE_KEY_AVAILABILITY, JSON.stringify(availability));
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  }
};

// Get availability for a specific time slot
export const getTimeSlotAvailability = (time: string): TimeSlotAvailability | null => {
  const availability = getAvailabilityData();
  return availability.find(s => s.time === time) || null;
};

// Check if time slot is available
export const isTimeSlotAvailable = (time: string): boolean => {
  const slot = getTimeSlotAvailability(time);
  return slot ? slot.booked < slot.totalCapacity : true;
};

// Export reservations data (for portfolio demo)
export const exportReservations = (): string => {
  const reservations = getReservations();
  const availability = getAvailabilityData();
  
  return JSON.stringify({
    reservations,
    availability,
    exportedAt: new Date().toISOString(),
  }, null, 2);
};

// Import reservations data (for portfolio demo)
export const importReservations = (data: string): boolean => {
  try {
    const parsed = JSON.parse(data);
    
    if (parsed.reservations && Array.isArray(parsed.reservations)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.reservations));
    }
    
    if (parsed.availability && Array.isArray(parsed.availability)) {
      localStorage.setItem(STORAGE_KEY_AVAILABILITY, JSON.stringify(parsed.availability));
    }
    
    return true;
  } catch (error) {
    console.error('Error importing reservations:', error);
    return false;
  }
};

// Clear all data (for demo purposes)
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_AVAILABILITY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Clear fake data only (keeps real reservations)
export const clearFakeData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_AVAILABILITY);
  } catch (error) {
    console.error('Error clearing fake data:', error);
  }
};

// Format phone number as user types
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Apply phone number formatting
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  
  // Handle numbers longer than 10 digits
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

// Validate phone number format (more lenient)
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone.trim()) return false; // Empty phone is invalid
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10; // Accept 10 or more digits
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
