import * as fs from 'fs';
import * as path from 'path';
import { LocatorConfig } from './excelReader';

const GLOBAL_LOCATORS_PATH = path.resolve(process.cwd(), 'src/global/locators/locators.json');

function parseEntry(entry: any): LocatorConfig | null {
    if (!entry || !entry.key) return null;

    let options: Record<string, any> = {};
    if (typeof entry.options === 'string') {
        try { options = JSON.parse(entry.options); } catch { options = {}; }
    } else if (entry.options && typeof entry.options === 'object') {
        options = entry.options;
    }

    return {
        key: entry.key,
        type: entry.type,
        value: String(entry.value ?? ''),
        options,
        nth: entry.nth !== undefined && entry.nth !== null && entry.nth !== ''
            ? Number(entry.nth)
            : undefined,
    };
}

function loadFromFile(filePath: string, pageName: string): Record<string, LocatorConfig> {
    if (!fs.existsSync(filePath)) return {};
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const entries: any[] = raw[pageName] ?? [];
    const result: Record<string, LocatorConfig> = {};
    for (const entry of entries) {
        const parsed = parseEntry(entry);
        if (parsed) result[parsed.key] = parsed;
    }
    return result;
}

/**
 * Loads locators for a given page from the central JSON file.
 * An optional regional override path can be provided — entries in the
 * override file are merged on top of the global definitions (same key wins).
 *
 * Regional override files live at:
 *   src/regions/<REGION>/locators/locators.json
 * and follow the same structure as the global file.
 */
export function loadLocatorsFromJson(
    pageName: string,
    overridePath?: string
): Record<string, LocatorConfig> {
    const global = loadFromFile(GLOBAL_LOCATORS_PATH, pageName);

    if (overridePath) {
        const override = loadFromFile(path.resolve(process.cwd(), overridePath), pageName);
        return { ...global, ...override };
    }

    return global;
}
