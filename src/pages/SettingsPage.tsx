import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingRow {
  id: string;
  section: string;
  label: string;
  value: string;
  value_type: string;
  sort_order: number;
}

export default function SettingsPage() {
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async (): Promise<SettingRow[]> => {
      const { data, error } = await (supabase as any)
        .from("app_settings")
        .select("*")
        .order("sort_order");
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

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["系統設定"]} title="系統設定" description="管理系統層級的全域配置與偏好設定" />
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
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
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
