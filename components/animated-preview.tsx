// components/animated-preview.tsx
"use client";

import { motion } from "framer-motion";

const messages = [
  { id: 1, side: "left", text: "Hey, is this @nora?" },
  { id: 2, side: "right", text: "Yep. Found me on Tether?" },
  { id: 3, side: "left", text: "No phone number needed." },
  { id: 4, side: "right", text: "Exactly." }
] as const;

export function AnimatedPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[460px]"
    >
      <div className="hero-glow absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="surface relative overflow-hidden rounded-[32px] border border-white/12 p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-medium">@nora</p>
            <p className="text-xs text-white/45">online now</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="text-xs text-white/45">live</span>
          </div>
        </div>

        <div className="space-y-3 rounded-[26px] border border-white/10 p-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.22 + 0.2, duration: 0.35 }}
              className={`flex ${message.side === "right" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.side === "right"
                    ? "bg-white text-black"
                    : "border border-white/12 bg-white/[0.03] text-white"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}

          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-white" />
                <span
                  className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-white"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-white"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/35">
          Message @nora
        </div>
      </div>
    </motion.div>
  );
}
