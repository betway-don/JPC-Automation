// utils/locatorResolver.ts
import { Page, Locator } from "@playwright/test";
import { LocatorConfig } from "./excelReader";
import { CLIENT_RENEG_LIMIT } from "tls";

export function getLocator(page: Page, config: LocatorConfig): Locator {
  let locator: Locator;
  if (!config) {
        throw new Error("Locator config is undefined");
    }
  // console.log(`Getting locator for type: ${config}`);
  switch (config.type) {
    case "css":
      locator = page.locator(config.value);
      break;
    case "role":
      locator = page.getByRole(config.value as any, config.options || {});
      break;
    case "text":
      locator = page.getByText(config.value, config.options || {});
      break;
    case "xpath":
      locator = page.locator(`xpath=${config.value}`);
      break;
    case "label":
      locator = page.getByLabel(config.value, config.options || {});
      break;
    default:
      throw new Error(`Unsupported locator type: ${config.type}`);
  }

  if (config.nth !== undefined ) {
    locator = locator.nth(config.nth);
  }

  return locator;
}
