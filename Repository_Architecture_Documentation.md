# Repository Architecture Documentation

**Project Name:** JPC-Automation  
**Date:** 2025-12-04  
**Author:** Antigravity (AI Assistant)

---

## 1. Executive Summary

This document provides a comprehensive overview of the `JPC-Automation` repository's architecture. The project is a test automation framework built using **Playwright** with **TypeScript**, designed to support multiple regions (e.g., ZA, MW, TZ) with a high degree of code reusability and scalability. The architecture adheres to the **Page Object Model (POM)** design pattern and incorporates advanced features like externalized locators, custom action wrappers, and region-specific configurations.

---

## 2. Architectural Overview

The repository follows a **Multi-Region Hybrid Framework** approach. It separates core logic, shared components, and region-specific implementations to ensure maintainability and ease of expansion.

### 2.1. High-Level Structure

The codebase is organized into three primary layers within the `src` directory:

1.  **Global Layer (`src/global`)**: Contains utilities, setup scripts, database interactions, and reporting mechanisms that are agnostic to any specific region or page.
2.  **Common Layer (`src/common`)**: Houses shared Page Objects, Actions, and Tests that are applicable across multiple regions. This is the core of the reusability strategy.
3.  **Regional Layer (`src/regions`)**: Contains region-specific implementations. Each region (e.g., `ZA`, `MW`) has its own directory containing specific tests, pages, fixtures, and data.

### 2.2. Folder Structure Breakdown

Below is a detailed representation of the repository's file structure, highlighting key directories and files that define the architecture.

```text
d:\JPC-Automation
├── .git/                     # Git version control directory
├── .gitignore                # Git ignore rules
├── package.json              # Node.js dependencies and scripts
├── playwright.ZA.config.ts   # Playwright configuration for South Africa (ZA)
├── playwright.MW.config.ts   # Playwright configuration for Malawi (MW)
├── playwright.TZ.config.ts   # Playwright configuration for Tanzania (TZ)
├── src/
│   ├── global/               # Global layer: Region-agnostic utilities and setup
│   │   ├── database/         # Database connection and query scripts
│   │   ├── reporters/        # Custom test reporters (e.g., Allure, HTML)
│   │   ├── setup/            # Global setup/teardown scripts
│   │   └── utils/            # Shared utility functions
│   │       └── file-utils/
│   │           ├── excelReader.ts      # Reads test data/locators from Excel
│   │           └── locatorResolver.ts  # Resolves locators dynamically
│   ├── common/               # Common layer: Shared logic across all regions
│   │   ├── actions/
│   │   │   └── SafeActions.ts          # Wrapper for Playwright actions (click, fill, etc.)
│   │   ├── pages/            # Base Page Objects (Parents)
│   │   │   ├── LoginPage.ts            # Base Login Page
│   │   │   ├── HeaderPage.ts           # Base Header Page
│   │   │   ├── SignUpPage.ts           # Base Sign-Up Page
│   │   │   └── HamburgerMenuPage.ts    # Base Hamburger Menu Page
│   │   └── tests/            # Shared test modules (can be imported by regions)
│   └── regions/              # Regional layer: Specific implementations
│       ├── ZA/               # South Africa Region
│       │   ├── apis/         # API testing modules for ZA
│       │   ├── config/       # Region-specific configuration files
│       │   ├── fixtures/     # Dependency Injection fixtures
│       │   │   └── jackpotCityFixture.ts # Main fixture for ZA tests
│       │   ├── json-data/    # Data files (JSON) for data-driven testing
│       │   ├── locators/     # External locator files (if not using Excel)
│       │   ├── pages/        # Region-specific Page Objects (Children)
│       │   │   ├── HeaderPage.ts         # Extends Common HeaderPage
│       │   │   └── ...                   # Other region-specific pages
│       │   ├── regression/   # Regression test suites
│       │   ├── reports/      # Test execution reports
│       │   ├── screenshots/  # Captured screenshots
│       │   └── tests/        # ZA-specific test specs
│       ├── MW/               # Malawi Region (Structure mirrors ZA)
│       │   ├── fixtures/
│       │   ├── pages/
│       │   ├── tests/
│       │   └── ...
│       └── TZ/               # Tanzania Region (Structure mirrors ZA)
│           └── ...
```

