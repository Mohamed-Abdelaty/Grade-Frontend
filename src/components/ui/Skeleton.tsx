export function Skeleton({ className = 'h-4 w-full' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-lg bg-linear-to-r from-surface-2 via-line to-surface-2 bg-[length:200%_100%] ${className}`}
    />
  )
}