"use client";

import { useTimeSince } from "@/hooks/useTimeSince";

export function UpdatedAgo({ iso }: { iso: string }) {
  const label = useTimeSince(iso);
  return <>{label}</>;
}
