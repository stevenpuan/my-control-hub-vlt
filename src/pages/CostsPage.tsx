import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryRow {
  id: string;
  category: string;
  app_count: number;
  monthly_cost: number;
  sort_order: number;
}
interface TrendRow {
  id: string;
  month_label: string;
  amount: number;
  sort_order: number;
}

export default function CostsPage() {
  const catQ = useQuery({
    queryKey: ["cost_categories"],
    queryFn: async (): Promise<CategoryRow[]> => {
      const { data, error } = await (supabase as any)
        .from("cost_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as CategoryRow[];
    },
  });
  const trendQ = useQuery({
    queryKey: ["cost_trend"],
    queryFn: async (): Promise<TrendRow[]> => {
      const { data, error } = await (supabase as any)
        .from("cost_trend")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as TrendRow[];
    },
  });

  if (catQ.error) toast.error("讀取費用類別失敗", { description: (catQ.error as Error).message });
  if (trendQ.error) toast.error("讀取費用趨勢失敗", { description: (trendQ.error as Error).message });

  const categories = catQ.data ?? [];
  const trend = trendQ.data ?? [];

  const totals = useMemo(() => {
    const total = categories.reduce((s, r) => s + Number(r.monthly_cost ?? 0), 0);
    let mom = "—";
    if (trend.length >= 2) {
      const last = Number(trend[trend.length - 1].amount);
      const prev = Number(trend[trend.length - 2].amount);
      if (prev) {
        const pct = ((last - prev) / prev) * 100;
        mom = `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
      }
    }
    return { total, mom };
  }, [categories, trend]);

  const maxTrend = Math.max(1, ...trend.map((t) => Number(t.amount)));

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["SaaS 應用管理", "費用分析"]}
        title="費用分析"
        description="分析各項 SaaS 應用的費用趨勢與分佈"
      />
      <div className="grid grid-cols-4 gap-4">
        {catQ.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : (
          <>
            <StatCard label="本月總費用" value={`$${totals.total.toLocaleString()}`} />
            <StatCard label="較上月" value={totals.mom} />
            <StatCard label="年度預算使用" value="67%" />
            <StatCard label="可優化項目" value={4} />
          </>
        )}
      </div>

      {catQ.isLoading ? (
        <Skeleton className="h-48 rounded-lg" />
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">費用類別</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">應用數量</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">月費用</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">佔比</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => {
                const pct = totals.total ? (Number(item.monthly_cost) / totals.total) * 100 : 0;
                return (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-card-foreground">{item.category}</td>
                    <td className="px-4 py-3 text-card-foreground">{item.app_count}</td>
                    <td className="px-4 py-3 text-card-foreground">
                      ${Number(item.monthly_cost).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-muted-foreground text-xs">{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-card-foreground mb-4">費用趨勢（近 6 個月）</h3>
        {trendQ.isLoading ? (
          <Skeleton className="h-48 rounded" />
        ) : (
          <div className="h-48 flex items-end gap-4 px-4">
            {trend.map((row) => {
              const val = Number(row.amount);
              return (
                <div key={row.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">${(val / 1000).toFixed(1)}k</span>
                  <div
                    className="w-full bg-primary/20 rounded-t"
                    style={{ height: `${(val / maxTrend) * 160}px` }}
                  >
                    <div className="w-full h-full bg-primary/60 rounded-t" />
                  </div>
                  <span className="text-xs text-muted-foreground">{row.month_label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
