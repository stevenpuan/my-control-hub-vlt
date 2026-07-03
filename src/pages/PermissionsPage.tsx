import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";

const roles = [
  { id: 1, role: "系統管理員", members: 2, permissions: "完整存取所有功能", apps: "全部", createdBy: "系統", lastModified: "2026-01-01" },
  { id: 2, role: "IT 管理員", members: 3, permissions: "管理應用、帳號、Token", apps: "全部", createdBy: "系統管理員", lastModified: "2026-02-15" },
  { id: 3, role: "部門主管", members: 5, permissions: "檢視部門應用、管理授權", apps: "部門相關", createdBy: "系統管理員", lastModified: "2026-03-01" },
  { id: 4, role: "稽核員", members: 2, permissions: "唯讀存取合規與日誌", apps: "全部（唯讀）", createdBy: "系統管理員", lastModified: "2026-02-20" },
  { id: 5, role: "一般使用者", members: 38, permissions: "檢視已授權應用", apps: "已授權", createdBy: "系統", lastModified: "2026-01-01" },
];

const columns = [
  { key: "role", label: "角色名稱" },
  { key: "members", label: "成員數" },
  { key: "permissions", label: "權限說明" },
  { key: "apps", label: "應用範圍" },
  { key: "createdBy", label: "建立者" },
  { key: "lastModified", label: "最後修改" },
];

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["權限管理"]} title="權限管理" description="定義與管理使用者角色及存取權限" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="角色數" value={5} />
        <StatCard label="總成員" value={50} />
        <StatCard label="管理員" value={5} />
        <StatCard label="待審核" value={0} />
      </div>
      <DataTable columns={columns} data={roles} />
    </div>
  );
}
