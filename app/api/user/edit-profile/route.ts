import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    try {
        const { userId, name, email } = await req.json();
        if (!userId) {
            return NextResponse.json({
                message: "User is unauthorized",
            }, { status: 404 })
        }

        const foundUser = prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!foundUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email
            }
        })

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        }, { status: 200 })

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({
            message: "Internal Server Error",
        }, { status: 500 });
    }
}