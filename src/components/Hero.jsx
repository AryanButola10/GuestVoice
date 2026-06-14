import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl">

          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <span className="section-label">AI-Powered Review Intelligence</span>
            <span className="h-px flex-1 max-w-[60px] bg-green-300 rounded" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            Turn Guest Feedback Into{' '}
            <span className="text-green-700">Actionable Insights</span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-2xl">
            GuestVoice helps homestay operators analyse customer reviews in seconds —
            classifying sentiment, detecting themes, and generating professional
            responses so you can focus on delivering great experiences.
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
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-8">
            {[
              { text: 'Sentiment Classification' },
              { text: 'Theme Detection' },
              { text: 'Response Suggestions' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-slate-500 text-sm">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
