import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { question } = body;

    // TODO: Replace this with an actual call to Srinivethitha's LangChain backend
    return NextResponse.json({
        answer: `You asked: "${question}". The real answer will come from the Semantic Layer + LangChain backend once connected.`,
    });
}