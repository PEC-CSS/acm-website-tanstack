import type { TablerIcon } from "@tabler/icons-react";

import {
  IconMailFilled,
  IconBrandLinkedinFilled,
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";

export const PLATFORMS = [
  "discord",
  "github",
  "instagram",
  "youtube",
  "linkedin",
  "email",
] as const;

export type TPlatform = (typeof PLATFORMS)[number];

export const PLATFORM_ICONS: Record<TPlatform, TablerIcon> = {
  email: IconMailFilled,
  linkedin: IconBrandLinkedinFilled,
  discord: IconBrandDiscordFilled,
  github: IconBrandGithubFilled,
  instagram: IconBrandInstagramFilled,
  youtube: IconBrandYoutubeFilled,
};
