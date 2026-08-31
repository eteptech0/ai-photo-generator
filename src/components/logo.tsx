import Link from "next/link";

/**
 * Wordmark: three stacked bars (the three queues) beside the name.
 * The bars grow left-to-right — discover, build, operate.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="3queue — home"
      className={`group inline-flex items-center gap-2.5 ${className ?? ""}`}
    >
      <svg viewBox="0 0 20 20" aria-hidden className="size-5">
        <rect x="0" y="3" width="7" height="3" rx="1.5" fill="currentColor" />
        <rect
          x="0"
          y="8.5"
          width="13"
          height="3"
          rx="1.5"
          fill="currentColor"
          opacity="0.65"
        />
        <rect
          x="0"
          y="14"
          width="20"
          height="3"
          rx="1.5"
          className="fill-accent"
        />
      </svg>
      <span className="text-[1.0625rem] font-semibold tracking-tight">
        3queue
      </span>
    </Link>
  );
}
