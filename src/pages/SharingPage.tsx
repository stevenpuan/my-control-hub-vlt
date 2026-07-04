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

const fields: CrudField[] = [
  { name: "resource", label: "共享資源", type: "text", required: true },
  { name: "resource_type", label: "資源類型", type: "text" },
  { name: "shared_with", label: "共享對象", type: "text" },
  {
    name: "permission", label: "權限等級", type: "select",
    options: ["使用", "管理", "編輯", "唯讀"].map((v) => ({ label: v, value: v })),
  },
  { name: "shared_by", label: "授權人", type: "text" },
  { name: "share_date", label: "共享日期", type: "date" },
  { name: "expiry_date", label: "到期日（空=無期限）", type: "date" },
];

export default function SharingPage() {
  const crud = useCrud<ShareRow>({ table: "shares", queryKey: "shares", labelName: "共享" });

  const { data: shares = [], isLoading, error } = useQuery({
    queryKey: ["shares"],
    queryFn: async (): Promise<ShareRow[]> => {
      const { data, error } = await (supabase as any)
        .from("shares").select("*").order("share_date", { ascending: false });
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
      expiring: shares.filter((s) => s.expiry_date && new Date(s.expiry_date).getTime() <= in90 && new Date(s.expiry_date).getTime() >= now).length,
      admin: shares.filter((s) => s.permission === "管理").length,
    };
  }, [shares]);

  const columns = [
    { key: "resource", label: "共享資源" },
    { key: "resource_type", label: "資源類型" },
    { key: "shared_with", label: "共享對象" },
    { key: "permission", label: "權限等級" },
    { key: "shared_by", label: "授權人" },
    { key: "share_date", label: "共享日期" },
    { key: "expiry_date", label: "到期日", render: (r: ShareRow) => <span>{r.expiry_date ?? "無期限"}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["團隊共享"]}
        title="團隊共享"
        description="管理團隊間的帳號、金鑰與資源共享設定"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
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
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={shares} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯共享" : "新增共享"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({ ...p, expiry_date: p.expiry_date || null }))}
      />
    </div>
  );
}
