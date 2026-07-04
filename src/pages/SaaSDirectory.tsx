import { useState, useMemo } from "react";
import { Search, Filter, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StatCard from "@/components/StatCard";
import ExpiryAlert from "@/components/ExpiryAlert";
import PageHeader from "@/components/PageHeader";
import AppBadge from "@/components/AppBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";
import { useCrud } from "@/hooks/useCrud";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = ["全部類別", "AI / ML", "雲端服務", "協作工具", "設計工具", "開發工具", "人力資源"];
const statuses = ["全部狀態", "使用中", "試用中", "已停用"];
const compliances = ["全部合規", "SOC 2", "ISO 27001", "GDPR", "SSO"];

const iconBgByCategory: Record<string, string> = {
  "AI / ML": "bg-badge-ai/15",
  "雲端服務": "bg-badge-cloud/15",
  "協作工具": "bg-badge-sso/15",
  "設計工具": "bg-badge-soc2/15",
  "開發工具": "bg-badge-iso/15",
  "人力資源": "bg-badge-gdpr/15",
};

interface AppRow {
  id: string;
  name: string;
  vendor: string | null;
  category: string | null;
  description: string | null;
  badges: string[] | null;
  monthly_cost: number | null;
  currency: string | null;
  contract_end: string | null;
  icon: string | null;
}

const fields: CrudField[] = [
  { name: "name", label: "名稱", type: "text", required: true },
  { name: "vendor", label: "供應商", type: "text" },
  {
    name: "category", label: "分類", type: "select",
    options: ["AI / ML", "雲端服務", "協作工具", "設計工具", "開發工具", "人力資源"].map((v) => ({ label: v, value: v })),
  },
  { name: "description", label: "描述", type: "textarea" },
  { name: "badges", label: "標章（逗號分隔）", type: "tags" },
  { name: "monthly_cost", label: "月費", type: "number" },
  { name: "currency", label: "幣別", type: "text", placeholder: "TWD" },
  { name: "contract_end", label: "合約到期", type: "date" },
  { name: "icon", label: "圖示（emoji）", type: "text" },
];

export default function SaaSDirectory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部類別");
  const [status, setStatus] = useState("全部狀態");
  const [compliance, setCompliance] = useState("全部合規");

  const crud = useCrud<AppRow>({ table: "saas_apps", queryKey: "saas_apps", labelName: "應用" });
  const [pendingDelete, setPendingDelete] = useState<AppRow | null>(null);

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ["saas_apps"],
    queryFn: async (): Promise<AppRow[]> => {
      const { data, error } = await (supabase as any).from("saas_apps").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as AppRow[];
    },
  });
  if (error) toast.error("讀取 SaaS 應用失敗", { description: (error as Error).message });

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const badges = app.badges ?? [];
      const s = search.toLowerCase();
      if (s && !app.name.toLowerCase().includes(s) && !(app.vendor ?? "").toLowerCase().includes(s)) return false;
      if (category !== "全部類別" && !badges.includes(category)) return false;
      if (status !== "全部狀態" && !badges.includes(status)) return false;
      if (compliance !== "全部合規" && !badges.includes(compliance)) return false;
      return true;
    });
  }, [apps, search, category, status, compliance]);

  const stats = useMemo(() => ({
    totalApps: apps.length,
    totalMonthlyCost: apps.reduce((s, a) => s + Number(a.monthly_cost ?? 0), 0),
    ssoEnabled: apps.filter((a) => (a.badges ?? []).includes("SSO")).length,
    trial: apps.filter((a) => (a.badges ?? []).includes("試用中")).length,
  }), [apps]);

  const expiringApps = useMemo(() => {
    const now = Date.now();
    const in30 = 30 * 86400000;
    return apps
      .filter((a) => a.contract_end && new Date(a.contract_end).getTime() - now < in30 && new Date(a.contract_end).getTime() - now > 0)
      .map((a) => ({
        id: a.id, name: a.name, vendor: a.vendor ?? "", category: a.category ?? "",
        description: a.description ?? "", badges: a.badges ?? [],
        monthlyCost: Number(a.monthly_cost ?? 0), contractEnd: a.contract_end ?? undefined,
        icon: a.icon ?? "📦", iconBg: iconBgByCategory[a.category ?? ""] ?? "bg-muted",
      }));
  }, [apps]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["SaaS 應用管理"]}
        title="SaaS 應用目錄"
        description="管理企業使用的所有 SaaS 應用與訂閱"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />

      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : (
          <>
            <StatCard label="應用總數" value={stats.totalApps} />
            <StatCard label="月費用合計" value={`$${stats.totalMonthlyCost.toLocaleString()}`} />
            <StatCard label="啟用 SSO" value={stats.ssoEnabled} />
            <StatCard label="試用中" value={stats.trial} />
          </>
        )}
      </div>

      {!isLoading && <ExpiryAlert apps={expiringApps} />}

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
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)
        ) : (
          <>
            {filtered.map((app) => {
              const iconBg = iconBgByCategory[app.category ?? ""] ?? "bg-muted";
              return (
                <div key={app.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow group relative">
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => crud.openEdit(app)} aria-label="編輯">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(app)} aria-label="刪除">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${iconBg}`}>
                      {app.icon ?? "📦"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-card-foreground truncate">{app.name}</div>
                      <div className="text-xs text-muted-foreground">{app.vendor}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">{app.description}</div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(app.badges ?? []).map((b) => <AppBadge key={b} label={b} />)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{app.contract_end ? `合約到期：${app.contract_end}` : "無合約期限"}</span>
                    <span className="font-semibold text-card-foreground">${Number(app.monthly_cost ?? 0).toLocaleString()}/月</span>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">沒有找到符合條件的應用</div>
            )}
          </>
        )}
      </div>

      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯應用" : "新增應用"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({
          ...p,
          currency: p.currency || "TWD",
          contract_end: p.contract_end || null,
        }))}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>此操作無法復原，確定要刪除這筆資料嗎？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                const row = pendingDelete;
                setPendingDelete(null);
                if (row) await crud.remove(row);
              }}
            >刪除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
