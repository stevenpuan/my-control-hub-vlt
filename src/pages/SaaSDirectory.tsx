import { useState, useMemo } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { saasApps, expiringApps, stats } from "@/data/saasApps";
import StatCard from "@/components/StatCard";
import SaaSAppCard from "@/components/SaaSAppCard";
import ExpiryAlert from "@/components/ExpiryAlert";
import PageHeader from "@/components/PageHeader";

const categories = ["全部類別", "AI / ML", "雲端服務", "協作工具", "設計工具", "開發工具", "人力資源"];
const statuses = ["全部狀態", "使用中", "試用中", "已停用"];
const compliances = ["全部合規", "SOC 2", "ISO 27001", "GDPR", "SSO"];

export default function SaaSDirectory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部類別");
  const [status, setStatus] = useState("全部狀態");
  const [compliance, setCompliance] = useState("全部合規");

  const filtered = useMemo(() => {
    return saasApps.filter((app) => {
      if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.vendor.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "全部類別" && !app.badges.includes(category)) return false;
      if (status !== "全部狀態" && !app.badges.includes(status)) return false;
      if (compliance !== "全部合規" && !app.badges.includes(compliance)) return false;
      return true;
    });
  }, [search, category, status, compliance]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["SaaS 應用管理"]}
        title="SaaS 應用目錄"
        description="管理企業使用的所有 SaaS 應用與訂閱"
        actions={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> 新增應用
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="應用總數" value={stats.totalApps} />
        <StatCard label="月費用合計" value={`$${stats.totalMonthlyCost.toLocaleString()}`} />
        <StatCard label="啟用 SSO" value={stats.ssoEnabled} />
        <StatCard label="試用中" value={stats.trial} />
      </div>

      <ExpiryAlert apps={expiringApps} />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋應用、供應商..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Filter className="w-4 h-4 text-muted-foreground" />
        {[
          { value: category, setter: setCategory, options: categories },
          { value: status, setter: setStatus, options: statuses },
          { value: compliance, setter: setCompliance, options: compliances },
        ].map(({ value, setter, options }) => (
          <select key={options[0]} value={value} onChange={(e) => setter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
        {filtered.map((app) => <SaaSAppCard key={app.id} app={app} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">沒有找到符合條件的應用</div>
        )}
      </div>
    </div>
  );
}
