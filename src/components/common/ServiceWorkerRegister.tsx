"use client";

import { useEffect } from "react";

const WARM_PATHS = [
  "/",
  "/lesson/day-1",
  "/lesson/day-2",
  "/lesson/day-3",
  "/lesson/day-4",
  "/lesson/day-5",
];

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    void navigator.serviceWorker
      .register("/sw.js")
      .then(async () => {
        await navigator.serviceWorker.ready;
        if (cancelled || !navigator.onLine) return;
        await Promise.all(
          WARM_PATHS.map((path) => fetch(path).catch(() => undefined)),
        );
      })
      .catch(() => {
        // SW optional — app still works online
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
