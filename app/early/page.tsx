// app/early/page.tsx
import { EarlyAccessForm } from "@/components/early-access-form";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

export default function EarlyPage() {
  return (
    <div className="pt-12">
      <Section
        eyebrow="Early Access"
        title="Claim your username before launch."
        copy="This reservation flow uses mock frontend logic today and is structured so real backend validation can be added later."
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="rounded-3xl border border-white/10 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Username reservation</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
              Choose a unique handle, check availability instantly, and join the beta waitlist.
            </p>
            <div className="mt-6">
              <EarlyAccessForm expanded />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-3xl border border-white/10 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">What happens next</h2>
            <div className="mt-6 space-y-5 text-sm leading-6 text-white/65">
              <p>• Reserved usernames can later connect to full user accounts.</p>
              <p>• The account layer is designed to support authentication and profile ownership.</p>
              <p>• Real-time chat, notifications, and sync across devices can plug into this foundation.</p>
              <p>• Early users will get first access to the web experience and Android beta.</p>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