### 2.3. Mobile Execution & Cross-Platform Support
The repository natively supports executing scripts on physical Android devices connected via ADB.
-   **Fixture Level Support**: Standard fixtures (`jackpotCityFixture.ts`) automatically detect the `ANDROID_DEVICE` environment variable.
-   **Dynamic Timeouts**: `SafeActions` and context launchers automatically adjust timeouts (30s action / 60s navigation) when running on mobile to account for device latency.
-   **Shared Utils**: `src/common/utils/androidUtils.ts` manages the connection and browser launch on the device.

```text
d:\JPC-Automation
├── runner.js                 # Unified execution runner script
├── playwright.ZA.config.ts   # ...
```

---

## 3. Key Design Patterns & Components

### 3.1. Page Object Model (POM)
The framework strictly follows POM to separate test logic from page details.
-   **Base Pages**: Located in `src/common/pages`, these define the standard behavior and locators for pages common to all regions.
-   **Derived Pages**: Located in `src/regions/{Region}/pages`, these extend the Base Pages to add or override functionality specific to a region.

### 3.2. SafeActions Wrapper
A custom `SafeActions` class (`src/common/actions/SafeActions.ts`) wraps standard Playwright actions (click, fill, etc.).
-   **Purpose**: To handle flakiness, automatic waiting, and logging consistently across all tests.
-   **Benefit**: Reduces "flaky" tests by ensuring elements are ready before interaction.

### 3.3. Externalized Locators
Locators are decoupled from the code and stored in external files (Excel/JSON).
-   **Mechanism**: The `LoginPage.ts` demonstrates loading locators via `loadLocatorsFromExcel`.
-   **Fallback**: If external files fail, an internal mock data structure is used.
-   **Benefit**: Allows non-technical team members to update selectors without touching the code.

### 3.4. Dependency Injection (Fixtures)
Playwright Fixtures (e.g., `jackpotCityFixture.ts`) are used to instantiate and inject Page Objects into tests.
-   **Benefit**: Eliminates boilerplate setup code in tests and ensures fresh page instances for every test.

### 3.5. Unified Execution Runner
A custom `runner.js` script abstracts the complexity of Playwright CLI flags.
-   **Command**: `npm run exec -- [args]`
-   **Parameters**: `--region=<region>`, `--mode=<android|desktop>`, `--grep=<pattern>`, plus any standard Playwright flags (e.g., `--headed`, `--debug`).
-   **Benefit**: Provides a consistent, user-friendly interface for running tests across different platforms and regions without remembering verbose config paths.

---

## 4. Scalability

The architecture is designed to scale in several dimensions:

### 4.1. Adding New Regions
To add a new region (e.g., "KE" for Kenya):
1.  Create `src/regions/KE`.
2.  Create `playwright.KE.config.ts`.
3.  Inherit common pages and override only what is different.
**Effort**: Minimal, as most logic is reused from `src/common`.

### 4.2. Parallel Execution
The framework is configured for parallel execution (`fullyParallel: true` in configs).
-   **Scalability**: Tests can run concurrently across multiple workers, significantly reducing execution time as the test suite grows.

### 4.3. Data-Driven Testing
Tests are designed to consume data from JSON/Excel files (`src/regions/{Region}/json-data`).
-   **Scalability**: New test scenarios can be added simply by adding data rows, without writing new test code.

---

## 5. Advantages of this Architecture

1.  **High Reusability**: Common code is written once and used everywhere. This reduces duplication and maintenance overhead.
2.  **Maintainability**: The separation of concerns (Global vs. Common vs. Region) makes it easy to locate and fix issues.
3.  **Flexibility**: Region-specific overrides allow the framework to adapt to local variations without breaking the core logic.
4.  **Stability**: The `SafeActions` layer and robust fixture management contribute to a stable and reliable test suite.
5.  **Ease of Use**: Externalized locators and the **Unified Runner** allow manual testers or business analysts to run complex scenarios with simple commands.
6.  **Comprehensive Reporting**: Integrated Allure and HTML reporting provide detailed insights into test execution.

---

## 6. Conclusion

The `JPC-Automation` repository represents a mature, enterprise-grade automation framework. Its modular design ensures that it can handle the complexity of a multi-region application while remaining easy to maintain and extend. The use of modern TypeScript features and Playwright's powerful capabilities positions this framework well for future growth.
