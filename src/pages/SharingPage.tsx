import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";

const shares = [
  { id: 1, resource: "OpenAI API Key", type: "API Key", sharedWith: "AI 團隊（5人）", permission: "使用", sharedBy: "系統管理員", date: "2026-01-15", expiry: "2027-01-15" },
  { id: 2, resource: "AWS Console", type: "帳號存取", sharedWith: "DevOps 團隊（3人）", permission: "管理", sharedBy: "CTO", date: "2025-11-01", expiry: "無期限" },
  { id: 3, resource: "Figma 企業版", type: "授權", sharedWith: "設計部（8人）", permission: "編輯", sharedBy: "IT 管理員", date: "2026-02-01", expiry: "2026-12-01" },
  { id: 4, resource: "1Password Vault", type: "密碼庫", sharedWith: "管理層（4人）", permission: "唯讀", sharedBy: "資安長", date: "2025-09-01", expiry: "無期限" },
  { id: 5, resource: "Notion 工作區", type: "工作區存取", sharedWith: "全公司（50人）", permission: "編輯", sharedBy: "IT 管理員", date: "2026-03-01", expiry: "2026-11-01" },
];

const columns = [
  { key: "resource", label: "共享資源" },
  { key: "type", label: "資源類型" },
  { key: "sharedWith", label: "共享對象" },
  { key: "permission", label: "權限等級" },
  { key: "sharedBy", label: "授權人" },
  { key: "date", label: "共享日期" },
  { key: "expiry", label: "到期日" },
];

export default function SharingPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["團隊共享"]} title="團隊共享" description="管理團隊間的帳號、金鑰與資源共享設定" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="共享項目" value={5} />
        <StatCard label="涉及團隊" value={5} />
        <StatCard label="即將到期" value={2} />
        <StatCard label="高權限共享" value={1} />
      </div>
      <DataTable columns={columns} data={shares} />
    </div>
  );
}
