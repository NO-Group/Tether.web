// components/ui/availability-badge.tsx
import { cn } from "@/lib/utils";

export function AvailabilityBadge({
  state
}: {
  state: "idle" | "checking" | "available" | "taken" | "invalid";
}) {
  const labelMap = {
    idle: "Ready to check",
    checking: "Checking...",
    available: "Available",
    taken: "Taken",
    invalid: "Invalid username"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs",
        state === "available" && "border-white bg-white text-black",
        state === "taken" && "border-white/15 text-white/55",
        state === "checking" && "border-white/15 text-white/55",
        state === "idle" && "border-white/10 text-white/40",
        state === "invalid" && "border-white/15 text-white/55"
      )}
    >
      {labelMap[state]}
    </div>
  );
}
