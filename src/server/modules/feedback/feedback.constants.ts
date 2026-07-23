import { UserRole } from "@prisma/client";

export const FEEDBACK_WRITE_ROLES = [
    UserRole.ADMIN,
    UserRole.ANALYST,
] as const;