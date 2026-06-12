import { Page, TestInfo, TestType, expect } from '@playwright/test';

/**
 * Site explorer — proactive bug hunting.
 *
 * Unlike the feature suites (which assert specific behaviors), the explorer crawls page
 * families and checks every page for cross-cutting invariants nobody writes per-page tests for:
 *   - broken images (visible <img> whose source failed to load)
 *   - failed first-party requests (HTTP >= 400 on jackpotcity/jpc.africa)
 *   - uncaught JS page errors
 *   - error-page content rendered where real content should be
 *   - raw i18n keys leaking into visible text (e.g. "twitter-game-share-text")
 *
 * Findings fail the test with a readable summary and a JSON attachment for the report.
 */

type ExplorerFixtures = {
    page: Page;
    screenshotDir: string;
    testData: any;
};

/** Persistent, already-reported issues that must not drown out NEW findings. Prune as they get fixed. */
const KNOWN_ISSUES: RegExp[] = [
    /ttq is not defined/i,            // TikTok pixel loaded without its loader — site-wide, reported
    /Uncaught \[object Object\]/i,    // persistent unidentified rejection on game pages — reported
];

const FIRST_PARTY = /jackpotcity\.co\.za|jpc\.africa/i;

/** Tokens that look like i18n keys but legitimately appear in page text. */
const I18N_ALLOWLIST = new Set(['terms-and-conditions', 'privacy-policy', 'responsible-gambling', 'get-the-app', 'contact-us', 'how-to', 'e-mail', 'opt-in', 'opt-out', 'sign-up', 'log-in', 't-cs']);

interface Finding {
    page: string;
    kind: 'broken-image' | 'failed-request' | 'page-error' | 'error-page' | 'i18n-key' | 'console-error';
    detail: string;
}

function isKnown(text: string): boolean {
    return KNOWN_ISSUES.some(rx => rx.test(text));
}

class PageInspector {
    findings: Finding[] = [];
    softFindings: Finding[] = [];
    private currentUrl = '';

    constructor(private page: Page) {
        page.on('pageerror', err => {
            const text = String(err).slice(0, 300);
            if (!isKnown(text)) this.findings.push({ page: this.currentUrl, kind: 'page-error', detail: text });
        });
        page.on('console', msg => {
            if (msg.type() !== 'error') return;
            const text = msg.text().slice(0, 300);
            if (!isKnown(text)) this.softFindings.push({ page: this.currentUrl, kind: 'console-error', detail: text });
        });
        page.on('response', resp => {
            try {
                const url = resp.url();
                if (resp.status() >= 400 && FIRST_PARTY.test(url)) {
                    const finding: Finding = { page: this.currentUrl, kind: 'failed-request', detail: `${resp.status()} ${url.slice(0, 200)}` };
                    // 401s are expected when logged out (game pages probe authenticated launch/playtime
                    // endpoints and fall back) — record but don't fail on them
                    if (resp.status() === 401) this.softFindings.push(finding);
                    else this.findings.push(finding);
                }
            } catch { /* response may be gone */ }
        });
    }

    async visit(url: string) {
        this.currentUrl = url;
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(3000);

        // broken images: visible, finished loading, but no pixels.
        // First-party only — third-party tracking pixels legitimately return no image data.
        const broken = await this.page.evaluate(() =>
            Array.from(document.images)
                .filter(img => img.offsetWidth > 0 && img.complete && img.naturalWidth === 0 && !!img.getAttribute('src'))
                .map(img => (img.currentSrc || img.src || '').slice(0, 180))
                .filter(src => /jackpotcity\.co\.za|jpc\.africa|^\/|^data:/i.test(src)));
        for (const src of broken) this.findings.push({ page: url, kind: 'broken-image', detail: src });

        // error-page content where real content should be
        const bodyText = await this.page.evaluate(() => document.body.innerText.slice(0, 5000));
        if (/page not found|something went wrong|an error occurred/i.test(bodyText)) {
            this.findings.push({ page: url, kind: 'error-page', detail: bodyText.match(/.{0,80}(page not found|something went wrong|an error occurred).{0,40}/i)?.[0] ?? 'error text' });
        }

        // raw i18n keys leaking into visible text. Real keys have 4+ kebab segments
        // (e.g. "twitter-game-share-text"); 3-segment tokens are usually legitimate English
        // compounds ("easy-to-learn", "chock-a-block") so they don't fail the run.
        const keyish = bodyText.match(/\b[a-z][a-z0-9]*(?:-[a-z0-9]+){3,}\b/g) ?? [];
        for (const token of new Set(keyish)) {
            if (!I18N_ALLOWLIST.has(token) && !url.includes(token)) {
                this.findings.push({ page: url, kind: 'i18n-key', detail: token });
            }
        }
    }

