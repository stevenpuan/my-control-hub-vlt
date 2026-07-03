import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ShareRow {
  id: string;
  resource: string;
  resource_type: string;
  shared_with: string;
  permission: string;
  shared_by: string;
  share_date: string;
  expiry_date: string | null;
}

const columns = [
  { key: "resource", label: "共享資源" },
  { key: "resource_type", label: "資源類型" },
  { key: "shared_with", label: "共享對象" },
  { key: "permission", label: "權限等級" },
  { key: "shared_by", label: "授權人" },
  { key: "share_date", label: "共享日期" },
  {
    key: "expiry_date",
    label: "到期日",
    render: (r: ShareRow) => <span>{r.expiry_date ?? "無期限"}</span>,
  },
];

export default function SharingPage() {
  const { data: shares = [], isLoading, error } = useQuery({
    queryKey: ["shares"],
    queryFn: async (): Promise<ShareRow[]> => {
      const { data, error } = await (supabase as any)
        .from("shares")
        .select("*")
        .order("share_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ShareRow[];
    },
  });

  if (error) toast.error("讀取共享資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const now = Date.now();
    const in90 = now + 90 * 86400000;
    return {
      total: shares.length,
      teams: shares.length,
      expiring: shares.filter((s) => {
        if (!s.expiry_date) return false;
        const t = new Date(s.expiry_date).getTime();
        return t >= now && t <= in90;
      }).length,
      admin: shares.filter((s) => s.permission === "管理").length,
    };
  }, [shares]);

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["團隊共享"]} title="團隊共享" description="管理團隊間的帳號、金鑰與資源共享設定" />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="共享項目" value={stats.total} />,
              <StatCard key="b" label="涉及團隊" value={stats.teams} />,
              <StatCard key="c" label="即將到期" value={stats.expiring} />,
              <StatCard key="d" label="高權限共享" value={stats.admin} />,
            ]}
      </div>
      {isLoading ? <Skeleton className="h-64 rounded-lg" /> : <DataTable columns={columns} data={shares} />}
    </div>
  );
}
