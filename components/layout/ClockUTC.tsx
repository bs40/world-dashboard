"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const id = setInterval(onStoreChange, 1000);
  return () => clearInterval(id);
}

// Snapshot is a primitive (whole seconds) so identical values skip re-renders.
const getSnapshot = () => Math.floor(Date.now() / 1000);
// Server snapshot is 0 → placeholder markup, replaced after hydration.
const getServerSnapshot = () => 0;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function ClockUTC() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let time = "--:--:-- UTC";
  let date = "";
  if (seconds > 0) {
    const now = new Date(seconds * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
    date = `${MONTHS[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
  }

  return (
    <div className="numeric hidden text-right leading-tight md:block" aria-live="off">
      <div className="text-sm text-frost">{time}</div>
      <div className="label-caps-sm text-steel">{date || " "}</div>
    </div>
  );
}