    async report(testInfo: TestInfo, label: string) {
        // identical failures repeat across retries/polls — dedupe for a readable report
        const seen = new Set<string>();
        this.findings = this.findings.filter(f => {
            const k = `${f.page}|${f.kind}|${f.detail}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });
        if (this.findings.length || this.softFindings.length) {
            await testInfo.attach(`explorer-${label}`, {
                body: JSON.stringify({ findings: this.findings, softFindings: this.softFindings }, null, 2),
                contentType: 'application/json',
            });
        }
        const summary = this.findings
            .map(f => `[${f.kind}] ${f.page}\n    ${f.detail}`)
            .join('\n');
        expect(this.findings, `Explorer findings on ${label}:\n${summary}`).toEqual([]);
    }
}

export async function runExplorerTests(test: TestType<ExplorerFixtures, any>) {

    test.describe('Site Explorer', () => {

        test('EX-001 - content & vertical pages are healthy', async ({ page }: ExplorerFixtures, testInfo: TestInfo) => {
            test.setTimeout(420000);
            const inspector = new PageInspector(page);
            const pages = [
                '/privacy-policy', '/contact-us', '/terms-and-conditions', '/faq',
                '/responsible-gambling', '/get-the-app', '/about-us', '/paia-manual', '/how-to',
                '/blog', '/winners', '/new-games', '/crashgames', '/quickgames',
                '/betgames', '/luckynumbers', '/spingames', '/livegames',
            ];
            for (const p of pages) await inspector.visit(p);
            await inspector.report(testInfo, 'content-pages');
        });

        test('EX-002 - every promotion detail page is healthy', async ({ page }: ExplorerFixtures, testInfo: TestInfo) => {
            test.setTimeout(420000);
            const inspector = new PageInspector(page);
            await page.goto('/promotions', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(3000);
            const hrefs = await page.locator('div.tabs-content a[href^="/promotions/"]:visible').evaluateAll(
                (els: Element[]) => [...new Set(els.map(e => (e.getAttribute('href') || '').split('?')[0]))]);
            console.log(`[explorer] visiting ${Math.min(hrefs.length, 20)} of ${hrefs.length} promo pages`);
            for (const href of hrefs.slice(0, 20)) await inspector.visit(href);
            await inspector.report(testInfo, 'promotions');
        });

        test('EX-003 - provider pages are healthy', async ({ page }: ExplorerFixtures, testInfo: TestInfo) => {
            test.setTimeout(420000);
            const inspector = new PageInspector(page);
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(3000);
            const hrefs = await page.locator('a.provider-card').evaluateAll(
                (els: Element[]) => [...new Set(els.map(e => (e.getAttribute('href') || '').split('?')[0]))]);
            console.log(`[explorer] visiting ${Math.min(hrefs.length, 12)} of ${hrefs.length} provider pages`);
            for (const href of hrefs.slice(0, 12)) await inspector.visit(href);
            await inspector.report(testInfo, 'providers');
        });

        test('EX-004 - sampled game pages are healthy (logged out)', async ({ page }: ExplorerFixtures, testInfo: TestInfo) => {
            test.setTimeout(420000);
            const inspector = new PageInspector(page);
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(3000);
            const hrefs = await page.locator('a.game-card[href^="/home/"]').evaluateAll(
                (els: Element[]) => [...new Set(els.map(e => (e.getAttribute('href') || '').split('?')[0]))]);
            console.log(`[explorer] visiting ${Math.min(hrefs.length, 8)} of ${hrefs.length} game pages`);
            for (const href of hrefs.slice(0, 8)) await inspector.visit(href);
            await inspector.report(testInfo, 'game-pages');
        });

    });
}
