'use client';

import { useState } from 'react';

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    dueDate: '',
    description: '',
    lateFeeEnabled: false,
    lateFeeAmount: '',
    lateFeeStartDay: '30'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!formData.clientEmail.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      setLoading(false);
      return;
    }
    
    try {
      // Create new invoice
      const newInvoice = {
        id: Date.now().toString(),
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        description: formData.description,
        status: 'pending' as const,
        daysSinceDue: 0,
        remindersSent: 0,
        lateFee: formData.lateFeeEnabled ? {
          amount: parseFloat(formData.lateFeeAmount),
          startDay: parseInt(formData.lateFeeStartDay)
        } : undefined
      };

      // Save via API
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      setSuccess('Invoice created successfully! Automatic reminders are now scheduled.');
      
      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        amount: '',
        dueDate: '',
        description: '',
        lateFeeEnabled: false,
        lateFeeAmount: '',
        lateFeeStartDay: '30'
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-8 border border-emerald-100 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Invoice</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Client Email *
            </label>
            <input
              type="email"
              required
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
              placeholder="client@acmecorp.com"
            />
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                placeholder="2500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-emerald-100 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
              placeholder="Website redesign project - Phase 1"
            />
          </div>

          {/* Late Fee Settings */}
          <div className="border-t border-emerald-100 pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="lateFeeEnabled"
                checked={formData.lateFeeEnabled}
                onChange={(e) => setFormData({ ...formData, lateFeeEnabled: e.target.checked })}
                className="w-5 h-5 text-emerald-600 bg-white border-2 border-emerald-200 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <label htmlFor="lateFeeEnabled" className="ml-3 text-sm font-semibold text-slate-700">
                Enable Late Fees
              </label>
            </div>

            {formData.lateFeeEnabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Late Fee Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.lateFeeAmount}
                    onChange={(e) => setFormData({ ...formData, lateFeeAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="50.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apply After (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lateFeeStartDay}
                    onChange={(e) => setFormData({ ...formData, lateFeeStartDay: e.target.value })}
                    className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reminder Schedule Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2">
              📧 Automatic Reminder Schedule
            </h3>
            <ul className="text-sm text-slate-700 space-y-1.5">
              <li>• Day 7: Friendly reminder</li>
              <li>• Day 14: Firmer follow-up</li>
              <li>• Day 30: Final notice with late fees (if enabled)</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 text-emerald-700 font-medium">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-[#1e3a5f] hover:bg-[#152d47] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Invoice...
              </>
            ) : (
              'Create Invoice & Schedule Reminders'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}














