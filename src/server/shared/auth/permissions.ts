import { UserRole } from "@prisma/client";

import { ForbiddenError } from "@/server/shared/errors/errors";

interface UserLike {
    role: UserRole | readonly UserRole[]
}

export function requireRoles(
    user: UserLike,
    roles: UserRole | readonly UserRole[]
) {
    const roleList = Array.isArray(roles) ? roles : [roles];

    if (!roleList.includes(user.role)) {
        throw new ForbiddenError("You do not have permission to perform this action.");
    }
}