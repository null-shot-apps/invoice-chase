'use client';

import { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
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
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [emailPreview, setEmailPreview] = useState({ subject: '', body: '' });

  useEffect(() => {
    // Load invoices from localStorage - NO DUMMY DATA
    const stored = localStorage.getItem('invoices');
    if (stored) {
      const parsed = JSON.parse(stored);
      setInvoices(parsed);
    } else {
      // Start with empty array
      setInvoices([]);
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

  const openMarkPaidModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowMarkPaidModal(true);
  };

  const confirmMarkAsPaid = () => {
    if (!selectedInvoice) return;
    
    const updated = invoices.map(inv => 
      inv.id === selectedInvoice.id ? { ...inv, status: 'paid' as const } : inv
    );
    setInvoices(updated);
    localStorage.setItem('invoices', JSON.stringify(updated));
    setShowMarkPaidModal(false);
    setSelectedInvoice(null);
  };

  const openReminderModal = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    
    // Generate email preview
    const daysSinceDue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    const reminderType = daysSinceDue <= 7 ? 'friendly' : daysSinceDue <= 14 ? 'firm' : 'final';
    
    let subject = '';
    let body = '';
    
    if (reminderType === 'friendly') {
      subject = `Friendly Reminder: Invoice Payment for ${invoice.clientName}`;
      body = `Hi ${invoice.clientName},\n\nI hope this email finds you well! I wanted to send a friendly reminder that invoice #${invoice.id} for ${invoice.amount} was due on ${invoice.dueDate}.\n\nIf you've already sent the payment, please disregard this message. Otherwise, I'd appreciate it if you could process the payment at your earliest convenience.\n\nThank you for your business!\n\nBest regards`;
    } else if (reminderType === 'firm') {
      subject = `Payment Reminder: Invoice #${invoice.id} Now ${daysSinceDue} Days Overdue`;
      body = `Dear ${invoice.clientName},\n\nThis is a follow-up regarding invoice #${invoice.id} for ${invoice.amount}, which was due on ${invoice.dueDate} and is now ${daysSinceDue} days overdue.\n\nI understand that delays can happen, but I need to receive payment as soon as possible. Please let me know if there are any issues or concerns.\n\nThank you for your prompt attention to this matter.\n\nBest regards`;
    } else {
      subject = `FINAL NOTICE: Invoice #${invoice.id} - ${daysSinceDue} Days Overdue`;
      body = `Dear ${invoice.clientName},\n\nThis is a final notice regarding invoice #${invoice.id} for ${invoice.amount}, which is now ${daysSinceDue} days overdue.\n\nIf payment is not received within 7 days, I will be forced to pursue additional collection measures, which may include late fees and legal action.\n\nPlease contact me immediately to resolve this matter.\n\nRegards`;
    }
    
    setEmailPreview({ subject, body });
    setShowReminderModal(true);
  };

  const confirmSendReminder = async () => {
    if (!selectedInvoice) return;
    
    try {
      // Send email via API
      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedInvoice.clientEmail,
          subject: emailPreview.subject,
          body: emailPreview.body,
          invoiceId: selectedInvoice.id,
          amount: selectedInvoice.amount,
          clientName: selectedInvoice.clientName
        })
      });
      
      if (response.ok) {
        // Update invoice with reminder sent
        const updated = invoices.map(inv => 
          inv.id === selectedInvoice.id 
            ? { 
                ...inv, 
                remindersSent: inv.remindersSent + 1,
                lastReminderDate: new Date().toISOString().split('T')[0]
              } 
            : inv
        );
        setInvoices(updated);
        localStorage.setItem('invoices', JSON.stringify(updated));
        alert('✅ Reminder email sent successfully!');
      } else {
        alert('❌ Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('❌ Error sending email. Check console for details.');
    }
    
    setShowReminderModal(false);
    setSelectedInvoice(null);
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
                        onClick={() => openReminderModal(invoice)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        Send Reminder
                      </button>
                      <button
                        onClick={() => openMarkPaidModal(invoice)}
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

      {/* Late Payer Insights - Real Data Only */}
      {invoices.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Client Payment Patterns</h2>
          <div className="space-y-3">
            {Array.from(new Set(invoices.map(i => i.clientName))).map(clientName => {
              const clientInvoices = invoices.filter(i => i.clientName === clientName);
              const paidInvoices = clientInvoices.filter(i => i.status === 'paid');
              const avgDays = paidInvoices.length > 0 
                ? Math.round(paidInvoices.reduce((sum, inv) => sum + (inv.daysSinceDue || 0), 0) / paidInvoices.length)
                : 0;
              const reliability = avgDays <= 7 ? 'Reliable' : avgDays <= 14 ? 'Moderate' : 'Chronic Late Payer';
              const reliabilityColor = avgDays <= 7 ? 'green' : avgDays <= 14 ? 'yellow' : 'red';
              
              return (
                <div key={clientName} className="flex items-center justify-between p-3 bg-black/20 rounded">
                  <div>
                    <p className="text-white font-medium">{clientName}</p>
                    <p className="text-sm text-gray-400">
                      {paidInvoices.length > 0 
                        ? `Average: ${avgDays} days to payment` 
                        : 'No payment history yet'}
                    </p>
                  </div>
                  {paidInvoices.length > 0 && (
                    <span className={`px-3 py-1 bg-${reliabilityColor}-500/20 text-${reliabilityColor}-400 text-sm rounded`}>
                      {reliability}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mark as Paid Confirmation Modal */}
      {showMarkPaidModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Payment</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to mark invoice #{selectedInvoice.id} from{' '}
              <span className="font-semibold text-white">{selectedInvoice.clientName}</span> for{' '}
              <span className="font-semibold text-green-400">${selectedInvoice.amount}</span> as paid?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmMarkAsPaid}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Yes, Mark as Paid
              </button>
              <button
                onClick={() => {
                  setShowMarkPaidModal(false);
                  setSelectedInvoice(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Email Preview Modal */}
      {showReminderModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-white/20 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Send Payment Reminder</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400">To:</label>
                <p className="text-white">{selectedInvoice.clientEmail}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Subject:</label>
                <p className="text-white">{emailPreview.subject}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Message:</label>
                <div className="bg-black/30 rounded-lg p-4 mt-2 border border-white/10">
                  <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">
                    {emailPreview.body}
                  </pre>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  💡 This email will be sent to {selectedInvoice.clientEmail} and the reminder count will be updated.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmSendReminder}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Send Reminder Email
              </button>
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  setSelectedInvoice(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









