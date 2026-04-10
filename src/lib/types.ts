import z from "zod";

import { ACM_BRANCHES, DESIGNATIONS } from "./constants/org";

export const AcmBranchEnum = z.enum(ACM_BRANCHES).meta({
  title: "ACM Branch Name",
  "x-enumDescriptions": {
    DEVELOPMENT: "Development",
    AI: "Artificial Intelligence",
    CP: "Competitive Programming",
    CYBER: "Cyber-Security",
    SOCIALS: "Social",
    WIT: "Women In Tech",
  },
});

export type Designation = (typeof DESIGNATIONS)[number];

export const DesignationEnum = z.enum(DESIGNATIONS);

const DESIGNATION_RANK: Record<Designation, number> = {
  Member: 0,
  ImplementationBody: 1,
  ExecutiveBody: 2,
  Core: 3,
  Admin: 4,
};

export function hasRole(actual: Designation, required: Designation): boolean {
  return DESIGNATION_RANK[actual] >= DESIGNATION_RANK[required];
}
