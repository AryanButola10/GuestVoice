import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8000/api';

/**
 * Auth page — Sign In / Sign Up tabs, plus Google OAuth.
 * Connects to FastAPI backend at /api/auth/login and /api/auth/register.
 */
export default function Login() {
  const [tab, setTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Sign In form state
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });

  // Sign Up form state
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '' });

  // -------------------------------------------------------------------------
  // Sign In — POST /api/auth/login
  // -------------------------------------------------------------------------
  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInForm),
      });
      const data = await res.json();

      if (res.status === 429) {
        toast.error('Too many login attempts. Please wait 15 minutes.');
        return;
      }
      if (!res.ok) {
        toast.error(data.detail || 'Login failed. Check your credentials.');
        return;
      }

      login(data.access_token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate('/dashboard');
    } catch {
      toast.error('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------------------
  // Sign Up — POST /api/auth/register
  // -------------------------------------------------------------------------
  async function handleSignUp(e) {
    e.preventDefault();
    if (signUpForm.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpForm),
      });
      const data = await res.json();

      if (res.status === 429) {
        toast.error('Too many attempts. Please wait 15 minutes.');
        return;
      }
      if (!res.ok) {
        toast.error(data.detail || 'Registration failed. Try again.');
        return;
      }

      login(data.access_token);
      toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch {
      toast.error('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------------------
  // Google OAuth — redirect to backend which handles the rest
  // -------------------------------------------------------------------------
  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/auth/google`;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
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

            <div className="p-6 space-y-5">

              {/* Google OAuth Button */}
              <button
                id="auth-google-btn"
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
              </div>

              {/* ---- SIGN IN FORM ---- */}
              {tab === 'signin' && (
                <form id="signin-form" onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      id="signin-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={signInForm.email}
                      onChange={e => setSignInForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      id="signin-password"
                      type="password"
                      required
                      placeholder="Your password"
                      value={signInForm.password}
                      onChange={e => setSignInForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 transition"
                    />
                  </div>
                  <button
                    id="signin-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors duration-200"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* ---- SIGN UP FORM ---- */}
              {tab === 'signup' && (
                <form id="signup-form" onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="Aryan Butola"
                      value={signUpForm.name}
                      onChange={e => setSignUpForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={signUpForm.email}
                      onChange={e => setSignUpForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Password <span className="text-slate-400 font-normal">(min 8 characters)</span>
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      placeholder="Create a strong password"
                      value={signUpForm.password}
                      onChange={e => setSignUpForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 transition"
                    />
                  </div>
                  <button
                    id="signup-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors duration-200"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              )}

            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Your reviews are secure and private. We never share your data.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
