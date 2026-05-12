import { Page, Locator } from '@playwright/test';

export class TaskFormPage {
  constructor(private page: Page) {}

  get titleInput(): Locator {
    return this.page.locator('input[placeholder="Title"]');
  }

  get descriptionInput(): Locator {
    return this.page.locator('textarea[placeholder="Description"]');
  }

  get addButton(): Locator {
    return this.page.getByRole('button', { name: 'Add' });
  }

  get upForGrabsToggle(): Locator {
    return this.page.locator('[role="switch"]').first();
  }

  get profileError(): Locator {
    return this.page.getByText('Please select a profile.');
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async toggleUpForGrabs(): Promise<void> {
    await this.upForGrabsToggle.click();
    await this.page.waitForTimeout(1000);
  }

  async add(): Promise<void> {
    await this.addButton.click();
    await this.page.waitForTimeout(5000);
  }

  async isStillOnForm(): Promise<boolean> {
    return this.page.url().includes('/tasks/add');
  }
}
