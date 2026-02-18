import { useState, useEffect } from "react";
import { useCategory } from "../hooks/useCategory";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import WrapperHeader from "../components/common/WrapperHeader";
import { LuBadgeInfo } from "react-icons/lu";
import CardWrapper from "../components/ui/CardWrapper";
import WrapperBody from "../components/common/WrapperBody";
import ImageUpload from "../components/ui/ImageUpload";
import RadioCard from "../components/common/RadioCard";
import { LuPackage, LuTriangleAlert } from "react-icons/lu";
import { FaLink, FaRandom } from "react-icons/fa";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import Modal from "../components/atoms/Modal";
import {
  FieldLabel,
  SelectField,
  Input,
  Textarea,
} from "../components/atoms/FormComponents";
import Btn from "../components/atoms/Btn";
import Badge from "../components/atoms/Badge";
import SectionHead from "../components/atoms/SectionHead";
import Skeleton from "../components/atoms/Skeleton";
import PageSkeleton from "../sections/categories/detail/PageSkeleton";
import CategoryHeader from "../sections/categories/detail/CategoryHeader";
import RenameModal from "../sections/categories/detail/RenameModal";
import MetaFieldsSection from "../sections/categories/detail/MetaFieldsSection";

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

  useEffect(() => {
    if (!category) return;
    setForm({
      description: category.description || "",
      level: category.level ?? 0,
      parent: category.parent?._id || "",
      sortOrder: category.sortOrder ?? 0,
    });
    setImagePreview(category.image || category.icon || "");
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
              <div className="relative">
                <Input
                  value={category?.level || 0}
                  readOnly
                  className="opacity-50 pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono pointer-events-none">
                  readonly
                </span>
              </div>
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

          <WrapperBody.Divider />

          {/* Image Upload */}
          <ImageUpload
            label="Category Image"
            value={imagePreview}
            onUpload={(f) => {
              if (f) {
                setImageFile(f);
                setImagePreview(URL.createObjectURL(f));
              }
            }}
            onRemove={() => {
              setImagePreview("");
              setImageFile(null);
            }}
          />

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
    <CardWrapper className="p-4">
      <WrapperHeader
        icon="🧬"
        title="Status"
        description="Control visibility"
        descriptionClassName="text-xs"
        className="pb-2 mb-3"
        titleClassName="text-[15px] font-bold mb-1"
        showDivider
      />
      <RadioCard
        label="Active Status"
        isChecked={category?.isActive ?? false}
        name="activeStatus"
        sub="Inactive categories are hidden from storefront."
        handleChange={handleToggle}
        disabled={loadingStates.updateStatus}
        showStatusText
      />
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
    </CardWrapper>
  );
};

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
    <CardWrapper>
      <WrapperHeader
        icon={<LuPackage />}
        title="Products"
        description="Assigned count"
        descriptionClassName="text-xs -mt-2"
        className="p-4"
      />
      <WrapperBody.Divider />
      <WrapperBody>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
          {loadingStates.fetchProductCount ? (
            <Skeleton className="h-12 w-16 mx-auto" />
          ) : (
            <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tabular-nums">
              {count ?? "—"}
            </span>
          )}
          <p className="text-[10px] text-gray-400 mt-1.5 uppercase tracking-[0.12em] font-bold">
            Products
          </p>
        </div>
        {!loadingStates.fetchProductCount && count > 0 && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl">
            <span className="shrink-0 text-sm text-amber-300">
              <LuTriangleAlert />
            </span>
            <p className="text-[11px] text-amber-400 leading-snug">
              Set a fallback before deleting this category.
            </p>
          </div>
        )}
        {!loadingStates.fetchProductCount && count === 0 && (
          <div className="mt-3 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
            <p className="text-[11px] text-emerald-400">
              No products. Safe to delete.
            </p>
          </div>
        )}{" "}
      </WrapperBody>
    </CardWrapper>
  );
};

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
    <CardWrapper>
      <WrapperHeader
        icon={<FaRandom />}
        title="Fallback Category"
        description="Where products go if this category is deleted"
        className="p-4"
        descriptionClassName="text-xs"
      />
      <WrapperBody>
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
            Current fallback:{" "}
            <strong className="font-bold">{fallbackName}</strong>
          </p>
        )}
        {!selected && (
          <p className="text-[11px] text-amber-500 mt-2">
            <LuTriangleAlert className="inline-flex" /> No fallback set —
            category cannot be safely deleted if products exist.
          </p>
        )}
      </WrapperBody>
    </CardWrapper>
  );
};

const SeoSection = ({ category, loadingStates, actions, toast }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    keywords: [],
  });
  const [keywordInput, setKeywordInput] = useState("");

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
  const keywords = form.keywords;
  // .split(",")
  // .map((k) => k.trim())
  // .filter(Boolean);

  return (
    <CardWrapper className="p-4">
      <SectionHead
        icon={<FiSearch />}
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
                titleLen > 60 ? "text-amber-500" : "text-slate-400"
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
          <p className="text-[10px] text-slate-400 mt-1">
            Recommended: 50–60 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel>Meta Description</FieldLabel>
            <span
              className={`text-[10px] font-mono ${
                descLen > 160 ? "text-amber-500" : "text-slate-400"
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
          <FieldLabel>Keywords</FieldLabel>
          <WrapperBody.Flex gap={2}>
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="e.g. laptops, notebooks, portable computers"
            />
            <Btn
              variant="primary"
              onClick={() => {
                if (!form.keywords.includes(keywordInput.toLowerCase())) {
                  setForm((p) => ({
                    ...p,
                    keywords: [...p.keywords, keywordInput.toLowerCase()],
                  }));
                  setKeywordInput("");
                } else {
                  toast.error(`${keywordInput} already exists.`);
                }
              }}
            >
              + Add
            </Btn>
          </WrapperBody.Flex>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {keywords.map((kw) => (
                <Badge
                  key={kw}
                  color="slate"
                  onRemove={() =>
                    setForm((prev) => ({
                      ...prev,
                      keywords: prev.keywords.filter((t) => t !== kw),
                    }))
                  }
                >
                  {kw}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* SERP Preview */}
        {(form.title || form.description) && (
          <WrapperBody
            className="p-3 sm:p-4 rounded-xl"
            border
            borderColor="primary"
            showBg
            bgColor="primary"
          >
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.14em] font-bold mb-2">
              SERP Preview
            </p>
            <p className="text-blue-400 text-sm font-medium line-clamp-1">
              {form.title || category?.name}
            </p>
            <p className="text-blue-500 text-[11px] font-mono mt-0.5 flex items-center gap-2">
              <FaLink />
              shopverse.com/categories/{category?.slug}
            </p>
            <p className="text-gray-300 text-xs mt-1 line-clamp-2 leading-relaxed">
              {form.description || "No meta description set."}
            </p>
          </WrapperBody>
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
    </CardWrapper>
  );
};

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
    <CardWrapper padding>
      <SectionHead
        icon={<FiTrash2 />}
        title="Danger Zone"
        subtitle="Irreversible operations — proceed with caution"
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-3 sm:p-4 border border-red-700/50 rounded-xl">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-400">Delete this category</p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Once deleted, this cannot be undone. Products will be moved to the
            fallback category if set.
          </p>
          {isDangerous && (
            <div className="mt-2 flex items-start gap-2 p-2.5 bg-red-950/40 border border-red-900/50 rounded-xl">
              <span className="text-sm shrink-0">
                <LuTriangleAlert />
              </span>
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
    </CardWrapper>
  );
};

const CategoryDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  const {
    category,
    categories,
    loadingStates,
    error,
    getCategoryById,
    getProductCount,
    getCategoryBySlug,
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
    getAllCategories,
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
    getAllCategories();
    if (!id && !state?.slug) return;
    if (state?.slug) {
      getCategoryBySlug(state?.slug);
    } else getCategoryById(id);
  }, [id, state?.slug]);

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
            <Btn
              variant="secondary"
              onClick={() => {
                if (state?.slug) {
                  getCategoryBySlug(state?.slug);
                } else getCategoryById(id);
              }}
            >
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
        onBack={() => navigate("/categories")}
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
