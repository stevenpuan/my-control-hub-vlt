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

const fields: CrudField[] = [
  { name: "name", label: "名稱", type: "text", required: true },
  { name: "service", label: "服務", type: "text" },
  {
    name: "token_type", label: "類型", type: "select",
    options: ["API Key", "OAuth 2.0", "Service Account", "Bot Token", "Access Key"].map((v) => ({ label: v, value: v })),
  },
  { name: "scope", label: "權限範圍", type: "text" },
  { name: "created_by_team", label: "建立者", type: "text" },
  { name: "created_date", label: "建立日", type: "date" },
  { name: "expiry_date", label: "到期日（空=無期限）", type: "date" },
  {
    name: "status", label: "狀態", type: "select",
    options: ["啟用", "即將到期", "已停用"].map((v) => ({ label: v, value: v })),
  },
  { name: "last_used", label: "最後使用", type: "date" },
];

export default function OAuthPage() {
  const crud = useCrud<TokenRow>({ table: "oauth_tokens", queryKey: "oauth_tokens", labelName: "Token" });

  const { data: tokens = [], isLoading, error } = useQuery({
    queryKey: ["oauth_tokens"],
    queryFn: async (): Promise<TokenRow[]> => {
      const { data, error } = await (supabase as any)
        .from("oauth_tokens").select("*").order("created_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TokenRow[];
    },
  });
  if (error) toast.error("讀取 Token 資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => ({
    total: tokens.length,
    active: tokens.filter((t) => t.status === "啟用").length,
    expiring: tokens.filter((t) => t.status === "即將到期").length,
    disabled: tokens.filter((t) => t.status === "已停用").length,
  }), [tokens]);

  const columns = [
    { key: "name", label: "名稱" },
    { key: "service", label: "服務" },
    { key: "token_type", label: "類型" },
    { key: "scope", label: "權限範圍" },
    { key: "created_by_team", label: "建立者" },
    { key: "expiry_date", label: "到期日", render: (r: TokenRow) => <span>{r.expiry_date ?? "無期限"}</span> },
    { key: "status", label: "狀態", render: (r: TokenRow) => <StatusBadge label={r.status} /> },
    { key: "last_used", label: "最後使用" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["OAuth/Token 管理"]}
        title="OAuth/Token 管理"
        description="集中管理 API 金鑰、OAuth 憑證與服務帳號的生命週期"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
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
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={tokens} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯 Token" : "新增 Token"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({
          ...p,
          expiry_date: p.expiry_date || null,
          last_used: p.last_used || null,
          created_date: p.created_date || null,
        }))}
      />
    </div>
  );
}
