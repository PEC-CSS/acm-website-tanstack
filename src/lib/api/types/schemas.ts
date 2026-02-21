import z from "zod";

import { ACM_BRANCHES } from "$lib/constants/org";
import { DesignationEnum } from "$lib/types";

export const BranchEnum = z.enum(ACM_BRANCHES);

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

export const AuthenticatedUserSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export const APILoginResponseSchema = z.object({
  jwtToken: z.string(),
  user: APIUserSchema,
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
