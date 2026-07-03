import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";

const accounts = [
  { id: 1, platform: "Facebook", accountName: "公司官方粉專", owner: "行銷部 - 王小明", followers: "12.5K", status: "使用中", lastActive: "2026-04-05", mfa: "已啟用" },
  { id: 2, platform: "Instagram", accountName: "品牌帳號", owner: "行銷部 - 李小華", followers: "8.3K", status: "使用中", lastActive: "2026-04-06", mfa: "已啟用" },
  { id: 3, platform: "X (Twitter)", accountName: "@company_official", owner: "公關部 - 張大衛", followers: "5.1K", status: "使用中", lastActive: "2026-04-04", mfa: "未啟用" },
  { id: 4, platform: "LinkedIn", accountName: "公司企業頁面", owner: "HR 部 - 陳美玲", followers: "3.2K", status: "使用中", lastActive: "2026-04-03", mfa: "已啟用" },
  { id: 5, platform: "YouTube", accountName: "官方頻道", owner: "行銷部 - 王小明", followers: "2.1K", status: "使用中", lastActive: "2026-03-28", mfa: "已啟用" },
  { id: 6, platform: "TikTok", accountName: "品牌短影音", owner: "行銷部 - 林志偉", followers: "950", status: "試用中", lastActive: "2026-04-01", mfa: "未啟用" },
];

const columns = [
  { key: "platform", label: "平台" },
  { key: "accountName", label: "帳號名稱" },
  { key: "owner", label: "負責人" },
  { key: "followers", label: "追蹤數" },
  { key: "status", label: "狀態", render: (r: any) => <AppBadge label={r.status} /> },
  { key: "lastActive", label: "最後活動" },
  { key: "mfa", label: "MFA", render: (r: any) => (
    <span className={r.mfa === "已啟用" ? "text-badge-active" : "text-destructive"}>{r.mfa}</span>
  )},
];

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["社群帳號管理", "帳號列表"]} title="帳號列表" description="管理所有社群媒體帳號與存取權限" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="帳號總數" value={6} />
        <StatCard label="使用中" value={5} />
        <StatCard label="MFA 啟用率" value="66.7%" />
        <StatCard label="需要關注" value={2} />
      </div>
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}
