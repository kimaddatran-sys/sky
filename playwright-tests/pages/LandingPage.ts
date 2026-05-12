import { Page } from '@playwright/test';
import { ProfilesListPage } from './ProfilesListPage';
import { TaskListPage } from './TaskListPage';

export class LandingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(3000);
    await this.dismissModals();
  }

  private async dismissModals() {
    const gotItBtn = this.page.getByRole('button', { name: 'Got it' });
    if (await gotItBtn.count() > 0 && await gotItBtn.isVisible()) {
      await gotItBtn.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async goToProfiles(): Promise<ProfilesListPage> {
    await this.page.getByText('Profiles', { exact: true }).click({ force: true });
    await this.page.waitForTimeout(3000);
    return new ProfilesListPage(this.page);
  }

  async goToTasks(): Promise<TaskListPage> {
    await this.page.getByText('Tasks', { exact: true }).click({ force: true });
    await this.page.waitForTimeout(3000);
    const taskListPage = new TaskListPage(this.page);
    await taskListPage.dismissIntroIfPresent();
    return taskListPage;
  }
}
