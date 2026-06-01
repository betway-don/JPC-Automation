const fs = require('fs');

const testCasesData = JSON.parse(fs.readFileSync('d:\\JPC-Automation\\extracted_test_cases.json', 'utf8'));
const implementedTests = JSON.parse(fs.readFileSync('d:\\JPC-Automation\\implemented_test_titles.json', 'utf8'));

// Simple function to extract keywords from string
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

let report = {};

for (const region in testCasesData) {
    report[region] = {
        total: 0,
        implemented: 0,
        missing: [],
        matched: []
    };
    
    // We filter out headers/empty rows
    const validTestCases = testCasesData[region].filter(tc => tc.id && tc.id.startsWith('TC_'));
    report[region].total = validTestCases.length;
    
    validTestCases.forEach(tc => {
        // Find best match in implemented tests
        let bestMatch = null;
        let highestSim = 0;
        
        implementedTests.forEach(impl => {
            const sim = calculateSimilarity(tc.title, impl.title);
            if (sim > highestSim) {
                highestSim = sim;
                bestMatch = impl.title;
            }
        });
        
        if (highestSim > 0.4) { // Threshold for matching
            report[region].implemented++;
            report[region].matched.push({ excel: tc.title, code: bestMatch, score: highestSim });
        } else {
            report[region].missing.push(tc.title);
        }
    });
    
    report[region].coverage = report[region].total > 0 ? Math.round((report[region].implemented / report[region].total) * 100) + '%' : '0%';
}

fs.writeFileSync('d:\\JPC-Automation\\fuzzy_coverage_report.json', JSON.stringify(report, null, 2));
console.log("Fuzzy coverage report generated!");
