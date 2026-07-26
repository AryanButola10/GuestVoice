import { Component } from 'react';

/**
 * ErrorBoundary — catches unexpected JavaScript errors anywhere in the
 * child component tree and shows a friendly fallback UI instead of a
 * blank white screen.
 *
 * Usage:
 *   Wrap the entire app in main.jsx:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('❌ ErrorBoundary caught an error:', error, info);
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              An unexpected error occurred. Please refresh the page to continue.
              If the problem persists, try clearing your browser cache.
            </p>
            {this.state.error && (
              <p className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 mb-6 font-mono text-left break-all">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
