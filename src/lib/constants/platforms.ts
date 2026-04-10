export const PLATFORMS = [
  "discord",
  "github",
  "instagram",
  "youtube",
  "linkedin",
  "email",
] as const;

export type TPlatform = (typeof PLATFORMS)[number];
