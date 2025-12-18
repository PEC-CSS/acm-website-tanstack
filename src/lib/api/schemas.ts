import z from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  batch: z.number(),
  profile: z.string().nullable(),
  sid: z.number(),
  verified: z.boolean(),
  designation: z.literal([
    "Member",
    "ImplementationBody",
    "ExecutiveBody",
    "Core",
    "Admin",
  ]),
  experience: z.number(),
});
