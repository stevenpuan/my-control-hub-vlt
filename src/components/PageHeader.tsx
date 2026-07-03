import { Home, ChevronRight } from "lucide-react";

export default function PageHeader({
  breadcrumb,
  title,
  description,
  actions,
}: {
  breadcrumb: string[];
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Home className="w-3.5 h-3.5" />
        <span>總覽</span>
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>{item}</span>
          </span>
        ))}
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        {actions}
      </div>
    </div>
  );
}
