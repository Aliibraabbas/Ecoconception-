import clsx from "clsx";

export function Skeleton({ className }) {
  return <div className={clsx("animate-pulse rounded-md bg-text-secondary/15", className)} aria-hidden="true" />;
}
