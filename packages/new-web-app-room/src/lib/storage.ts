// Storage utility for InvoiceChase using window.storage API

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  daysSinceDue: number;
  remindersSent: number;
  lastReminderDate?: string;
  createdAt: string;
  lateFeeEnabled: boolean;
  lateFeeAmount?: number;
  lateFeeAppliedDate?: string;
  reminderHistory: Array<{
    date: string;
    type: 'day7' | 'day14' | 'day30';
    emailContent: string;
  }>;
}

export interface ClientPattern {
  clientName: string;
  totalInvoices: number;
  paidInvoices: number;
  averageDaysToPayment: number;
  reliabilityScore: 'reliable' | 'moderate' | 'chronic-late';
  lastPaymentDate?: string;
}

export interface ReminderSettings {
  emailFrom: string;
  timezone: string;
  businessHoursOnly: boolean;
  avoidWeekends: boolean;
  day7Template: string;
  day14Template: string;
  day30Template: string;
  autoStopOnPayment: boolean;
}

// Initialize storage with default settings
export function initializeStorage() {
  if (typeof window === 'undefined') return;
  
  const settings = getSettings();
  if (!settings) {
    saveSettings({
      emailFrom: 'you@example.com',
      timezone: 'America/New_York',
      businessHoursOnly: true,
      avoidWeekends: true,
      day7Template: `Hi {clientName},

I hope this email finds you well. I wanted to send a friendly reminder that invoice #{invoiceId} for {amount} was due on {dueDate}.

If you've already sent payment, please disregard this message. Otherwise, I'd appreciate if you could process this at your earliest convenience.

Thank you for your business!

Best regards`,
      day14Template: `Hi {clientName},

I'm following up on invoice #{invoiceId} for {amount}, which is now {daysOverdue} days overdue (due date: {dueDate}).

I understand things can get busy, but I wanted to check in to see if there are any issues with this invoice. Please let me know if you need any clarification or if there's anything I can do to help expedite payment.

Looking forward to hearing from you soon.

Best regards`,
      day30Template: `Hi {clientName},

This is a final notice regarding invoice #{invoiceId} for {amount}, which is now {daysOverdue} days overdue (due date: {dueDate}).

{lateFeeNotice}

If payment is not received within 7 days, I will need to pursue additional collection measures. Please contact me immediately if there are any concerns or disputes regarding this invoice.

I value our business relationship and hope we can resolve this promptly.

Best regards`,
      autoStopOnPayment: true
    });
  }
}

// Invoice operations
export function getAllInvoices(): Invoice[] {
  if (typeof window === 'undefined') return [];
  
  const keys = Object.keys(localStorage).filter(k => k.startsWith('invoice:'));
  return keys.map(key => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }).filter(Boolean);
}

export function getInvoice(id: string): Invoice | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`invoice:${id}`);
  return data ? JSON.parse(data) : null;
}

export function saveInvoice(invoice: Invoice): void {
  if (typeof window === 'undefined') return;
  
  // Update status based on due date
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (invoice.status !== 'paid') {
    invoice.daysSinceDue = Math.max(0, daysDiff);
    invoice.status = daysDiff > 0 ? 'overdue' : 'pending';
  }
  
  localStorage.setItem(`invoice:${invoice.id}`, JSON.stringify(invoice));
  
  // Update client pattern
  updateClientPattern(invoice.clientName);
}

export function deleteInvoice(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`invoice:${id}`);
}

// Client pattern operations
export function getClientPattern(clientName: string): ClientPattern | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`client:${clientName}`);
  return data ? JSON.parse(data) : null;
}

export function updateClientPattern(clientName: string): void {
  if (typeof window === 'undefined') return;
  
  const invoices = getAllInvoices().filter(inv => inv.clientName === clientName);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  
  let averageDaysToPayment = 0;
  if (paidInvoices.length > 0) {
    const totalDays = paidInvoices.reduce((sum, inv) => {
      const created = new Date(inv.createdAt);
      const due = new Date(inv.dueDate);
      const daysToPay = Math.floor((due.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) + inv.daysSinceDue;
      return sum + daysToPay;
    }, 0);
    averageDaysToPayment = Math.round(totalDays / paidInvoices.length);
  }
  
  let reliabilityScore: 'reliable' | 'moderate' | 'chronic-late' = 'reliable';
  if (averageDaysToPayment > 20) {
    reliabilityScore = 'chronic-late';
  } else if (averageDaysToPayment > 14) {
    reliabilityScore = 'moderate';
  }
  
  const pattern: ClientPattern = {
    clientName,
    totalInvoices: invoices.length,
    paidInvoices: paidInvoices.length,
    averageDaysToPayment,
    reliabilityScore,
    lastPaymentDate: paidInvoices.length > 0 ? paidInvoices[paidInvoices.length - 1].dueDate : undefined
  };
  
  localStorage.setItem(`client:${clientName}`, JSON.stringify(pattern));
}

export function getAllClientPatterns(): ClientPattern[] {
  if (typeof window === 'undefined') return [];
  
  const keys = Object.keys(localStorage).filter(k => k.startsWith('client:'));
  return keys.map(key => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }).filter(Boolean);
}

// Settings operations
export function getSettings(): ReminderSettings | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem('settings:reminders');
  return data ? JSON.parse(data) : null;
}

export function saveSettings(settings: ReminderSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('settings:reminders', JSON.stringify(settings));
}

// Utility functions
export function calculateNextReminderDate(invoice: Invoice): { days: number; type: 'day7' | 'day14' | 'day30' } | null {
  if (invoice.status === 'paid') return null;
  
  const daysSinceDue = invoice.daysSinceDue;
  
  if (daysSinceDue >= 30 && invoice.remindersSent < 3) {
    return { days: 30, type: 'day30' };
  } else if (daysSinceDue >= 14 && invoice.remindersSent < 2) {
    return { days: 14, type: 'day14' };
  } else if (daysSinceDue >= 7 && invoice.remindersSent < 1) {
    return { days: 7, type: 'day7' };
  }
  
  return null;
}

export function generateEmailContent(invoice: Invoice, template: string): string {
  const lateFeeNotice = invoice.lateFeeEnabled && invoice.lateFeeAmount
    ? `A late fee of $${invoice.lateFeeAmount} has been applied to this invoice.`
    : '';
  
  return template
    .replace(/{clientName}/g, invoice.clientName)
    .replace(/{invoiceId}/g, invoice.id)
    .replace(/{amount}/g, `$${invoice.amount.toLocaleString()}`)
    .replace(/{dueDate}/g, invoice.dueDate)
    .replace(/{daysOverdue}/g, invoice.daysSinceDue.toString())
    .replace(/{lateFeeNotice}/g, lateFeeNotice);
}

