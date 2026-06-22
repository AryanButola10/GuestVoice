/**
 * Card Component
 *
 * @param {string} icon - Emoji or icon character displayed at the top.
 * @param {string} tag - Small label/badge shown above the title.
 * @param {string} title - Card heading text.
 * @param {string} description - Card body description text.
 */
export default function Card({ icon, tag, title, description }) {
  return (
    <div className="card-base flex flex-col gap-3">
      {icon && (
        <span className="text-2xl" aria-hidden="true">{icon}</span>
      )}
      {tag && (
        <span className="section-label">{tag}</span>
      )}
      {title && (
        <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-base leading-snug">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
