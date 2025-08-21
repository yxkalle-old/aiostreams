import z from 'zod';
import { UserData } from '../db/schemas';
import { Env } from './env';
import { makeRequest } from './http';
import { createLogger } from './logger';
import { Cache } from './cache';

const DEFAULT_REASON = 'Disabled by owner of the instance';

const logger = createLogger('core');

let remotePatternCache: Cache<string, string[]> | undefined;
if (Env.REDIS_URI) {
  remotePatternCache = Cache.getInstance('remote-pattern');
}

async function fetchPatternsFromUrl(url: string): Promise<string[]> {
  try {
    if (remotePatternCache) {
      await remotePatternCache.waitUntilReady();
      const cached = await remotePatternCache.get(url);
      if (cached) {
        return cached;
      }
    }
    const response = await makeRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 1000,
    });
    if (!response.ok) {
      logger.error(
        `Failed to fetch allowed regex patterns from ${url}: ${response.status} ${response.statusText}`
      );
      return [];
    }
    const schema = z.array(
      z.object({
        name: z.string(),
        pattern: z.string(),
      })
    );
    const data = await response.json();
    const parsedData = schema.parse(data);
    const patterns = parsedData.map((item) => item.pattern);
    if (remotePatternCache) {
      await remotePatternCache.set(url, patterns, 60 * 60 * 24);
    }
    return patterns;
  } catch (error) {
    logger.error(`Error fetching or parsing patterns from ${url}:`, error);
    return [];
  }
}

export class FeatureControl {
  private static readonly _allowedRegexPatterns: Promise<{
    patterns: string[];
    description?: string;
  }> = (async () => {
    const patterns: string[] = Env.ALLOWED_REGEX_PATTERNS;
    let patternsFromUrls: string[] = [];
    if (Env.ALLOWED_REGEX_PATTERNS_URLS?.length) {
      const fetchPromises = await Promise.allSettled(
        Env.ALLOWED_REGEX_PATTERNS_URLS.map(fetchPatternsFromUrl)
      );
      patternsFromUrls = fetchPromises
        .filter(
          (result): result is PromiseFulfilledResult<string[]> =>
            result.status === 'fulfilled'
        )
        .flatMap((result) => result.value);
      logger.debug(
        `Fetched ${patternsFromUrls.length} regex patterns from URLs`
      );
    }
    const allPatterns = [...new Set([...patterns, ...patternsFromUrls])];

    return {
      patterns: allPatterns,
      description: Env.ALLOWED_REGEX_PATTERNS_DESCRIPTION,
    };
  })();

  private static readonly _disabledHosts: Map<string, string> = (() => {
    const map = new Map<string, string>();
    if (Env.DISABLED_HOSTS) {
      for (const disabledHost of Env.DISABLED_HOSTS.split(',')) {
        const [host, reason] = disabledHost.split(':');
        map.set(host, reason || DEFAULT_REASON);
      }
    }
    return map;
  })();

  private static readonly _disabledAddons: Map<string, string> = (() => {
    const map = new Map<string, string>();
    if (Env.DISABLED_ADDONS) {
      for (const disabledAddon of Env.DISABLED_ADDONS.split(',')) {
        const [addon, reason] = disabledAddon.split(':');
        map.set(addon, reason || DEFAULT_REASON);
      }
    }
    return map;
  })();

  private static readonly _disabledServices: Map<string, string> = (() => {
    const map = new Map<string, string>();
    if (Env.DISABLED_SERVICES) {
      for (const disabledService of Env.DISABLED_SERVICES.split(',')) {
        const [service, reason] = disabledService.split(':');
        map.set(service, reason || DEFAULT_REASON);
      }
    }
    return map;
  })();

  public static readonly regexFilterAccess: 'none' | 'trusted' | 'all' =
    Env.REGEX_FILTER_ACCESS;

  public static get disabledHosts() {
    return this._disabledHosts;
  }

  public static get disabledAddons() {
    return this._disabledAddons;
  }

  public static get disabledServices() {
    return this._disabledServices;
  }

  public static get allowedRegexPatterns() {
    return this._allowedRegexPatterns;
  }

  public static async isRegexAllowed(userData: UserData, regexes?: string[]) {
    const { patterns } = await this.allowedRegexPatterns;
    if (regexes && regexes.length > 0) {
      const areAllRegexesAllowed = regexes.every((regex) =>
        patterns.includes(regex)
      );
      if (areAllRegexesAllowed) {
        return true;
      }
    }
    switch (this.regexFilterAccess) {
      case 'trusted':
        return userData.trusted ?? false;
      case 'all':
        return true;
      default:
        return false;
    }
  }
}
