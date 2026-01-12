import { _android as android, test } from '@playwright/test';

test('Android automation demo', async () => {
    // Connect to the device.
    // Make sure your device is connected via USB and "USB Debugging" is enabled.
    const [device] = await android.devices();

    if (!device) {
        console.log('No Android device found. Please connect a device and enable USB debugging.');
        return;
    }

    console.log(`Connected to device: ${device.model()}`);

    // Launch Chrome browser on the device.
    await device.shell('am force-stop com.android.chrome');
    const context = await device.launchBrowser();
    const page = await context.newPage();

    // Navigate to a website.
    console.log('Navigating to google.com...');
    await page.goto('https://www.google.com');

    // Verify page title or take a screenshot
    console.log('Page title:', await page.title());

    // Take a screenshot and save it to the current directory
    await page.screenshot({ path: 'android_screenshot.png' });
    console.log('Screenshot saved as android_screenshot.png');

    // Close the context and device connection.
    await context.close();
    await device.close();
});
