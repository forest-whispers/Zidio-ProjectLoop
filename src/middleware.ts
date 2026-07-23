import { auth } from "@/server/modules/auth/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;

    const pathname = req.nextUrl.pathname;

    const authRoutes = ["/login", "/register"];

    const isAuthRoute = authRoutes.includes(pathname);

    if (!isLoggedIn && !isAuthRoute) {
        return Response.redirect(new URL("/login", req.url));
    }

    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/dashboard", req.url));
    }
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/workspace/:path*",
        "/settings/:path*",
        "/login",
        "/register",
    ],
};