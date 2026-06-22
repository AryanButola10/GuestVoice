/**
 * Loader Component
 *
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Size of the spinner.
 * @param {string} [label='Loading...'] - Accessible label for screen readers.
 * @param {string} [className] - Additional CSS classes.
 */

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

export default function Loader({ size = 'md', label = 'Loading...', className = '' }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={['inline-flex flex-col items-center gap-2', className].join(' ')}
    >
      <span
        className={[
          'rounded-full border-green-200 border-t-green-700 animate-spin dark:border-green-900 dark:border-t-green-400',
          sizeClasses[size],
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
