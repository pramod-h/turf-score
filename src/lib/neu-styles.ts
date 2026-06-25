export const NEU_CARD = {
  background: "var(--card)",
  boxShadow: "var(--shadow-neu-card)",
} as const;

export const NEU_CARD_LG = {
  background: "var(--card)",
  boxShadow: "var(--shadow-neu-card-lg)",
} as const;

export const NEU_INSET = {
  background: "var(--background)",
  boxShadow: "var(--shadow-neu-inset)",
} as const;

export const NEU_INSET_SM = {
  background: "var(--background)",
  boxShadow: "var(--shadow-neu-inset-sm)",
} as const;

export function neuToggleStyle(isActive: boolean) {
  return isActive
    ? {
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        boxShadow: "var(--shadow-neu-red)",
      }
    : {
        background: "var(--background)",
        color: "var(--muted-foreground)",
        boxShadow: "var(--shadow-neu-raised-xs)",
      };
}
