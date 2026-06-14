/* One-off: port src/global/locators/locators.json → typed Sel map literals (per group).
   Run: node scripts/gen-locators.js [group]   — prints TS to paste into each Page Object. */
const fs = require('fs');
const path = require('path');

const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/global/locators/locators.json'), 'utf-8'));

function lit(v) { return JSON.stringify(v ?? ''); }
function optsArg(options) {
    if (!options || (typeof options === 'object' && Object.keys(options).length === 0)) return '';
    const o = typeof options === 'string' ? (() => { try { return JSON.parse(options); } catch { return {}; } })() : options;
    if (!o || Object.keys(o).length === 0) return '';
    return ', ' + JSON.stringify(o);
}

function builder(entry) {
    const v = String(entry.value ?? '');
    let expr;
    switch (entry.type) {
        case 'css': case 'locator': expr = `css(${lit(v)})`; break;
        case 'id': expr = `id(${lit(v)})`; break;
        case 'xpath': expr = `xpath(${lit(v)})`; break;
        case 'role': expr = `role(${lit(v)}${optsArg(entry.options)})`; break;
        case 'text': expr = `text(${lit(v)}${optsArg(entry.options)})`; break;
        case 'label': expr = `label(${lit(v)}${optsArg(entry.options)})`; break;
        case 'title': expr = `title(${lit(v)}${optsArg(entry.options)})`; break;
        case 'placeholder': expr = `placeholder(${lit(v)})`; break;
        default: expr = `css(${lit(v)}) /* TODO type=${entry.type} */`;
    }
    const n = entry.nth;
    if (n !== undefined && n !== null && n !== '') {
        expr = Number(n) === 0 ? `first(${expr})` : `at(${expr}, ${Number(n)})`;
    }
    return expr;
}

const only = process.argv[2];
for (const group of Object.keys(json)) {
    if (only && group !== only) continue;
    if (!Array.isArray(json[group])) continue;
    console.log(`\n// ===================== ${group} (${json[group].length}) =====================`);
    for (const entry of json[group]) {
        if (!entry || !entry.key) continue;
        console.log(`    ${entry.key}: ${builder(entry)},`);
    }
}
