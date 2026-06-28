import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader } from '../components/ui';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    guest_name: '',
    property: '',
    rating: 5,
    review_text: '',
  });

  // -----------------------------------------------------------------------
  // Fetch reviews and stats from backend on mount
  // -----------------------------------------------------------------------
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  async function fetchReviews() {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      toast.error('Could not load reviews. Is the backend running?');
    } finally {
      setLoadingReviews(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch {
      // stats failing silently is fine — reviews will still show
    }
  }

  // -----------------------------------------------------------------------
  // Submit a new review via POST /api/reviews
  // -----------------------------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.review_text.trim() || form.review_text.length < 10) {
      toast.error('Review text must be at least 10 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Submission failed');
      }
      toast.success('Review submitted successfully!');
      setForm({ guest_name: '', property: '', rating: 5, review_text: '' });
      fetchReviews();
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  // -----------------------------------------------------------------------
  // Delete a review via DELETE /api/reviews/:id
  // -----------------------------------------------------------------------
  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Review deleted.');
      setReviews((prev) => prev.filter((r) => r.id !== id));
      fetchStats();
    } catch {
      toast.error('Could not delete review.');
    }
  }

  // -----------------------------------------------------------------------
  // Sentiment badge colour
  // -----------------------------------------------------------------------
  const sentimentClass = {
    positive: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    neutral:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    negative: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <span className="section-label">Review Analysis</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-3 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl">
              Submit guest reviews to receive AI-generated sentiment classification,
              theme detection, and suggested management responses.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Reviews Analysed', value: stats ? stats.total_reviews : '—' },
              { label: 'Positive Sentiment', value: stats ? `${stats.positive_percent}%` : '—' },
              { label: 'Top Theme', value: stats ? stats.top_theme : '—' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm"
              >
                <p className="text-slate-400 dark:text-slate-500 text-xs mb-1">{stat.label}</p>
                <p className="text-slate-900 dark:text-slate-100 font-semibold text-xl capitalize">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Submit Review Form ── */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-slate-800 dark:text-slate-100 font-semibold text-sm mb-4">
                Submit a Review
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Guest Name</label>
                  <input
                    id="guest-name-input"
                    type="text"
                    required
                    placeholder="e.g. Sarah Mitchell"
                    value={form.guest_name}
                    onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Property Name</label>
                  <input
                    id="property-input"
                    type="text"
                    required
                    placeholder="e.g. Mountain View Cottage"
                    value={form.property}
                    onChange={(e) => setForm({ ...form, property: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Rating: <span className="text-green-600 font-semibold">{form.rating} ★</span>
                  </label>
                  <input
                    id="rating-input"
                    type="range"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Review Text</label>
                  <textarea
                    id="review-text-input"
                    required
                    rows={4}
                    placeholder="Paste the guest review here..."
                    value={form.review_text}
                    onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    id="dashboard-analyse-btn"
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? <Loader size="sm" label="Submitting" /> : null}
                    {submitting ? 'Submitting…' : 'Analyse Review'}
                  </button>
                  <button
                    id="dashboard-clear-btn"
                    type="button"
                    onClick={() => setForm({ guest_name: '', property: '', rating: 5, review_text: '' })}
                    className="btn-outline"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* ── Reviews List ── */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-slate-800 dark:text-slate-100 font-semibold text-sm">
                All Reviews ({reviews.length})
              </h2>

              {loadingReviews ? (
                <div className="flex justify-center py-16">
                  <Loader size="lg" label="Loading reviews" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
                  <p className="text-slate-400 dark:text-slate-500 text-sm">
                    No reviews yet. Submit your first review using the form!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                          {review.guest_name}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">{review.property}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${sentimentClass[review.sentiment] || sentimentClass.neutral}`}>
                          {review.sentiment}
                        </span>
                        <span className="text-yellow-500 text-sm font-semibold">{'★'.repeat(review.rating)}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                      {review.review_text}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {review.themes.map((t) => (
                          <span key={t} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full capitalize">
                            {t}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors ml-2 flex-shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
