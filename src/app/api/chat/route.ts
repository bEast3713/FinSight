import { NextResponse } from "next/server";

type InputMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is missing" }, { status: 500 });
  }

  const body = (await req.json()) as { messages: InputMessage[]; systemContext: string; companyName?: string };
  const companyName = body.companyName ?? "the selected company";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are a financial analyst for ${companyName}. You have access to the following data:
${body.systemContext}
Answer questions concisely. Cite specific numbers from the data. Do not invent data.`,
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
