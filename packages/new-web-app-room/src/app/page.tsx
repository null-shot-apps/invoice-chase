'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import ReminderSettings from '@/components/ReminderSettings';

export default function InvoiceChase() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-invoice' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto relative">
      {/* Animated Aurora Background */}
      <div className="fixed inset-0 bg-aurora-layer-1"></div>
      <div className="fixed inset-0 bg-aurora-layer-2"></div>
      <div className="fixed inset-0 bg-aurora-layer-3"></div>
      <div className="fixed inset-0 bg-particles"></div>
      
      {/* Content */}
      <div className="relative z-10">
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">InvoiceChase</h1>
                <p className="text-xs text-blue-200/80">Get paid on time, automatically</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('new-invoice')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'new-invoice'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                New Invoice
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
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



