import { UserRole } from "@prisma/client";

import { prisma } from "@/server/config/db";
import { ConflictError, NotFoundError } from "@/server/shared/errors/errors";

import { hashPassword, comparePassword } from "./password";
import { SignUpDto } from "./auth.types";

function slugify(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function signUp(dto: SignUpDto) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: dto.email,
        },
    });

    if (existingUser) {
        throw new ConflictError("Email already registered.");
    }

    const passwordHash = await hashPassword(dto.password);

    if (dto.mode === "create") {
        let slug = slugify(dto.workspaceName);

        const existingWorkspace = await prisma.workspace.findUnique({
            where: {
                slug,
            },
        });

        slug = existingWorkspace
            ? `${slug}-${Date.now()}`
            : slug;

        const workspace = await prisma.workspace.create({
            data: {
                name: dto.workspaceName,
                slug,
            },
        });

        const user = await prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: UserRole.ADMIN,
                workspaceId: workspace.id,
            },
        });

        return {
            user,
            workspace,
        };
    }

    let slugInput = dto.workspaceSlug.trim();
    if (slugInput.includes("/")) {
        const segments = slugInput.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        if (lastSegment) {
            slugInput = lastSegment;
        }
    }
    const slug = slugify(slugInput);

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug,
        },
        select: {
            id: true,
            name: true,
            slug: true
        }
    });

    if (!workspace) {
        throw new NotFoundError("Workspace not found.");
    }

    const user = await prisma.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: dto.role,
            workspaceId: workspace.id,
        },
    });

    return {
        user,
        workspace,
    };
}

export async function authenticateUser(
    email: string,
    password: string
) {

    const user = await prisma.user.findUnique({
        where: {
            email: email as string,
        },
        include: {
            workspace: true,
        },
    });

    if (!user) {
        return null;
    }

    const isValid = await comparePassword(
        password as string,
        user.passwordHash
    );

    if (!isValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspace: {
            id: user.workspace.id,
            name: user.workspace.name,
            slug: user.workspace.slug,
        },
    };
}