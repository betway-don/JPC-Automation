const fs = require('fs');
const path = require('path');

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
let implementedTests = [];

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        // match test('title', ...) or test("title", ...)
        const match = line.match(/test\(['"](.*?)['"]/);
        if (match && match[1]) {
            implementedTests.push({ file: file, title: match[1] });
        }
    });
});

fs.writeFileSync('d:\\JPC-Automation\\implemented_test_titles.json', JSON.stringify(implementedTests, null, 2));
console.log(`Extracted ${implementedTests.length} implemented tests from code.`);
