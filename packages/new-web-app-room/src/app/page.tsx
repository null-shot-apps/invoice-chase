'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import ReminderSettings from '@/components/ReminderSettings';

export default function InvoiceChase() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-invoice' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">InvoiceChase</h1>
              <p className="ml-4 text-sm text-gray-300">Get paid on time, automatically</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('new-invoice')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'new-invoice'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                New Invoice
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'settings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'new-invoice' && <InvoiceForm />}
        {activeTab === 'settings' && <ReminderSettings />}
      </main>
    </div>
  );
}


