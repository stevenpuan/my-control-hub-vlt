import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";
import { useCrud } from "@/hooks/useCrud";

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

const fields: CrudField[] = [
  { name: "platform", label: "平台", type: "text", required: true },
  { name: "account_name", label: "帳號名稱", type: "text", required: true },
  { name: "owner", label: "負責人", type: "text" },
  { name: "followers_count", label: "追蹤數", type: "number" },
  {
    name: "status",
    label: "狀態",
    type: "select",
    options: [
      { label: "使用中", value: "使用中" },
      { label: "試用中", value: "試用中" },
    ],
  },
  { name: "last_active", label: "最後活動", type: "date" },
  { name: "mfa_enabled", label: "MFA", type: "switch" },
];

const formatFollowers = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

export default function AccountsPage() {
  const crud = useCrud<AccountRow>({ table: "accounts", queryKey: "accounts", labelName: "帳號" });

  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<AccountRow[]> => {
      const { data, error } = await (supabase as any)
        .from("accounts").select("*").order("followers_count", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AccountRow[];
    },
  });
  if (error) toast.error("讀取帳號資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a) => a.status === "使用中").length;
    const mfaRate = total ? ((accounts.filter((a) => a.mfa_enabled).length / total) * 100).toFixed(1) + "%" : "0.0%";
    return { total, active, mfaRate, needsAttention: accounts.filter((a) => !a.mfa_enabled).length };
  }, [accounts]);

  const columns = [
    { key: "platform", label: "平台" },
    { key: "account_name", label: "帳號名稱" },
    { key: "owner", label: "負責人" },
    { key: "followers_count", label: "追蹤數", render: (r: AccountRow) => formatFollowers(r.followers_count) },
    { key: "status", label: "狀態", render: (r: AccountRow) => <AppBadge label={r.status} /> },
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

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["社群帳號管理", "帳號列表"]}
        title="帳號列表"
        description="管理所有社群媒體帳號與存取權限"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="total" label="帳號總數" value={stats.total} />,
              <StatCard key="active" label="使用中" value={stats.active} />,
              <StatCard key="mfa" label="MFA 啟用率" value={stats.mfaRate} />,
              <StatCard key="attention" label="需要關注" value={stats.needsAttention} />,
            ]}
      </div>
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={accounts} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯帳號" : "新增帳號"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({ ...p, last_active: p.last_active || null }))}
      />
    </div>
  );
}
