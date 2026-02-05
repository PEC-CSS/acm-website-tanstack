import z from "zod";
import { ACM_BRANCHES, DESIGNATIONS } from "$lib/constants/org";

export const BranchEnum = z.enum(ACM_BRANCHES);

export const DesignationEnum = z.enum(DESIGNATIONS);

export const BaseUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  batch: z.number().int().positive(),
  sid: z.number().int().positive(),
  verified: z.boolean(),
  designation: DesignationEnum,
});

export const UserSchema = BaseUserSchema.extend({
  profile: z.string().nullable(),
  experience: z.number(),
});

export const APIUserSchema = BaseUserSchema.extend({
  dp: z.string().nullable(),
  password: z.string(),
  xp: z.number(),
});

export const BaseEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  branch: BranchEnum,
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  relatedLink: z.string(),
  venue: z.string(),
  ended: z.boolean(),
});
