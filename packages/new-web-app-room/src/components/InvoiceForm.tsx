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
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Invoice</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Email *
            </label>
            <input
              type="email"
              required
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="client@acmecorp.com"
            />
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="2500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Website redesign project - Phase 1"
            />
          </div>

          {/* Late Fee Settings */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="lateFeeEnabled"
                checked={formData.lateFeeEnabled}
                onChange={(e) => setFormData({ ...formData, lateFeeEnabled: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-600"
              />
              <label htmlFor="lateFeeEnabled" className="ml-2 text-sm font-medium text-gray-300">
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
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-300 mb-2">
              📧 Automatic Reminder Schedule
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Day 7: Friendly reminder</li>
              <li>• Day 14: Firmer follow-up</li>
              <li>• Day 30: Final notice with late fees (if enabled)</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
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




