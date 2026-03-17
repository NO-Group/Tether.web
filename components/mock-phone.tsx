// components/mock-phone.tsx
"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

type Mode = "username" | "search" | "chat";

export function MockPhone({ mode }: { mode: Mode }) {
  return (
    <motion.div
      className="surface relative w-[280px] rounded-[34px] border border-white/12 p-3 shadow-soft"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="mb-3 flex justify-center">
        <div className="h-1.5 w-24 rounded-full bg-white/20" />
      </div>

      <div className="overflow-hidden rounded-[26px] border border-white/10 p-3">
        {mode === "username" && (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Profile</p>
            <div className="mt-4 rounded-3xl border border-white/10 p-4">
              <div className="h-14 w-14 rounded-full border border-white/15" />
              <p className="mt-4 text-base font-medium">@alex</p>
              <p className="mt-1 text-sm text-white/50">Reserved identity</p>
              <div className="mt-4 flex gap-2">
                <div className="rounded-full bg-white px-3 py-2 text-xs text-black">Claimed</div>
                <div className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/60">
                  Public handle
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "search" && (
          <div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-white/45" />
              <span className="text-sm text-white/35">Search usernames</span>
            </div>
            <div className="mt-4 space-y-2">
              {["@nora", "@kai", "@miles", "@sora"].map((user) => (
                <div
                  key={user}
                  className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3"
                >
                  <span className="text-sm">{user}</span>
                  <span className="text-xs text-white/45">available</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "chat" && (
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                Fast enough to feel invisible.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-black">
                That&apos;s the point.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                Usernames make it simple.
              </div>
            </div>
            <div className="mt-6 rounded-full border border-white/10 px-4 py-3 text-sm text-white/35">
              Message
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
