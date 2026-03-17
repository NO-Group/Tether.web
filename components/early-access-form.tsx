// components/early-access-form.tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { AvailabilityBadge } from "@/components/ui/availability-badge";

const reservedNames = new Set(["admin", "support", "tether", "alex", "nora", "kai"]);

function validateUsername(input: string) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(input);
}

export function EarlyAccessForm({ expanded = false }: { expanded?: boolean }) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">(
    "idle"
  );
  const [joined, setJoined] = useState(false);

  const normalized = useMemo(() => username.trim().toLowerCase(), [username]);

  const checkAvailability = async () => {
    if (!validateUsername(normalized)) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus(reservedNames.has(normalized) ? "taken" : "available");
  };

  const joinBeta = async () => {
    await checkAvailability();
    setTimeout(() => {
      if (!reservedNames.has(normalized) && validateUsername(normalized)) {
        setJoined(true);
      }
    }, 720);
  };

  return (
    <div className="rounded-3xl border border-white/10 p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/35">
              @
            </span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.replace(/\s/g, ""));
                setJoined(false);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="username"
              className="input-base pl-8"
            />
          </div>
          <AvailabilityBadge state={status} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={checkAvailability}>
            Reserve Username
          </Button>
          {expanded && <Button onClick={joinBeta}>Join Beta</Button>}
        </div>

        <p className="text-xs leading-5 text-white/40">
          3–20 characters. Letters, numbers, and underscores only.
        </p>

        {joined && status === "available" && (
          <div className="rounded-2xl border border-white/10 bg-white text-black px-4 py-3 text-sm">
            @{normalized} is reserved. You&apos;re on the beta list.
          </div>
        )}
      </div>
    </div>
  );
}
