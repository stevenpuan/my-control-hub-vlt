import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const complianceItems = [
  { id: 1, app: "OpenAI", soc2: "✓", iso27001: "✗", gdpr: "✓", sso: "✗", mfa: "✓", lastAudit: "2026-03-01", risk: "中" },
  { id: 2, app: "AWS", soc2: "✓", iso27001: "✓", gdpr: "✓", sso: "✓", mfa: "✓", lastAudit: "2026-02-15", risk: "低" },
  { id: 3, app: "Slack", soc2: "✓", iso27001: "✗", gdpr: "✗", sso: "✓", mfa: "✓", lastAudit: "2026-01-20", risk: "中" },
  { id: 4, app: "Notion", soc2: "✓", iso27001: "✗", gdpr: "✗", sso: "✗", mfa: "✓", lastAudit: "2025-12-01", risk: "高" },
  { id: 5, app: "GitHub", soc2: "✓", iso27001: "✓", gdpr: "✓", sso: "✓", mfa: "✓", lastAudit: "2026-03-15", risk: "低" },
  { id: 6, app: "Google Gemini", soc2: "✓", iso27001: "✓", gdpr: "✓", sso: "✓", mfa: "✓", lastAudit: "2026-02-28", risk: "低" },
];

const check = (v: string) => v === "✓" ? <span className="text-success">✓</span> : <span className="text-destructive">✗</span>;

const columns = [
  { key: "app", label: "應用" },
  { key: "soc2", label: "SOC 2", render: (r: any) => check(r.soc2) },
  { key: "iso27001", label: "ISO 27001", render: (r: any) => check(r.iso27001) },
  { key: "gdpr", label: "GDPR", render: (r: any) => check(r.gdpr) },
  { key: "sso", label: "SSO", render: (r: any) => check(r.sso) },
  { key: "mfa", label: "MFA", render: (r: any) => check(r.mfa) },
  { key: "lastAudit", label: "上次稽核" },
  { key: "risk", label: "風險等級", render: (r: any) => <StatusBadge label={r.risk} /> },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["稽核合規"]} title="稽核合規" description="檢視已納入合規盤點的應用認證狀態與風險評估（共 6 項已稽核，整體應用 11 項）" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="已稽核應用" value={6} />
        <StatCard label="完全合規" value={3} />
        <StatCard label="高風險" value={1} />
        <StatCard label="合規率" value="83%" />
      </div>
      <DataTable columns={columns} data={complianceItems} />
    </div>
  );
}
