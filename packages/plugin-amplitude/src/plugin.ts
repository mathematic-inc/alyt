import type { AnalyticsPlugin } from "@alyt/core";
import type { AmplitudeBrowser } from "@amplitude/analytics-browser";

export interface AmplitudeClient {
  readonly reset: AmplitudeBrowser["reset"];
  readonly setUserId: AmplitudeBrowser["setUserId"];
  readonly track: AmplitudeBrowser["track"];
}

export interface AmplitudeOptions {
  readonly apiKey: string;
  readonly client?: AmplitudeClient;
}

export function amplitude(options: AmplitudeOptions): AnalyticsPlugin {
  function getAmplitude(): AmplitudeClient | null {
    if (options.client) {
      return options.client;
    }
    if (typeof window === "undefined") {
      return null;
    }
    const { amplitude: client }: Window & { amplitude?: AmplitudeClient } = window;
    return client ?? null;
  }

  return {
    name: "amplitude",
    track(event, params) {
      getAmplitude()?.track(event, params);
    },
    identify(userId) {
      getAmplitude()?.setUserId(userId);
    },
    page(name, params) {
      getAmplitude()?.track("Page View", { page_title: name, ...params });
    },
    reset() {
      getAmplitude()?.reset();
    },
  };
}
