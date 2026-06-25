import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-all outline-none",
        "placeholder:text-muted-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-destructive/40",
        className
      )}
      style={{
        background: "var(--background)",
        boxShadow: "var(--shadow-neu-inset)",
        border: "none",
        ...style,
      }}
      {...props}
    />
  )
}

export { Input }
