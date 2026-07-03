import { AlertTriangle } from "lucide-react";
import type { SaaSApp } from "@/data/saasApps";

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function ExpiryAlert({ apps }: { apps: SaaSApp[] }) {
  if (apps.length === 0) return null;
  return (
    <div className="border border-warning/30 bg-warning/5 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-warning font-medium text-sm">
          <AlertTriangle className="w-4 h-4" />
          合約到期預警
        </div>
        <span className="text-xs bg-warning/15 text-warning px-2 py-0.5 rounded-full font-medium">
          {apps.length} 筆 30天內
        </span>
      </div>
      <div className="space-y-2">
        {apps.map((app) => {
          const days = daysUntil(app.contractEnd!);
          return (
            <div key={app.id} className="flex items-center gap-3 bg-card rounded-md px-3 py-2">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-base ${app.iconBg}`}>
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-card-foreground">{app.name}</div>
                <div className="text-xs text-muted-foreground">
                  {app.vendor} · 到期日 {app.contractEnd}
                </div>
              </div>
              <span className="text-xs bg-warning/15 text-warning px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                ⚠ {days} 天
              </span>
              <span className="text-sm text-muted-foreground">${app.monthlyCost}/月</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
