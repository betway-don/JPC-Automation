const XLSX = require('xlsx');
const fs = require('fs');

const files = [
    'd:\\JPC-Automation\\GH Region automation test suit (1).xlsx',
    'd:\\JPC-Automation\\MW Region automation test suit.xlsx',
    'd:\\JPC-Automation\\TZ Region automation test suit.xlsx',
    'd:\\JPC-Automation\\ZA Region automation test suit.xlsx'
];

let allTestCases = {};

files.forEach(file => {
    const regionMatch = file.match(/([A-Z]{2}) Region/);
    const region = regionMatch ? regionMatch[1] : file;
    allTestCases[region] = [];
    
    try {
        const workbook = XLSX.readFile(file);
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            // Find column indexes
            let tcIdCol = -1;
            let titleCol = -1;
            
            if (rows.length > 0) {
                const headers = rows[0];
                tcIdCol = headers.findIndex(h => h && h.toString().toLowerCase().includes('test case id'));
                titleCol = headers.findIndex(h => h && h.toString().toLowerCase().includes('title'));
            }
            
            if (tcIdCol !== -1 && titleCol !== -1) {
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    if (row && row[tcIdCol]) {
                        allTestCases[region].push({
                            sheet: sheetName,
                            id: row[tcIdCol].toString().trim(),
                            title: row[titleCol] ? row[titleCol].toString().trim() : ''
                        });
                    }
                }
            }
        });
    } catch(err) {
        console.error("Error reading file:", err.message);
    }
});

fs.writeFileSync('d:\\JPC-Automation\\extracted_test_cases.json', JSON.stringify(allTestCases, null, 2));
console.log("Extracted test cases to extracted_test_cases.json");
