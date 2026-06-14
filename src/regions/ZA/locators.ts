import { RegionOverrides } from '../../common/locators/sel';

/**
 * ZA locator overrides.
 *
 * ZA is the BASE region: the common Page Objects already carry the ZA-hardened selectors, so
 * there is nothing to override here. Add an entry only if ZA ever diverges from the base — e.g.
 *   export const zaOverrides: RegionOverrides = { header: { wallet: css('#new-id') } };
 */
export const zaOverrides: RegionOverrides = {};
