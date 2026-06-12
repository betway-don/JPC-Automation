const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const LOCATOR_PATH = path.join(__dirname, "src/global/utils/file-utils/locators.xlsx");
const SHEET_NAME = "signUp";

const workbook = XLSX.readFile(LOCATOR_PATH);
const sheet = workbook.Sheets[SHEET_NAME];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log("FULL ROW DATA:");
console.log(JSON.stringify(rows[0], null, 2));
