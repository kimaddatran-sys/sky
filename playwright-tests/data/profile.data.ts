export interface ProfileData {
  name: string;
  birthdate: string;
  avatarIndex: number;
  colorIndex: number;
}

const avatarNames = [
  'raccoon', 'unicorn', 'lab', 'husky', 'elephant',
  'dino', 'cat', 'bunny', 'beagle', 'bear',
];

export function generateProfileData(overrides?: Partial<ProfileData>): ProfileData {
  const timestamp = Date.now();
  return {
    name: `Test_${timestamp}`,
    birthdate: '01/15/2000',
    avatarIndex: 0,
    colorIndex: 1,
    ...overrides,
  };
}

export function getAvatarName(index: number): string {
  return avatarNames[index] || avatarNames[0];
}
