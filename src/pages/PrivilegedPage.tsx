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

interface PrivilegedRow {
  id: string;
  account: string;
  service: string;
  holder: string;
  account_type: string;
  mfa_status: string;
  last_access: string | null;
  rotation_label: string | null;
  next_rotation: string | null;
}

const fields: CrudField[] = [
  { name: "account", label: "帳號名稱", type: "text", required: true },
  { name: "service", label: "服務", type: "text" },
  { name: "holder", label: "持有人", type: "text" },
  { name: "account_type", label: "帳號類型", type: "text" },
  {
    name: "mfa_status", label: "MFA", type: "select",
    options: [{ label: "已啟用", value: "已啟用" }, { label: "N/A", value: "N/A" }],
  },
  { name: "last_access", label: "最後存取", type: "date" },
  { name: "rotation_label", label: "輪換週期", type: "text", placeholder: "如 90天" },
  { name: "next_rotation", label: "下次輪換", type: "date" },
];

export default function PrivilegedPage() {
  const crud = useCrud<PrivilegedRow>({ table: "privileged_accounts", queryKey: "privileged_accounts", labelName: "特權帳號" });

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["privileged_accounts"],
    queryFn: async (): Promise<PrivilegedRow[]> => {
      const { data, error } = await (supabase as any)
        .from("privileged_accounts").select("*").order("next_rotation");
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
    const needRotate = rows.filter((r) => r.next_rotation && new Date(r.next_rotation).getTime() >= now && new Date(r.next_rotation).getTime() <= in30).length;
    return { total, mfaRate, needRotate };
  }, [rows]);

  const columns = [
    { key: "account", label: "帳號名稱" },
    { key: "service", label: "服務" },
    { key: "holder", label: "持有人" },
    { key: "account_type", label: "帳號類型" },
    {
      key: "mfa_status",
      label: "MFA",
      render: (r: PrivilegedRow) => (
        <span className={r.mfa_status === "已啟用" ? "text-badge-active" : "text-muted-foreground"}>{r.mfa_status}</span>
      ),
    },
    { key: "last_access", label: "最後存取" },
    { key: "next_rotation", label: "下次輪換" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["特權帳號"]}
        title="特權帳號"
        description="監控與管理高權限帳號的存取與密碼輪換"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
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
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={rows} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯特權帳號" : "新增特權帳號"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({
          ...p,
          last_access: p.last_access || null,
          next_rotation: p.next_rotation || null,
        }))}
      />
    </div>
  );
}
