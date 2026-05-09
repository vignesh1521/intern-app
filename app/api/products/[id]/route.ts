import { NextRequest, NextResponse } from "next/server";

import pool from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/auth";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const auth = requireAdmin(req);

        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;

        const [products]: any = await pool.query(
            `
            SELECT id
            FROM products
            WHERE id = ?
            `,
            [id]
        );

        if (products.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        await pool.query(
            `
            DELETE FROM products
            WHERE id = ?
            `,
            [id]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
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

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const auth = requireAdmin(req);

        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;

        const body = await req.json();

        const {
            title,
            description,
            price,
        } = body;

        const parsedPrice = Number(price);

        if (
            isNaN(parsedPrice) ||
            parsedPrice <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Price must be a valid positive number",
                },
                {
                    status: 400,
                }
            );
        }

        await pool.query(
            `
            UPDATE products
            SET
                title = ?,
                description = ?,
                price = ?
            WHERE id = ?
            `,
            [
                title,
                description,
                parsedPrice,
                id,
            ]
        );

        return NextResponse.json({
            success: true,
            message: "Product updated",
        });

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