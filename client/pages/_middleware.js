import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Redirect if not logged in and trying to access a protected route
    if (!token && pathname.startsWith("/protected")) {
        return new Response("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
}
