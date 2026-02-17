import { useState, useEffect, useRef, useMemo } from "react";
import { useCategory } from "../hooks/useCategory";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import WrapperHeader from "../components/common/WrapperHeader";
import { LuArrowLeft, LuBadgeInfo } from "react-icons/lu";
import CardWrapper from "../components/ui/CardWrapper";
import WrapperBody from "../components/common/WrapperBody";

const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
    {children}
    {required && <span className="text-amber-500 ml-1">*</span>}
  </label>
);

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

const badgeVariants = {
  slate: "bg-slate-800 text-slate-400 border-slate-700",
  amber: "bg-amber-950/60 text-amber-400 border-amber-800/60",
  emerald: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
  red: "bg-red-950/60 text-red-400 border-red-800/60",
  blue: "bg-blue-950/60 text-blue-400 border-blue-800/60",
};

const Badge = ({ children, color = "slate" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${badgeVariants[color]}`}
  >
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 ${className}`}
  >
    {children}
  </div>
);

const SectionHead = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-5">
    <span className="text-xl sm:text-2xl leading-none mt-0.5 shrink-0">
      {icon}
    </span>
    <div className="min-w-0">
      <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight leading-snug">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const Divider = () => <hr className="border-slate-800 my-5" />;

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
      checked ? "bg-amber-500" : "bg-slate-700"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Skeleton = ({ className = "" }) => (
  <div className={`bg-slate-800 animate-pulse rounded-lg ${className}`} />
);

// ─── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, footer }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Bottom-sheet on mobile, centered dialog on sm+ */}
      <div className="relative bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-800 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Page Skeleton ────────────────────────────────────────────────────────────
const PageSkeleton = () => (
  <div className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
    <Skeleton className="h-14 w-full sm:w-2/3" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Skeleton className="h-48 lg:col-span-2" />
      <div className="space-y-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
    <Skeleton className="h-36" />
    <Skeleton className="h-64" />
    <Skeleton className="h-44" />
    <Skeleton className="h-32" />
  </div>
);

// ─── Category Header ──────────────────────────────────────────────────────────
const CategoryHeader = ({ category, onBack }) => {
  const crumbs = ["Categories", category?.parent?.name, category?.name].filter(
    Boolean,
  );

  return (
    <div className="sticky top-22 z-30  backdrop-blur-md  p-2">
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

// ─── Basic Information Section ────────────────────────────────────────────────
const RenameModal = ({ category, loadingStates, actions, toast }) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");

  const handle = async () => {
    if (!val.trim()) return;
    try {
      await actions.renameCategory(category._id, val.trim());
      toast.success("Category renamed");
      setOpen(false);
    } catch {
      toast.error("Failed to rename");
    }
  };

  return (
    <>
      <Btn
        variant="secondary"
        size="sm"
        onClick={() => {
          setVal(category?.name || "");
          setOpen(true);
        }}
      >
        Rename
      </Btn>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Rename Category"
        footer={
          <>
            <Btn variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              loading={loadingStates.renameCategory}
              onClick={handle}
            >
              Save
            </Btn>
          </>
        }
      >
        <div>
          <FieldLabel required>New Name</FieldLabel>
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Category name…"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
          <p className="text-[11px] text-slate-500 mt-2">
            Renaming recalculates the slug automatically on the backend.
          </p>
        </div>
      </Modal>
    </>
  );
};

const BasicInfoSection = ({
  category,
  categories,
  loadingStates,
  actions,
  toast,
}) => {
  const [form, setForm] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!category) return;
    setForm({
      description: category.description || "",
      level: category.level ?? 0,
      parent: category.parent?._id || "",
      sortOrder: category.sortOrder ?? 0,
    });
    setImagePreview(category.image || "");
  }, [category]);

  const handleSave = async () => {
    try {
      await actions.updateCategory(category._id, {
        description: form.description,
        level: Number(form.level),
        parent: form.parent || null,
        sortOrder: Number(form.sortOrder),
        ...(imageFile ? { image: imageFile } : {}),
      });
      toast.success("Category updated");
      setImageFile(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const otherCats = categories.filter((c) => c._id !== category?._id);

  return (
    <CardWrapper
      headerProps={{
        description: "Core identity, hierarchy, and media assets",
        icon: <LuBadgeInfo />,
        showDivider: true,
        className: "p-4",
      }}
      bodyClassName="p-6"
      title="Basic Information"
    >
      {loadingStates.fetchCategory && !category ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Name */}
          <div>
            <FieldLabel>Name</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={category?.name || ""}
                readOnly
                className="flex-1 opacity-60"
              />
              <RenameModal
                category={category}
                loadingStates={loadingStates}
                actions={actions}
                toast={toast}
              />
            </div>
          </div>

          {/* Slug — always readonly */}
          <div>
            <FieldLabel>Slug</FieldLabel>
            <div className="relative">
              <Input
                value={category?.slug || ""}
                readOnly
                className="opacity-50 pr-20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono pointer-events-none">
                readonly
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              placeholder="Describe this category…"
            />
          </div>

          {/* Level + Parent — single col mobile, 2-col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Level</FieldLabel>
              {/* Architecture note: level should equal parent.level + 1.
                  Enforce consistency server-side. */}
              <SelectField
                value={form.level ?? 0}
                onChange={(e) =>
                  setForm((p) => ({ ...p, level: e.target.value }))
                }
              >
                <option value={0}>0 — Root</option>
                <option value={1}>1 — Section</option>
                <option value={2}>2 — Subsection</option>
                <option value={3}>3 — Leaf</option>
              </SelectField>
            </div>
            <div>
              <FieldLabel>Parent Category</FieldLabel>
              <SelectField
                value={form.parent || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, parent: e.target.value }))
                }
              >
                <option value="">— None (Root) —</option>
                {otherCats.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>

          {/* Sort Order */}
          <div className="max-w-40">
            <FieldLabel>Sort Order</FieldLabel>
            <Input
              type="number"
              min={0}
              value={form.sortOrder ?? 0}
              onChange={(e) =>
                setForm((p) => ({ ...p, sortOrder: e.target.value }))
              }
            />
          </div>

          <Divider />

          {/* Image Upload */}
          <div>
            <FieldLabel>Category Image</FieldLabel>
            <div className="border border-dashed border-slate-700 rounded-xl p-3 flex flex-col items-center gap-3 hover:border-slate-600 transition-colors">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Category"
                    className="w-full h-28 sm:h-36 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-slate-950/80 text-slate-400 hover:text-red-400 rounded-full w-7 h-7 flex items-center justify-center text-xs transition-colors border border-slate-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-full h-28 bg-slate-800 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-600">
                  <span className="text-2xl">🖼</span>
                  <span className="text-xs">No image set</span>
                </div>
              )}
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImageFile(f);
                    setImagePreview(URL.createObjectURL(f));
                  }
                }}
              />
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => imageRef.current?.click()}
              >
                {imagePreview ? "Replace Image" : "Upload Image"}
              </Btn>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Btn
              variant="primary"
              loading={loadingStates.updateCategory}
              onClick={handleSave}
            >
              Save Changes
            </Btn>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

