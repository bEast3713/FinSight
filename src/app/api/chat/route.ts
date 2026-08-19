import { NextResponse } from "next/server";

type InputMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "AIzaSyCD2T7AerFqCtpyDMgbFmuEfK4nTXYZcow") {
    return NextResponse.json(
      { error: "Please add your Gemini API Key in .env.local to enable AI Chat." },
      { status: 401 }
    );
  }

  const body = (await req.json()) as { messages: InputMessage[]; systemContext: string; companyName?: string };
  const companyName = body.companyName ?? "the selected company";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are an expert financial analyst for ${companyName}. You have access to the following REAL-TIME live market data:
${body.systemContext}
Analyze the data provided. Answer questions concisely, cite specific numbers, and do not invent data.`,
              },
            ],
          },
          generationConfig: {
            maxOutputTokens: 1024,
          },
          contents: body.messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
        }),
      },
    );

    if (response.status === 429) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText || "Gemini request failed" }, { status: 500 });
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    const reply =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ||
      "No response generated.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
