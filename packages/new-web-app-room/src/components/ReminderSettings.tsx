'use client';

import { useState, useEffect } from 'react';

interface ReminderTemplate {
  day: number;
  subject: string;
  message: string;
  tone: 'friendly' | 'firm' | 'formal';
}

export default function ReminderSettings() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([
    {
      day: 7,
      subject: 'Friendly Payment Reminder',
      message: `Hi {clientName},

I hope this message finds you well! I wanted to send a quick reminder that invoice #{invoiceId} for {amount} was due on {dueDate}.

I know things can get busy, so I just wanted to make sure this didn't slip through the cracks. If you've already sent payment, please disregard this message!

If you have any questions or need to discuss the invoice, feel free to reach out.

Thanks!`,
      tone: 'friendly'
    },
    {
      day: 14,
      subject: 'Payment Follow-up Required',
      message: `Hi {clientName},

I'm following up on invoice #{invoiceId} for {amount}, which was due on {dueDate}. It's now {daysOverdue} days overdue.

I understand that delays happen, but I wanted to check in to see if there are any issues with the invoice or if you need any additional information from me.

Please let me know when I can expect payment, or if there's anything we need to discuss.

Best regards,`,
      tone: 'firm'
    },
    {
      day: 30,
      subject: 'Final Notice - Payment Required',
      message: `Dear {clientName},

This is a final notice regarding invoice #{invoiceId} for {amount}, which is now {daysOverdue} days overdue (due date: {dueDate}).

As per our agreement, a late fee of {lateFee} has been applied to this invoice, bringing the total to {totalWithLateFee}.

Please remit payment within 5 business days to avoid further action. If payment has already been sent, please provide confirmation.

If you're experiencing difficulties with payment, please contact me immediately to discuss payment arrangements.

Regards,`,
      tone: 'formal'
    }
  ]);

  const [settings, setSettings] = useState({
    respectBusinessHours: true,
    avoidWeekends: true,
    timezone: 'America/New_York',
    autoStopOnPayment: true,
    ccEmail: '',
    fromName: '',
    fromEmail: ''
  });

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = localStorage.getItem('reminderSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    
    // Load templates from localStorage
    const storedTemplates = localStorage.getItem('reminderTemplates');
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('reminderSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const updateTemplate = (index: number, field: keyof ReminderTemplate, value: string | number) => {
    const updated = [...templates];
    updated[index] = { ...updated[index], [field]: value };
    setTemplates(updated);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Reminder Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={settings.fromName}
              onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={settings.fromEmail}
              onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              CC Email (optional)
            </label>
            <input
              type="email"
              value={settings.ccEmail}
              onChange={(e) => setSettings({ ...settings, ccEmail: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
              placeholder="accounting@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
            </select>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="respectBusinessHours"
                checked={settings.respectBusinessHours}
                onChange={(e) => setSettings({ ...settings, respectBusinessHours: e.target.checked })}
                className="w-5 h-5 text-[#1e3a5f] bg-white border-2 border-slate-200 rounded focus:ring-2 focus:ring-[#1e3a5f]"
              />
              <label htmlFor="respectBusinessHours" className="ml-3 text-sm font-medium text-slate-700">
                Only send reminders during business hours (9 AM - 5 PM)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="avoidWeekends"
                checked={settings.avoidWeekends}
                onChange={(e) => setSettings({ ...settings, avoidWeekends: e.target.checked })}
                className="w-5 h-5 text-[#1e3a5f] bg-white border-2 border-slate-200 rounded focus:ring-2 focus:ring-[#1e3a5f]"
              />
              <label htmlFor="avoidWeekends" className="ml-3 text-sm font-medium text-slate-700">
                Avoid sending reminders on weekends
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStopOnPayment"
                checked={settings.autoStopOnPayment}
                onChange={(e) => setSettings({ ...settings, autoStopOnPayment: e.target.checked })}
                className="w-5 h-5 text-[#1e3a5f] bg-white border-2 border-slate-200 rounded focus:ring-2 focus:ring-[#1e3a5f]"
              />
              <label htmlFor="autoStopOnPayment" className="ml-3 text-sm font-medium text-slate-700">
                Automatically stop reminders when payment is received
              </label>
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="w-full px-6 py-3 bg-[#1e3a5f] hover:bg-[#152d47] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Email Templates</h2>
        
        <div className="space-y-6">
          {templates.map((template, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Day {template.day} Reminder
                </h3>
                <select
                  value={template.tone}
                  onChange={(e) => updateTemplate(index, 'tone', e.target.value)}
                  className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                >
                  <option value="friendly">Friendly</option>
                  <option value="firm">Firm</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={template.subject}
                    onChange={(e) => updateTemplate(index, 'subject', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={template.message}
                    onChange={(e) => updateTemplate(index, 'message', e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Available variables: {'{clientName}'}, {'{invoiceId}'}, {'{amount}'}, {'{dueDate}'}, {'{daysOverdue}'}, {'{lateFee}'}, {'{totalWithLateFee}'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.setItem('reminderTemplates', JSON.stringify(templates));
            alert('Templates saved successfully!');
          }}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Save Templates
        </button>
      </div>
    </div>
  );
}




