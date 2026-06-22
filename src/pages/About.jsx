import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content py-20 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <span className="section-label">About GuestVoice</span>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-5 tracking-tight leading-tight">
            Built for the hospitality industry
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
            GuestVoice is an AI-powered guest review analysis platform designed to help
            homestay operators and hospitality businesses make sense of customer feedback
            at scale. Inspired by the real-world challenges faced by the Trishul
            Eco-Homestays Network in Uttarakhand, the platform converts unstructured
            reviews into structured, actionable intelligence.
          </p>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
            Whether your reviews come from booking platforms, travel portals, or direct
            guest channels, GuestVoice aggregates and analyses them in one place —
            classifying sentiment, detecting recurring themes, and suggesting professional
            management responses.
          </p>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Our mission is to give small and mid-sized hospitality teams the same
            feedback intelligence capabilities that large hotel chains invest heavily
            in — delivered simply, affordably, and without requiring a data science team.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
