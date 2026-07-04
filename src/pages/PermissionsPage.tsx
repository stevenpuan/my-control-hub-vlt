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

interface RoleRow {
  id: string;
  role: string;
  members: number;
  permissions: string;
  apps_scope: string;
  role_created_by: string;
  last_modified: string;
}

const fields: CrudField[] = [
  { name: "role", label: "角色名稱", type: "text", required: true },
  { name: "members", label: "成員數", type: "number" },
  { name: "permissions", label: "權限說明", type: "textarea" },
  { name: "apps_scope", label: "應用範圍", type: "text" },
  { name: "role_created_by", label: "建立者", type: "text" },
  { name: "last_modified", label: "最後修改", type: "date" },
];

export default function PermissionsPage() {
  const crud = useCrud<RoleRow>({ table: "permission_roles", queryKey: "permission_roles", labelName: "角色" });

  const { data: roles = [], isLoading, error } = useQuery({
    queryKey: ["permission_roles"],
    queryFn: async (): Promise<RoleRow[]> => {
      const { data, error } = await (supabase as any)
        .from("permission_roles").select("*").order("members", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RoleRow[];
    },
  });
  if (error) toast.error("讀取角色資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const total = roles.length;
    const totalMembers = roles.reduce((s, r) => s + (r.members ?? 0), 0);
    const admin = roles.filter((r) => r.role.includes("管理員")).reduce((s, r) => s + (r.members ?? 0), 0);
    return { total, totalMembers, admin };
  }, [roles]);

  const columns = [
    { key: "role", label: "角色名稱" },
    { key: "members", label: "成員數" },
    { key: "permissions", label: "權限說明" },
    { key: "apps_scope", label: "應用範圍" },
    { key: "role_created_by", label: "建立者" },
    { key: "last_modified", label: "最後修改" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["權限管理"]}
        title="權限管理"
        description="定義與管理使用者角色及存取權限"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="角色數" value={stats.total} />,
              <StatCard key="b" label="總成員" value={stats.totalMembers} />,
              <StatCard key="c" label="管理員" value={stats.admin} />,
              <StatCard key="d" label="待審核" value={0} />,
            ]}
      </div>
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={roles} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯角色" : "新增角色"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({ ...p, last_modified: p.last_modified || null }))}
      />
    </div>
  );
}
