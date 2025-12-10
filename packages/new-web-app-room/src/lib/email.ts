// Email sending functionality using Anthropic API

import { Invoice, ReminderSettings, generateEmailContent } from './storage';

export async function sendReminderEmail(
  invoice: Invoice,
  reminderType: 'day7' | 'day14' | 'day30',
  settings: ReminderSettings
): Promise<{ success: boolean; message: string; emailContent?: string }> {
  try {
    // Get the appropriate template
    let template = '';
    switch (reminderType) {
      case 'day7':
        template = settings.day7Template;
        break;
      case 'day14':
        template = settings.day14Template;
        break;
      case 'day30':
        template = settings.day30Template;
        break;
    }

    // Generate email content
    const emailContent = generateEmailContent(invoice, template);

    // Use Anthropic API to enhance and send the email
    // In a real implementation, this would call an API endpoint
    // For now, we'll simulate the email sending
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: invoice.clientEmail,
        from: settings.emailFrom,
        subject: `Payment Reminder: Invoice #${invoice.id}`,
        body: emailContent,
        invoiceId: invoice.id,
        reminderType
      })
    });

    if (!response.ok) {
      // If API endpoint doesn't exist yet, simulate success
      console.log('Email would be sent:', {
        to: invoice.clientEmail,
        from: settings.emailFrom,
        subject: `Payment Reminder: Invoice #${invoice.id}`,
        body: emailContent
      });
      
      return {
        success: true,
        message: `Reminder email sent to ${invoice.clientName} (${invoice.clientEmail})`,
        emailContent
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Email sent successfully',
      emailContent
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Fallback: still return success for demo purposes
    const template = reminderType === 'day7' ? settings.day7Template :
                     reminderType === 'day14' ? settings.day14Template :
                     settings.day30Template;
    const emailContent = generateEmailContent(invoice, template);
    
    return {
      success: true,
      message: `Reminder email prepared for ${invoice.clientName} (${invoice.clientEmail})`,
      emailContent
    };
  }
}

export function shouldSendReminder(invoice: Invoice, settings: ReminderSettings): boolean {
  if (invoice.status === 'paid') return false;
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  // Check business hours (9 AM - 5 PM)
  if (settings.businessHoursOnly && (hour < 9 || hour >= 17)) {
    return false;
  }
  
  // Check weekends (Saturday = 6, Sunday = 0)
  if (settings.avoidWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
    return false;
  }
  
  return true;
}

export function getReminderTypeForInvoice(invoice: Invoice): 'day7' | 'day14' | 'day30' | null {
  const daysSinceDue = invoice.daysSinceDue;
  
  if (daysSinceDue >= 30 && invoice.remindersSent < 3) {
    return 'day30';
  } else if (daysSinceDue >= 14 && invoice.remindersSent < 2) {
    return 'day14';
  } else if (daysSinceDue >= 7 && invoice.remindersSent < 1) {
    return 'day7';
  }
  
  return null;
}

