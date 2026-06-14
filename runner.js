/**
 * JPC test runner + report builder.
 *
 * Runs a suite (regression | smoke) across one or more regions and produces, per run:
 *
 *   reports/<timestamp>/<suite>/<REGION>/
 *       <REGION>-<suite>-report.pdf      ← printable pass/fail report of every test
 *       screenshots/<NN>_<test title>.png ← one image per test, named by test case
 *
 * Run folders older than RETENTION_DAYS (7) are pruned automatically.
 *
 * Usage:
 *   node runner.js --suite=regression --region=all
 *   node runner.js --suite=smoke      --region=za
 *   node runner.js --suite=regression --region=za --grep="GS-LO-001"   (narrow to one/few)
 *   node runner.js --suite=smoke      --region=za --spec=<path>         (explicit spec path)
 *   node runner.js --region=za --spec=<path>                            (ad-hoc, no report)
 *
 * Flags: --suite=regression|smoke  --region=za|gh|tz|mw|all  --grep=<regex>
 *        --spec=<path>  --mode=desktop|android  (+ any extra Playwright flags pass through)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RETENTION_DAYS = 7;
const ALL_REGIONS = ['za', 'gh', 'tz'];          // mw is geo-blocked from our location → opt-in only
const VALID_REGIONS = ['za', 'gh', 'tz', 'mw'];
// Modules excluded from a "regression" run (smoke is its own suite; these are tooling/non-functional).
const REGRESSION_EXCLUDE = new Set(['smoke', '_architecture', 'explorer']);

// ── arg parsing ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const params = {};
const extraArgs = [];
const runnerKeys = ['region', 'mode', 'spec', 'grep', 'suite'];
args.forEach(arg => {
    if (arg.startsWith('--')) {
        const key = arg.slice(2).split('=')[0];
        if (runnerKeys.includes(key)) params[key] = arg.slice(2).split('=')[1] || true;
        else extraArgs.push(arg);
    } else if (!params.spec) {
        params.spec = arg;
    } else {
        extraArgs.push(arg);
    }
});

const suite = (params.suite || '').toLowerCase();          // 'regression' | 'smoke' | ''
const mode = (params.mode || 'desktop').toLowerCase();
const grep = params.grep || '';
const reportMode = suite === 'regression' || suite === 'smoke';

// Resolve the list of regions to run.
let regions;
const regionArg = (params.region || '').toLowerCase();
if (regionArg === 'all') regions = ALL_REGIONS.slice();
else if (VALID_REGIONS.includes(regionArg)) regions = [regionArg];
else {
    console.error(`\x1b[31mError: use --region=<${VALID_REGIONS.join('|')}|all>\x1b[0m`);
    process.exit(1);
}
if (reportMode && regionArg === 'all') {
    console.log('\x1b[36m[Note] "all" runs za, gh, tz. MW is geo-blocked here — add --region=mw explicitly to attempt it.\x1b[0m');
}

// ── helpers ──────────────────────────────────────────────────────────────────────
const sanitize = (s) => (s || 'untitled').replace(/[^a-z0-9._-]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 120);

/** Flatten the Playwright JSON report into a list of {title, status, duration, error, shots}. */
function collectSpecs(rootSuites) {
    const out = [];
    const walk = (s, trail) => {
        const here = [...trail, s.title].filter(Boolean);
        (s.specs || []).forEach(spec => {
            const t = (spec.tests && spec.tests[0]) || {};
            const results = t.results || [];
            const last = results[results.length - 1] || {};
            const shots = (last.attachments || []).filter(a => a.name === 'screenshot' && a.path && fs.existsSync(a.path));
            out.push({
                title: spec.title,
                fullTitle: [...here, spec.title].join(' › '),
                status: t.status || (last.status === 'passed' ? 'expected' : last.status || 'unknown'),
                rawStatus: last.status || 'unknown',
                duration: last.duration || 0,
                error: (last.errors && last.errors[0] && last.errors[0].message) || (last.error && last.error.message) || '',
                shots,
            });
        });
        (s.suites || []).forEach(ss => walk(ss, here));
    };
    (rootSuites || []).forEach(s => walk(s, []));
    return out;
}

