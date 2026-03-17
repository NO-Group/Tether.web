// components/footer.tsx
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="container-edge flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Tether</p>
          <p className="mt-1 text-sm text-white/45">Connect without limits.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/60">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
