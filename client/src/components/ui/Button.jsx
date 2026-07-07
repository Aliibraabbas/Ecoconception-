import clsx from "clsx";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface text-text border border-text-secondary/30 hover:bg-text-secondary/10",
  ghost: "bg-transparent text-text hover:bg-text-secondary/10",
  danger: "bg-danger text-white hover:opacity-90",
};

export function Button({ variant = "primary", loading = false, disabled, className, children, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </button>
  );
}