const STATUS_META = {
    expected: { label: 'PASS', color: '#1a7f37', bg: '#e6f4ea' },
    unexpected: { label: 'FAIL', color: '#b3261e', bg: '#fce8e6' },
    flaky: { label: 'FLAKY', color: '#9a6700', bg: '#fff4e5' },
    skipped: { label: 'SKIPPED', color: '#5f6368', bg: '#f1f3f4' },
    unknown: { label: 'UNKNOWN', color: '#5f6368', bg: '#f1f3f4' },
};
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildHtml({ region, suite, runStamp, specs }) {
    const counts = { expected: 0, unexpected: 0, flaky: 0, skipped: 0, unknown: 0 };
    specs.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
    const total = specs.length;
    const ran = total - counts.skipped;
    const passRate = ran ? Math.round((counts.expected / ran) * 100) : 0;

    const rows = specs.map((s, i) => {
        const m = STATUS_META[s.status] || STATUS_META.unknown;
        const img = s.shotFile ? `<img class="shot" src="screenshots/${esc(s.shotFile)}"/>` : '<span class="noshot">—</span>';
        const err = s.error ? `<div class="err">${esc(s.error.split('\n').slice(0, 4).join('\n')).slice(0, 600)}</div>` : '';
        return `<tr>
            <td class="idx">${i + 1}</td>
            <td class="title">${esc(s.title)}${err}</td>
            <td><span class="badge" style="color:${m.color};background:${m.bg}">${m.label}</span></td>
            <td class="dur">${(s.duration / 1000).toFixed(1)}s</td>
            <td class="shotcell">${img}</td>
        </tr>`;
    }).join('\n');

    return `<!doctype html><html><head><meta charset="utf-8"><style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #202124; margin: 0; padding: 24px; }
        h1 { font-size: 20px; margin: 0 0 2px; }
        .sub { color: #5f6368; font-size: 12px; margin-bottom: 16px; }
        .summary { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
        .pill { border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
        th { text-align: left; background: #f8f9fa; border-bottom: 2px solid #dadce0; padding: 7px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .3px; color: #5f6368; }
        td { border-bottom: 1px solid #eceff1; padding: 7px 8px; vertical-align: top; }
        .idx { color: #9aa0a6; width: 28px; }
        .title { font-weight: 600; max-width: 360px; }
        .badge { padding: 2px 8px; border-radius: 10px; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
        .dur { color: #5f6368; white-space: nowrap; }
        .err { font-weight: 400; color: #b3261e; font-size: 10px; white-space: pre-wrap; margin-top: 4px; font-family: Consolas, monospace; }
        .shotcell { width: 180px; }
        .shot { width: 170px; border: 1px solid #dadce0; border-radius: 4px; }
        .noshot { color: #bdc1c6; }
        tr { break-inside: avoid; }
    </style></head><body>
        <h1>JackpotCity — ${esc(region.toUpperCase())} — ${esc(suite)} report</h1>
        <div class="sub">Run: ${esc(runStamp)} &nbsp;•&nbsp; ${total} test cases</div>
        <div class="summary">
            <span class="pill" style="background:#e6f4ea;color:#1a7f37">Passed ${counts.expected}</span>
            <span class="pill" style="background:#fce8e6;color:#b3261e">Failed ${counts.unexpected}</span>
            <span class="pill" style="background:#fff4e5;color:#9a6700">Flaky ${counts.flaky}</span>
            <span class="pill" style="background:#f1f3f4;color:#5f6368">Skipped ${counts.skipped}</span>
            <span class="pill" style="background:#e8f0fe;color:#1967d2">Pass rate ${passRate}%</span>
        </div>
        <table>
            <thead><tr><th>#</th><th>Test case</th><th>Status</th><th>Time</th><th>Screenshot</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    </body></html>`;
}

async function buildPdf(htmlPath, pdfPath) {
    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '8mm', right: '8mm' } });
    } finally {
        await browser.close();
    }
}

function pruneOldRuns(reportsRoot) {
    if (!fs.existsSync(reportsRoot)) return;
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    for (const name of fs.readdirSync(reportsRoot)) {
        const p = path.join(reportsRoot, name);
        try {
            const st = fs.statSync(p);
            if (st.isDirectory() && st.mtimeMs < cutoff) {
                fs.rmSync(p, { recursive: true, force: true });
                console.log(`\x1b[90m[prune] removed run older than ${RETENTION_DAYS}d: ${name}\x1b[0m`);
            }
        } catch { /* ignore */ }
    }
}

/** Resolve the spec path(s) for a region+suite. Playwright CLI path filters need forward slashes. */
function specPathsFor(region, suiteName) {
    const modulesDir = `src/regions/${region.toUpperCase()}/tests/modules`;
    if (params.spec) return [String(params.spec).replace(/\\/g, '/')];
    if (suiteName === 'smoke') return [`${modulesDir}/smoke`];
    if (suiteName === 'regression') {
        const abs = path.join(__dirname, 'src', 'regions', region.toUpperCase(), 'tests', 'modules');
        if (!fs.existsSync(abs)) return [modulesDir];
        return fs.readdirSync(abs)
            .filter(d => fs.statSync(path.join(abs, d)).isDirectory() && !REGRESSION_EXCLUDE.has(d))
            .map(d => `${modulesDir}/${d}`);
    }
    return [];
}

