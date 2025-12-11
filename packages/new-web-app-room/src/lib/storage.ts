// Real backend storage using API routes

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  remindersSent: number;
  lastReminderDate?: string;
  createdAt: string;
  paidAt?: string;
  lateFeeEnabled: boolean;
  lateFeeAmount?: number;
  lateFeeAppliedDate?: string;
}

export interface ClientPattern {
  name: string;
  totalInvoices: number;
  averageDaysToPayment: number;
  paymentReliability: number;
  invoices: string[];
}

export interface Settings {
  userEmail: string;
  userName: string;
  businessName: string;
  timezone: string;
  businessHours: { start: string; end: string };
  respectWeekends: boolean;
  respectHolidays: boolean;
  apiKey: string;
}

// Initialize storage (no-op for API-based storage)
export function initializeStorage() {
  // Storage is handled by backend API
}

// Get all invoices from backend
export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    const response = await fetch('/api/invoices');
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

// Get single invoice
export async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

// Save invoice (create or update)
export async function saveInvoice(invoice: Invoice): Promise<void> {
  try {
    const existingInvoice = await getInvoice(invoice.id);
    
    if (existingInvoice) {
      // Update existing invoice
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });
      if (!response.ok) throw new Error('Failed to update invoice');
    } else {
      // Create new invoice
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });
      if (!response.ok) throw new Error('Failed to create invoice');
    }
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
}

// Delete invoice
export async function deleteInvoice(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete invoice');
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

// Get client payment pattern
export async function getClientPattern(clientName: string): Promise<ClientPattern | null> {
  try {
    const response = await fetch(`/api/clients/${encodeURIComponent(clientName)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching client pattern:', error);
    return null;
  }
}

// Update client pattern
export async function updateClientPattern(invoice: Invoice): Promise<void> {
  // This is handled automatically by the backend when saving invoices
}

// Get settings
export async function getSettings(): Promise<Settings> {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      userEmail: '',
      userName: '',
      businessName: '',
      timezone: 'UTC',
      businessHours: { start: '09:00', end: '17:00' },
      respectWeekends: true,
      respectHolidays: true,
      apiKey: ''
    };
  }
}

// Save settings
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to save settings');
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

