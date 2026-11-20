import type { AnalyticsPlugin } from "@alyt/core";

export type PlausibleClient = (
  event: string,
  options?: { readonly props?: Readonly<Record<string, unknown>> },
) => void;

export interface PlausibleOptions {
  readonly apiHost?: string;
  readonly client?: PlausibleClient;
  readonly domain: string;
}

export function plausible(options: PlausibleOptions): AnalyticsPlugin {
  function getPlausible(): PlausibleClient | null {
    if (options.client) {
      return options.client;
    }
    if (typeof window === "undefined") {
      return null;
    }
    const { plausible: client }: Window & { plausible?: PlausibleClient } = window;
    return client ?? null;
  }

  return {
    name: "plausible",
    track(event, params) {
      getPlausible()?.(event, params ? { props: params } : undefined);
    },
  };
}
