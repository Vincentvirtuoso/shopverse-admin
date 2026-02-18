const inputBase =
  "w-full rounded-lg px-3 py-2 text-sm font-mono placeholder-slate-600 transition-colors duration-150 focus:outline-none bg-white dark:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed";

const Input = ({ className = "", ...props }) => (
  <input className={`${inputBase} ${className}`} {...props} />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea className={`${inputBase} resize-none ${className}`} {...props} />
);

const SelectField = ({ className = "", children, ...props }) => (
  <select className={`${inputBase} ${className}`} {...props}>
    {children}
  </select>
);

const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
    {children}
    {required && <span className="text-amber-500 ml-1">*</span>}
  </label>
);

export { FieldLabel, SelectField, Input, Textarea };
