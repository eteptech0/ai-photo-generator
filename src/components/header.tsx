"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the mobile menu whenever the route changes. Adjusting state during
  // render is cheaper than an effect: React re-runs this pass before painting.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors ${
                  active ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/contact" className="px-5 py-2">
            Book an intro call
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-lg text-fg md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
            {open ? (
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h14M3 13h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main (mobile)"
          className="border-t border-line bg-ink px-6 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-line py-4 text-base text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/contact" className="mt-6 w-full">
            Book an intro call
          </ButtonLink>
        </nav>
      ) : null}
    </header>
  );
}
