// components/page-hero.tsx
import { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  copy,
  actions
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="container-edge py-16 sm:py-20">
      {eyebrow && (
        <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
        {title}
      </h1>
      {copy && <p className="mt-5 max-w-2xl text-base text-white/65 sm:text-lg">{copy}</p>}
      {actions && <div className="mt-8">{actions}</div>}
    </section>
  );
}
