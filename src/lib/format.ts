export function formatGs(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "Gs. 0";
  return `Gs. ${Math.round(n).toLocaleString("es-PY")}`;
}

export const PRICE_MODALITY_LABEL: Record<string, string> = {
  per_hour: "por hora",
  per_night: "por noche",
  per_week: "por semana",
  per_month: "por mes",
  annual: "anual",
  full_weekend: "fin de semana",
};
