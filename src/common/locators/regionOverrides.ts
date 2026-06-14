import { RegionOverrides, LocatorMap } from './sel';
import { zaOverrides } from '../../regions/ZA/locators';
import { ghOverrides } from '../../regions/GH/locators';
import { mwOverrides } from '../../regions/MW/locators';
import { tzOverrides } from '../../regions/TZ/locators';

/**
 * Region selector overrides registry.
 *
 * Each region exports a partial {@link RegionOverrides} map (page-group → selector map). The active
 * region is chosen by the `JPC_REGION` env var that every playwright.<REGION>.config.ts sets; when
 * unset we default to ZA (the base). A Page Object resolves its selectors via BasePage.build(),
 * which merges `overridesForPage(pageKey)` over the PO's own base map — so a region only needs to
 * declare the keys where its markup actually differs.
 */
const REGIONS: Record<string, RegionOverrides> = {
    ZA: zaOverrides,
    GH: ghOverrides,
    MW: mwOverrides,
    TZ: tzOverrides,
};

export function overridesForPage(pageKey: string): LocatorMap {
    const region = process.env.JPC_REGION || 'ZA';
    return (REGIONS[region] || {})[pageKey] || {};
}
