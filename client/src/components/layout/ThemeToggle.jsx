import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext.jsx";

const OPTIONS = [
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
  { value: "system", label: "Système", Icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Thème" className="flex items-center gap-1 rounded-lg border border-text-secondary/20 p-1">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          role="radio"
          aria-checked={theme === value}
          title={label}
          onClick={() => setTheme(value)}
          className={`rounded-md p-1.5 transition-colors ${
            theme === value ? "bg-primary text-white" : "text-text-secondary hover:bg-text-secondary/10"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
