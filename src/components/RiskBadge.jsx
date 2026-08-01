import { riskConfig } from '@/lib/analysisEngine';
import { cn } from '@/lib/utils';

export default function RiskBadge({ level, size = "default" }) {
  const config = riskConfig(level);

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      config.bg, config.text, config.border,
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
    )}>
      <span className={cn("rounded-full", config.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      Riesgo {config.label}
    </div>
  );
}
