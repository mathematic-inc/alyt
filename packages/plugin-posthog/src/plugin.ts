import type { AnalyticsPlugin } from "@alyt/core";
import type { PostHog } from "posthog-js";

export interface PostHogClient {
  readonly capture: PostHog["capture"];
  readonly identify: PostHog["identify"];
  readonly reset: PostHog["reset"];
}

export interface PostHogOptions {
  readonly apiHost?: string;
  readonly apiKey: string;
  readonly client?: PostHogClient;
}

export function posthog(options: PostHogOptions): AnalyticsPlugin {
  function getPostHog(): PostHogClient | null {
    if (options.client) {
      return options.client;
    }
    if (typeof window === "undefined") {
      return null;
    }
    const { posthog: client }: Window & { posthog?: PostHogClient } = window;
    return client ?? null;
  }

  return {
    name: "posthog",
    track(event, params) {
      getPostHog()?.capture(event, params);
    },
    identify(userId, traits) {
      getPostHog()?.identify(userId, traits);
    },
    page(name, params) {
      getPostHog()?.capture("$pageview", { page_title: name, ...params });
    },
    reset() {
      getPostHog()?.reset();
    },
  };
}
