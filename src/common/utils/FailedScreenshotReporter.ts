import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class FailedScreenshotReporter implements Reporter {
    onTestEnd(test: TestCase, result: TestResult) {
        if (result.status === 'failed' || result.status === 'timedOut') {
            // Playwright attaches screenshots on failure if `screenshot: 'only-on-failure'` is set.
            const screenshot = result.attachments.find(a => a.name === 'screenshot');
            
            if (screenshot && screenshot.path) {
                const failedDir = path.resolve(process.cwd(), 'failed_screenshots');
                if (!fs.existsSync(failedDir)) {
                    fs.mkdirSync(failedDir, { recursive: true });
                }
                
                // Sanitize test title to create a safe, descriptive filename
                const safeTitle = test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const ext = path.extname(screenshot.path);
                
                // Append timestamp to ensure uniqueness
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const newName = `${safeTitle}_${timestamp}${ext}`;
                const newPath = path.join(failedDir, newName);
                
                // Copy the screenshot from test-results to our dedicated failed_screenshots directory
                fs.copyFileSync(screenshot.path, newPath);
                console.log(`\n[FailedScreenshotReporter] Copied failed screenshot to: ${newPath}`);
            }
        }
    }
}

export default FailedScreenshotReporter;
