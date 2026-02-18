import { META_TYPES } from "../../../assets/categoryDetail";
import Badge from "../../../components/atoms/Badge";
import {
  FieldLabel,
  Input,
  SelectField,
} from "../../../components/atoms/FormComponents";
import Toggle from "../../../components/atoms/Toggle";
import WrapperBody from "../../../components/common/WrapperBody";

const MetaFieldEditForm = ({ form, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <FieldLabel required>Label</FieldLabel>
        <Input
          value={form.label || ""}
          onChange={(e) => {
            onChange("label", e.target.value);
            onChange(
              "key",
              e.target.value
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, ""),
            );
          }}
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

    <WrapperBody.Divider />

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

export default MetaFieldEditForm;
