import { test, expect } from '../fixtures';
import { generateTaskData } from '../data/task.data';

test.describe('Task Creation', () => {
  test('should create a task with title, description, and up for grabs toggled', async ({ landingPage, page }) => {
    const taskData = generateTaskData();

    await landingPage.goto();
    const taskListPage = await landingPage.goToTasks();
    const taskFormPage = await taskListPage.createTask();

    await taskFormPage.fillTitle(taskData.title);
    await taskFormPage.fillDescription(taskData.description);
    await taskFormPage.toggleUpForGrabs();
    await taskFormPage.add();

    expect(await taskFormPage.isStillOnForm()).toBe(false);
    await expect(taskListPage.taskByTitle(taskData.title)).toBeVisible({ timeout: 10000 });
  });

  test('should not submit when title is empty', async ({ landingPage }) => {
    const taskData = generateTaskData({ title: '' });

    await landingPage.goto();
    const taskListPage = await landingPage.goToTasks();
    const taskFormPage = await taskListPage.createTask();

    await taskFormPage.fillDescription(taskData.description);
    await taskFormPage.toggleUpForGrabs();
    await taskFormPage.add();

    expect(await taskFormPage.isStillOnForm()).toBe(true);
  });

  test('should show error when no profile or up for grabs is selected', async ({ landingPage }) => {
    const taskData = generateTaskData({ upForGrabs: false });

    await landingPage.goto();
    const taskListPage = await landingPage.goToTasks();
    const taskFormPage = await taskListPage.createTask();

    await taskFormPage.fillTitle(taskData.title);
    await taskFormPage.fillDescription(taskData.description);
    // Do NOT toggle up for grabs or assign to a profile
    await taskFormPage.add();

    expect(await taskFormPage.isStillOnForm()).toBe(true);
    await expect(taskFormPage.profileError).toBeVisible({ timeout: 5000 });
  });
});
