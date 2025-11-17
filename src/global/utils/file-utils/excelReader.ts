// // utils/excelReader.ts
// import * as XLSX from "xlsx";
// // https://zensar-my.sharepoint.com/:x:/r/personal/atharva_deshmukh_zensar_com/Documents/locators1.xlsx?d=wd43b26e41466414ca6673bc2b2a139e3&csf=1&web=1&e=VFMjgD
// export type LocatorConfig = {
//   key: string;
//   type: "css" | "role" | "text" | "xpath";
//   value: string;
//   options?: Record<string, any>;
//   nth?: number;
// };

// export function loadLocatorsFromExcel(filePath: string, sheetName: string): Record<string, LocatorConfig> {
//   const workbook = XLSX.readFile(filePath);
//   const sheet = workbook.Sheets[sheetName];
//   const rows: LocatorConfig[] = XLSX.utils.sheet_to_json(sheet);

//   const locators: Record<string, LocatorConfig> = {};

//   rows.forEach((row) => {
//     locators[row.key] = {
//       key: row.key,
//       type: row.type,
//       value: row.value,
//       options: row.options ? JSON.parse(row.options) : {},
//       nth: row.nth !== undefined ? Number(row.nth) : undefined,
//     };
//   });

//   return locators;
// }
import * as XLSX from "xlsx";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

export type LocatorConfig = {
  key: string;
  type: "css" | "role" | "text" | "xpath"|"label";
  value: string;
  options?: Record<string, any>;
  nth?: number;
};

function isHttpUrl(p: string) {
  return /^https?:\/\//i.test(p);
}

function downloadSync(url: string, dest: string) {
  try {
    if (process.platform === "win32") {
      // Use PowerShell Invoke-WebRequest on Windows
      // -UseBasicParsing is kept for older PS versions (harmless on recent)
      const safeUrl = url.replace(/'/g, "''");
      const cmd = `powershell -NoProfile -Command "Invoke-WebRequest -Uri '${safeUrl}' -OutFile '${dest}' -UseBasicParsing"`;
      execSync(cmd, { stdio: "inherit" });
    } else {
      // Try curl, fallback to wget
      try {
        execSync(`curl -sSL -o '${dest}' '${url}'`, { stdio: "inherit" });
      } catch (curlErr) {
        // Try wget
        execSync(`wget -qO '${dest}' '${url}'`, { stdio: "inherit" });
      }
    }
  } catch (err) {
    throw new Error(`Failed to download ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function loadLocatorsFromExcel(filePath: string, sheetName: string): Record<string, LocatorConfig> {
  let workbook: XLSX.WorkBook;
  let tmpFile: string | undefined;

  if (isHttpUrl(filePath)) {
    // download synchronously to temp file
    tmpFile = path.join(os.tmpdir(), `locators-${Date.now()}.xlsx`);
    downloadSync(filePath, tmpFile);
    if (!fs.existsSync(tmpFile)) {
      throw new Error(`Downloaded file not found at ${tmpFile}`);
    }
    workbook = XLSX.readFile(tmpFile);
  } else {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Local locator file not found: ${filePath}`);
    }
    workbook = XLSX.readFile(filePath);
  }

  try {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`Sheet '${sheetName}' not found in workbook. Available sheets: ${workbook.SheetNames.join(", ")}`);
    }

    // Use defval to avoid undefined cells
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const locators: Record<string, LocatorConfig> = {};

    rows.forEach((row) => {
      if (!row.key) {
        // skip rows without a key
        return;
      }

      let parsedOptions: Record<string, any> = {};
      if (row.options) {
        if (typeof row.options === "string") {
          try {
            parsedOptions = JSON.parse(row.options);
          } catch {
            // If options isn't JSON, keep as empty object
            parsedOptions = {};
          }
        } else if (typeof row.options === "object") {
          parsedOptions = row.options;
        }
      }

      locators[row.key] = {
        key: row.key,
        type: row.type,
        value: row.value,
        options: parsedOptions,
        nth: row.nth !== undefined && row.nth !== "" ? Number(row.nth) : undefined,
      };
    });

    return locators;
  } finally {
    // cleanup temporary file if we downloaded one
    if (tmpFile) {
      try {
        fs.unlinkSync(tmpFile);
      } catch {
        // ignore cleanup errors
      }
    }
  }
}

// I'll update loadLocatorsFromExcel so it can fetch the XLSX from your GitHub raw URL (or any http/https URL) synchronously — so you don't need to change HomePage or any call sites.

// What I'll do

// Detect when the passed filePath is an HTTP(S) URL.
// Download the file synchronously (uses curl/wget on Unix, PowerShell's Invoke-WebRequest on Windows) into a temp file.
// Read the temp XLSX with the same XLSX.readFile call you already have.
// Remove the temp file afterward.
// Preserve the same function signature and behavior so your existing code continues to work.
// Notes

// This uses Node's child_process.execSync to download the file synchronously so no async changes are required in callers.
// Runners must have either curl or wget (Linux/macOS) or PowerShell (Windows) available. GitHub-hosted runners do.
// If download fails, an informative error is thrown and code falls back to raising the error (you can wrap call-sites in try/catch if you want a fallback to local file).
// Replace the file excelReader.ts with the following: