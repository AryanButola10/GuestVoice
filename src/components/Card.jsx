/**
 * Card — reusable feature/info card component
 *
 * Props:
 *  - icon        {JSX.Element}  SVG icon element
 *  - title       {string}       Card heading
 *  - description {string}       Supporting text
 *  - tag         {string}       Optional badge label (e.g. "AI-Powered")
 */
export default function Card({ icon, title, description, tag }) {
  return (
    <div className="card-base group flex flex-col gap-4">

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-700 flex-shrink-0 group-hover:bg-green-100 transition-all duration-200">
        {icon}
      </div>

      <div className="flex-1">
        {/* Tag */}
        {tag && (
          <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full mb-2">
            {tag}
          </span>
        )}

        {/* Title */}
        <h3 className="text-slate-900 font-semibold text-base mb-2 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
