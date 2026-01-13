// utils/locatorResolver.ts
import { Page, Locator } from "@playwright/test";
import { LocatorConfig } from "./excelReader";

export function getLocator(page: Page, config: LocatorConfig): Locator {
  let locator: Locator;

  if (!config) {
    throw new Error("Locator config is undefined");
  }

  switch (config.type) {
    case "css":
      locator = page.locator(config.value);
      break;
    case "role":
      // Cast config.value to any because getByRole expects specific string unions (like 'button'), 
      // but our excel returns a generic string.
      locator = page.getByRole(config.value as any, config.options || {});
      break;
    case "text":
      locator = page.getByText(config.value, config.options || {});
      break;
    case "id":
      locator = page.locator(`#${config.value}`);
      break;
    case "xpath":
      locator = page.locator(`xpath=${config.value}`);
      break;
    case "label":
      locator = page.getByLabel(config.value, config.options || {});
      break;
    case "title":
      locator = page.getByTitle(config.value, config.options || {});
      break;
      
    // 👇 ADDED THIS BLOCK TO FIX YOUR ERROR 👇
    case "placeholder":
      locator = page.getByPlaceholder(config.value, config.options || {});
      break;
    // ----------------------------------------

    default:
      throw new Error(`Unsupported locator type: ${config.type}`);
  }

  // Handle 'nth' index if provided (e.g., if there are multiple buttons with the same name)
  if (config.nth !== undefined && config.nth !== null) {
    locator = locator.nth(config.nth);
  }

  return locator;
}