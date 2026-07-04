"use client";

import { useEffect, useState } from "react";

function formatElapsed(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `há ${hours}h${minutes % 60 ? ` ${minutes % 60}min` : ""}`;
}

/** Live "time since" label that re-renders every 30s without a full page refresh. */
export function useTimeSince(iso: string): string {
  const [label, setLabel] = useState(() => formatElapsed(Date.now() - new Date(iso).getTime()));

  useEffect(() => {
    const id = setInterval(() => {
      setLabel(formatElapsed(Date.now() - new Date(iso).getTime()));
    }, 30_000);
    return () => clearInterval(id);
  }, [iso]);

  return label;
}
