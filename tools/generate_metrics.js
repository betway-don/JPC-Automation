const fs = require('fs');

const testCasesData = JSON.parse(fs.readFileSync('d:\\JPC-Automation\\extracted_test_cases.json', 'utf8'));
const implementedTests = JSON.parse(fs.readFileSync('d:\\JPC-Automation\\implemented_test_titles.json', 'utf8'));

function getKeywords(str) {
    if (!str) return [];
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !['verify', 'that', 'user', 'should', 'able', 'the', 'and', 'for', 'with', 'not', 'are'].includes(w));
}

function calculateSimilarity(str1, str2) {
    const kw1 = getKeywords(str1);
    const kw2 = getKeywords(str2);
    if (kw1.length === 0 || kw2.length === 0) return 0;
    
    let matches = 0;
    kw1.forEach(k => {
        if (kw2.includes(k)) matches++;
    });
    
    return matches / Math.max(kw1.length, kw2.length);
}

let metrics = {
    overall: { total: 0, implemented: 0 },
    regions: {},
    modules: {}
};

for (const region in testCasesData) {
    metrics.regions[region] = { total: 0, implemented: 0 };
    
    const validTestCases = testCasesData[region].filter(tc => tc.id && tc.id.startsWith('TC_'));
    
    validTestCases.forEach(tc => {
        const sheet = tc.sheet || "Unknown";
        if (!metrics.modules[sheet]) {
            metrics.modules[sheet] = { total: 0, implemented: 0 };
        }
        
        metrics.overall.total++;
        metrics.regions[region].total++;
        metrics.modules[sheet].total++;
        
        let highestSim = 0;
        implementedTests.forEach(impl => {
            const sim = calculateSimilarity(tc.title, impl.title);
            if (sim > highestSim) highestSim = sim;
        });
        
        if (highestSim > 0.4) {
            metrics.overall.implemented++;
            metrics.regions[region].implemented++;
            metrics.modules[sheet].implemented++;
        }
    });
}

function calcCov(impl, tot) {
    return tot > 0 ? Math.round((impl / tot) * 100) + '%' : '0%';
}

let mdContent = `# JPC Automation Test Coverage Metrics\n\n`;
mdContent += `## Overall Coverage\n`;
mdContent += `**Total Coverage:** ${calcCov(metrics.overall.implemented, metrics.overall.total)} (${metrics.overall.implemented} / ${metrics.overall.total} tests implemented)\n\n`;

mdContent += `## Metrics by Region\n`;
mdContent += `| Region | Total Tests | Implemented | Missing | Coverage % |\n`;
mdContent += `|--------|-------------|-------------|---------|------------|\n`;
for (const r in metrics.regions) {
    const data = metrics.regions[r];
    mdContent += `| ${r} | ${data.total} | ${data.implemented} | ${data.total - data.implemented} | ${calcCov(data.implemented, data.total)} |\n`;
}

mdContent += `\n## Metrics by Module (Sheet)\n`;
mdContent += `| Module/Sheet | Total Tests | Implemented | Missing | Coverage % |\n`;
mdContent += `|--------------|-------------|-------------|---------|------------|\n`;
for (const m in metrics.modules) {
    const data = metrics.modules[m];
    mdContent += `| ${m} | ${data.total} | ${data.implemented} | ${data.total - data.implemented} | ${calcCov(data.implemented, data.total)} |\n`;
}

fs.writeFileSync('d:\\JPC-Automation\\metrics.md', mdContent);
console.log("Metrics generated in metrics.md");
