const btnBase =
  "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none shrink-0";

const btnVariants = {
  primary:
    "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 focus:ring-amber-500 shadow-lg shadow-amber-500/20",
  secondary:
    "bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-600 focus:ring-slate-500",
  danger:
    "bg-red-900/50 hover:bg-red-800 active:bg-red-900 text-red-300 border border-red-800 focus:ring-red-500",
  ghost:
    "bg-transparent hover:bg-slate-800 active:bg-slate-900 text-slate-400 hover:text-slate-200 focus:ring-slate-500",
  success:
    "bg-emerald-900/50 hover:bg-emerald-800 active:bg-emerald-900 text-emerald-300 border border-emerald-800 focus:ring-emerald-500",
};

const btnSizes = {
  xs: "text-[10px] px-2.5 py-1",
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-sm px-5 py-2.5",
};

const Btn = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) => (
  <button
    className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && (
      <svg
        className="animate-spin w-3.5 h-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    )}
    {children}
  </button>
);

export default Btn;
