/* Migrate a Page Object from JSON-loaded locators to the typed build() pattern.
   Usage: node scripts/migrate-po.js <poFile> <group>
   - replaces the `const x = loadLocatorsFromJson('group'); this.locators = {...}` block
     with `this.locators = this.build('group', { <typed map> })`
   - swaps the JSON imports for the needed sel builders.
   Leaves all getters/methods untouched. */
const fs = require('fs');
const path = require('path');

const [, , poFile, group] = process.argv;
if (!poFile || !group) { console.error('usage: migrate-po.js <poFile> <group>'); process.exit(1); }

const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/global/locators/locators.json'), 'utf-8'));
const entries = json[group] || [];
const lit = (v) => JSON.stringify(v ?? '');
function optsArg(options) {
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
        default: expr = `css(${lit(v)})`;
    }
    const n = entry.nth;
    if (n !== undefined && n !== null && n !== '') expr = Number(n) === 0 ? `first(${expr})` : `at(${expr}, ${Number(n)})`;
    return expr;
}

const mapLines = entries.filter(e => e && e.key).map(e => `            ${e.key}: ${builder(e)},`).join('\n');

// which builders are used → import only those
const allBuilders = ['css', 'id', 'xpath', 'role', 'text', 'label', 'placeholder', 'title', 'first', 'at', 'within', 'or', 'withText'];
const used = allBuilders.filter(b => new RegExp(`\\b${b}\\(`).test(mapLines));

let src = fs.readFileSync(poFile, 'utf-8');

// 1) swap imports: drop the two JSON imports, add sel import after the SafeActions import line
src = src.replace(/^import \{ loadLocatorsFromJson \}.*\n/m, '');
src = src.replace(/^import \{ getLocator \}.*\n/m, '');
if (!/from '\.\.\/locators\/sel'/.test(src)) {
    src = src.replace(/(import \{ BasePage \} from '\.\/BasePage';\n)/, `$1import { ${used.join(', ')} } from '../locators/sel';\n`);
}

// 2) replace the locator-loading block
const blockRe = new RegExp(
    `\\n\\s*const \\w+ = loadLocatorsFromJson\\('${group}'\\);[\\s\\S]*?this\\.locators = \\{[\\s\\S]*?\\n\\s*\\};`,
    'm'
);
const replacement = `\n        this.locators = this.build('${group}', {\n${mapLines}\n        });`;
if (!blockRe.test(src)) { console.error('!! locator block not matched in', poFile); process.exit(2); }
src = src.replace(blockRe, replacement);

fs.writeFileSync(poFile, src);
console.log(`migrated ${path.basename(poFile)} (group=${group}, ${entries.length} keys, builders: ${used.join(',')})`);
