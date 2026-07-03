import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface HandoverRow {
  id: string;
  account: string;
  from_person: string;
  to_person: string;
  status: string;
  start_date: string;
  items: string;
  progress_done: number;
  progress_total: number;
}

const columns = [
  { key: "account", label: "帳號/服務" },
  { key: "from_person", label: "移交人" },
  { key: "to_person", label: "接收人" },
  { key: "status", label: "狀態", render: (r: HandoverRow) => <StatusBadge label={r.status} /> },
  { key: "start_date", label: "開始日期" },
  { key: "items", label: "交接項目" },
  {
    key: "progress",
    label: "進度",
    render: (r: HandoverRow) => (
      <span>{r.progress_done}/{r.progress_total}</span>
    ),
  },
];

export default function HandoverPage() {
  const { data: handovers = [], isLoading, error } = useQuery({
    queryKey: ["handovers"],
    queryFn: async (): Promise<HandoverRow[]> => {
      const { data, error } = await (supabase as any)
        .from("handovers")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HandoverRow[];
    },
  });

  if (error) toast.error("讀取交接資料失敗", { description: (error as Error).message });

  const stats = useMemo(
    () => ({
      inProgress: handovers.filter((h) => h.status === "進行中").length,
      done: handovers.filter((h) => h.status === "已完成").length,
      pending: handovers.filter((h) => h.status === "待開始").length,
    }),
    [handovers]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["社群帳號管理", "交接管理"]}
        title="交接管理"
        description="追蹤帳號與服務的交接流程與進度"
      />
      <div className="grid grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : [
              <StatCard key="a" label="進行中" value={stats.inProgress} />,
              <StatCard key="b" label="已完成" value={stats.done} />,
              <StatCard key="c" label="待開始" value={stats.pending} />,
            ]}
      </div>
      {isLoading ? <Skeleton className="h-64 rounded-lg" /> : <DataTable columns={columns} data={handovers} />}
    </div>
  );
}
