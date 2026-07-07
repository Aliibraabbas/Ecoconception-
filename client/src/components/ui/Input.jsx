import clsx from "clsx";

export function FormField({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ error, className, ...props }) {
  return (
    <input
      aria-invalid={Boolean(error)}
      className={clsx(
        "w-full rounded-lg border bg-background px-3 py-2 text-sm text-text outline-none placeholder:text-text-secondary",
        error ? "border-danger" : "border-text-secondary/30 focus:border-primary",
        className
      )}
      {...props}
    />
  );
}
