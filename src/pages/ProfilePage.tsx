import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

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
  lastSignIn: string | null;
  profile: ProfileRow | null;
}

export default function ProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async (): Promise<AuthInfo> => {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userRes.user;
      if (!user) return { email: null, lastSignIn: null, profile: null };
      const { data: profile, error: pErr } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (pErr) throw pErr;
      return {
        email: user.email ?? null,
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

  const lastLogin = data?.lastSignIn
    ? new Date(data.lastSignIn).toLocaleString("zh-TW", { hour12: false })
    : "—";

  const security = [
    { label: "MFA 狀態", value: "已啟用" },
    { label: "上次密碼變更", value: "—" },
    { label: "上次登入", value: lastLogin },
    { label: "登入裝置", value: "—" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["個人設定"]} title="個人設定" description="管理您的個人帳號資訊與偏好" />
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
    </div>
  );
}
