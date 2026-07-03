import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  "AI / ML": "bg-badge-ai/15 text-badge-ai",
  "使用中": "bg-badge-active/15 text-badge-active",
  "按用量": "bg-badge-usage/15 text-badge-usage",
  "SSO": "bg-badge-sso/15 text-badge-sso",
  "SOC 2": "bg-badge-soc2/15 text-badge-soc2",
  "GDPR": "bg-badge-gdpr/15 text-badge-gdpr",
  "ISO 27001": "bg-badge-iso/15 text-badge-iso",
  "雲端服務": "bg-badge-cloud/15 text-badge-cloud",
};

export default function AppBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        badgeStyles[label] || "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </span>
  );
}
