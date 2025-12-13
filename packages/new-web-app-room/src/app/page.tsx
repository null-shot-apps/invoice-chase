'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import ReminderSettings from '@/components/ReminderSettings';

export default function InvoiceChase() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-invoice' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-[#1e3a5f] bg-clip-text text-transparent">InvoiceChase</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1e3a5f] text-white shadow-md shadow-blue-200'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('new-invoice')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'new-invoice'
                    ? 'bg-[#1e3a5f] text-white shadow-md shadow-blue-200'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                New Invoice
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-[#1e3a5f] text-white shadow-md shadow-blue-200'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'new-invoice' && <InvoiceForm />}
        {activeTab === 'settings' && <ReminderSettings />}
      </main>
    </div>
  );
}









