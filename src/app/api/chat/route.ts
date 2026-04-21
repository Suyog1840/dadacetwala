import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the "College Companion", an expert AI assistant for "DadaCETwala".
Your goal is to help students with their MHT-CET counseling, cutoffs, fee structures, and college selection queries in Maharashtra.
Be concise, helpful, and supportive. Use a friendly, professional tone. 
Keep your answers brief as the chat window is small. Use bullet points if listing options.
If you don't know the exact cutoff or fee for a specific college that requires database lookups, mention that they can use the Predictor or College tools on the website, or contact the DadaCETwala expert counselors at 8767444148 or WhatsApp 8390064849.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY missing");
      return NextResponse.json({ reply: "I'm sorry, I am currently unconfigured. Please tell the admin to set the GOOGLE_API_KEY." }, { status: 500 });
    }

    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      maxOutputTokens: 1024,
      temperature: 0.7,
    });

    const lcHistory = history.map((m: any) => {
      if (m.role === 'user') return new HumanMessage(m.content);
      return new AIMessage(m.content);
    });

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...lcHistory,
      new HumanMessage(message),
    ];

    const response = await chatModel.invoke(messages);

    return NextResponse.json({ reply: response.content });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Sorry, I am currently facing some issues. Error: " + error.message, stack: error.stack }, { status: 500 });
  }
}
