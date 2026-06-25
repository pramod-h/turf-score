import { cn } from "@/lib/utils";

export function NeuCard({
  className,
  variant = "default",
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "lg" }) {
  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{
        background: "var(--card)",
        boxShadow: variant === "lg" ? "var(--shadow-neu-card-lg)" : "var(--shadow-neu-card)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function NeuSectionHeader({
  title,
  titleColor,
  divider = true,
  className,
  children,
}: {
  title: string;
  titleColor?: string;
  divider?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("px-4 py-3 flex items-center justify-between", className)}
      style={divider ? { borderBottom: "1px solid var(--border)" } : undefined}
    >
      <p
        className="text-xs font-extrabold uppercase tracking-widest"
        style={{ color: titleColor ?? "var(--foreground)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
