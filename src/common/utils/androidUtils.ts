import { _android, Page, BrowserContext } from 'playwright';

export async function launchAndroidBrowser(baseURL: string | undefined): Promise<{ page: Page, context: BrowserContext, device: any }> {
    const [device] = await _android.devices();
    if (!device) {
        throw new Error('No Android device found. Please connect via ADB.');
    }
    console.log(`Launching Chrome on Android device: ${device.model()}`);
    await device.shell('am force-stop com.android.chrome');
    const context = await device.launchBrowser({
        pkg: 'com.android.chrome',
        baseURL: baseURL
    });
    context.setDefaultTimeout(30000); // 30 seconds action timeout
    context.setDefaultNavigationTimeout(60000); // 60 seconds navigation timeout
    const page = await context.newPage();
    return { page, context, device };
}
