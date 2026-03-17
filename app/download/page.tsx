// app/download/page.tsx
import { Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/button";
import { Section } from "@/components/section";

export default function DownloadPage() {
  return (
    <div className="pt-12">
      <Section
        eyebrow="Download"
        title="Tether Beta (APK)"
        copy="The Android beta will be available soon. For now, the installer is inactive while the first public build is prepared."
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-white/10 p-3">
              <Download className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Download APK</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              The beta package is not live yet. Once released, you will be able to install Tether directly on Android devices.
            </p>
            <div className="mt-6">
              <Button size="lg" disabled>
                Download APK
              </Button>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
              Coming soon to Google Play Store
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-white/10 p-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Installation instructions</h2>
            <ol className="mt-4 space-y-4 text-sm leading-6 text-white/65">
              <li>1. Download the APK from the official Tether site when available.</li>
              <li>2. On your Android device, enable installation from unknown sources if prompted.</li>
              <li>3. Open the downloaded file and follow the install flow.</li>
              <li>4. Verify the source before installing and only use official builds.</li>
            </ol>
          </div>
        </div>
      </Section>
    </div>
  );
}
