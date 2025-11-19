// const data = require('../ZA/json-data/oddsData.json')
export async function OddsSelection(numberOflegs: number, page: import('@playwright/test').Page) {


    await page.reload();
    const apiUrl = "https://new.betway.co.za/sportsapi/br/v1/BetBook/Highlights/?countryCode=ZA&sportId=soccer";
    const response = await page.waitForResponse((resp: { url: () => string; status: () => number; }) => resp.url().startsWith(apiUrl) && resp.status() === 200);
    const data = await response.json();
    for (let i = 0; i < numberOflegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const knownOutcomeId = `${eventId}11`;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === knownOutcomeId);
        if (!priceObj) continue;
        const oddValue = await page.locator(`//div[@id="${eventId}"]`).getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000); // Optional: wait between clicks
    }
}

export async function placeBetWithIndex(legNum: number, page: import('@playwright/test').Page) {
    await page.reload();
    const apiUrl = "https://new.betway.co.za/sportsapi/br/v1/BetBook/Highlights/?countryCode=ZA&sportId=soccer";
    const response = await page.waitForResponse((resp: { url: () => string; status: () => number; }) => resp.url().startsWith(apiUrl) && resp.status() === 200);
    const data = await response.json();
    for (let i = legNum; i < 10; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const knownOutcomeId = `${eventId}11`;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === knownOutcomeId);
        if (!priceObj) continue;
        const oddValue = await page.locator(`//div[@id="${eventId}"]`).getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000);
        break; // Optional: wait between clicks
    }
}

export async function EsportsOddsSelection(numberOflegs: number, page: import('@playwright/test').Page) {
    await page.reload();
    const apiUrl = "https://new.betway.co.za/sportsapi/br/v1/BetBook/Highlights/?countryCode=ZA&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D";
    const response = await page.waitForResponse((resp: { url: () => string; status: () => number; }) => resp.url().startsWith(apiUrl) && resp.status() === 200);
    const data = await response.json();
    for (let i = 1; i < numberOflegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const knownOutcomeId = `${eventId}1864`;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === knownOutcomeId);
        if (!priceObj) continue;
        const oddValue = await page.locator(`//div[@id="${eventId}"]`).getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000); // Optional: wait between clicks
    }
    await page.waitForTimeout(5000);
}
export async function DrawNoBetOddsSelection(numberOflegs: number, page: import('@playwright/test').Page) {
    await page.locator('#pv_id_3').click();
    await page.getByText('Draw No Bet').last().click();
    const apiUrl = "https://new.betway.co.za/sportsapi/br/v1/BetBook/Highlights/?countryCode=ZA&sportId=soccer";
    const response = await page.waitForResponse((resp: { url: () => string; status: () => number; }) => resp.url().startsWith(apiUrl) && resp.status() === 200);
    const data = await response.json();
    for (let i = 0; i < numberOflegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const knownOutcomeId = `${eventId}114`;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === knownOutcomeId);
        if (!priceObj) continue;
        const oddValue = await page.locator(`//div[@id="${eventId}"]`).getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000); // Optional: wait between clicks
    }
    await page.waitForTimeout(5000);
}

export async function LiveOddsSelection(numberOfLegs: number, page: import('@playwright/test').Page) {
    await page.reload();
    await page.getByRole('img', { name: 'Table Tennis' }).click();
    const apiUrl = "https://new.betway.co.za/sportsapi/br/v1/BetBook/LiveInPlay/?countryCode=ZA&sportId=table-tennis"
    const response = await page.waitForResponse((resp: { url: () => string; status: () => number; }) => resp.url().startsWith(apiUrl) && resp.status() === 200);
    const data = await response.json();
    for (let i = 0; i < numberOfLegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const knownOutcomeId = `${eventId}1864`;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === knownOutcomeId);
        if (!priceObj) continue;
        const oddValue = await page.locator(`//div[@id="${eventId}"]`).getByText(`${priceObj.priceDecimal}`, { exact: false });
        console.log(oddValue)
        await oddValue.click();
        await page.waitForTimeout(1000); // Optional: wait between clicks
    }
    await page.waitForTimeout(5000);
}

export async function OddsSelectionAbove(numberOflegs: number, minOdd: number, page: import('@playwright/test').Page) {
    await page.reload();
    await page.locator('#sports-tabs div').filter({ hasText: 'Upcoming' }).click();
    const apiUrl = "https://new.betway.co.za/sportsapi/br/v1/BetBook/Upcoming/?countryCode=ZA&sportId=soccer";
    const response = await page.waitForResponse(
        (resp: { url: () => string; status: () => number }) =>
            resp.url().startsWith(apiUrl) && resp.status() === 200);
    const data = await response.json();
    let selected = 0;
    for (let i = 0; i < data.events?.length; i++) {
        if (selected >= numberOflegs) break;
        const eventId = data.events[i]?.eventId;
        if (!eventId) continue;
        const knownOutcomeId = `${eventId}11`;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === knownOutcomeId && parseFloat(p.priceDecimal) > minOdd);
        if (!priceObj) continue;
        const oddLocator = page.locator(`//div[@id="${eventId}"]`).getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddLocator.waitFor({ state: 'visible', timeout: 10000 });
        await oddLocator.scrollIntoViewIfNeeded();
        await oddLocator.click();
        selected++;
        await page.waitForTimeout(1000);
    }
}


