import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const usageData = [
  { service: "OpenAI", metric: "API 呼叫次數", current: "145,230", limit: "200,000", usage: 72.6 },
  { service: "AWS S3", metric: "儲存容量", current: "2.3 TB", limit: "5 TB", usage: 46.0 },
  { service: "AWS Lambda", metric: "執行次數", current: "890K", limit: "1M", usage: 89.0 },
  { service: "Google Cloud", metric: "BigQuery 掃描", current: "12.5 TB", limit: "20 TB", usage: 62.5 },
  { service: "Slack", metric: "訊息數", current: "23,450", limit: "無限", usage: 0 },
  { service: "GitHub", metric: "Actions 分鐘", current: "2,800", limit: "3,000", usage: 93.3 },
];

export default function UsagePage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["用量監控"]} title="用量監控" description="即時監控各服務的用量與配額使用情況" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="監控服務" value={6} />
        <StatCard label="超過 80%" value={2} />
        <StatCard label="超過 90%" value={1} />
        <StatCard label="本月異常" value={0} />
      </div>

      <div className="space-y-3">
        {usageData.map((item) => (
          <div key={item.service} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium text-card-foreground">{item.service}</span>
                <span className="text-muted-foreground text-sm ml-2">— {item.metric}</span>
              </div>
              <span className="text-sm text-card-foreground">{item.current} / {item.limit}</span>
            </div>
            {item.usage > 0 ? (
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.usage > 90 ? "bg-destructive" : item.usage > 80 ? "bg-warning" : "bg-primary"
                  }`}
                  style={{ width: `${item.usage}%` }}
                />
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">無限制</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
