import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <span className="section-label">Review Analysis</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-3 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-xl">
              Paste guest reviews below to receive AI-generated sentiment classification,
              theme detection, and suggested management responses. This feature will be
              fully functional after AI integration is complete.
            </p>
          </div>

          {/* Placeholder panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Input area */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-slate-800 font-semibold text-sm mb-4">
                Submit Reviews for Analysis
              </h2>
              <div className="w-full h-48 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-400 text-sm text-center px-6">
                  Input panel
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  id="dashboard-analyse-btn"
                  disabled
                  className="btn-primary opacity-40 cursor-not-allowed"
                >
                  Analyse Reviews
                </button>
                <button
                  id="dashboard-clear-btn"
                  disabled
                  className="btn-outline opacity-40 cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Stats sidebar */}
            <div className="space-y-4">
              {[
                { label: 'Reviews Analysed', value: '—' },
                { label: 'Positive Sentiment', value: '—' },
                { label: 'Top Theme', value: '—' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
                >
                  <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                  <p className="text-slate-900 font-semibold text-xl">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Results placeholder */}
          <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-slate-800 font-semibold text-sm mb-4">Analysis Results</h2>
            <div className="h-32 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-400 text-sm text-center">
                Results will appear here after a review is submitted and analysed.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
