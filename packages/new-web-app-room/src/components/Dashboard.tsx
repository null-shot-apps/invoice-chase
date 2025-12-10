'use client';

import { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  daysSinceDue: number;
  remindersSent: number;
  lastReminderDate?: string;
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');

  useEffect(() => {
    // Load invoices from localStorage
    const stored = localStorage.getItem('invoices');
    if (stored) {
      const parsed = JSON.parse(stored);
      setInvoices(parsed);
    } else {
      // Demo data
      const demoInvoices: Invoice[] = [
        {
          id: '1',
          clientName: 'Acme Corp',
          amount: 2500,
          dueDate: '2024-11-25',
          status: 'overdue',
          daysSinceDue: 15,
          remindersSent: 2,
          lastReminderDate: '2024-12-08'
        },
        {
          id: '2',
          clientName: 'TechStart Inc',
          amount: 1800,
          dueDate: '2024-12-15',
          status: 'pending',
          daysSinceDue: 0,
          remindersSent: 0
        },
        {
          id: '3',
          clientName: 'Design Studio',
          amount: 3200,
          dueDate: '2024-11-30',
          status: 'overdue',
          daysSinceDue: 10,
          remindersSent: 1,
          lastReminderDate: '2024-12-05'
        }
      ];
      setInvoices(demoInvoices);
      localStorage.setItem('invoices', JSON.stringify(demoInvoices));
    }
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    filter === 'all' ? true : inv.status === filter
  );

  const stats = {
    totalOutstanding: invoices
      .filter(i => i.status !== 'paid')
      .reduce((sum, i) => sum + i.amount, 0),
    overdueCount: invoices.filter(i => i.status === 'overdue').length,
    pendingCount: invoices.filter(i => i.status === 'pending').length,
    avgDaysToPayment: 18 // Mock data
  };

  const markAsPaid = (id: string) => {
    const updated = invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'paid' as const } : inv
    );
    setInvoices(updated);
    localStorage.setItem('invoices', JSON.stringify(updated));
  };

  const sendReminder = (id: string) => {
    const updated = invoices.map(inv => 
      inv.id === id 
        ? { 
            ...inv, 
            remindersSent: inv.remindersSent + 1,
            lastReminderDate: new Date().toISOString().split('T')[0]
          } 
        : inv
    );
    setInvoices(updated);
    localStorage.setItem('invoices', JSON.stringify(updated));
    alert('Reminder sent successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-gray-300 text-sm">Total Outstanding</p>
          <p className="text-3xl font-bold text-white mt-2">${stats.totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-gray-300 text-sm">Overdue Invoices</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{stats.overdueCount}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-gray-300 text-sm">Pending Invoices</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pendingCount}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-gray-300 text-sm">Avg Days to Payment</p>
          <p className="text-3xl font-bold text-white mt-2">{stats.avgDaysToPayment}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {(['all', 'pending', 'overdue', 'paid'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Reminders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {invoice.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  ${invoice.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {invoice.dueDate}
                  {invoice.status === 'overdue' && (
                    <span className="ml-2 text-red-400 text-xs">
                      ({invoice.daysSinceDue} days overdue)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    invoice.status === 'paid' 
                      ? 'bg-green-500/20 text-green-400'
                      : invoice.status === 'overdue'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {invoice.remindersSent} sent
                  {invoice.lastReminderDate && (
                    <div className="text-xs text-gray-400">
                      Last: {invoice.lastReminderDate}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {invoice.status !== 'paid' && (
                    <>
                      <button
                        onClick={() => sendReminder(invoice.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        Send Reminder
                      </button>
                      <button
                        onClick={() => markAsPaid(invoice.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      >
                        Mark Paid
                      </button>
                    </>
                  )}
                  {invoice.status === 'paid' && (
                    <span className="text-green-400">✓ Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No invoices found
          </div>
        )}
      </div>

      {/* Late Payer Insights */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Client Payment Patterns</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-black/20 rounded">
            <div>
              <p className="text-white font-medium">Acme Corp</p>
              <p className="text-sm text-gray-400">Average: 22 days to payment</p>
            </div>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded">
              Chronic Late Payer
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-black/20 rounded">
            <div>
              <p className="text-white font-medium">TechStart Inc</p>
              <p className="text-sm text-gray-400">Average: 12 days to payment</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded">
              Reliable
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-black/20 rounded">
            <div>
              <p className="text-white font-medium">Design Studio</p>
              <p className="text-sm text-gray-400">Average: 18 days to payment</p>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded">
              Moderate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

