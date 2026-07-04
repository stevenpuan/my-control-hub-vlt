import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";
import { useCrud } from "@/hooks/useCrud";

interface ComplianceRow {
  id: string;
  app: string;
  soc2: boolean;
  iso27001: boolean;
  gdpr: boolean;
  sso: boolean;
  mfa: boolean;
  last_audit: string;
  risk: string;
}

const check = (v: boolean) =>
  v ? <span className="text-success">✓</span> : <span className="text-destructive">✗</span>;

const fields: CrudField[] = [
  { name: "app", label: "應用", type: "text", required: true },
  { name: "soc2", label: "SOC 2", type: "switch" },
  { name: "iso27001", label: "ISO 27001", type: "switch" },
  { name: "gdpr", label: "GDPR", type: "switch" },
  { name: "sso", label: "SSO", type: "switch" },
  { name: "mfa", label: "MFA", type: "switch" },
  { name: "last_audit", label: "上次稽核", type: "date" },
  {
    name: "risk", label: "風險等級", type: "select",
    options: ["低", "中", "高"].map((v) => ({ label: v, value: v })),
  },
];

export default function CompliancePage() {
  const crud = useCrud<ComplianceRow>({ table: "compliance_items", queryKey: "compliance_items", labelName: "合規" });

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["compliance_items"],
    queryFn: async (): Promise<ComplianceRow[]> => {
      const { data, error } = await (supabase as any).from("compliance_items").select("*").order("app");
      if (error) throw error;
      return (data ?? []) as ComplianceRow[];
    },
  });
  if (error) toast.error("讀取合規資料失敗", { description: (error as Error).message });

  const stats = useMemo(() => {
    const total = items.length;
    const fullyCompliant = items.filter((r) => r.soc2 && r.iso27001 && r.gdpr && r.sso && r.mfa).length;
    const highRisk = items.filter((r) => r.risk === "高").length;
    const trueCount = items.reduce((s, r) => s + [r.soc2, r.iso27001, r.gdpr, r.sso, r.mfa].filter(Boolean).length, 0);
    const rate = total ? ((trueCount / (total * 5)) * 100).toFixed(1) + "%" : "0.0%";
    return { total, fullyCompliant, highRisk, rate };
  }, [items]);

  const columns = [
    { key: "app", label: "應用" },
    { key: "soc2", label: "SOC 2", render: (r: ComplianceRow) => check(r.soc2) },
    { key: "iso27001", label: "ISO 27001", render: (r: ComplianceRow) => check(r.iso27001) },
    { key: "gdpr", label: "GDPR", render: (r: ComplianceRow) => check(r.gdpr) },
    { key: "sso", label: "SSO", render: (r: ComplianceRow) => check(r.sso) },
    { key: "mfa", label: "MFA", render: (r: ComplianceRow) => check(r.mfa) },
    { key: "last_audit", label: "上次稽核" },
    { key: "risk", label: "風險等級", render: (r: ComplianceRow) => <StatusBadge label={r.risk} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["稽核合規"]}
        title="稽核合規"
        description="檢視應用認證狀態與風險評估"
        actions={<Button onClick={crud.openCreate}><Plus className="h-4 w-4" />新增</Button>}
      />
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="已稽核應用" value={stats.total} />,
              <StatCard key="b" label="完全合規" value={stats.fullyCompliant} />,
              <StatCard key="c" label="高風險" value={stats.highRisk} />,
              <StatCard key="d" label="合規率" value={stats.rate} />,
            ]}
      </div>
      {isLoading ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <DataTable columns={columns} data={items} onEdit={crud.openEdit} onDelete={crud.remove} />
      )}
      <CrudDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        mode={crud.editing ? "edit" : "create"}
        title={crud.editing ? "編輯合規項目" : "新增合規項目"}
        fields={fields}
        defaultValues={crud.editing ?? undefined}
        onSubmit={(v) => crud.submit(v, (p) => ({ ...p, last_audit: p.last_audit || null }))}
      />
    </div>
  );
}
