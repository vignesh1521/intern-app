import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import pool from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        let body: {
            name?: string;
            email?: string;
            password?: string;
        } = {};

        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid data",
                },
                {
                    status: 400,
                }
            );
        }

        const { name, email, password } = body;

        if (!name || !email || !password) {
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

        const [existingUsers]: any = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO users (
                name,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword,
                "admin",
            ]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
            },
            {
                status: 201,
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