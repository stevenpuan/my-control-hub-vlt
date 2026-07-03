import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const integrations = [
  { id: 1, name: "SSO (Okta)", type: "身份驗證", status: "已部署", connectedApps: 8, lastSync: "2026-04-07", health: "正常" },
  { id: 2, name: "SCIM 自動佈建", type: "使用者管理", status: "已部署", connectedApps: 5, lastSync: "2026-04-07", health: "正常" },
  { id: 3, name: "SIEM (Splunk)", type: "日誌整合", status: "已部署", connectedApps: 11, lastSync: "2026-04-07", health: "正常" },
  { id: 4, name: "CASB 整合", type: "安全閘道", status: "規劃中", connectedApps: 0, lastSync: "—", health: "—" },
  { id: 5, name: "IT 資產管理同步", type: "資產管理", status: "測試中", connectedApps: 3, lastSync: "2026-04-06", health: "警告" },
];

const columns = [
  { key: "name", label: "整合名稱" },
  { key: "type", label: "類型" },
  { key: "status", label: "狀態", render: (r: any) => <StatusBadge label={r.status} /> },
  { key: "connectedApps", label: "連接應用數" },
  { key: "lastSync", label: "最後同步" },
  { key: "health", label: "健康狀態", render: (r: any) => (
    <span className={r.health === "正常" ? "text-success" : r.health === "警告" ? "text-warning" : "text-muted-foreground"}>{r.health}</span>
  )},
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["整合部署"]} title="整合部署" description="管理第三方系統整合與自動化部署配置" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="整合項目" value={5} />
        <StatCard label="已部署" value={3} />
        <StatCard label="測試中" value={1} />
        <StatCard label="規劃中" value={1} />
      </div>
      <DataTable columns={columns} data={integrations} />
    </div>
  );
}
