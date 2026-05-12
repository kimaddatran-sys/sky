import { test as base } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { ProfilesListPage } from '../pages/ProfilesListPage';
import { ProfileFormPage } from '../pages/ProfileFormPage';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskFormPage } from '../pages/TaskFormPage';

type TestFixtures = {
  landingPage: LandingPage;
  profilesListPage: ProfilesListPage;
  profileFormPage: ProfileFormPage;
  taskListPage: TaskListPage;
  taskFormPage: TaskFormPage;
};

export const test = base.extend<TestFixtures>({
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  profilesListPage: async ({ page }, use) => {
    await use(new ProfilesListPage(page));
  },
  profileFormPage: async ({ page }, use) => {
    await use(new ProfileFormPage(page));
  },
  taskListPage: async ({ page }, use) => {
    await use(new TaskListPage(page));
  },
  taskFormPage: async ({ page }, use) => {
    await use(new TaskFormPage(page));
  },
});

export { expect } from '@playwright/test';
