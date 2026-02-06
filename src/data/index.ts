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
import { resolveStaticImg } from "$lib/utils";

const MemberSchema = z.object({
  name: z.string(),
  avatar: z.string().transform(av => resolveStaticImg(av)),
});

const CoreMemberSchema = MemberSchema.extend({
  title: z.string(),
});

const GroupSchema = z.object({
  name: z.string(),
  leads: z.array(MemberSchema),
});

const TeamSchema = z.object({
  core: z.array(CoreMemberSchema),
  groups: z.array(GroupSchema),
});

export type TeamData = z.infer<typeof TeamSchema>;
