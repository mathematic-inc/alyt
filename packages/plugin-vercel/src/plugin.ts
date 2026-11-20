import type { AnalyticsPlugin } from "@alyt/core";
import { track as vercelTrack } from "@vercel/analytics";

type Properties = NonNullable<Parameters<typeof vercelTrack>[1]>;

export interface VercelAnalyticsOptions {
  readonly client?: { readonly track: typeof vercelTrack };
}

function isPropertyValue(value: unknown): value is Properties[string] {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === undefined
  );
}

function toProperties(params: Readonly<Record<string, unknown>> | undefined) {
  if (params === undefined) {
    return undefined;
  }
  const properties: Properties = {};
  for (const [key, value] of Object.entries(params)) {
    if (isPropertyValue(value)) {
      properties[key] = value;
    }
  }
  return properties;
}

export function vercelAnalytics(options?: VercelAnalyticsOptions): AnalyticsPlugin {
  return {
    name: "vercel",
    track(event, params) {
      const trackFn = options?.client?.track ?? vercelTrack;
      trackFn(event, toProperties(params));
    },
  };
}
