import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // AI analysis state
  const [aiResults, setAiResults] = useState({});    // { [reviewId]: result }
  const [aiLoading, setAiLoading] = useState(new Set()); // set of reviewIds being analysed

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
  // Submit a new review via POST /api/reviews (requires JWT)
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
        return;
      }
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
  // Delete a review via DELETE /api/reviews/:id (requires JWT)
  // -----------------------------------------------------------------------
  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Review deleted.');
      setReviews((prev) => prev.filter((r) => r.id !== id));
      fetchStats();
    } catch {
      toast.error('Could not delete review.');
    }
  }

  // -----------------------------------------------------------------------
  // AI Analyse a review via POST /api/ai/analyze (requires JWT)
  // -----------------------------------------------------------------------
  async function handleAIAnalyse(review) {
    setAiLoading(prev => new Set(prev).add(review.id));
    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_text: review.review_text,
          guest_name: review.guest_name,
          property: review.property,
          rating: review.rating,
        }),
      });
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout(); navigate('/login'); return;
      }
      if (res.status === 429) {
        toast.error('AI rate limit reached. Please wait a moment.');
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'AI analysis failed.');
      }
      const data = await res.json();
      setAiResults(prev => ({ ...prev, [review.id]: data }));
      toast.success('AI analysis complete! ✨');
    } catch (err) {
      toast.error(err.message || 'AI service unavailable. Try again.');
    } finally {
      setAiLoading(prev => { const s = new Set(prev); s.delete(review.id); return s; });
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
          <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="section-label">Review Analysis</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-3 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl">
                Submit guest reviews to receive AI-generated sentiment classification,
                theme detection, and suggested management responses.
              </p>
            </div>
            {/* User info + Logout */}
            <div className="flex items-center gap-3 mt-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <button
                id="logout-btn"
                onClick={() => { logout(); navigate('/login'); }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
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
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* AI Analyse button */}
                        <button
                          id={`ai-analyse-btn-${review.id}`}
                          onClick={() => handleAIAnalyse(review)}
                          disabled={aiLoading.has(review.id)}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 disabled:opacity-50 transition-colors flex items-center gap-1"
                        >
                          {aiLoading.has(review.id) ? (
                            <><Loader size="sm" /> Analysing…</>
                          ) : '🤖 AI Analyse'}
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* AI Result Panel */}
                    {aiResults[review.id] && (
                      <div className="mt-4 pt-4 border-t border-violet-100 dark:border-violet-900/30 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">✨ AI Analysis</span>
                          <button
                            onClick={() => setAiResults(prev => { const n = {...prev}; delete n[review.id]; return n; })}
                            className="text-xs text-slate-400 hover:text-slate-600 ml-auto"
                          >✕ Close</button>
                        </div>

                        {/* Sentiment + Confidence */}
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            aiResults[review.id].ai_sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                            aiResults[review.id].ai_sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                          }`}>
                            {aiResults[review.id].ai_sentiment}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {aiResults[review.id].confidence}% confidence
                          </span>
                          {/* Confidence bar */}
                          <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 max-w-24">
                            <div
                              className="h-1.5 rounded-full bg-violet-500"
                              style={{ width: `${aiResults[review.id].confidence}%` }}
                            />
                          </div>
                        </div>

                        {/* AI Themes */}
                        <div className="flex flex-wrap gap-1">
                          {aiResults[review.id].ai_themes.map(t => (
                            <span key={t} className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full capitalize border border-violet-100 dark:border-violet-800">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                          {aiResults[review.id].summary}
                        </p>

                        {/* Management Response */}
                        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-lg p-3">
                          <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1">💬 Suggested Response</p>
                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                            {aiResults[review.id].management_response}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(aiResults[review.id].management_response);
                              toast.success('Response copied to clipboard!');
                            }}
                            className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            📋 Copy response
                          </button>
                        </div>

                        {/* Improvement Suggestions */}
                        {aiResults[review.id].improvement_suggestions?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">💡 Improvement Suggestions</p>
                            <ul className="space-y-1">
                              {aiResults[review.id].improvement_suggestions.map((s, i) => (
                                <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex gap-1.5">
                                  <span className="text-violet-400">•</span>{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
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
