"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground transition-all active:scale-95"
      style={{
        background: "var(--background)",
        boxShadow: "var(--shadow-neu-raised-sm)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
