import { cn } from "@/lib/utils";

const TONES = {
  pos: "text-pos border-pos/30 bg-pos/10",
  warn: "text-warn border-warn/30 bg-warn/10",
  elev: "text-elev border-elev/30 bg-elev/10",
  sev: "text-sev border-sev/30 bg-sev/10",
  cyan: "text-cyanpale border-cyan/30 bg-cyan/10",
  tech: "text-tech border-tech/30 bg-tech/10",
  neutral: "text-steel border-edge bg-panel2",
} as const;

export type PillTone = keyof typeof TONES;

interface StatusPillProps {
  tone?: PillTone;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export function StatusPill({ tone = "neutral", children, pulse, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "label-caps-sm inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5",
        TONES[tone],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-current" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
