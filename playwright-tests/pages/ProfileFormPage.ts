import { Page, Locator } from '@playwright/test';

export class ProfileFormPage {
  constructor(private page: Page) {}

  get nameInput(): Locator {
    return this.page.locator('input[placeholder="Name"]');
  }

  get birthdateInput(): Locator {
    return this.page.locator('input[placeholder="Birthday"]');
  }

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  private get avatarItems(): Locator {
    return this.page.locator('[tabindex="0"]').filter({
      has: this.page.locator('img[src*="avatar"]'),
    });
  }

  async selectAvatar(index: number): Promise<void> {
    const avatar = this.avatarItems.nth(index);
    await avatar.click();
    await this.page.waitForTimeout(1000);
  }

  async selectAvatarByName(name: string): Promise<void> {
    const avatar = this.page.locator('[tabindex="0"]').filter({
      has: this.page.locator(`img[src*="avatar_${name}"]`),
    }).first();
    await avatar.click();
    await this.page.waitForTimeout(1000);
  }

  async selectColor(index: number): Promise<void> {
    const allTabindex = this.page.locator('[tabindex="0"]');
    const totalCount = await allTabindex.count();
    let colorIdx = 0;

    for (let i = 0; i < totalCount; i++) {
      const el = allTabindex.nth(i);
      const box = await el.boundingBox();
      if (box && Math.abs(box.width - 40) < 2 && Math.abs(box.height - 40) < 2) {
        if (colorIdx === index) {
          await el.click();
          await this.page.waitForTimeout(1000);
          return;
        }
        colorIdx++;
      }
    }

    throw new Error(`Color at index ${index} not found. Only found ${colorIdx} color swatches.`);
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async clearName(): Promise<void> {
    await this.nameInput.clear();
  }

  async fillBirthdate(date: string): Promise<void> {
    await this.birthdateInput.fill(date);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForTimeout(5000);
  }

  async isStillOnForm(): Promise<boolean> {
    return this.page.url().includes('/profiles/add');
  }
}
