export interface SaaSApp {
  id: string;
  name: string;
  vendor: string;
  category: string;
  description: string;
  badges: string[];
  monthlyCost: number;
  contractEnd?: string;
  icon: string;
  iconBg: string;
}

// 統一使用語義設計 token，避免在元件內寫死 Tailwind 顏色
const iconBgByCategory: Record<string, string> = {
  "AI / ML": "bg-badge-ai/15",
  "雲端服務": "bg-badge-cloud/15",
  "協作工具": "bg-badge-sso/15",
  "設計工具": "bg-badge-soc2/15",
  "開發工具": "bg-badge-iso/15",
  "人力資源": "bg-badge-gdpr/15",
};

const bg = (c: string) => iconBgByCategory[c] ?? "bg-muted";

export const saasApps: SaaSApp[] = [
  { id: "1", name: "OpenAI", vendor: "OpenAI", category: "AI / ML",
    description: "GPT-4, DALL-E, Whisper API",
    badges: ["AI / ML", "使用中", "按用量", "SOC 2", "GDPR"],
    monthlyCost: 2400, contractEnd: "2027-01-01", icon: "🤖", iconBg: bg("AI / ML") },
  { id: "2", name: "Anthropic (Claude)", vendor: "Anthropic", category: "AI / ML",
    description: "Claude API 企業方案",
    badges: ["AI / ML", "使用中", "按用量", "SOC 2"],
    monthlyCost: 1800, icon: "🧠", iconBg: bg("AI / ML") },
  { id: "3", name: "Google Gemini", vendor: "Google", category: "AI / ML",
    description: "Gemini Pro / Ultra API",
    badges: ["AI / ML", "使用中", "按用量", "SSO", "SOC 2", "ISO 27001", "GDPR"],
    monthlyCost: 900, icon: "✨", iconBg: bg("AI / ML") },
  { id: "4", name: "AWS", vendor: "Amazon", category: "雲端服務",
    description: "EC2, S3, RDS, Lambda 等",
    badges: ["雲端服務", "使用中", "按用量", "SSO", "SOC 2", "ISO 27001"],
    monthlyCost: 8500, contractEnd: "2026-12-01", icon: "☁️", iconBg: bg("雲端服務") },
  { id: "5", name: "Google Cloud", vendor: "Google", category: "雲端服務",
    description: "GKE, BigQuery, Cloud Run",
    badges: ["雲端服務", "使用中", "按用量", "SSO", "SOC 2", "ISO 27001"],
    monthlyCost: 6200, icon: "🌐", iconBg: bg("雲端服務") },
  { id: "6", name: "Microsoft Azure", vendor: "Microsoft", category: "雲端服務",
    description: "Azure VM, Cosmos DB, Functions",
    badges: ["雲端服務", "使用中", "按用量", "SSO", "SOC 2", "ISO 27001"],
    monthlyCost: 5400, icon: "💎", iconBg: bg("雲端服務") },
  { id: "7", name: "Slack", vendor: "Salesforce", category: "協作工具",
    description: "企業通訊與協作平台",
    badges: ["協作工具", "使用中", "SSO", "SOC 2"],
    monthlyCost: 1200, contractEnd: "2026-09-15", icon: "💬", iconBg: bg("協作工具") },
  { id: "8", name: "Notion", vendor: "Notion Labs", category: "協作工具",
    description: "知識管理與文件協作",
    badges: ["協作工具", "使用中", "SOC 2"],
    monthlyCost: 480, icon: "📝", iconBg: bg("協作工具") },
  { id: "9", name: "Figma", vendor: "Adobe", category: "設計工具",
    description: "UI/UX 設計與原型工具",
    badges: ["設計工具", "使用中", "SSO", "SOC 2"],
    monthlyCost: 720, icon: "🎨", iconBg: bg("設計工具") },
  { id: "10", name: "GitHub", vendor: "Microsoft", category: "開發工具",
    description: "程式碼版控與 CI/CD",
    badges: ["開發工具", "使用中", "SSO", "SOC 2", "ISO 27001"],
    monthlyCost: 950, contractEnd: "2027-03-01", icon: "🐙", iconBg: bg("開發工具") },
  { id: "11", name: "BambooHR", vendor: "BambooHR", category: "人力資源",
    description: "人力資源管理系統",
    badges: ["人力資源", "使用中", "SSO", "SOC 2"],
    // 修正：BambooHR 設定為 30 天內到期，與「到期轉換」頁顯示一致
    monthlyCost: 380, contractEnd: "2026-06-29", icon: "🌿", iconBg: bg("人力資源") },
];

export const expiringApps = saasApps.filter((app) => {
  if (!app.contractEnd) return false;
  const diff = new Date(app.contractEnd).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
});

export const stats = {
  totalApps: saasApps.length,
  totalMonthlyCost: saasApps.reduce((sum, a) => sum + a.monthlyCost, 0),
  ssoEnabled: saasApps.filter((a) => a.badges.includes("SSO")).length,
  trial: 1,
};
