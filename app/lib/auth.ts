import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

type JwtPayload = {
    userId: number;
    name: string;
    email: string;
    role: "admin" | "user";
};

export function verifyToken(
    token: string
): JwtPayload | null {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

    } catch {
        return null;
    }
}

export function requireAuth(
    req: NextRequest
) {
    console.log(req);
    const authHeader =
        req.headers.get("authorization");

    const token =
        authHeader?.split(" ")[1];


    if (!token) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    return {
        user: decoded,
    };
}

export function requireAdmin(
    req: NextRequest
) {
    const auth = requireAuth(req);

    if (auth.error) {
        return auth;
    }

    if (auth.user.role !== "admin") {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    message: "Admin only",
                },
                {
                    status: 403,
                }
            ),
        };
    }

    return auth;
}