// ─── Status Section ───────────────────────────────────────────────────────────
const StatusSection = ({ category, loadingStates, actions, toast }) => {
  const handleToggle = async (val) => {
    try {
      await actions.updateCategoryStatus(category._id, val);
      toast.success(val ? "Category activated" : "Category deactivated");
    } catch {
      toast.error("Failed to update status");
    }
  };
  return (
    <Card>
      <SectionHead icon="🧬" title="Status" subtitle="Control visibility" />
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-200">Active</p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            Inactive categories are hidden from storefront.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className={`text-xs font-bold ${
              category?.isActive ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {category?.isActive ? "On" : "Off"}
          </span>
          <Toggle
            checked={category?.isActive ?? false}
            onChange={handleToggle}
            disabled={loadingStates.updateStatus}
          />
        </div>
      </div>
      {category?.isArchived && (
        <div className="mt-3 flex items-start gap-2.5 p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl">
          <span className="text-base shrink-0">📦</span>
          <div>
            <p className="text-xs font-bold text-amber-400">Archived</p>
            <p className="text-[11px] text-amber-600 mt-0.5 leading-snug">
              Preserved for history. Cannot be assigned to new products.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

// ─── Product Insights Section ─────────────────────────────────────────────────
const ProductInsightsSection = ({ category, loadingStates, actions }) => {
  const [count, setCount] = useState(null);
  useEffect(() => {
    if (!category?._id) return;
    actions
      .getProductCount(category._id)
      .then((r) => setCount(r?.data?.count ?? 0))
      .catch(() => setCount(0));
  }, [category?._id]);

  return (
    <Card>
      <SectionHead icon="📦" title="Products" subtitle="Assigned count" />
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
        {loadingStates.fetchProductCount ? (
          <Skeleton className="h-12 w-16 mx-auto" />
        ) : (
          <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tabular-nums">
            {count ?? "—"}
          </span>
        )}
        <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-[0.12em] font-bold">
          Products
        </p>
      </div>
      {!loadingStates.fetchProductCount && count > 0 && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl">
          <span className="shrink-0 text-sm">⚠</span>
          <p className="text-[11px] text-amber-400 leading-snug">
            Set a fallback before deleting this category.
          </p>
        </div>
      )}
      {!loadingStates.fetchProductCount && count === 0 && (
        <div className="mt-3 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
          <p className="text-[11px] text-emerald-400">
            ✓ No products. Safe to delete.
          </p>
        </div>
      )}
    </Card>
  );
};

// ─── Fallback Section ─────────────────────────────────────────────────────────
/**
 * WHY FALLBACK MATTERS:
 * When deleting a category, its products must be reassigned somewhere.
 * Without a fallback, products become orphaned (data integrity risk).
 * The fallback auto-re-homes all products before deletion completes.
 */
const FallbackSection = ({
  category,
  categories,
  loadingStates,
  actions,
  toast,
}) => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (category?.fallbackCategory) {
      setSelected(
        typeof category.fallbackCategory === "object"
          ? category.fallbackCategory._id
          : category.fallbackCategory,
      );
    }
  }, [category?.fallbackCategory]);

  const others = categories.filter((c) => c._id !== category?._id);
  const fallbackName = others.find((c) => c._id === selected)?.name;

  const handleSave = async () => {
    try {
      await actions.setFallbackCategory(category._id, selected || null);
      toast.success("Fallback saved");
    } catch {
      toast.error("Failed to set fallback");
    }
  };

  return (
    <Card>
      <SectionHead
        icon="🔁"
        title="Fallback Category"
        subtitle="Where products go if this category is deleted"
      />
      <div className="p-3 sm:p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl mb-4">
        <p className="text-[11px] text-blue-300 leading-relaxed">
          <strong>Why this matters:</strong> Deleting a category with active
          products without a fallback creates orphaned data. Products are
          automatically reassigned to the fallback before deletion completes.
        </p>
      </div>
      {/* Stack on mobile, row on sm+ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <FieldLabel>Fallback Category</FieldLabel>
          <SelectField
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={loadingStates.setFallback}
          >
            <option value="">— None selected —</option>
            {others.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="flex items-end">
          <Btn
            variant={selected ? "success" : "secondary"}
            loading={loadingStates.setFallback}
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save Fallback
          </Btn>
        </div>
      </div>
      {fallbackName && (
        <p className="text-[11px] text-emerald-400 mt-2">
          ✓ Current fallback:{" "}
          <strong className="font-mono">{fallbackName}</strong>
        </p>
      )}
      {!selected && (
        <p className="text-[11px] text-amber-500 mt-2">
          ⚠ No fallback set — category cannot be safely deleted if products
          exist.
        </p>
      )}
    </Card>
  );
};

const META_TYPES = ["text", "number", "boolean", "array", "date", "select"];
const TYPE_COLOR = {
  text: "blue",
  number: "emerald",
  boolean: "amber",
  array: "slate",
  date: "red",
  select: "blue",
};

const MetaFieldEditForm = ({ form, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <FieldLabel required>Label</FieldLabel>
        <Input
          value={form.label || ""}
          onChange={(e) => onChange("label", e.target.value)}
          placeholder="e.g. RAM Size"
        />
      </div>
      <div>
        <FieldLabel required>Type</FieldLabel>
        <SelectField
          value={form.type || "text"}
          onChange={(e) => onChange("type", e.target.value)}
        >
          {META_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectField>
      </div>
    </div>

    {/* Options — only for select */}
    {form.type === "select" && (
      <div>
        <FieldLabel>Options (comma-separated)</FieldLabel>
        <Input
          value={Array.isArray(form.options) ? form.options.join(", ") : ""}
          onChange={(e) =>
            onChange(
              "options",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          placeholder="e.g. HDD, SSD, NVMe SSD"
        />
        {Array.isArray(form.options) && form.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.options.map((o) => (
              <Badge key={o} color="slate">
                {o}
              </Badge>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Unit + placeholder for text/number */}
    {(form.type === "number" || form.type === "text") && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Unit</FieldLabel>
          <Input
            value={form.unit || ""}
            onChange={(e) => onChange("unit", e.target.value)}
            placeholder="e.g. GB, kg, cm"
          />
        </div>
        <div>
          <FieldLabel>Placeholder</FieldLabel>
          <Input
            value={form.placeholder || ""}
            onChange={(e) => onChange("placeholder", e.target.value)}
            placeholder="e.g. Enter value…"
          />
        </div>
      </div>
    )}

    {/* Default value — type-aware rendering */}
    <div>
      <FieldLabel>Default Value</FieldLabel>
      {form.type === "boolean" ? (
        <div className="flex items-center gap-3">
          <Toggle
            checked={!!form.defaultValue}
            onChange={(v) => onChange("defaultValue", v)}
          />
          <span className="text-sm text-slate-400">
            {form.defaultValue ? "true" : "false"}
          </span>
        </div>
      ) : form.type === "number" ? (
        <Input
          type="number"
          value={form.defaultValue ?? ""}
          onChange={(e) =>
            onChange(
              "defaultValue",
              e.target.value === "" ? null : Number(e.target.value),
            )
          }
          placeholder="Default number…"
        />
      ) : form.type === "array" ? (
        <Input
          value={
            Array.isArray(form.defaultValue)
              ? form.defaultValue.join(", ")
              : form.defaultValue || ""
          }
          onChange={(e) =>
            onChange(
              "defaultValue",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          placeholder="Comma-separated defaults…"
        />
      ) : form.type === "select" && Array.isArray(form.options) ? (
        <SelectField
          value={form.defaultValue || ""}
          onChange={(e) => onChange("defaultValue", e.target.value)}
        >
          <option value="">— No default —</option>
          {form.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </SelectField>
      ) : (
        <Input
          value={form.defaultValue || ""}
          onChange={(e) => onChange("defaultValue", e.target.value || null)}
          placeholder="Default text…"
        />
      )}
    </div>

    <Divider />

    {/* Feature flags — 2 col grid always */}
    <div className="grid grid-cols-2 gap-2">
      {[
        {
          key: "isRequired",
          label: "Required",
          desc: "Must fill before saving product",
        },
        {
          key: "isFilterable",
          label: "Filterable",
          desc: "Expose as storefront filter",
        },
        {
          key: "isSearchable",
          label: "Searchable",
          desc: "Include in full-text index",
        },
        {
          key: "isVisibleOnProductPage",
          label: "Visible on Page",
          desc: "Show in spec section",
        },
      ].map(({ key, label, desc }) => (
        <div
          key={key}
          className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-200 leading-tight">
              {label}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 leading-tight hidden sm:block">
              {desc}
            </p>
          </div>
          <Toggle checked={!!form[key]} onChange={(v) => onChange(key, v)} />
        </div>
      ))}
    </div>
  </div>
);

const AddMetaFieldModal = ({
  open,
  onClose,
  categoryId,
  existingKeys,
  loadingStates,
  actions,
  toast,
}) => {
  const blank = {
    key: "",
    label: "",
    type: "text",
    unit: "",
    placeholder: "",
    options: [],
    defaultValue: null,
    isRequired: false,
    isFilterable: false,
    isSearchable: false,
    isVisibleOnProductPage: true,
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  const change = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.key.trim()) e.key = "Required";
    else if (!/^[a-z][a-zA-Z0-9_]*$/.test(form.key.trim()))
      e.key = "Start with a letter; letters/numbers/underscores only";
    else if (existingKeys.includes(form.key.trim()))
      e.key = "Key already exists";
    if (!form.label.trim()) e.label = "Required";
    if (form.type === "select" && (!form.options || form.options.length === 0))
      e.options = "At least one option required for select type";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await actions.addMetaField(categoryId, {
        ...form,
        key: form.key.trim(),
        label: form.label.trim(),
      });
      toast.success(`Field "${form.key}" added`);
      setForm(blank);
      setErrors({});
      onClose();
    } catch {
      toast.error("Failed to add field");
    }
  };

  const handleClose = () => {
    setForm(blank);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Meta Field"
      footer={
        <>
          <Btn variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            loading={loadingStates.addMetaField}
            onClick={handleSubmit}
          >
            Add Field
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Key</FieldLabel>
            <Input
              value={form.key}
              onChange={(e) => change("key", e.target.value.toLowerCase())}
              placeholder="e.g. screen_size"
              className={
                errors.key ? "border-red-600 focus:border-red-500" : ""
              }
            />
            {errors.key && (
              <p className="text-[11px] text-red-400 mt-1">{errors.key}</p>
            )}
            <p className="text-[10px] text-slate-600 mt-1">
              snake_case, unique in this category
            </p>
          </div>
          <div>
            <FieldLabel required>Label</FieldLabel>
            <Input
              value={form.label}
              onChange={(e) => change("label", e.target.value)}
              placeholder="e.g. Screen Size"
              className={
                errors.label ? "border-red-600 focus:border-red-500" : ""
              }
            />
            {errors.label && (
              <p className="text-[11px] text-red-400 mt-1">{errors.label}</p>
            )}
          </div>
        </div>
        <MetaFieldEditForm form={form} onChange={change} />
        {errors.options && (
          <p className="text-[11px] text-red-400">{errors.options}</p>
        )}
      </div>
    </Modal>
  );
};

const MetaFieldRow = ({
  field,
  index,
  totalCount,
  isExpanded,
  isReordering,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  categoryId,
  loadingStates,
  actions,
  toast,
  allKeys,
}) => {
  const [editForm, setEditForm] = useState({ ...field });
  const [renameMode, setRenameMode] = useState(false);
  const [newKey, setNewKey] = useState(field.key);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditForm({ ...field });
    setNewKey(field.key);
  }, [field]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await actions.updateMetaField(categoryId, field.key, {
        label: editForm.label,
        type: editForm.type,
        unit: editForm.unit,
        placeholder: editForm.placeholder,
        options: editForm.options,
        defaultValue: editForm.defaultValue,
        isRequired: editForm.isRequired,
        isFilterable: editForm.isFilterable,
        isSearchable: editForm.isSearchable,
        isVisibleOnProductPage: editForm.isVisibleOnProductPage,
      });
      toast.success(`"${field.key}" updated`);
      onToggleExpand();
    } catch {
      toast.error("Failed to update field");
    } finally {
      setSaving(false);
    }
  };

  const handleRenameKey = async () => {
    const t = newKey.trim();
    if (!t || t === field.key) {
      setRenameMode(false);
      return;
    }
    if (allKeys.includes(t)) {
      toast.error("Key already exists");
      return;
    }
    if (!/^[a-z][a-zA-Z0-9_]*$/.test(t)) {
      toast.error("Invalid key format");
      return;
    }
    try {
      await actions.renameMetaFieldKey(categoryId, field.key, t);
      toast.success("Key renamed");
      setRenameMode(false);
    } catch {
      toast.error("Failed to rename key");
    }
  };

  const handleDelete = async () => {
    try {
      await actions.removeMetaField(categoryId, field.key);
      toast.success(`"${field.key}" removed`);
      setConfirmDelete(false);
    } catch {
      toast.error("Failed to remove field");
    }
  };

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isExpanded
          ? "border-amber-800/50 bg-slate-950/70"
          : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
      }`}
    >
      {/* Row Header */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
        {/* Reorder arrows */}
        {isReordering && (
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="text-slate-600 hover:text-amber-400 disabled:opacity-20 transition-colors text-[11px] leading-none p-0.5"
            >
              ▲
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === totalCount - 1}
              className="text-slate-600 hover:text-amber-400 disabled:opacity-20 transition-colors text-[11px] leading-none p-0.5"
            >
              ▼
            </button>
          </div>
        )}

        <span className="text-[10px] text-slate-600 font-mono w-4 text-right shrink-0">
          {index + 1}
        </span>

        {/* Key / inline rename */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {renameMode ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="text-xs h-7 py-0 w-36 sm:w-44"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameKey();
                  if (e.key === "Escape") setRenameMode(false);
                }}
              />
              <Btn
                variant="success"
                size="xs"
                loading={loadingStates.renameMetaField}
                onClick={handleRenameKey}
              >
                ✓
              </Btn>
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => setRenameMode(false)}
              >
                ✕
              </Btn>
            </div>
          ) : (
            <button
              onClick={() => {
                setRenameMode(true);
                setNewKey(field.key);
              }}
              title="Click to rename key"
              className="font-mono text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition-colors text-left"
            >
              {field.key}
            </button>
          )}
          <Badge color={TYPE_COLOR[field.type] || "slate"}>{field.type}</Badge>
          {field.isRequired && <Badge color="red">req</Badge>}
          {field.isFilterable && <Badge color="blue">filter</Badge>}
          <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
            {field.label}
          </span>
        </div>

        {/* Row actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleExpand}
            disabled={isReordering}
            className="text-slate-500 hover:text-slate-300 text-[11px] px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 whitespace-nowrap"
          >
            {isExpanded ? "▲" : "▼"}
            <span className="hidden sm:inline ml-1">
              {isExpanded ? "Close" : "Edit"}
            </span>
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={isReordering}
            className="text-red-600 hover:text-red-400 text-[11px] px-2 py-1 rounded-lg hover:bg-red-950/30 transition-colors disabled:opacity-30"
          >
            <span className="hidden sm:inline">Delete</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      </div>

      {/* Expanded Edit Panel */}
      {isExpanded && !isReordering && (
        <div className="border-t border-slate-800 px-3 sm:px-4 py-4">
          {/* Label shown for mobile (hidden in row) */}
          <p className="text-[11px] text-slate-500 mb-3 sm:hidden">
            {field.label}
          </p>
          <MetaFieldEditForm
            form={editForm}
            onChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
          />
          <div className="flex justify-end gap-2 mt-4 flex-wrap">
            <Btn variant="ghost" size="sm" onClick={onToggleExpand}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSave}
            >
              Save Field
            </Btn>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Meta Field"
        footer={
          <>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Btn>
            <Btn
              variant="danger"
              size="sm"
              loading={loadingStates.removeMetaField}
              onClick={handleDelete}
            >
              Delete
            </Btn>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            Delete meta field{" "}
            <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
              {field.key}
            </code>{" "}
            ("{field.label}")?
          </p>
          <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-xl">
            <p className="text-[11px] text-red-400 leading-relaxed">
              ⚠ This removes the field from the product schema. Existing product
              values are preserved, but the field won't appear in admin creation
              forms.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const MetaFieldsSection = ({ category, loadingStates, actions, toast }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [orderedKeys, setOrderedKeys] = useState([]);

  const sorted = useMemo(() => {
    if (!category?.metaFields) return [];
    return [...category.metaFields].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [category?.metaFields]);

  useEffect(() => {
    setOrderedKeys(sorted.map((f) => f.key));
  }, [sorted]);

  const moveUp = (i) => {
    if (i === 0) return;
    const nk = [...orderedKeys];
    [nk[i - 1], nk[i]] = [nk[i], nk[i - 1]];
    setOrderedKeys(nk);
  };

  const moveDown = (i) => {
    if (i === orderedKeys.length - 1) return;
    const nk = [...orderedKeys];
    [nk[i], nk[i + 1]] = [nk[i + 1], nk[i]];
    setOrderedKeys(nk);
  };

  const saveOrder = async () => {
    try {
      await actions.reorderMetaFields(category._id, orderedKeys);
      toast.success("Field order saved");
      setReordering(false);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const displayedFields = (reordering ? orderedKeys : sorted.map((f) => f.key))
    .map((k) => sorted.find((f) => f.key === k))
    .filter(Boolean);

  const anyLoading =
    loadingStates.addMetaField ||
    loadingStates.updateMetaField ||
    loadingStates.renameMetaField ||
    loadingStates.removeMetaField ||
    loadingStates.reorderMetaFields;

  return (
    <Card>
      {/* Header — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <SectionHead
          icon="🧪"
          title="Meta Fields — Schema Builder"
          subtitle="Define product attributes. These become form fields in product creation."
        />
        <div className="flex gap-2 shrink-0 flex-wrap">
          {reordering ? (
            <>
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReordering(false);
                  setOrderedKeys(sorted.map((f) => f.key));
                }}
              >
                Cancel
              </Btn>
              <Btn
                variant="success"
                size="sm"
                loading={loadingStates.reorderMetaFields}
                onClick={saveOrder}
              >
                Save Order
              </Btn>
            </>
          ) : (
            <>
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => setReordering(true)}
                disabled={sorted.length < 2}
              >
                ↕ Reorder
              </Btn>
              <Btn
                variant="primary"
                size="sm"
                onClick={() => setAddOpen(true)}
                disabled={anyLoading}
              >
                + Add Field
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {META_TYPES.map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 border border-slate-700 font-mono"
          >
            {t}
          </span>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="py-10 sm:py-14 flex flex-col items-center gap-3 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
          <span className="text-3xl">🗂</span>
          <p className="text-sm">No meta fields yet</p>
          <p className="text-xs text-center max-w-xs px-4 leading-relaxed">
            Meta fields define what product attributes exist for this category.
          </p>
          <Btn variant="secondary" size="sm" onClick={() => setAddOpen(true)}>
            + Add First Field
          </Btn>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedFields.map((field, idx) => (
            <MetaFieldRow
              key={field.key}
              field={field}
              index={idx}
              totalCount={displayedFields.length}
              isExpanded={expandedKey === field.key}
              isReordering={reordering}
              onToggleExpand={() =>
                setExpandedKey((p) => (p === field.key ? null : field.key))
              }
              onMoveUp={() => moveUp(idx)}
              onMoveDown={() => moveDown(idx)}
              categoryId={category._id}
              loadingStates={loadingStates}
              actions={actions}
              toast={toast}
              allKeys={sorted.map((f) => f.key)}
            />
          ))}
        </div>
      )}

      <AddMetaFieldModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        categoryId={category?._id}
        existingKeys={sorted.map((f) => f.key)}
        loadingStates={loadingStates}
        actions={actions}
        toast={toast}
      />
    </Card>
  );
};

// ─── SEO Section ──────────────────────────────────────────────────────────────
const SeoSection = ({ category, loadingStates, actions, toast }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    keywords: "",
  });

  useEffect(() => {
    if (!category?.meta) return;
    setForm({
      title: category.meta.title || "",
      description: category.meta.description || "",
      keywords: (category.meta.keywords || []).join(", "),
    });
  }, [category?.meta]);

  const handleSave = async () => {
    try {
      await actions.updateCategory(category._id, {
        meta: {
          title: form.title,
          description: form.description,
          keywords: form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      });
      toast.success("SEO metadata saved");
    } catch {
      toast.error("Failed to save SEO");
    }
  };

  const titleLen = form.title.length;
  const descLen = form.description.length;
  const keywords = form.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <Card>
      <SectionHead
        icon="🔍"
        title="SEO Metadata"
        subtitle="Search engine indexing and social sharing previews"
      />
      <div className="space-y-4">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel>Meta Title</FieldLabel>
            <span
              className={`text-[10px] font-mono ${
                titleLen > 60 ? "text-amber-500" : "text-slate-600"
              }`}
            >
              {titleLen}/60
            </span>
          </div>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Buy Laptops Online — Best Deals"
          />
          <p className="text-[10px] text-slate-600 mt-1">
            Recommended: 50–60 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel>Meta Description</FieldLabel>
            <span
              className={`text-[10px] font-mono ${
                descLen > 160 ? "text-amber-500" : "text-slate-600"
              }`}
            >
              {descLen}/160
            </span>
          </div>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            placeholder="Brief description for search engine snippets…"
          />
        </div>

        {/* Keywords */}
        <div>
          <FieldLabel>Keywords (comma-separated)</FieldLabel>
          <Input
            value={form.keywords}
            onChange={(e) =>
              setForm((p) => ({ ...p, keywords: e.target.value }))
            }
            placeholder="e.g. laptops, notebooks, portable computers"
          />
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {keywords.map((kw) => (
                <Badge key={kw} color="slate">
                  {kw}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* SERP Preview */}
        {(form.title || form.description) && (
          <div className="p-3 sm:p-4 bg-white/3 border border-slate-800 rounded-xl">
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.14em] font-bold mb-2">
              SERP Preview
            </p>
            <p className="text-blue-400 text-sm font-medium line-clamp-1">
              {form.title || category?.name}
            </p>
            <p className="text-emerald-700 text-[11px] font-mono mt-0.5">
              yourdomain.com/categories/{category?.slug}
            </p>
            <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
              {form.description || "No meta description set."}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Btn
            variant="primary"
            loading={loadingStates.updateCategory}
            onClick={handleSave}
          >
            Save SEO
          </Btn>
        </div>
      </div>
    </Card>
  );
};

// ─── Danger Zone ──────────────────────────────────────────────────────────────
const DangerZone = ({
  category,
  categories,
  productCount,
  loadingStates,
  actions,
  toast,
  navigate,
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [globalFallback, setGlobalFallback] = useState("");

  const hasFallback = !!category?.fallbackCategory;
  const hasProducts = productCount > 0;
  // Block deletion when products exist but no fallback is set
  const isDangerous = hasProducts && !hasFallback;
  const others = categories.filter((c) => c._id !== category?._id);
  const expected = category?.name || "";

  const handleDelete = async () => {
    if (confirmText !== expected) return;
    try {
      const fid =
        globalFallback ||
        (typeof category?.fallbackCategory === "object"
          ? category?.fallbackCategory?._id
          : category?.fallbackCategory) ||
        null;
      await actions.deleteCategory(category._id, fid);
      toast.success("Category deleted");
      navigate("/admin/categories");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Card className="border-red-900/40 bg-red-950/8">
      <SectionHead
        icon="🗑"
        title="Danger Zone"
        subtitle="Irreversible operations — proceed with caution"
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-3 sm:p-4 border border-red-900/40 rounded-xl">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-400">Delete this category</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Once deleted, this cannot be undone. Products will be moved to the
            fallback category if set.
          </p>
          {isDangerous && (
            <div className="mt-2 flex items-start gap-2 p-2.5 bg-red-950/40 border border-red-900/50 rounded-xl">
              <span className="text-sm shrink-0">⚠</span>
              <p className="text-[11px] text-red-400 leading-snug">
                {productCount} product{productCount !== 1 ? "s" : ""} exist and
                no fallback is set. Set a fallback above first.
              </p>
            </div>
          )}
          {hasFallback && (
            <p className="text-[11px] text-emerald-400 mt-2">
              ✓ Fallback is set. Products will be safely reassigned.
            </p>
          )}
        </div>
        <Btn
          variant="danger"
          onClick={() => setDeleteOpen(true)}
          disabled={isDangerous}
          className="w-full sm:w-auto shrink-0"
        >
          Delete Category
        </Btn>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setConfirmText("");
        }}
        title="Delete Category"
        footer={
          <>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </Btn>
            <Btn
              variant="danger"
              size="sm"
              loading={loadingStates.deleteCategory}
              disabled={confirmText !== expected}
              onClick={handleDelete}
            >
              Permanently Delete
            </Btn>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl">
            <p className="text-xs text-red-300 font-bold">
              You are about to delete:
            </p>
            <p className="text-base text-white font-black mt-1">
              {category?.name}
            </p>
            {hasProducts && (
              <p className="text-[11px] text-red-400 mt-1">
                {productCount} product{productCount !== 1 ? "s" : ""} will be
                reassigned.
              </p>
            )}
          </div>

          {hasProducts && (
            <div>
              <FieldLabel>Override Fallback (optional)</FieldLabel>
              <SelectField
                value={globalFallback}
                onChange={(e) => setGlobalFallback(e.target.value)}
              >
                <option value="">
                  Use category fallback {hasFallback ? "(set)" : "— none"}
                </option>
                {others.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
            </div>
          )}

          <div>
            <FieldLabel required>
              Type{" "}
              <span className="text-amber-400 normal-case font-mono">
                {expected}
              </span>{" "}
              to confirm
            </FieldLabel>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${expected}" to confirm`}
              className={
                confirmText && confirmText !== expected
                  ? "border-red-600"
                  : confirmText === expected && confirmText
                    ? "border-emerald-700"
                    : ""
              }
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CategoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  const {
    category,
    categories,
    loadingStates,
    error,
    getCategoryById,
    getProductCount,
    updateCategory,
    renameCategory,
    deleteCategory,
    updateCategoryStatus,
    setFallbackCategory,
    addMetaField,
    updateMetaField,
    renameMetaFieldKey,
    removeMetaField,
    reorderMetaFields,
  } = useCategory();

  // Bundle all actions for clean prop passing
  const actions = {
    updateCategory,
    renameCategory,
    deleteCategory,
    updateCategoryStatus,
    setFallbackCategory,
    addMetaField,
    updateMetaField,
    renameMetaFieldKey,
    removeMetaField,
    reorderMetaFields,
    getProductCount,
  };

  useEffect(() => {
    if (!id) return;
    getCategoryById(id);
  }, [id]);

  useEffect(() => {
    if (!category?._id) return;
    getProductCount(category._id)
      .then((r) => setProductCount(r?.data?.count ?? 0))
      .catch(() => setProductCount(0));
  }, [category?._id]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm w-full">
          <div className="text-5xl">⚠</div>
          <h2 className="text-lg font-bold text-red-400">
            Failed to load category
          </h2>
          <p className="text-xs text-slate-500">{error?.message}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Btn variant="secondary" onClick={() => getCategoryById(id)}>
              Retry
            </Btn>
            <Btn variant="ghost" onClick={() => navigate("/admin/categories")}>
              ← Back
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  if (loadingStates.fetchCategory && !category) {
    return (
      <div className="min-h-screen bg-slate-950">
        <PageSkeleton />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="min-h-screen ">
      {/* Sticky header */}
      <CategoryHeader
        category={category}
        onBack={() => navigate("/admin/categories")}
      />

      <main className="max-w-5xl mx-auto px-6 sm:px-6 py-5 sm:py-8 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          <div className="lg:col-span-2">
            <BasicInfoSection
              category={category}
              categories={categories}
              loadingStates={loadingStates}
              actions={actions}
              toast={toast}
            />
          </div>
          <div className="space-y-4 sm:space-y-5">
            <StatusSection
              category={category}
              loadingStates={loadingStates}
              actions={actions}
              toast={toast}
            />
            <ProductInsightsSection
              category={category}
              loadingStates={loadingStates}
              actions={actions}
            />
          </div>
        </div>

        <FallbackSection
          category={category}
          categories={categories}
          loadingStates={loadingStates}
          actions={actions}
          toast={toast}
        />

        <MetaFieldsSection
          category={category}
          loadingStates={loadingStates}
          actions={actions}
          toast={toast}
        />

        <SeoSection
          category={category}
          loadingStates={loadingStates}
          actions={actions}
          toast={toast}
        />

        <DangerZone
          category={category}
          categories={categories}
          productCount={productCount}
          loadingStates={loadingStates}
          actions={actions}
          toast={toast}
          navigate={navigate}
        />
      </main>
    </div>
  );
};

export default CategoryDetailsPage;
