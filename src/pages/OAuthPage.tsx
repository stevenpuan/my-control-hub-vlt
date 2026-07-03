import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenRow {
  id: string;
  name: string;
  service: string;
  token_type: string;
  scope: string;
  created_by_team: string;
  created_date: string;
  expiry_date: string | null;
  status: string;
  last_used: string | null;
}

const columns = [
  { key: "name", label: "名稱" },
  { key: "service", label: "服務" },
  { key: "token_type", label: "類型" },
  { key: "scope", label: "權限範圍" },
  { key: "created_by_team", label: "建立者" },
  {
    key: "expiry_date",
    label: "到期日",
    render: (r: TokenRow) => <span>{r.expiry_date ?? "無期限"}</span>,
  },
  { key: "status", label: "狀態", render: (r: TokenRow) => <StatusBadge label={r.status} /> },
  { key: "last_used", label: "最後使用" },
];

export default function OAuthPage() {
  const { data: tokens = [], isLoading, error } = useQuery({
    queryKey: ["oauth_tokens"],
    queryFn: async (): Promise<TokenRow[]> => {
      const { data, error } = await (supabase as any)
        .from("oauth_tokens")
        .select("*")
        .order("created_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TokenRow[];
    },
  });

  if (error) toast.error("讀取 Token 資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    return {
      total: tokens.length,
      active: tokens.filter((t) => t.status === "啟用").length,
      expiring: tokens.filter((t) => t.status === "即將到期").length,
      disabled: tokens.filter((t) => t.status === "已停用").length,
    };
  }, [tokens]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["OAuth/Token 管理"]}
        title="OAuth/Token 管理"
        description="集中管理 API 金鑰、OAuth 憑證與服務帳號的生命週期"
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="Token 總數" value={stats.total} />,
              <StatCard key="b" label="啟用中" value={stats.active} />,
              <StatCard key="c" label="即將到期" value={stats.expiring} />,
              <StatCard key="d" label="已停用" value={stats.disabled} />,
            ]}
      </div>
      {isLoading ? <Skeleton className="h-64 rounded-lg" /> : <DataTable columns={columns} data={tokens} />}
    </div>
  );
}
