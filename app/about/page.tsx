// app/about/page.tsx
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

export default function AboutPage() {
  return (
    <div className="pt-12">
      <Section
        eyebrow="About"
        title="Messaging rebuilt around identity, not phone numbers."
        copy="Tether is a modern communication platform designed around usernames, speed, and simplicity. It gives people a cleaner way to connect—without sharing more than they need to."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="surface rounded-3xl border border-white/10 p-6">
            <h3 className="text-lg font-medium">What is Tether</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Tether is a next-generation chat platform that uses usernames as the foundation of communication. The experience is quick to understand, fast to use, and built for modern digital identity.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="surface rounded-3xl border border-white/10 p-6">
            <h3 className="text-lg font-medium">Vision & mission</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              We believe communication should feel direct and private. Tether exists to remove friction, reduce unnecessary exposure, and create a messaging layer that feels clean from the first interaction.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="surface rounded-3xl border border-white/10 p-6">
            <h3 className="text-lg font-medium">Why usernames win</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Usernames are portable, memorable, and flexible. They let people connect across devices, communities, and contexts without tying every conversation to a phone number.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="rounded-3xl border border-white/10 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">Story</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              The future of chat should be lighter.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="rounded-3xl border border-white/10 p-8 text-sm leading-7 text-white/70">
            <p>
              Traditional messaging products were built around device ownership and contact syncing. That model made sense for an earlier internet. Tether is built for a connected world where identity can be simpler, faster, and more deliberate.
            </p>
            <p className="mt-4">
              By centering the product around usernames, Tether creates a communication layer that feels more native to the web, more adaptable across platforms, and more aligned with how people actually discover each other online.
            </p>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
