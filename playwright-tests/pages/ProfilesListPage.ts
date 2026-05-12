import { Page, Locator } from '@playwright/test';
import { ProfileFormPage } from './ProfileFormPage';

export class ProfilesListPage {
  constructor(private page: Page) {}

  get addProfileButton(): Locator {
    return this.page.getByRole('button', { name: /add a profile/i });
  }

  profileByName(name: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(name, 'i') });
  }

  async addProfile(): Promise<ProfileFormPage> {
    await this.addProfileButton.click();
    await this.page.waitForTimeout(3000);
    return new ProfileFormPage(this.page);
  }
}
