/*
 * Why use YAML + Zod setup instead of plain ol' JSON data files?
 *
 * - YAML is way easier to write — no quotes, commas, or braces everywhere
 * - Zod validates data at build time (catches typos and missing fields early)
 * - Built-in validation for emails, URLs, etc.
 * - Easy data transformation (like resolving asset paths for Vite)
 *
 * Yeah, it's a bit more setup, but the DX improvement is totally worth it.
 * */
import z from "zod";

import { PLATFORMS } from "$lib/constants/platforms";
import { resolveStaticImg, slugify } from "$lib/utils";
import DEVS from "./devs.yaml";
import SOCIALS from "./socials.yaml";
import TEAM from "./team.yaml";

const LinkSchema = z.object({
  platform: z.enum(PLATFORMS),
  url: z.url(),
});

const MemberSchema = z.object({
  name: z.string(),
  avatar: z.string().transform(av => resolveStaticImg(av)),
  links: z.array(LinkSchema).default([]),
});

const CoreMemberSchema = MemberSchema.extend({
  title: z.string(),
});

const GroupSchema = z
  .object({
    name: z.string(),
    leads: z.array(MemberSchema),
  })
  .transform(group => ({
    ...group,
    id: slugify(group.name),
  }));

const TeamSchema = z.object({
  core: z.array(CoreMemberSchema),
  groups: z.array(GroupSchema),
});

const SocialsSchema = z.array(LinkSchema);

const RoleEnum = z.enum(["Project Lead", "Co-Lead", "Backend", "Frontend", "Documentation"]);

const DevSchema = z.array(
  MemberSchema.extend({
    avatar: z
      .string()
      .transform(av => resolveStaticImg(av))
      .optional(),
    roles: z.array(RoleEnum),
  }),
);

export const DEV_DATA = DevSchema.parse(DEVS);
export type TDevData = z.infer<typeof DevSchema>;

export const TEAM_DATA = TeamSchema.parse(TEAM);
export type TTeamData = z.infer<typeof TeamSchema>;

export const SOCIALS_DATA = SocialsSchema.parse(SOCIALS);
export type TSocialsData = z.infer<typeof SocialsSchema>;
