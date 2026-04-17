import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, products } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key") {
      // Return null so the client falls back to local response
      return NextResponse.json({ reply: null }, { status: 200 });
    }

    const prompt = `You are Pooki's AI fashion stylist. You help customers find the perfect streetwear outfits from Pooki's collection. Be cool, trendy, and concise (max 2-3 sentences). Always recommend specific products when relevant.

Available products: ${products}

Customer message: "${message}"

Reply as the AI stylist in a cool, friendly tone. If recommending products, mention their price and suggest visiting /collections/all or /drops.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.8 },
        }),
      }
    );

    if (!response.ok) throw new Error("Gemini API error");

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Stylist API error:", err);
    return NextResponse.json({ reply: null }, { status: 200 });
  }
}
