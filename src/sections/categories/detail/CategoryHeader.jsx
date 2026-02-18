import Badge from "../../../components/atoms/Badge";
import WrapperHeader from "../../../components/common/WrapperHeader";
import { LuArrowLeft } from "react-icons/lu";

const CategoryHeader = ({ category, onBack }) => {
  const crumbs = ["Categories", category?.parent?.name, category?.name].filter(
    Boolean,
  );

  return (
    <div className="sticky top-22 z-30  backdrop-blur-md bg-gray-50 dark:bg-neutral-800/70 p-2">
      <WrapperHeader
        className="px-4 sm:px-6 py-3 sm:py-4"
        title={
          <div className="flex items-center gap-2 flex-wrap">
            <b className="text-base sm:text-xl font-black text-slate-100 tracking-tight truncate">
              {category?.name}
            </b>
            <Badge color={category?.isActive ? "emerald" : "red"}>
              {category?.isActive ? "Active" : "Inactive"}
            </Badge>
            {category?.isArchived && <Badge color="amber">Archived</Badge>}
            <Badge color="slate">Lvl {category?.level}</Badge>
          </div>
        }
        description={
          <nav className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500 mb-1 flex-wrap">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1 sm:gap-1.5">
                {i > 0 && <span className="text-slate-700">›</span>}
                <span
                  className={
                    i === crumbs.length - 1
                      ? "text-amber-400 font-semibold"
                      : "hover:text-slate-300 cursor-pointer transition-colors"
                  }
                >
                  {c}
                </span>
              </span>
            ))}
          </nav>
        }
      >
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg place-self-start"
        >
          <LuArrowLeft /> Back
        </button>
      </WrapperHeader>
    </div>
  );
};

export default CategoryHeader;
