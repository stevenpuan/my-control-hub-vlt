import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const monthlyCosts = [
  { category: "AI / ML 服務", apps: 3, cost: 5100 },
  { category: "雲端基礎設施", apps: 3, cost: 20100 },
  { category: "協作工具", apps: 3, cost: 2400 },
  { category: "開發工具", apps: 2, cost: 1670 },
];

export default function CostsPage() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["SaaS 應用管理", "費用分析"]} title="費用分析" description="分析各項 SaaS 應用的費用趨勢與分佈" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="本月總費用" value="$29,270" />
        <StatCard label="較上月" value="+3.2%" />
        <StatCard label="年度預算使用" value="67%" />
        <StatCard label="可優化項目" value={4} />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">費用類別</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">應用數量</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">月費用</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">佔比</th>
            </tr>
          </thead>
          <tbody>
            {monthlyCosts.map((item) => (
              <tr key={item.category} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-card-foreground">{item.category}</td>
                <td className="px-4 py-3 text-card-foreground">{item.apps}</td>
                <td className="px-4 py-3 text-card-foreground">${item.cost.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(item.cost / 29270) * 100}%` }} />
                    </div>
                    <span className="text-muted-foreground text-xs">{((item.cost / 29270) * 100).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-card-foreground mb-4">費用趨勢（近 6 個月）</h3>
        <div className="h-48 flex items-end gap-4 px-4">
          {[24500, 25800, 26200, 27100, 28350, 29270].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">${(val / 1000).toFixed(1)}k</span>
              <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(val / 30000) * 160}px` }}>
                <div className="w-full h-full bg-primary/60 rounded-t" />
              </div>
              <span className="text-xs text-muted-foreground">{["11月", "12月", "1月", "2月", "3月", "4月"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
