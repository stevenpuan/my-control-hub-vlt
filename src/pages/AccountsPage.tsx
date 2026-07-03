import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountRow {
  id: string;
  platform: string;
  account_name: string;
  owner: string;
  followers_count: number;
  status: string;
  last_active: string | null;
  mfa_enabled: boolean;
}

function formatFollowers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}

const columns = [
  { key: "platform", label: "平台" },
  { key: "account_name", label: "帳號名稱" },
  { key: "owner", label: "負責人" },
  {
    key: "followers_count",
    label: "追蹤數",
    render: (r: AccountRow) => formatFollowers(r.followers_count),
  },
  {
    key: "status",
    label: "狀態",
    render: (r: AccountRow) => <AppBadge label={r.status} />,
  },
  { key: "last_active", label: "最後活動" },
  {
    key: "mfa_enabled",
    label: "MFA",
    render: (r: AccountRow) => (
      <span className={r.mfa_enabled ? "text-badge-active" : "text-destructive"}>
        {r.mfa_enabled ? "已啟用" : "未啟用"}
      </span>
    ),
  },
];

export default function AccountsPage() {
  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<AccountRow[]> => {
      const { data, error } = await (supabase as any)
        .from("accounts")
        .select("*")
        .order("followers_count", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AccountRow[];
    },
  });

  if (error) {
    toast.error("讀取帳號資料失敗", { description: (error as Error).message });
  }

  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a) => a.status === "使用中").length;
    const mfaRate =
      total > 0
        ? ((accounts.filter((a) => a.mfa_enabled).length / total) * 100).toFixed(1) + "%"
        : "0.0%";
    const needsAttention = accounts.filter((a) => !a.mfa_enabled).length;
    return { total, active, mfaRate, needsAttention };
  }, [accounts]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["社群帳號管理", "帳號列表"]}
        title="帳號列表"
        description="管理所有社群媒體帳號與存取權限"
      />

      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          : [
              <StatCard key="total" label="帳號總數" value={stats.total} />,
              <StatCard key="active" label="使用中" value={stats.active} />,
              <StatCard key="mfa" label="MFA 啟用率" value={stats.mfaRate} />,
              <StatCard key="attention" label="需要關注" value={stats.needsAttention} />,
            ]}
      </div>

      {isLoading ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 border-b border-border px-4 py-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-border last:border-0 px-4 py-3"
            >
              <div className="flex gap-4 items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={accounts} />
      )}
    </div>
  );
}
