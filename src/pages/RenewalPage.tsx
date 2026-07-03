import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const renewals = [
  { id: 1, app: "BambooHR", vendor: "BambooHR", expiry: "2026-06-29", daysLeft: 24, cost: "$380/月", action: "續約/取消", priority: "高" },
  { id: 2, app: "Adobe CC", vendor: "Adobe", expiry: "2026-08-30", daysLeft: 84, cost: "$580/月", action: "評估替代方案", priority: "中" },
  { id: 3, app: "Slack", vendor: "Salesforce", expiry: "2026-09-15", daysLeft: 102, cost: "$1,200/月", action: "提前續約", priority: "低" },
  { id: 4, app: "AWS", vendor: "Amazon", expiry: "2026-12-01", daysLeft: 179, cost: "$8,500/月", action: "議價", priority: "中" },
  { id: 5, app: "GitHub", vendor: "Microsoft", expiry: "2027-03-01", daysLeft: 269, cost: "$950/月", action: "自動續約", priority: "低" },
];

const columns = [
  { key: "app", label: "應用" },
  { key: "vendor", label: "供應商" },
  { key: "expiry", label: "到期日" },
  { key: "daysLeft", label: "剩餘天數", render: (r: any) => (
    <span className={r.daysLeft < 30 ? "text-destructive font-medium" : r.daysLeft < 90 ? "text-warning font-medium" : "text-card-foreground"}>
      {r.daysLeft} 天
    </span>
  )},
  { key: "cost", label: "月費" },
  { key: "action", label: "建議動作" },
  { key: "priority", label: "優先級", render: (r: any) => <StatusBadge label={r.priority} /> },
];

export default function RenewalPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["到期轉換"]} title="到期轉換" description="追蹤即將到期的合約並規劃續約或轉換策略" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="30天內到期" value={1} />
        <StatCard label="90天內到期" value={2} />
        <StatCard label="本年度到期" value={4} />
        <StatCard label="預估續約費" value="$10,280" />
      </div>
      <DataTable columns={columns} data={renewals} />
    </div>
  );
}
