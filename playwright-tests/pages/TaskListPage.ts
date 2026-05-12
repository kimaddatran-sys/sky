import { Page, Locator } from '@playwright/test';
import { TaskFormPage } from './TaskFormPage';

export class TaskListPage {
  constructor(private page: Page) {}

  get createTaskFab(): Locator {
    // The FAB is a 64x64 button with empty text at the bottom-right
    return this.page.getByRole('button').last();
  }

  async dismissIntroIfPresent(): Promise<void> {
    const continueBtn = this.page.getByRole('button', { name: 'Continue' });
    if (await continueBtn.count() > 0 && await continueBtn.isVisible()) {
      await continueBtn.click();
      await this.page.waitForTimeout(3000);
    }
  }

  taskByTitle(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }

  async createTask(): Promise<TaskFormPage> {
    await this.createTaskFab.click();
    await this.page.waitForTimeout(3000);
    return new TaskFormPage(this.page);
  }
}
