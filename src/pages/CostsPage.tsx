import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";
import { useCrud } from "@/hooks/useCrud";

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

const categoryFields: CrudField[] = [
  { name: "category", label: "類別", type: "text", required: true },
  { name: "app_count", label: "應用數量", type: "number" },
  { name: "monthly_cost", label: "月費用", type: "number" },
  { name: "sort_order", label: "排序", type: "number" },
];

const trendFields: CrudField[] = [
  { name: "month_label", label: "月份", type: "text", required: true },
  { name: "amount", label: "金額", type: "number" },
  { name: "sort_order", label: "排序", type: "number" },
];

export default function CostsPage() {
  const catCrud = useCrud<CategoryRow>({ table: "cost_categories", queryKey: "cost_categories", labelName: "費用類別" });
  const trendCrud = useCrud<TrendRow>({ table: "cost_trend", queryKey: "cost_trend", labelName: "費用趨勢" });

  const catQ = useQuery({
    queryKey: ["cost_categories"],
    queryFn: async (): Promise<CategoryRow[]> => {
      const { data, error } = await (supabase as any).from("cost_categories").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as CategoryRow[];
    },
  });
  const trendQ = useQuery({
    queryKey: ["cost_trend"],
    queryFn: async (): Promise<TrendRow[]> => {
      const { data, error } = await (supabase as any).from("cost_trend").select("*").order("sort_order");
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

  const categoryColumns = [
    { key: "category", label: "費用類別" },
    { key: "app_count", label: "應用數量" },
    { key: "monthly_cost", label: "月費用", render: (r: CategoryRow) => <span>${Number(r.monthly_cost).toLocaleString()}</span> },
    {
      key: "pct",
      label: "佔比",
      render: (r: CategoryRow) => {
        const pct = totals.total ? (Number(r.monthly_cost) / totals.total) * 100 : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-muted-foreground text-xs">{pct.toFixed(1)}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["SaaS 應用管理", "費用分析"]}
        title="費用分析"
        description="分析各項 SaaS 應用的費用趨勢與分佈"
        actions={<Button onClick={catCrud.openCreate}><Plus className="h-4 w-4" />新增類別</Button>}
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
        <DataTable columns={categoryColumns} data={categories} onEdit={catCrud.openEdit} onDelete={catCrud.remove} />
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-card-foreground">費用趨勢（近 6 個月）</h3>
          <Button size="sm" variant="outline" onClick={trendCrud.openCreate}>
            <Plus className="h-4 w-4" />新增月份
          </Button>
        </div>
        {trendQ.isLoading ? (
          <Skeleton className="h-48 rounded" />
        ) : (
          <>
            <div className="h-48 flex items-end gap-4 px-4">
              {trend.map((row) => {
                const val = Number(row.amount);
                return (
                  <div key={row.id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">${(val / 1000).toFixed(1)}k</span>
                    <div className="w-full bg-primary/20 rounded-t cursor-pointer" style={{ height: `${(val / maxTrend) * 160}px` }}
                      onClick={() => trendCrud.openEdit(row)}>
                      <div className="w-full h-full bg-primary/60 rounded-t" />
                    </div>
                    <span className="text-xs text-muted-foreground">{row.month_label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <DataTable
                columns={[
                  { key: "month_label", label: "月份" },
                  { key: "amount", label: "金額", render: (r: TrendRow) => <span>${Number(r.amount).toLocaleString()}</span> },
                  { key: "sort_order", label: "排序" },
                ]}
                data={trend}
                onEdit={trendCrud.openEdit}
                onDelete={trendCrud.remove}
              />
            </div>
          </>
        )}
      </div>

      <CrudDialog
        open={catCrud.dialogOpen}
        onOpenChange={catCrud.setDialogOpen}
        mode={catCrud.editing ? "edit" : "create"}
        title={catCrud.editing ? "編輯費用類別" : "新增費用類別"}
        fields={categoryFields}
        defaultValues={catCrud.editing ?? undefined}
        onSubmit={catCrud.submit}
      />
      <CrudDialog
        open={trendCrud.dialogOpen}
        onOpenChange={trendCrud.setDialogOpen}
        mode={trendCrud.editing ? "edit" : "create"}
        title={trendCrud.editing ? "編輯月份" : "新增月份"}
        fields={trendFields}
        defaultValues={trendCrud.editing ?? undefined}
        onSubmit={trendCrud.submit}
      />
    </div>
  );
}
