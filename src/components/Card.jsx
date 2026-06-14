/**
 * Card — reusable feature/info card component
 *
 * Props:
 *  - icon     {JSX.Element}  SVG icon element
 *  - title    {string}       Card heading
 *  - description {string}   Supporting text
 *  - tag      {string}       Optional badge label (e.g. "AI-Powered")
 */
export default function Card({ icon, title, description, tag }) {
  return (
    <div className="card-base group flex flex-col gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-green-400 flex-shrink-0 group-hover:bg-green-600/10 group-hover:border-green-700/50 transition-all duration-200">
        {icon}
      </div>

      <div className="flex-1">
        {/* Tag */}
        {tag && (
          <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full mb-2">
            {tag}
          </span>
        )}

        {/* Title */}
        <h3 className="text-white font-semibold text-base mb-2 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
