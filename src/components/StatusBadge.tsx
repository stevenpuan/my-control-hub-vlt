import { cn } from "@/lib/utils";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary",
  neutral: "bg-muted text-muted-foreground",
};

// 常見狀態文字 → 語義顏色
const presetMap: Record<string, StatusVariant> = {
  // 通用啟用 / 停用
  "啟用": "success",
  "使用中": "success",
  "正常": "success",
  "已部署": "success",
  "停用": "neutral",
  "待審核": "warning",
  "測試中": "warning",
  "警告": "warning",
  "規劃中": "neutral",
  "已過期": "danger",
  "低使用率": "warning",
  // 風險等級
  "高": "danger",
  "中": "warning",
  "低": "success",
};

interface Props {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

export default function StatusBadge({ label, variant, className }: Props) {
  const v = variant ?? presetMap[label] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        variantStyles[v],
        className
      )}
    >
      {label}
    </span>
  );
}
