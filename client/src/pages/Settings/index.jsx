import { useTheme } from "@/contexts/ThemeContext.jsx";
import { useMe } from "@/hooks/useMe.js";
import { Skeleton } from "@/components/common/Skeleton.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";

const THEME_OPTIONS = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { data, isLoading, isError, refetch, updateProfile } = useMe();

  const handleThemeChange = (value) => {
    setTheme(value);
    updateProfile({ theme: value });
  };

  if (isLoading) return <Skeleton className="h-40" />;
  if (isError) return <ErrorState onRetry={refetch} message="Impossible de charger les paramètres." />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-bold text-text">Paramètres</h1>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Thème</legend>
        <div role="radiogroup" className="flex gap-2">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              role="radio"
              aria-checked={theme === option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                theme === option.value ? "border-primary bg-primary/10 text-primary" : "border-text-secondary/20 text-text-secondary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Langue</legend>
        <select
          value={data.profile.locale}
          onChange={(e) => updateProfile({ locale: e.target.value })}
          className="rounded-lg border border-text-secondary/20 bg-surface px-3 py-2 text-sm text-text"
        >
          <option value="fr">Français</option>
        </select>
      </fieldset>
    </div>
  );
}
