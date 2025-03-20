import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/health`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Backend is down!");
    }

    return NextResponse.json({ message: "Ping successful!" });
  } catch (error) {
    console.error("Ping failed:", error);
    return NextResponse.json({ error: "Failed to ping backend." }, { status: 500 });
  }
}
