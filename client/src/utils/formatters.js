export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatRelativeDate(dateString) {
  if (!dateString) return "—";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;
  const diffDays = Math.round(diffHours / 24);
  return `il y a ${diffDays} j`;
}

export function formatPercent(value) {
  return `${Math.round((value ?? 0) * 100)}%`;
}

// Clé "YYYY-MM-DD" à partir des composants locaux d'une Date, sans passer par toISOString()
// (qui convertit en UTC et peut décaler le jour selon le fuseau horaire local).
export function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
