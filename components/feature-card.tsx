// components/feature-card.tsx
import { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function FeatureCard({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="group rounded-3xl border border-white/10 p-6 transition-all hover:border-white/20 hover:bg-white/[0.03]">
      <div className="inline-flex rounded-full border border-white/10 p-3 transition-all group-hover:border-white/25">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-medium">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
    </Reveal>
  );
}
