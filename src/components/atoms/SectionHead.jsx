const SectionHead = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-2">
    <span className="text-xl sm:text-2xl leading-none mt-0.5 shrink-0">
      {icon}
    </span>
    <div className="min-w-0">
      <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight leading-snug">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default SectionHead;
