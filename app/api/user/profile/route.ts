import { authOptions } from "@/lib/options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(){
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user.id){
            return NextResponse.json({
                message: "User is Unauthorized"
            }, {status: 401})
        }

        const currentUserEmail = await session.user.email;

        const foundUser = await prisma.user.findUnique({
            where: {
                email: currentUserEmail as string
            }
        })

        if(!foundUser){
            return NextResponse.json({
                message: "User not found"
            }, {status: 404})
        }

        return NextResponse.json({
            message: "User successfully fetched",
            user: foundUser
        }, {status: 200})
    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}