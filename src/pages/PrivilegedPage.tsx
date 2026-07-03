import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PrivilegedRow {
  id: string;
  account: string;
  service: string;
  holder: string;
  account_type: string;
  mfa_status: string;
  last_access: string | null;
  next_rotation: string | null;
}

const columns = [
  { key: "account", label: "帳號名稱" },
  { key: "service", label: "服務" },
  { key: "holder", label: "持有人" },
  { key: "account_type", label: "帳號類型" },
  {
    key: "mfa_status",
    label: "MFA",
    render: (r: PrivilegedRow) => (
      <span className={r.mfa_status === "已啟用" ? "text-badge-active" : "text-muted-foreground"}>
        {r.mfa_status}
      </span>
    ),
  },
  { key: "last_access", label: "最後存取" },
  { key: "next_rotation", label: "下次輪換" },
];

export default function PrivilegedPage() {
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["privileged_accounts"],
    queryFn: async (): Promise<PrivilegedRow[]> => {
      const { data, error } = await (supabase as any)
        .from("privileged_accounts")
        .select("*")
        .order("next_rotation");
      if (error) throw error;
      return (data ?? []) as PrivilegedRow[];
    },
  });

  if (error) toast.error("讀取特權帳號失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const total = rows.length;
    const mfaOn = rows.filter((r) => r.mfa_status === "已啟用").length;
    const mfaRate = total ? ((mfaOn / total) * 100).toFixed(1) + "%" : "0.0%";
    const now = Date.now();
    const in30 = now + 30 * 86400000;
    const needRotate = rows.filter((r) => {
      if (!r.next_rotation) return false;
      const t = new Date(r.next_rotation).getTime();
      return t >= now && t <= in30;
    }).length;
    return { total, mfaRate, needRotate };
  }, [rows]);

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["特權帳號"]} title="特權帳號" description="監控與管理高權限帳號的存取與密碼輪換" />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="特權帳號" value={stats.total} />,
              <StatCard key="b" label="MFA 覆蓋率" value={stats.mfaRate} />,
              <StatCard key="c" label="需輪換" value={stats.needRotate} />,
              <StatCard key="d" label="閒置帳號" value={0} />,
            ]}
      </div>
      {isLoading ? <Skeleton className="h-64 rounded-lg" /> : <DataTable columns={columns} data={rows} />}
    </div>
  );
}
