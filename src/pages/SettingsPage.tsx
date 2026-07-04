import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";

interface SettingRow {
  id: string;
  section: string;
  label: string;
  value: string;
  value_type: string;
  sort_order: number;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<SettingRow | null>(null);

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async (): Promise<SettingRow[]> => {
      const { data, error } = await (supabase as any).from("app_settings").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as SettingRow[];
    },
  });
  if (error) toast.error("讀取設定失敗", { description: (error as Error).message });

  const sections = useMemo(() => {
    const map = new Map<string, SettingRow[]>();
    for (const r of rows) {
      if (!map.has(r.section)) map.set(r.section, []);
      map.get(r.section)!.push(r);
    }
    return Array.from(map.entries());
  }, [rows]);

  const editFields: CrudField[] = editing
    ? [{ name: "value", label: editing.label, type: (editing.value_type as any) || "text" }]
    : [];

  const handleSubmit = async (values: Record<string, any>) => {
    if (!editing) return;
    try {
      const { error } = await (supabase as any)
        .from("app_settings").update({ value: String(values.value ?? "") }).eq("id", editing.id);
      if (error) throw error;
      toast.success("已更新");
      queryClient.invalidateQueries({ queryKey: ["app_settings"] });
      setEditing(null);
    } catch (e) {
      toast.error("設定更新失敗", { description: (e as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["系統設定"]} title="系統設定" description="管理系統層級的全域配置與偏好設定" />
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(([section, items]) => (
            <div key={section} className="bg-card border border-border rounded-lg">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-semibold text-card-foreground">{section}</h3>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-card-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded">{item.value}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(item)} aria-label="編輯">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CrudDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        mode="edit"
        title={editing ? `編輯：${editing.label}` : "編輯"}
        fields={editFields}
        defaultValues={editing ? { value: editing.value } : undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
