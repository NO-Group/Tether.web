// app/features/page.tsx
import { AtSign, Search, Zap } from "lucide-react";
import { MockPhone } from "@/components/mock-phone";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

export default function FeaturesPage() {
  return (
    <div className="pt-12">
      <Section
        eyebrow="Features"
        title="Purpose-built around speed and clarity."
        copy="Every part of Tether is designed to reduce friction—from discovering a person to starting a conversation."
      >
        <div className="space-y-6">
          <Reveal className="grid gap-6 rounded-3xl border border-white/10 p-6 lg:grid-cols-[1fr_0.9fr] lg:p-8">
            <div>
              <div className="inline-flex rounded-full border border-white/10 p-2">
                <AtSign className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold">Username system</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                Usernames make identity portable and memorable. Tether replaces number-first onboarding with a cleaner account model that can later support profiles, verification, and account recovery.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <MockPhone mode="username" />
            </div>
          </Reveal>

          <Reveal delay={0.06} className="grid gap-6 rounded-3xl border border-white/10 p-6 lg:grid-cols-[0.9fr_1fr] lg:p-8">
            <div className="order-2 flex items-center justify-center lg:order-1">
              <MockPhone mode="search" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex rounded-full border border-white/10 p-2">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold">Search system</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                Tether is designed for fast user discovery. Search is immediate, focused, and scalable for future backend integrations such as global username lookup, suggested profiles, and contact relevance.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="grid gap-6 rounded-3xl border border-white/10 p-6 lg:grid-cols-[1fr_0.9fr] lg:p-8">
            <div>
              <div className="inline-flex rounded-full border border-white/10 p-2">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold">Messaging speed</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                Lightweight interaction patterns, responsive layouts, and subtle motion give every message a sense of immediacy. The system is structured to support real-time chat, read states, and notifications later.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <MockPhone mode="chat" />
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
