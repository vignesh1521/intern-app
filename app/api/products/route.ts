import { NextRequest, NextResponse } from "next/server";

import pool from "@/app/lib/db";
import { requireAdmin, requireAuth } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    try {

        const auth = requireAuth(req);

        if (auth.error) {
            return auth.error;
        }

        console.log("hope");
        const [products]: any = await pool.query(
            `
            SELECT
                id,
                title,
                description,
                price
            FROM products
            ORDER BY id DESC
            `
        );

        return NextResponse.json(
            {
                success: true,
                products,
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

export async function POST(req: NextRequest) {
    try {

        const auth = requireAdmin(req);

        if (auth.error) {
            return auth.error;
        }

        const body = await req.json();

        const {
            title,
            description,
            price,
        } = body;

        if (
            !title ||
            !description ||
            !price
        ) {
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

        const [result]: any = await pool.query(
            `
            INSERT INTO products (
                title,
                description,
                price
            )
            VALUES (?, ?, ?)
            `,
            [
                title,
                description,
                price,
            ]
        );

        const [products]: any = await pool.query(
            `
            SELECT *
            FROM products
            WHERE id = ?
            `,
            [result.insertId]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product created",
                product: products[0],
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
