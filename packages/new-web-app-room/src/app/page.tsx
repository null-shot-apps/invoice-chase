'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-[#1e3a5f] bg-clip-text text-transparent">
            InvoiceChase
          </h1>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#152d47] transition-colors shadow-md shadow-blue-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Never Chase Payments
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-[#1e3a5f] bg-clip-text text-transparent">
              Again
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Automate your invoice reminders and get paid faster. InvoiceChase helps you track overdue payments and send professional follow-ups automatically.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transform hover:-translate-y-0.5"
          >
            Start Tracking Invoices
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Tracking</h3>
            <p className="text-slate-600 leading-relaxed">
              Keep all your invoices organized in one place. Track payment status, due dates, and amounts effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Auto Reminders</h3>
            <p className="text-slate-600 leading-relaxed">
              Set up automated reminder schedules. Send gentle, professional, or urgent follow-ups based on how overdue the payment is.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-[#1e3a5f] rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Professional Templates</h3>
            <p className="text-slate-600 leading-relaxed">
              Use pre-written, professional email templates that maintain good client relationships while getting results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2x</div>
              <div className="text-emerald-200">Faster Payments</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-emerald-200">Response Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-emerald-200">Automated</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Get Paid Faster?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of freelancers and businesses who never worry about chasing payments anymore.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transform hover:-translate-y-0.5"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-600">
          <p>&copy; 2024 InvoiceChase. Never chase payments again.</p>
        </div>
      </footer>
    </div>
  );
}

