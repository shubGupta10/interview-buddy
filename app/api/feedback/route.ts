import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !message) {
            return NextResponse.json(
                { message: "Name and message are required" },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                name,
                email,
                message,
            },
        });

        return NextResponse.json(
            { message: "Feedback submitted successfully", feedback },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving feedback:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
