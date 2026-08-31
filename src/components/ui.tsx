import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("mx-auto w-full max-w-6xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

type Tone = "dark" | "raised" | "light";

const toneStyles: Record<Tone, string> = {
  dark: "bg-ink text-fg",
  raised: "bg-ink-raised text-fg",
  light: "bg-paper text-fg-inverse",
};

export function Section({
  children,
  tone = "dark",
  className,
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cx(
        toneStyles[tone],
        "border-t py-20 sm:py-28",
        tone === "light" ? "border-line-inverse" : "border-line",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <p
      className={cx(
        "eyebrow flex items-center gap-3",
        tone === "light" ? "text-fg-inverse-muted" : "text-fg-muted",
      )}
    >
      <span aria-hidden className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-3xl text-center items-center" : "max-w-3xl",
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className="text-title font-semibold text-balance">{title}</h2>
      {lead ? (
        <p
          className={cx(
            "text-lead text-pretty",
            tone === "light" ? "text-fg-inverse-muted" : "text-fg-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/**
 * Variants own every colour utility they need. Never override a variant's
 * colours through `className` — Tailwind resolves conflicting utilities by
 * stylesheet order, not attribute order, so the override may silently lose.
 * Add a variant instead.
 */
type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondaryLight"
  | "onAccent"
  | "onAccentOutline"
  | "ghost";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 " +
  "text-sm font-medium transition-colors duration-150 whitespace-nowrap";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary:
    "border border-line-strong text-fg hover:border-accent hover:text-accent",
  secondaryLight:
    "border border-line-inverse text-fg-inverse hover:border-accent hover:text-accent",
  onAccent: "bg-accent-ink text-accent hover:bg-accent-ink/85",
  onAccentOutline:
    "border border-accent-ink/25 text-accent-ink hover:bg-accent-ink/10",
  ghost: "text-fg-muted hover:text-fg",
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = cx(buttonBase, buttonVariants[variant], className);

  if (isExternal) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={cx(
        buttonBase,
        buttonVariants[variant],
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cx("size-4", className)}
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-7",
        tone === "light"
          ? "border-line-inverse bg-paper-raised"
          : "border-line bg-ink-raised",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  value,
  label,
  tone = "dark",
}: {
  value: string;
  label: string;
  tone?: Tone;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-3xl font-medium tracking-tight text-accent sm:text-4xl">
        {value}
      </span>
      <span
        className={cx(
          "text-sm leading-snug",
          tone === "light" ? "text-fg-inverse-muted" : "text-fg-muted",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function CheckItem({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <li className="flex items-start gap-3">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="mt-1 size-4 shrink-0 text-accent"
      >
        <path
          d="M3 8.5L6.5 12L13 4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cx(
          "text-sm leading-relaxed",
          tone === "light" ? "text-fg-inverse-muted" : "text-fg-muted",
        )}
      >
        {children}
      </span>
    </li>
  );
}
