/**
 * Input Component
 *
 * @param {string} [label] - Text label displayed above the input field.
 * @param {string} [placeholder] - Placeholder text inside the input.
 * @param {string} [type='text'] - HTML input type (text, email, password, etc.).
 * @param {string} [value] - Controlled value of the input.
 * @param {function} [onChange] - Change handler: (e) => void.
 * @param {string} [error] - Error message shown below the input in red.
 * @param {string} [id] - HTML id for the input (auto-generated from label if not provided).
 * @param {string} [className] - Additional CSS classes for the wrapper.
 */

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  id,
  className = '',
  ...rest
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={['flex flex-col gap-1.5', className].join(' ')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'w-full px-4 py-2.5 rounded-lg text-sm border transition-all duration-200',
          'bg-white text-slate-800 placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
          'dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500',
          error
            ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
        ].join(' ')}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
