import PageHeader from "@/components/PageHeader";

const settingSections = [
  {
    title: "一般設定",
    items: [
      { label: "組織名稱", value: "My Company", type: "text" },
      { label: "時區", value: "Asia/Taipei (UTC+8)", type: "select" },
      { label: "語言", value: "繁體中文", type: "select" },
      { label: "日期格式", value: "YYYY-MM-DD", type: "select" },
    ],
  },
  {
    title: "通知設定",
    items: [
      { label: "合約到期提醒", value: "30天、14天、7天前", type: "multi" },
      { label: "用量警報閾值", value: "80%", type: "number" },
      { label: "Email 通知", value: "啟用", type: "toggle" },
      { label: "Slack 通知", value: "啟用", type: "toggle" },
    ],
  },
  {
    title: "安全設定",
    items: [
      { label: "強制 MFA", value: "所有管理員", type: "select" },
      { label: "密碼輪換週期", value: "90 天", type: "number" },
      { label: "Session 逾時", value: "30 分鐘", type: "number" },
      { label: "IP 白名單", value: "未啟用", type: "toggle" },
    ],
  },
  {
    title: "資料管理",
    items: [
      { label: "自動備份", value: "每日", type: "select" },
      { label: "日誌保留期間", value: "365 天", type: "number" },
      { label: "資料匯出格式", value: "CSV, JSON", type: "multi" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["系統設定"]} title="系統設定" description="管理系統層級的全域配置與偏好設定" />
      <div className="space-y-6">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-lg">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-semibold text-card-foreground">{section.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item) => (
                <div key={item.label} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-card-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
