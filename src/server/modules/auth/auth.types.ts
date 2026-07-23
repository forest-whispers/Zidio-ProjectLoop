export type SignUpDto =
    | {
        mode: "create";
        name: string;
        email: string;
        password: string;
        workspaceName: string;
    }
    | {
        mode: "join";
        name: string;
        email: string;
        password: string;
        workspaceSlug: string;
        role: "ANALYST" | "VIEWER";
    };

export interface LoginDto {
    email: string;
    password: string;
}

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "ANALYST" | "VIEWER";
    workspaceId: string;
}