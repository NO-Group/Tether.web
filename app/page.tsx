// app/page.tsx
import Link from "next/link";
import { ArrowRight, AtSign, Search, Zap } from "lucide-react";
import { AnimatedPreview } from "@/components/animated-preview";
import { Button } from "@/components/button";
import { EarlyAccessForm } from "@/components/early-access-form";
import { FeatureCard } from "@/components/feature-card";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container-edge flex min-h-[92vh] flex-col justify-center py-20 sm:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/60">
                Next-generation messaging
              </div>
              <h1 className="text-balance max-w-4xl text-5xl font-semibold tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                Connect without limits.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/65 sm:text-xl">
                No numbers. Just usernames.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/early">
                    Start on Web
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" disabled>
                  Download APK
                  <span className="text-white/40">(Coming Soon)</span>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="lg:justify-self-end">
              <AnimatedPreview />
            </Reveal>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Live UI Preview"
        title="Messaging that feels immediate."
        copy="A focused interface built to disappear behind the conversation. Fast interactions, quiet motion, and a system that keeps identity simple."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <FeatureCard
            icon={<AtSign className="h-5 w-5" />}
            title="Username-based identity"
            description="Build your identity once. Reach people directly without exposing a personal number."
          />
          <FeatureCard
            icon={<Search className="h-5 w-5" />}
            title="Instant search"
            description="Find people and conversations in moments with a fast, minimal lookup flow."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Fast messaging"
            description="Optimized for speed and clarity with a UI that stays out of your way."
          />
        </div>
      </Section>

      <Section
        eyebrow="Early Access"
        title="Reserve your username."
        copy="Claim your handle early and secure your identity before public launch."
      >
        <div className="max-w-2xl">
          <EarlyAccessForm />
        </div>
      </Section>
    </div>
  );
}
