import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";

const privilegedAccounts = [
  { id: 1, account: "AWS Root", service: "AWS", holder: "CTO - 劉工程", type: "Root", mfa: "已啟用", lastAccess: "2026-03-15", rotation: "90天", nextRotation: "2026-06-15" },
  { id: 2, account: "GCP Org Admin", service: "Google Cloud", holder: "DevOps - 吳技術", type: "Admin", mfa: "已啟用", lastAccess: "2026-04-05", rotation: "60天", nextRotation: "2026-05-20" },
  { id: 3, account: "Azure Global Admin", service: "Azure", holder: "IT - 系統管理員", type: "Global Admin", mfa: "已啟用", lastAccess: "2026-04-07", rotation: "30天", nextRotation: "2026-04-30" },
  { id: 4, account: "DB Master", service: "PostgreSQL", holder: "DBA - 陳資料", type: "SuperUser", mfa: "N/A", lastAccess: "2026-04-06", rotation: "90天", nextRotation: "2026-07-01" },
  { id: 5, account: "Stripe Admin", service: "Stripe", holder: "財務 - 王財務", type: "Owner", mfa: "已啟用", lastAccess: "2026-03-20", rotation: "180天", nextRotation: "2026-09-01" },
];

const columns = [
  { key: "account", label: "帳號名稱" },
  { key: "service", label: "服務" },
  { key: "holder", label: "持有人" },
  { key: "type", label: "帳號類型" },
  { key: "mfa", label: "MFA", render: (r: any) => <span className={r.mfa === "已啟用" ? "text-badge-active" : "text-muted-foreground"}>{r.mfa}</span> },
  { key: "lastAccess", label: "最後存取" },
  { key: "nextRotation", label: "下次輪換" },
];

export default function PrivilegedPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["特權帳號"]} title="特權帳號" description="監控與管理高權限帳號的存取與密碼輪換" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="特權帳號" value={5} />
        <StatCard label="MFA 覆蓋率" value="80%" />
        <StatCard label="需輪換" value={1} />
        <StatCard label="閒置帳號" value={0} />
      </div>
      <DataTable columns={columns} data={privilegedAccounts} />
    </div>
  );
}
