import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
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
    required: true,
    options: [
      { label: "使用中", value: "使用中" },
      { label: "停用", value: "停用" },
      { label: "審核中", value: "審核中" },
    ],
  },
  { name: "last_active", label: "最後活動", type: "date" },
  { name: "mfa_enabled", label: "MFA 啟用", type: "switch" },
];

export default function AccountsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AccountRow | null>(null);

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

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (row: AccountRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const payload = { ...values };
    if (payload.last_active === "") payload.last_active = null;
    try {
      if (editing) {
        const { error } = await (supabase as any)
          .from("accounts")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("已更新");
      } else {
        const { error } = await (supabase as any).from("accounts").insert(payload);
        if (error) throw error;
        toast.success("新增成功");
      }
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setDialogOpen(false);
    } catch (e) {
      toast.error("操作失敗", { description: (e as Error).message });
    }
  };

  const handleDelete = async (row: AccountRow) => {
    const { error } = await (supabase as any).from("accounts").delete().eq("id", row.id);
    if (error) {
      toast.error("刪除失敗", { description: error.message });
      return;
    }
    toast.success("已刪除");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const columns = [
    { key: "platform", label: "平台" },
    { key: "account_name", label: "帳號名稱" },
    { key: "owner", label: "負責人" },
    {
      key: "followers_count",
      label: "追蹤數",
      render: (r: AccountRow) => formatFollowers(r.followers_count),
    },
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
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            新增
          </Button>
        }
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
        <DataTable columns={columns} data={accounts} onEdit={openEdit} onDelete={handleDelete} />
      )}

      <CrudDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={editing ? "edit" : "create"}
        title={editing ? "編輯帳號" : "新增帳號"}
        fields={fields}
        defaultValues={editing ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
