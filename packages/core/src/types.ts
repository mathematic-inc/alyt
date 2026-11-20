export interface AnalyticsPlugin {
  readonly identify?: (userId: string, traits?: Readonly<Record<string, unknown>>) => void;
  readonly name: string;
  readonly page?: (name?: string, params?: Readonly<Record<string, unknown>>) => void;
  readonly reset?: () => void;
  readonly track: (event: string, params?: Readonly<Record<string, unknown>>) => void;
}

export interface TrackOptions {
  readonly only?: readonly string[];
}

export interface AnalyticsClient {
  readonly addPlugin: (plugin: AnalyticsPlugin) => void;
  readonly identify: (userId: string, traits?: Readonly<Record<string, unknown>>) => void;
  readonly page: (name?: string, params?: Readonly<Record<string, unknown>>) => void;
  readonly removePlugin: (name: string) => void;
  readonly reset: () => void;
  readonly track: (
    event: string,
    params?: Readonly<Record<string, unknown>>,
    options?: TrackOptions,
  ) => void;
}

export interface AnalyticsOptions {
  readonly plugins?: readonly AnalyticsPlugin[];
}
