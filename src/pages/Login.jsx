import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  return (
    <div className="page-wrapper bg-slate-50">
      <Navbar />

      <main className="main-content py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">

            {/* Header */}
            <div className="mb-7 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-700 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign in to GuestVoice
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Access your review analysis dashboard
              </p>
            </div>

            {/* Placeholder form */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-slate-600 text-xs font-medium mb-1.5"
                >
                  Email address
                </label>
                <div className="w-full h-10 bg-slate-50 border border-slate-300 rounded-lg flex items-center px-3">
                  <span className="text-slate-400 text-sm">
                    Email field
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-slate-600 text-xs font-medium mb-1.5"
                >
                  Password
                </label>
                <div className="w-full h-10 bg-slate-50 border border-slate-300 rounded-lg flex items-center px-3">
                  <span className="text-slate-400 text-sm">
                    Password field
                  </span>
                </div>
              </div>

              <button
                id="login-submit-btn"
                disabled
                className="w-full btn-primary justify-center mt-2 opacity-40 cursor-not-allowed"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
