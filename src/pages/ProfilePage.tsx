import PageHeader from "@/components/PageHeader";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["個人設定"]} title="個人設定" description="管理您的個人帳號資訊與偏好" />
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-semibold text-card-foreground">個人資訊</h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: "姓名", value: "使用者" },
              { label: "Email", value: "user@company.com" },
              { label: "角色", value: "系統管理員" },
              { label: "部門", value: "IT 部門" },
              { label: "加入日期", value: "2025-01-15" },
            ].map((item) => (
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
            {[
              { label: "MFA 狀態", value: "已啟用" },
              { label: "上次密碼變更", value: "2026-03-01" },
              { label: "上次登入", value: "2026-04-07 09:30" },
              { label: "登入裝置", value: "3 台裝置" },
            ].map((item) => (
              <div key={item.label} className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-card-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
