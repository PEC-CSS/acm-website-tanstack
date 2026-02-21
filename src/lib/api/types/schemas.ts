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

// everything can be made optional to support =>
export const BaseEventSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  branch: BranchEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  relatedLink: z.string().optional(),
  venue: z.string().optional(),
  ended: z.boolean().optional(),
});

export const EventsArraySchema = z.array(BaseEventSchema).optional();

export const EventEndedEmailSchema = z.object({
  contributors: z.array(z.string()),
  publicity: z.array(z.string()),
  participants: z.array(z.string()),
  contributorXp: z.number(),
  publicityXp: z.number(),
  participantXp: z.number(),
});

export const EventEndedSIDSchema = z.object({
  contributors: z.array(z.string()),
  publicity: z.array(z.string()),
  participants: z.array(z.number()),
  contributorXp: z.number(),
  publicityXp: z.number(),
  participantXp: z.number(),
});

const BaseEventUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  dp: z.string(),
});

export const EventUserSchema = z.object({
  contributors: z.array(BaseEventUserSchema).optional(),
  publicity: z.array(BaseEventUserSchema).optional(),
  participants: z.array(BaseEventUserSchema).optional(),
});
