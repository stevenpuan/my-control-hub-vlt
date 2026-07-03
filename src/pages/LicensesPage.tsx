import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const licenses = [
  { id: 1, app: "OpenAI", type: "API Key", total: 15, used: 12, assignee: "AI 團隊", expiry: "2027-01-01" },
  { id: 2, app: "Slack", type: "使用者授權", total: 100, used: 87, assignee: "全公司", expiry: "2026-09-15" },
  { id: 3, app: "Figma", type: "使用者授權", total: 30, used: 28, assignee: "設計部", expiry: "2026-12-01" },
  { id: 4, app: "GitHub", type: "使用者授權", total: 50, used: 45, assignee: "工程部", expiry: "2027-03-01" },
  { id: 5, app: "Notion", type: "使用者授權", total: 80, used: 72, assignee: "全公司", expiry: "2026-11-01" },
  { id: 6, app: "Adobe CC", type: "裝置授權", total: 10, used: 3, assignee: "行銷部", expiry: "2026-06-30" },
];

const columns = [
  { key: "app", label: "應用名稱" },
  { key: "type", label: "授權類型" },
  { key: "total", label: "總授權數" },
  { key: "used", label: "已使用", render: (r: any) => <span>{r.used}/{r.total}</span> },
  { key: "assignee", label: "指派對象" },
  { key: "expiry", label: "到期日" },
  { key: "status", label: "狀態", render: (r: any) => {
    const ratio = r.used / r.total;
    if (ratio < 0.5) return <StatusBadge label="低使用率" />;
    if (ratio >= 0.9) return <StatusBadge label="即將額滿" variant="warning" />;
    return <StatusBadge label="使用中" />;
  }},
];

export default function LicensesPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["SaaS 應用管理", "授權管理"]} title="授權管理" description="追蹤所有 SaaS 應用的授權「席次（seats）」分配狀況（與應用數不同）" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="總授權席次" value={285} />
        <StatCard label="已分配席次" value={247} />
        <StatCard label="使用率" value="86.7%" />
        <StatCard label="即將到期" value={2} />
      </div>
      <DataTable columns={columns} data={licenses} />
    </div>
  );
}
