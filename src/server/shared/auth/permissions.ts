import { UserRole } from "@prisma/client";

import { ForbiddenError } from "@/server/shared/errors/errors";

interface UserLike {
    role: UserRole;
}

export function requireRoles(
    user: UserLike,
    roles: UserRole[]
) {
    if (!roles.includes(user.role)) {
        throw new ForbiddenError("You do not have permission to perform this action.");
    }
}