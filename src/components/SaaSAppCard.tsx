import type { SaaSApp } from "@/data/saasApps";
import AppBadge from "./AppBadge";

export default function SaaSAppCard({ app }: { app: SaaSApp }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${app.iconBg}`}>
          {app.icon}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-card-foreground truncate">{app.name}</div>
          <div className="text-xs text-muted-foreground">{app.vendor}</div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-3">{app.description}</div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {app.badges.map((b) => (
          <AppBadge key={b} label={b} />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {app.contractEnd ? `合約到期：${app.contractEnd}` : "無合約期限"}
        </span>
        <span className="font-semibold text-card-foreground">
          ${app.monthlyCost.toLocaleString()}/月
        </span>
      </div>
    </div>
  );
}
