import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pool from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        let body: {
            email?: string;
            password?: string;
        } = {};

        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid JSON data",
                },
                {
                    status: 400,
                }
            );
        }

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                {
                    status: 400,
                }
            );
        }

        const [users]: any = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email = ?
            `,
            [email]
        );

        if (users.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid credentials",
                },
                {
                    status: 400,
                }
            );
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid credentials",
                },
                {
                    status: 400,
                }
            );
        }

        const token = jwt.sign(
            {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d",
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",

                token,

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Server error",
            },
            {
                status: 500,
            }
        );
    }
}