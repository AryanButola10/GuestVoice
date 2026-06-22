/**
 * Toast Component — re-exports react-hot-toast for consistent use across the app.
 *
 * Usage:
 *   1. Place <Toaster /> once at the root (already done in App.jsx).
 *   2. Call toast(), toast.success(), toast.error() from anywhere.
 *
 * @example
 *   import { toast } from '../components/ui';
 *   toast.success('Review analysed!');
 *   toast.error('Something went wrong.');
 *   toast('Neutral message');
 */

export { default as toast, Toaster } from 'react-hot-toast';
