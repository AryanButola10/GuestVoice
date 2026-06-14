import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="section-label">AI-Powered Review Intelligence</span>
            <span className="h-px flex-1 max-w-[60px] bg-green-700/60 rounded" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
            Turn Guest Feedback Into{' '}
            <span className="text-green-400">Actionable Insights</span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
            GuestVoice helps homestay operators analyze customer reviews in seconds —
            classifying sentiment, detecting themes, and generating professional
            responses — so you can focus on delivering great experiences.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" id="hero-cta-primary" className="btn-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Analyse Reviews
            </Link>
            <Link to="/about" id="hero-cta-secondary" className="btn-outline">
              Learn More
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center gap-6">
            {[
              { icon: '✦', text: 'Sentiment Classification' },
              { icon: '✦', text: 'Theme Detection' },
              { icon: '✦', text: 'Response Suggestions' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-slate-500 text-sm">
                <span className="text-green-600 text-xs">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
