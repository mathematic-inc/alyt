"use client";

import { GAScript } from "@alyt/plugin-ga/react";
import { AnalyticsProvider } from "@alyt/react";

import { analytics } from "../lib/analytics";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GAScript measurementId="G-XXXXXXXXXX" />
      <AnalyticsProvider client={analytics}>{children}</AnalyticsProvider>
    </>
  );
}
