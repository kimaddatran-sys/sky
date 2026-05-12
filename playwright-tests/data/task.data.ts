export interface TaskData {
  title: string;
  description: string;
  upForGrabs: boolean;
}

export function generateTaskData(overrides?: Partial<TaskData>): TaskData {
  const timestamp = Date.now();
  return {
    title: `Test_Task_${timestamp}`,
    description: 'Automated test task description',
    upForGrabs: true,
    ...overrides,
  };
}
