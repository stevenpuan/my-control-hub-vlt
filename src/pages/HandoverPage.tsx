import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";

const handovers = [
  { id: 1, account: "Facebook 粉專", from: "王小明", to: "張大衛", status: "進行中", startDate: "2026-04-01", items: "密碼、管理權限、廣告帳戶", progress: "2/4" },
  { id: 2, account: "LinkedIn 頁面", from: "陳美玲", to: "林志偉", status: "已完成", startDate: "2026-03-15", items: "密碼、管理權限", progress: "3/3" },
  { id: 3, account: "AWS Root", from: "劉工程", to: "吳技術", status: "待開始", startDate: "2026-04-10", items: "Root 帳號、MFA 裝置、IAM", progress: "0/5" },
];

const columns = [
  { key: "account", label: "帳號/服務" },
  { key: "from", label: "移交人" },
  { key: "to", label: "接收人" },
  { key: "status", label: "狀態", render: (r: any) => <AppBadge label={r.status === "已完成" ? "使用中" : r.status === "進行中" ? "SSO" : "AI / ML"} /> },
  { key: "startDate", label: "開始日期" },
  { key: "items", label: "交接項目" },
  { key: "progress", label: "進度" },
];

export default function HandoverPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["社群帳號管理", "交接管理"]} title="交接管理" description="追蹤帳號與服務的交接流程與進度" />
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="進行中" value={1} />
        <StatCard label="已完成" value={1} />
        <StatCard label="待開始" value={1} />
      </div>
      <DataTable columns={columns} data={handovers} />
    </div>
  );
}
