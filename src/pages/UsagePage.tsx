import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface UsageRow {
  id: string;
  service: string;
  metric: string;
  current_label: string;
  limit_label: string;
  usage_pct: number;
  sort_order: number;
}

export default function UsagePage() {
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["usage_metrics"],
    queryFn: async (): Promise<UsageRow[]> => {
      const { data, error } = await (supabase as any)
        .from("usage_metrics")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as UsageRow[];
    },
  });

  if (error) toast.error("讀取用量資料失敗", { description: (error as Error).message });

  const stats = useMemo(
    () => ({
      total: rows.length,
      over80: rows.filter((r) => Number(r.usage_pct) > 80).length,
      over90: rows.filter((r) => Number(r.usage_pct) > 90).length,
    }),
    [rows]
  );

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["用量監控"]} title="用量監控" description="即時監控各服務的用量與配額使用情況" />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="監控服務" value={stats.total} />,
              <StatCard key="b" label="超過 80%" value={stats.over80} />,
              <StatCard key="c" label="超過 90%" value={stats.over90} />,
              <StatCard key="d" label="本月異常" value={0} />,
            ]}
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)
          : rows.map((item) => {
              const pct = Number(item.usage_pct);
              return (
                <div key={item.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-card-foreground">{item.service}</span>
                      <span className="text-muted-foreground text-sm ml-2">— {item.metric}</span>
                    </div>
                    <span className="text-sm text-card-foreground">
                      {item.current_label} / {item.limit_label}
                    </span>
                  </div>
                  {pct > 0 ? (
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct > 90 ? "bg-destructive" : pct > 80 ? "bg-warning" : "bg-primary"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">無限制</div>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
