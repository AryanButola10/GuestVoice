import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Auth page — combines Sign In and Sign Up in a single tab-based card.
 * Tabs animate smoothly on switch. Both forms are placeholder (no backend yet).
 */
export default function Login() {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'

  return (
    <div className="page-wrapper bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="main-content py-16 sm:py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">

          {/* Brand mark */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome to GuestVoice
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              AI-powered guest review analysis for your property
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

            {/* Tab switcher */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              <button
                id="auth-signin-tab"
                onClick={() => setTab('signin')}
                className={[
                  'flex-1 py-3.5 text-sm font-semibold transition-all duration-200 focus:outline-none',
                  tab === 'signin'
                    ? 'text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400 bg-green-50/50 dark:bg-green-900/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-b-2 border-transparent',
                ].join(' ')}
              >
                Sign In
              </button>
              <button
                id="auth-signup-tab"
                onClick={() => setTab('signup')}
                className={[
                  'flex-1 py-3.5 text-sm font-semibold transition-all duration-200 focus:outline-none',
                  tab === 'signup'
                    ? 'text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400 bg-green-50/50 dark:bg-green-900/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-b-2 border-transparent',
                ].join(' ')}
              >
                Sign Up
              </button>
            </div>

            {/* Form body — animates on tab change */}
            <div className="p-8">

              {/* ── SIGN IN FORM ── */}
              {tab === 'signin' && (
                <div className="space-y-4 animate-tab-in">
                  <FormField id="signin-email" label="Email address" placeholder="you@example.com" />
                  <FormField id="signin-password" label="Password" placeholder="••••••••" type="password" />

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" id="signin-remember" className="w-3.5 h-3.5 rounded accent-green-700" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Remember me</span>
                    </label>
                    <button className="text-xs text-green-700 dark:text-green-400 hover:underline font-medium">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    id="signin-submit-btn"
                    disabled
                    className="w-full btn-primary justify-center mt-2 opacity-40 cursor-not-allowed"
                  >
                    Sign In
                  </button>

                  <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-1">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setTab('signup')}
                      className="text-green-700 dark:text-green-400 font-semibold hover:underline"
                    >
                      Sign up free
                    </button>
                  </p>
                </div>
              )}

              {/* ── SIGN UP FORM ── */}
              {tab === 'signup' && (
                <div className="space-y-4 animate-tab-in">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField id="signup-firstname" label="First name" placeholder="Aryan" />
                    <FormField id="signup-lastname" label="Last name" placeholder="Butola" />
                  </div>
                  <FormField id="signup-email" label="Email address" placeholder="you@example.com" />
                  <FormField id="signup-password" label="Password" placeholder="Min. 8 characters" type="password" />
                  <FormField id="signup-confirm" label="Confirm password" placeholder="Re-enter password" type="password" />

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input type="checkbox" id="signup-terms" className="w-3.5 h-3.5 mt-0.5 rounded accent-green-700 flex-shrink-0" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      I agree to the{' '}
                      <button className="text-green-700 dark:text-green-400 font-semibold hover:underline">Terms of Service</button>
                      {' '}and{' '}
                      <button className="text-green-700 dark:text-green-400 font-semibold hover:underline">Privacy Policy</button>
                    </span>
                  </label>

                  <button
                    id="signup-submit-btn"
                    disabled
                    className="w-full btn-primary justify-center mt-2 opacity-40 cursor-not-allowed"
                  >
                    Create Account
                  </button>

                  <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-1">
                    Already have an account?{' '}
                    <button
                      onClick={() => setTab('signin')}
                      className="text-green-700 dark:text-green-400 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
            Authentication is disabled — backend integration coming in a future week.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Internal FormField sub-component for clean form rendering.
 * @param {string} id - Input element id
 * @param {string} label - Field label text
 * @param {string} placeholder - Placeholder text
 * @param {string} [type='text'] - Input type
 */
function FormField({ id, label, placeholder, type = 'text' }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-slate-600 dark:text-slate-300 text-xs font-medium mb-1.5"
      >
        {label}
      </label>
      <div className="w-full h-10 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg flex items-center px-3">
        <span className="text-slate-400 dark:text-slate-500 text-sm">{placeholder}</span>
      </div>
    </div>
  );
}
