import type { AnalyticsPlugin } from "@alyt/core";
import type { OverridedMixpanel } from "mixpanel-browser";

export interface MixpanelClient {
  readonly identify: OverridedMixpanel["identify"];
  readonly people: { readonly set: OverridedMixpanel["people"]["set"] };
  readonly reset: OverridedMixpanel["reset"];
  readonly track: OverridedMixpanel["track"];
  readonly track_pageview: OverridedMixpanel["track_pageview"];
}

export interface MixpanelOptions {
  readonly client?: MixpanelClient;
  readonly token: string;
}

export function mixpanel(options: MixpanelOptions): AnalyticsPlugin {
  function getMixpanel(): MixpanelClient | null {
    if (options.client) {
      return options.client;
    }
    if (typeof window === "undefined") {
      return null;
    }
    const { mixpanel: client }: Window & { mixpanel?: MixpanelClient } = window;
    return client ?? null;
  }

  return {
    name: "mixpanel",
    track(event, params) {
      getMixpanel()?.track(event, params);
    },
    identify(userId, traits) {
      const mp = getMixpanel();
      mp?.identify(userId);
      if (traits) {
        mp?.people.set(traits);
      }
    },
    page(name, params) {
      getMixpanel()?.track_pageview({ page: name, ...params });
    },
    reset() {
      getMixpanel()?.reset();
    },
  };
}
