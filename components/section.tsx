// components/section.tsx
import { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

type SectionProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, copy, children }: SectionProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-edge">
        <Reveal>
          {eyebrow && (
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
              {eyebrow}
            </p>
          )}
          <h2 className="section-title text-balance">{title}</h2>
          {copy && <p className="section-copy mt-4">{copy}</p>}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
