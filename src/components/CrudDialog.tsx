import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CrudFieldType =
  | "text"
  | "number"
  | "date"
  | "switch"
  | "select"
  | "textarea"
  | "tags";

export interface CrudField {
  name: string;
  label: string;
  type: CrudFieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface CrudDialogProps<T extends Record<string, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  title?: string;
  fields: CrudField[];
  defaultValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

function buildSchema(fields: CrudField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    let s: z.ZodTypeAny;
    switch (f.type) {
      case "number":
        s = z.preprocess(
          (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
          f.required ? z.number({ invalid_type_error: "必須為數字" }) : z.number().optional(),
        );
        break;
      case "switch":
        s = z.boolean().default(false);
        break;
      case "tags":
        s = z
          .preprocess(
            (v) =>
              Array.isArray(v)
                ? v
                : typeof v === "string"
                  ? v.split(",").map((t) => t.trim()).filter(Boolean)
                  : [],
            z.array(z.string()),
          );
        if (f.required) s = (s as z.ZodArray<z.ZodString>).min(1, "必填");
        break;
      default:
        s = f.required ? z.string().min(1, "必填") : z.string().optional();
    }
    shape[f.name] = s;
  }
  return z.object(shape);
}

function emptyDefaults(fields: CrudField[]): Record<string, any> {
  const out: Record<string, any> = {};
  for (const f of fields) {
    if (f.type === "switch") out[f.name] = false;
    else if (f.type === "tags") out[f.name] = [];
    else if (f.type === "number") out[f.name] = "";
    else out[f.name] = "";
  }
  return out;
}

export default function CrudDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  mode,
  title,
  fields,
  defaultValues,
  onSubmit,
}: CrudDialogProps<T>) {
  const schema = useMemo(() => buildSchema(fields), [fields]);

  const initial = useMemo(() => {
    const base = emptyDefaults(fields);
    if (!defaultValues) return base;
    const merged: Record<string, any> = { ...base };
    for (const f of fields) {
      const v = (defaultValues as any)[f.name];
      if (v === undefined || v === null) continue;
      if (f.type === "tags") {
        merged[f.name] = Array.isArray(v) ? v : String(v).split(",").map((s) => s.trim()).filter(Boolean);
      } else if (f.type === "date") {
        merged[f.name] = typeof v === "string" ? v.slice(0, 10) : v;
      } else {
        merged[f.name] = v;
      }
    }
    return merged;
  }, [fields, defaultValues]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: initial,
  });

  useEffect(() => {
    if (open) form.reset(initial);
  }, [open, initial, form]);

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values as T);
  });

  const resolvedTitle = title ?? (mode === "create" ? "新增" : "編輯");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "填寫下列欄位以新增資料。" : "修改欄位後儲存變更。"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {fields.map((f) => {
            const err = (form.formState.errors as any)[f.name]?.message as string | undefined;
            return (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={f.name}>
                  {f.label}
                  {f.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {renderField(f, form)}
                {err && <p className="text-sm font-medium text-destructive">{err}</p>}
              </div>
            );
          })}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {mode === "create" ? "新增" : "儲存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function renderField(f: CrudField, form: ReturnType<typeof useForm<any>>) {
  const { register, watch, setValue } = form;
  const value = watch(f.name);

  switch (f.type) {
    case "textarea":
      return <Textarea id={f.name} placeholder={f.placeholder} {...register(f.name)} />;
    case "number":
      return (
        <Input id={f.name} type="number" placeholder={f.placeholder} {...register(f.name)} />
      );
    case "date":
      return <Input id={f.name} type="date" {...register(f.name)} />;
    case "switch":
      return (
        <div className="flex items-center gap-2">
          <Switch
            id={f.name}
            checked={!!value}
            onCheckedChange={(v) => setValue(f.name, v, { shouldValidate: true })}
          />
          <span className="text-sm text-muted-foreground">{value ? "啟用" : "停用"}</span>
        </div>
      );
    case "select":
      return (
        <Select
          value={value ?? ""}
          onValueChange={(v) => setValue(f.name, v, { shouldValidate: true })}
        >
          <SelectTrigger id={f.name}>
            <SelectValue placeholder={f.placeholder ?? "請選擇"} />
          </SelectTrigger>
          <SelectContent>
            {f.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "tags":
      return (
        <Input
          id={f.name}
          placeholder={f.placeholder ?? "以逗號分隔"}
          value={Array.isArray(value) ? value.join(", ") : (value ?? "")}
          onChange={(e) =>
            setValue(
              f.name,
              e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              { shouldValidate: true },
            )
          }
        />
      );
    default:
      return <Input id={f.name} placeholder={f.placeholder} {...register(f.name)} />;
  }
}
