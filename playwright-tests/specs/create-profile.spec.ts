import { test, expect } from '../fixtures';
import { generateProfileData } from '../data/profile.data';

test.describe('Profile Creation', () => {
  test('should create a profile with all fields filled', async ({ landingPage, page }) => {
    const profileData = generateProfileData();

    await landingPage.goto();
    const profilesListPage = await landingPage.goToProfiles();
    const profileFormPage = await profilesListPage.addProfile();

    await profileFormPage.selectAvatar(profileData.avatarIndex);
    await profileFormPage.selectColor(profileData.colorIndex);
    await profileFormPage.fillName(profileData.name);
    await profileFormPage.fillBirthdate(profileData.birthdate);
    await profileFormPage.save();

    // After successful creation, page navigates away from the form
    expect(await profileFormPage.isStillOnForm()).toBe(false);
    // Confirmation toast appears
    await expect(page.getByText(`${profileData.name} created`)).toBeVisible({ timeout: 10000 });
  });

  test('should show error when saving with empty name', async ({ landingPage }) => {
    const profileData = generateProfileData({ name: '' });

    await landingPage.goto();
    const profilesListPage = await landingPage.goToProfiles();
    const profileFormPage = await profilesListPage.addProfile();

    await profileFormPage.selectAvatar(profileData.avatarIndex);
    await profileFormPage.selectColor(profileData.colorIndex);
    await profileFormPage.fillBirthdate(profileData.birthdate);
    await profileFormPage.save();

    expect(await profileFormPage.isStillOnForm()).toBe(true);
  });

  test('should show error when saving without picking a color', async ({ landingPage }) => {
    const profileData = generateProfileData();

    await landingPage.goto();
    const profilesListPage = await landingPage.goToProfiles();
    const profileFormPage = await profilesListPage.addProfile();

    await profileFormPage.selectAvatar(profileData.avatarIndex);
    // Do NOT select a color
    await profileFormPage.fillName(profileData.name);
    await profileFormPage.fillBirthdate(profileData.birthdate);
    await profileFormPage.save();

    expect(await profileFormPage.isStillOnForm()).toBe(true);
  });
});
