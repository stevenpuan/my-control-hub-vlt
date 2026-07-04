import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";
import { useCrud } from "@/hooks/useCrud";

interface RenewalRow {
  id: string;
  app: string;
  vendor: string;
  expiry: string;
  monthly_cost: number;
  action: string;
  priority: string;
}

const daysBetween = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

const fields: CrudField[] = [
  { name: "app", label: "應用", type: "text", required: true },
  { name: "vendor", label: "供應商", type: "text" },
  { name: "expiry", label: "到期日", type: "date" },
  { name: "monthly_cost", label: "月費", type: "number" },
  { name: "action", label: "建議動作", type: "text" },
  {
    name: "priority", label: "優先級", type: "select",
    options: ["低", "中", "高"].map((v) => ({ label: v, value: v })),
  },
];

export default function RenewalPage() {
  const crud = useCrud<RenewalRow>({ table: "renewals", queryKey: "renewals", labelName: "到期項目" });

  const { data: renewals = [], isLoading, error } = useQuery({
    queryKey: ["renewals"],
    queryFn: async (): Promise<RenewalRow[]> => {
      const { data, error } = await (supabase as any).from("renewals").select("*").order("expiry");
      if (error) throw error;
      return (data ?? []) as RenewalRow[];
    },
  });
  if (error) toast.error("讀取到期資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const now = Date.now();
    const in30 = now + 30 * 86400000;
    const in90 = now + 90 * 86400000;
    const yearEnd = new Date(new Date().getFullYear(), 11, 31).getTime();
    const inRange = (t: number, max: number) => t >= now && t <= max;
    const d30 = renewals.filter((r) => inRange(new Date(r.expiry).getTime(), in30)).length;
    const d90 = renewals.filter((r) => inRange(new Date(r.expiry).getTime(), in90)).length;
    const dYear = renewals.filter((r) => inRange(new Date(r.expiry).getTime(), yearEnd)).length;
    const totalCost = renewals.reduce((s, r) => s + Number(r.monthly_cost ?? 0), 0);
    return { d30, d90, dYear, totalCost };
  }, [renewals]);

  const columns = [
    { key: "app", label: "應用" },
    { key: "vendor", label: "供應商" },
    { key: "expiry", label: "到期日" },
    {
      key: "daysLeft",
      label: "剩餘天數",
      render: (r: RenewalRow) => {
        const d = daysBetween(r.expiry);
        const cls = d < 30 ? "text-destructive font-medium" : d < 90 ? "text-warning font-medium" : "text-card-foreground";
        return <span className={cls}>{d} 天</span>;
      },
    },
    { key: "monthly_cost", label: "月費", render: (r: RenewalRow) => <span>${Number(r.monthly_cost).toLocaleString()}/月</span> },
    { key: "action", label: "建議動作" },
    { key: "priority", label: "優先級", render: (r: RenewalRow) => <StatusBadge label={r.priority} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["到期轉換"]}
        title="到期轉換"
        description="追蹤即將到期的合約並規劃續約或轉換策略"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="30天內到期" value={stats.d30} />,
              <StatCard key="b" label="90天內到期" value={stats.d90} />,
              <StatCard key="c" label="本年度到期" value={stats.dYear} />,
              <StatCard key="d" label="預估續約費" value={`$${stats.totalCost.toLocaleString()}`} />,
            ]}
      </div>
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={renewals} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯到期項目" : "新增到期項目"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={crud.submit}
      />
    </div>
  );
}
