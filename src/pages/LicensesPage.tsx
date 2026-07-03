import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface LicenseRow {
  id: string;
  app: string;
  license_type: string;
  total_seats: number;
  used_seats: number;
  assignee: string;
  expiry: string;
}

const columns = [
  { key: "app", label: "應用名稱" },
  { key: "license_type", label: "授權類型" },
  { key: "total_seats", label: "總授權數" },
  {
    key: "used_seats",
    label: "已使用",
    render: (r: LicenseRow) => <span>{r.used_seats}/{r.total_seats}</span>,
  },
  { key: "assignee", label: "指派對象" },
  { key: "expiry", label: "到期日" },
  {
    key: "status",
    label: "狀態",
    render: (r: LicenseRow) => {
      const ratio = r.total_seats ? r.used_seats / r.total_seats : 0;
      if (ratio >= 0.9) return <StatusBadge label="即將額滿" variant="warning" />;
      if (ratio < 0.5) return <StatusBadge label="低使用率" />;
      return <StatusBadge label="使用中" />;
    },
  },
];

export default function LicensesPage() {
  const { data: licenses = [], isLoading, error } = useQuery({
    queryKey: ["licenses"],
    queryFn: async (): Promise<LicenseRow[]> => {
      const { data, error } = await (supabase as any).from("licenses").select("*").order("app");
      if (error) throw error;
      return (data ?? []) as LicenseRow[];
    },
  });

  if (error) toast.error("讀取授權資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const totalSeats = licenses.reduce((s, r) => s + (r.total_seats ?? 0), 0);
    const usedSeats = licenses.reduce((s, r) => s + (r.used_seats ?? 0), 0);
    const rate = totalSeats ? ((usedSeats / totalSeats) * 100).toFixed(1) + "%" : "0.0%";
    const now = Date.now();
    const in90 = now + 90 * 86400000;
    const expiring = licenses.filter((r) => {
      const t = new Date(r.expiry).getTime();
      return t >= now && t <= in90;
    }).length;
    return { totalSeats, usedSeats, rate, expiring };
  }, [licenses]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["SaaS 應用管理", "授權管理"]}
        title="授權管理"
        description="追蹤所有 SaaS 應用的授權「席次（seats）」分配狀況"
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="總授權席次" value={stats.totalSeats} />,
              <StatCard key="b" label="已分配席次" value={stats.usedSeats} />,
              <StatCard key="c" label="使用率" value={stats.rate} />,
              <StatCard key="d" label="即將到期" value={stats.expiring} />,
            ]}
      </div>
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={licenses} />
      )}
    </div>
  );
}
