// components/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/80 backdrop-blur-xl">
      <div className="container-edge flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-[-0.04em]">
          Tether
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-white/65 hover:text-white",
                  active && "border border-white/10 text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/8 md:hidden">
          <div className="container-edge flex flex-col py-3">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm text-white/70 hover:bg-white hover:text-black",
                    active && "border border-white/10 text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
