/**
 * Button Component
 *
 * @param {'primary' | 'secondary' | 'outline'} [variant='primary'] - Visual style of the button.
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Size of the button.
 * @param {boolean} [disabled=false] - Whether the button is disabled.
 * @param {function} [onClick] - Click handler function.
 * @param {React.ReactNode} children - Content rendered inside the button.
 * @param {string} [className] - Additional CSS classes.
 */

const variantClasses = {
  primary:
    'bg-green-700 hover:bg-green-800 text-white shadow-sm border border-transparent',
  secondary:
    'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-transparent dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100',
  outline:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-green-700 hover:text-green-700 dark:bg-transparent dark:text-slate-200 dark:border-slate-600 dark:hover:border-green-500 dark:hover:text-green-400',
};

const sizeClasses = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-md',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-lg',
  lg: 'text-base px-6 py-3 gap-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
