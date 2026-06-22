import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';

const features = [
  {
    id: 'feat-sentiment',
    tag: 'AI-Powered',
    title: 'Sentiment Classification',
    description:
      'Automatically classify each guest review as Positive, Neutral, or Negative using advanced language models — no manual reading required.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'feat-theme',
    tag: 'Smart Tagging',
    title: 'Theme Detection',
    description:
      'Each review is assigned a primary theme — Food, Host, Location, Cleanliness, Value, or Experience — so you always know what guests care about most.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    id: 'feat-response',
    tag: 'Time-Saving',
    title: 'Response Suggestions',
    description:
      'Receive a ready-to-use, professional management reply for every review — helping your team respond faster while maintaining a consistent brand voice.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
      </svg>
    ),
  },
  {
    id: 'feat-batch',
    tag: 'Efficient',
    title: 'Batch Processing',
    description:
      'Paste one review or dozens — GuestVoice processes them all in a single request, giving you a complete picture of guest satisfaction at once.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'feat-insights',
    tag: 'Analytics',
    title: 'Trend Insights',
    description:
      'Track recurring complaints, recurring praise, and service-quality patterns over time — so you can make data-driven decisions for your property.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'feat-multiplatform',
    tag: 'Flexible',
    title: 'Multi-Source Reviews',
    description:
      'Bring in reviews from any platform — booking sites, travel portals, social media, or direct feedback forms — and analyse them all in one place.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        {/* Hero */}
        <Hero />

        {/* Features section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section header */}
            <div className="mb-12">
              <span className="section-label">Platform Features</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2 mb-3 tracking-tight">
                Everything you need to understand your guests
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
                Designed specifically for homestay and hospitality operators who need fast,
                reliable feedback intelligence without a dedicated analytics team.
              </p>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => (
                <div key={feature.id} id={feature.id}>
                  <Card
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    tag={feature.tag}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="section-label">Workflow</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                How GuestVoice works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Paste Reviews',
                  desc: 'Copy and paste one or multiple guest reviews into the analysis panel.',
                },
                {
                  step: '2',
                  title: 'AI Analysis',
                  desc: 'GuestVoice sends the reviews to the Gemini AI model for structured processing.',
                },
                {
                  step: '3',
                  title: 'Get Insights',
                  desc: 'Receive sentiment, theme classification, and a suggested management response instantly.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
