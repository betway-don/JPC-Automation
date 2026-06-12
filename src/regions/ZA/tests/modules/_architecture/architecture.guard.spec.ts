import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Architecture guard — enforces the enterprise POM rule: NO raw selectors in the hardened
 * *NewSuite.shared.ts test files. Every element must be reached through a Page Object or
 * Component Object. If this fails, move the selector into the relevant Page/Component Object
 * and reference it from the test.
 *
 * explorer.shared.ts is intentionally exempt — it is a site crawler, selector-driven by nature.
 */

const SUITES_DIR = path.resolve(__dirname, '../../../../../common/tests');

// raw element-selector calls that must not appear in a spec
const FORBIDDEN = [
    /\bpage\.locator\(/,
    /\bpage\.getByRole\(/,
    /\bpage\.getByText\(/,
    /\bpage\.getByLabel\(/,
    /\bpage\.getByPlaceholder\(/,
    /\bpage\.getByTitle\(/,
    /\.locators\.[A-Za-z0-9_]+\.(locator|getByRole|getByText|getByLabel)\(/,
];

test.describe('Architecture guard', () => {
    test('no raw selectors in *NewSuite.shared.ts test files', () => {
        const files = fs.readdirSync(SUITES_DIR).filter(f => f.endsWith('NewSuite.shared.ts'));
        expect(files.length, 'expected to find NewSuite test files to scan').toBeGreaterThan(0);

        const violations: string[] = [];
        for (const file of files) {
            const lines = fs.readFileSync(path.join(SUITES_DIR, file), 'utf-8').split('\n');
            lines.forEach((line, i) => {
                if (line.trim().startsWith('//')) return; // skip comments
                if (FORBIDDEN.some(rx => rx.test(line))) {
                    violations.push(`${file}:${i + 1}  ${line.trim().slice(0, 100)}`);
                }
            });
        }

        expect(
            violations,
            `Raw selectors found in test files — move them into a Page Object / Component Object:\n${violations.join('\n')}`,
        ).toEqual([]);
    });
});
