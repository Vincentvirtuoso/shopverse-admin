import { LuX } from "react-icons/lu";

const badgeVariants = {
  slate: "bg-slate-800 text-slate-400 border-slate-700",
  amber: "bg-amber-950/60 text-amber-400 border-amber-800/60",
  emerald: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
  red: "bg-red-950/60 text-red-400 border-red-800/60",
  blue: "bg-blue-950/60 text-blue-400 border-blue-800/60",
};

const Badge = ({ children, color = "slate", onRemove = null }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${badgeVariants[color]} gap-2`}
  >
    {children}
    {onRemove && (
      <LuX
        onClick={onRemove}
        className="hover:text-red-500 duration-300 text-xs"
      />
    )}
  </span>
);

export default Badge;
