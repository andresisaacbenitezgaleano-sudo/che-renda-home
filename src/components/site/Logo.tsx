import logo from "@/assets/logo-che-renda.jpg";
import { cn } from "@/lib/utils";

export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <img
      src={logo}
      alt="Che Renda Tour & Travel"
      width={size}
      height={size}
      className={cn(
        "rounded-full object-cover ring-1 ring-border/60 shadow-sm bg-card",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
