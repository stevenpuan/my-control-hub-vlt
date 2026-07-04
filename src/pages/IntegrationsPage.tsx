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

interface IntegrationRow {
  id: string;
  name: string;
  integration_type: string;
  status: string;
  connected_apps: number;
  last_sync: string | null;
  health: string | null;
}

const fields: CrudField[] = [
  { name: "name", label: "整合名稱", type: "text", required: true },
  { name: "integration_type", label: "類型", type: "text" },
  {
    name: "status", label: "狀態", type: "select",
    options: ["已部署", "測試中", "規劃中"].map((v) => ({ label: v, value: v })),
  },
  { name: "connected_apps", label: "連接應用數", type: "number" },
  { name: "last_sync", label: "最後同步", type: "date" },
  {
    name: "health", label: "健康狀態", type: "select",
    options: [{ label: "正常", value: "正常" }, { label: "警告", value: "警告" }],
  },
];

export default function IntegrationsPage() {
  const crud = useCrud<IntegrationRow>({ table: "integrations", queryKey: "integrations", labelName: "整合" });

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["integrations"],
    queryFn: async (): Promise<IntegrationRow[]> => {
      const { data, error } = await (supabase as any).from("integrations").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as IntegrationRow[];
    },
  });
  if (error) toast.error("讀取整合資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => ({
    total: rows.length,
    deployed: rows.filter((r) => r.status === "已部署").length,
    testing: rows.filter((r) => r.status === "測試中").length,
    planning: rows.filter((r) => r.status === "規劃中").length,
  }), [rows]);

  const columns = [
    { key: "name", label: "整合名稱" },
    { key: "integration_type", label: "類型" },
    { key: "status", label: "狀態", render: (r: IntegrationRow) => <StatusBadge label={r.status} /> },
    { key: "connected_apps", label: "連接應用數" },
    { key: "last_sync", label: "最後同步", render: (r: IntegrationRow) => <span>{r.last_sync ?? "—"}</span> },
    {
      key: "health",
      label: "健康狀態",
      render: (r: IntegrationRow) => (
        <span className={r.health === "正常" ? "text-success" : r.health === "警告" ? "text-warning" : "text-muted-foreground"}>
          {r.health ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["整合部署"]}
        title="整合部署"
        description="管理第三方系統整合與自動化部署配置"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="整合項目" value={stats.total} />,
              <StatCard key="b" label="已部署" value={stats.deployed} />,
              <StatCard key="c" label="測試中" value={stats.testing} />,
              <StatCard key="d" label="規劃中" value={stats.planning} />,
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
        title={crud.editing ? "編輯整合" : "新增整合"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({
          ...p,
          last_sync: p.last_sync || null,
          health: p.health || null,
        }))}
      />
    </div>
  );
}
