import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CrudDialog, { type CrudField } from "@/components/CrudDialog";

interface ProfileRow {
  id: string;
  display_name: string | null;
  role: string | null;
  department: string | null;
  job_title: string | null;
  joined_date: string | null;
}

interface AuthInfo {
  email: string | null;
  userId: string | null;
  lastSignIn: string | null;
  profile: ProfileRow | null;
}

const fields: CrudField[] = [
  { name: "display_name", label: "姓名", type: "text" },
  { name: "role", label: "角色", type: "text" },
  { name: "department", label: "部門", type: "text" },
  { name: "job_title", label: "職稱", type: "text" },
  { name: "joined_date", label: "加入日期", type: "date" },
];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async (): Promise<AuthInfo> => {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userRes.user;
      if (!user) return { email: null, userId: null, lastSignIn: null, profile: null };
      const { data: profile, error: pErr } = await (supabase as any)
        .from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (pErr) throw pErr;
      return {
        email: user.email ?? null,
        userId: user.id,
        lastSignIn: user.last_sign_in_at ?? null,
        profile: (profile as ProfileRow) ?? null,
      };
    },
  });
  if (error) toast.error("讀取個人資料失敗", { description: (error as Error).message });

  const p = data?.profile;
  const personal = [
    { label: "姓名", value: p?.display_name ?? "—" },
    { label: "Email", value: data?.email ?? "—" },
    { label: "角色", value: p?.role ?? "—" },
    { label: "部門", value: p?.department ?? "—" },
    { label: "職稱", value: p?.job_title ?? "—" },
    { label: "加入日期", value: p?.joined_date ?? "—" },
  ];

  const lastLogin = data?.lastSignIn ? new Date(data.lastSignIn).toLocaleString("zh-TW", { hour12: false }) : "—";
  const security = [
    { label: "MFA 狀態", value: "已啟用" },
    { label: "上次密碼變更", value: "—" },
    { label: "上次登入", value: lastLogin },
    { label: "登入裝置", value: "—" },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    if (!data?.userId) return;
    const payload = { ...values, joined_date: values.joined_date || null };
    try {
      const { error } = await (supabase as any).from("profiles").update(payload).eq("id", data.userId);
      if (error) throw error;
      toast.success("已更新");
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
      setEditOpen(false);
    } catch (e) {
      toast.error("更新失敗", { description: (e as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["個人設定"]}
        title="個人設定"
        description="管理您的個人帳號資訊與偏好"
        actions={
          <Button onClick={() => setEditOpen(true)} disabled={!data?.userId}>
            <Pencil className="h-4 w-4" />編輯個人資訊
          </Button>
        }
      />
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-56 rounded-lg" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-semibold text-card-foreground">個人資訊</h3>
            </div>
            <div className="divide-y divide-border">
              {personal.map((item) => (
                <div key={item.label} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-card-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-semibold text-card-foreground">安全性</h3>
            </div>
            <div className="divide-y divide-border">
              {security.map((item) => (
                <div key={item.label} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-card-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CrudDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        title="編輯個人資訊"
        fields={fields}
        defaultValues={p ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
