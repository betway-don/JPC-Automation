const fs = require('fs');
const path = require('path');

const testCasesData = JSON.parse(fs.readFileSync('d:\\JPC-Automation\\extracted_test_cases.json', 'utf8'));

// Recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
          arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles('d:\\JPC-Automation\\src');
let allCodeContent = '';

allFiles.forEach(file => {
    allCodeContent += fs.readFileSync(file, 'utf8') + '\n';
});

let report = {};

for (const region in testCasesData) {
    let total = 0;
    let implemented = 0;
    let missing = [];
    
    testCasesData[region].forEach(tc => {
        if (!tc.id) return;
        
        // Exclude empty or placeholder IDs that are just headers
        if (!tc.id.startsWith('TC_') && !tc.id.match(/^[A-Z0-9_]+$/)) return;
        
        total++;
        if (allCodeContent.includes(tc.id)) {
            implemented++;
        } else {
            missing.push(tc.id + " - " + tc.title);
        }
    });
    
    report[region] = {
        total: total,
        implemented: implemented,
        coverage: total > 0 ? ((implemented / total) * 100).toFixed(2) + '%' : '0%',
        missingCount: missing.length,
        missing: missing
    };
}

let overallTotal = 0;
let overallImplemented = 0;
for (const region in report) {
    overallTotal += report[region].total;
    overallImplemented += report[region].implemented;
}
const overallCoverage = overallTotal > 0 ? ((overallImplemented / overallTotal) * 100).toFixed(2) + '%' : '0%';

const output = {
    overall: {
        total: overallTotal,
        implemented: overallImplemented,
        coverage: overallCoverage
    },
    regions: report
};

fs.writeFileSync('d:\\JPC-Automation\\coverage_report.json', JSON.stringify(output, null, 2));
console.log(`Overall Coverage: ${overallCoverage} (${overallImplemented}/${overallTotal} implemented)`);
console.log("Detailed report written to coverage_report.json");
