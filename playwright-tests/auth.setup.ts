import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page, context }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', { name: 'Sign in' }).click(),
  ]);

  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(3000);
  await popup.locator('#email').fill(process.env.SKYLIGHT_EMAIL!);
  await popup.locator('#password').fill(process.env.SKYLIGHT_PASSWORD!);
  await popup.getByRole('button', { name: 'Log In' }).click();

  await page.waitForTimeout(8000);

  const gotItBtn = page.getByRole('button', { name: 'Got it' });
  if (await gotItBtn.count() > 0 && await gotItBtn.isVisible()) {
    await gotItBtn.click();
    await page.waitForTimeout(1000);
  }

  await context.storageState({ path: authFile });
});
