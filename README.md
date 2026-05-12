# Skylight Playwright Tests

End-to-end tests for [ourskylight.com](https://ourskylight.com) using Playwright with the Page Object Model pattern.

## Project Structure

```
playwright-tests/
├── auth.setup.ts          # Login once, save session for all tests
├── fixtures/
│   └── index.ts           # Custom test fixtures (page objects)
├── pages/
│   ├── LandingPage.ts     # App entry point, navigation to features
│   ├── ProfilesListPage.ts
│   ├── ProfileFormPage.ts
│   ├── TaskListPage.ts
│   └── TaskFormPage.ts
├── data/
│   ├── profile.data.ts    # Profile test data factory
│   └── task.data.ts       # Task test data factory
└── specs/
    ├── create-profile.spec.ts   # Profile creation + validation
    └── create-task.spec.ts      # Task creation + validation
```

## Setup

Requires [Node.js](https://nodejs.org/) (v18+).

```bash
npm install                        # Install dependencies
npx playwright install chromium    # Download browser binary
```

This installs:

| Package | Purpose |
|---------|---------|
| `@playwright/test` | Test framework and runner |
| `@types/node` | TypeScript types for Node.js APIs |
| `dotenv` | Loads `.env` credentials into `process.env` |

Then create a `.env` file in the project root:

```
SKYLIGHT_EMAIL=<your email>
SKYLIGHT_PASSWORD=<your password>
```

## Running Tests

```bash
# Run all tests
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test

# Run a specific spec
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test create-task

# View HTML report after a run
npx playwright show-report
```

## Architecture

Tests use the **Page Object Model** — each screen has a class that owns its selectors and actions. Page methods return the next page object, creating a chainable flow:

- `LandingPage` → `goToProfiles()` → `ProfilesListPage` → `addProfile()` → `ProfileFormPage`
- `LandingPage` → `goToTasks()` → `TaskListPage` → `createTask()` → `TaskFormPage`

Selectors live in page objects. Specs only call high-level methods. If the UI changes, you fix one page class — not every test.

## Authentication

The `auth.setup.ts` project logs in via the Skylight popup, then saves cookies/storage to `.auth/user.json`. All spec tests load this saved state automatically, so they start already authenticated without repeating login.

## Adding New Tests

1. Create page object(s) in `pages/` for any new screens
2. Add a data factory in `data/` if the test needs generated input
3. Register page objects in `fixtures/index.ts`
4. Write spec file in `specs/`
5. Run and verify

## Extending: createdProfile Fixture

To use a profile created in one test as a precondition for another, create a **setup fixture** rather than sharing state between tests. This keeps tests independent and parallel-safe.

Add to `fixtures/index.ts`:

```typescript
createdProfile: async ({ page }, use) => {
  const data = generateProfileData();
  const landing = new LandingPage(page);
  await landing.goto();
  const list = await landing.goToProfiles();
  const form = await list.addProfile();
  await form.selectAvatar(data.avatarIndex);
  await form.selectColor(data.colorIndex);
  await form.fillName(data.name);
  await form.fillBirthdate(data.birthdate);
  await form.save();

  await use(data); // test runs with this profile available
},
```

Then any test can request it:

```typescript
test('assign task to profile', async ({ createdProfile, landingPage }) => {
  // createdProfile.name is guaranteed to exist
  const taskList = await landingPage.goToTasks();
  // ... use createdProfile.name when assigning
});
```

Each test gets its own freshly created profile. No shared mutable state, no test ordering issues.
