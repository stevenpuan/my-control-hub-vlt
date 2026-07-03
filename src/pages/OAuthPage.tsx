import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import AppBadge from "@/components/AppBadge";

const tokens = [
  { id: 1, name: "OpenAI API Key", service: "OpenAI", type: "API Key", scope: "全部權限", createdBy: "AI 團隊", created: "2026-01-15", expiry: "2027-01-15", status: "啟用", lastUsed: "2026-04-06" },
  { id: 2, name: "GitHub OAuth App", service: "GitHub", type: "OAuth 2.0", scope: "repo, user", createdBy: "工程部", created: "2025-11-01", expiry: "無期限", status: "啟用", lastUsed: "2026-04-07" },
  { id: 3, name: "Google Workspace SA", service: "Google", type: "Service Account", scope: "admin, drive", createdBy: "IT 部門", created: "2025-08-20", expiry: "2026-08-20", status: "啟用", lastUsed: "2026-04-05" },
  { id: 4, name: "Slack Bot Token", service: "Slack", type: "Bot Token", scope: "chat:write, channels:read", createdBy: "工程部", created: "2026-02-01", expiry: "無期限", status: "啟用", lastUsed: "2026-04-06" },
  { id: 5, name: "AWS IAM Access Key", service: "AWS", type: "Access Key", scope: "S3, Lambda", createdBy: "DevOps", created: "2025-06-10", expiry: "2026-06-10", status: "即將到期", lastUsed: "2026-04-07" },
  { id: 6, name: "Stripe Secret Key", service: "Stripe", type: "API Key", scope: "全部權限", createdBy: "財務部", created: "2025-12-01", expiry: "無期限", status: "啟用", lastUsed: "2026-03-20" },
];

const columns = [
  { key: "name", label: "名稱" },
  { key: "service", label: "服務" },
  { key: "type", label: "類型" },
  { key: "scope", label: "權限範圍" },
  { key: "createdBy", label: "建立者" },
  { key: "expiry", label: "到期日" },
  { key: "status", label: "狀態", render: (r: any) => <AppBadge label={r.status === "啟用" ? "使用中" : "SOC 2"} /> },
  { key: "lastUsed", label: "最後使用" },
];

export default function OAuthPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["OAuth/Token 管理"]} title="OAuth/Token 管理" description="集中管理 API 金鑰、OAuth 憑證與服務帳號的生命週期" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Token 總數" value={6} />
        <StatCard label="啟用中" value={5} />
        <StatCard label="即將到期" value={1} />
        <StatCard label="已停用" value={0} />
      </div>
      <DataTable columns={columns} data={tokens} />
    </div>
  );
}
