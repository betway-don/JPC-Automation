const { execSync } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
const extraArgs = [];
const runnerKeys = ['region', 'mode', 'spec', 'grep'];

args.forEach(arg => {
    if (arg.startsWith('--')) {
        const key = arg.slice(2).split('=')[0];
        if (runnerKeys.includes(key)) {
            const value = arg.slice(2).split('=')[1];
            params[key] = value || true;
        } else {
            extraArgs.push(arg);
        }
    } else {
        // Assume first positional arg is test file, others are passed through
        if (!params.spec) {
            params.spec = arg;
        } else {
            extraArgs.push(arg);
        }
    }
});

// --- Configuration ---
const validRegions = ['gh', 'mw', 'tz', 'za'];
const region = (params.region || '').toLowerCase();
const mode = (params.mode || 'desktop').toLowerCase(); // 'android' or 'desktop'
const spec = params.spec || '';
const grep = params.grep || '';

// --- Validation ---
if (!validRegions.includes(region)) {
    console.error(`\x1b[31mError: Invalid or missing region. Use --region=<${validRegions.join('|')}>\x1b[0m`);
    process.exit(1);
}

// --- Build Command ---
const configPath = `playwright.${region.toUpperCase()}.config.ts`;
const projectName = `${region.toUpperCase()} Region`;

// Env vars
let envVars = ``;
if (mode === 'android') {
    console.log(`\x1b[36m[Mode] Running on ANDROID Device\x1b[0m`);
} else {
    console.log(`\x1b[36m[Mode] Running on DESKTOP Chrome\x1b[0m`);
}

// Base Playwright Command
let command = `npx playwright test`;

// Add Spec file if provided
if (spec) {
    command += ` ${spec}`;
}

// Add Config and Project
command += ` --config=${configPath} --project="${projectName}"`;

// Add Grep if provided
if (grep) {
    command += ` -g "${grep}"`;
}

// Add Extra Args (Pass-through)
if (extraArgs.length > 0) {
    command += ` ${extraArgs.join(' ')}`;
}

console.log(`\x1b[33m[Executing] ${command}\x1b[0m`);

// --- Execution ---
try {
    // Merge current env with our Custom env
    const childEnv = { ...process.env, ANDROID_DEVICE: mode === 'android' ? 'true' : undefined };

    execSync(command, {
        stdio: 'inherit',
        env: childEnv
    });
} catch (error) {
    console.error(`\x1b[31mTest execution failed.\x1b[0m`);
    process.exit(1);
}
