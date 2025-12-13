'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import ReminderSettings from '@/components/ReminderSettings';

export default function InvoiceChase() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-invoice' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Content */}
      <div className="relative z-10">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">InvoiceChase</h1>
                <p className="text-xs text-slate-600">Get paid on time, automatically</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('new-invoice')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'new-invoice'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                New Invoice
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
    </div>
  );
}






