import clsx from "clsx";

const VARIANTS = {
  error: "border-danger/30 bg-danger/5 text-danger",
  success: "border-accent/30 bg-accent/5 text-accent",
  info: "border-info/30 bg-info/5 text-info",
};

export function Alert({ variant = "info", children }) {
  return (
    <div role="alert" className={clsx("rounded-lg border px-3 py-2 text-sm", VARIANTS[variant])}>
      {children}
    </div>
  );
}