// ── per-region run ────────────────────────────────────────────────────────────────
function runRegion(region, suiteName, runDir) {
    const configPath = `playwright.${region.toUpperCase()}.config.ts`;
    const projectName = `${region.toUpperCase()} Region`;
    const regionDir = path.join(runDir, suiteName, region.toUpperCase());
    const shotsDir = path.join(regionDir, 'screenshots');
    fs.mkdirSync(shotsDir, { recursive: true });
    const jsonPath = path.join(regionDir, '_results.json');

    const specs = specPathsFor(region, suiteName);
    let command = `npx playwright test ${specs.join(' ')} --config=${configPath} --project="${projectName}" --reporter=list,json`;
    if (grep) command += ` -g "${grep}"`;
    if (extraArgs.length) command += ` ${extraArgs.join(' ')}`;

    console.log(`\n\x1b[36m════ ${region.toUpperCase()} • ${suiteName} ════\x1b[0m`);
    console.log(`\x1b[33m[exec] ${command}\x1b[0m`);

    const childEnv = {
        ...process.env,
        PLAYWRIGHT_JSON_OUTPUT_NAME: jsonPath,
        ANDROID_DEVICE: mode === 'android' ? 'true' : undefined,
    };
    try {
        execSync(command, { stdio: 'inherit', env: childEnv });
    } catch {
        // Non-zero exit just means some tests failed — keep going and still build the report.
        console.log(`\x1b[90m[${region.toUpperCase()}] run finished with failures (report will reflect them).\x1b[0m`);
    }
    return { regionDir, shotsDir, jsonPath };
}

async function buildRegionReport(region, suiteName, runStamp, { regionDir, shotsDir, jsonPath }) {
    if (!fs.existsSync(jsonPath)) {
        console.log(`\x1b[31m[${region.toUpperCase()}] no JSON results produced — skipping report.\x1b[0m`);
        return null;
    }
    const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const specs = collectSpecs(report.suites);

    // Copy + rename one screenshot per test into the screenshots folder.
    specs.forEach((s, i) => {
        if (!s.shots.length) return;
        const base = `${String(i + 1).padStart(3, '0')}_${sanitize(s.title)}`;
        s.shots.forEach((shot, k) => {
            const fname = (k === 0 ? base : `${base}_${k + 1}`) + path.extname(shot.path || '.png');
            try { fs.copyFileSync(shot.path, path.join(shotsDir, fname)); if (k === 0) s.shotFile = fname; }
            catch { /* ignore copy errors */ }
        });
    });

    const html = buildHtml({ region, suite: suiteName, runStamp, specs });
    const htmlPath = path.join(regionDir, '_report.html');
    fs.writeFileSync(htmlPath, html);
    const pdfPath = path.join(regionDir, `${region.toUpperCase()}-${suiteName}-report.pdf`);
    await buildPdf(htmlPath, pdfPath);

    // tidy: keep only the PDF + screenshots/
    try { fs.unlinkSync(htmlPath); } catch { }
    try { fs.unlinkSync(jsonPath); } catch { }

    const pass = specs.filter(s => s.status === 'expected').length;
    const fail = specs.filter(s => s.status === 'unexpected').length;
    const skip = specs.filter(s => s.status === 'skipped').length;
    console.log(`\x1b[32m[${region.toUpperCase()}] report → ${pdfPath}  (${pass} pass / ${fail} fail / ${skip} skipped, ${specs.length} total)\x1b[0m`);
    return { pdfPath, pass, fail, skip, total: specs.length };
}

// ── main ───────────────────────────────────────────────────────────────────────────
(async () => {
    // Ad-hoc mode (no --suite): behave like the old runner — single region run, no report.
    if (!reportMode) {
        const region = regions[0];
        const configPath = `playwright.${region.toUpperCase()}.config.ts`;
        let command = `npx playwright test`;
        if (params.spec) command += ` ${params.spec}`;
        command += ` --config=${configPath} --project="${region.toUpperCase()} Region"`;
        if (grep) command += ` -g "${grep}"`;
        if (extraArgs.length) command += ` ${extraArgs.join(' ')}`;
        console.log(`\x1b[33m[exec] ${command}\x1b[0m`);
        try { execSync(command, { stdio: 'inherit', env: { ...process.env, ANDROID_DEVICE: mode === 'android' ? 'true' : undefined } }); }
        catch { process.exit(1); }
        return;
    }

    const reportsRoot = path.join(__dirname, 'reports');
    pruneOldRuns(reportsRoot);
    const runStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');
    const runDir = path.join(reportsRoot, runStamp);
    fs.mkdirSync(runDir, { recursive: true });

    console.log(`\x1b[36m[Runner] suite=${suite} regions=${regions.join(',')} → reports/${runStamp}/${suite}/<REGION>/\x1b[0m`);
    const summary = [];
    for (const region of regions) {
        const paths = runRegion(region, suite, runDir);
        const res = await buildRegionReport(region, suite, runStamp, paths);
        if (res) summary.push({ region: region.toUpperCase(), ...res });
    }

    console.log(`\n\x1b[36m════ Summary (${suite}) ════\x1b[0m`);
    summary.forEach(s => console.log(`  ${s.region}: ${s.pass} pass / ${s.fail} fail / ${s.skip} skipped`));
    console.log(`\x1b[36mReports under: ${runDir}\x1b[0m`);
})();
