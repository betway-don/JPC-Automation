import { Page, Locator } from '@playwright/test';

/**
 * A **selector definition**: a tiny function that resolves to a Playwright Locator against a
 * page (or a parent Locator, for scoped lookups). Selectors are declared as data — `css('...')`,
 * `role('button', { name: 'Login' })` — so they are:
 *   • the single source of truth (a Page Object's `loc` map is the ONLY place its selectors live),
 *   • region-overridable (a region supplies a partial map of the same shape — see regionOverrides),
 *   • resolved lazily against the live page when the Page Object is constructed.
 *
 * Builders below mirror every Playwright locator strategy. Compose with `at()` / `within()`.
 */
export type Sel = (root: Page | Locator) => Locator;

/** A named group of selectors for one page/component (e.g. all "header" selectors). */
export type LocatorMap = Record<string, Sel>;

/** Region override shape: page-group key → partial selector map that wins over the base. */
export type RegionOverrides = Record<string, LocatorMap>;

// ── primitive strategies ──────────────────────────────────────────────────────
export const css = (selector: string): Sel => (root) => root.locator(selector);
export const id = (elementId: string): Sel => (root) => root.locator(`#${elementId}`);
export const xpath = (expression: string): Sel => (root) => root.locator(`xpath=${expression}`);

type RoleName = Parameters<Page['getByRole']>[0];
type RoleOpts = Parameters<Page['getByRole']>[1];
export const role = (name: RoleName, opts?: RoleOpts): Sel => (root) => root.getByRole(name, opts);

export const text = (value: string | RegExp, opts?: { exact?: boolean }): Sel => (root) => root.getByText(value, opts);
export const label = (value: string | RegExp, opts?: { exact?: boolean }): Sel => (root) => root.getByLabel(value, opts);
export const placeholder = (value: string | RegExp): Sel => (root) => root.getByPlaceholder(value);
export const title = (value: string | RegExp, opts?: { exact?: boolean }): Sel => (root) => root.getByTitle(value, opts);

// ── composition ────────────────────────────────────────────────────────────────
/** The nth match (0-based) of another selector. */
export const at = (sel: Sel, index: number): Sel => (root) => sel(root).nth(index);
/** The first match of another selector. */
export const first = (sel: Sel): Sel => (root) => sel(root).first();
/** Resolve `child` scoped inside `parent`. */
export const within = (parent: Sel, child: Sel): Sel => (root) => child(parent(root));
/** Filter a selector by visible text. */
export const withText = (sel: Sel, value: string | RegExp): Sel => (root) => sel(root).filter({ hasText: value });
/** Either of two selectors (Playwright `.or()`). */
export const or = (a: Sel, b: Sel): Sel => (root) => a(root).or(b(root));
