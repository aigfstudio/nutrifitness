import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Initialize the Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const supabase = createAdminClient();
    
    // Fetch products to give Gemini context about what we sell
    const { data: products } = await supabase.from('products').select('name, description_short, price, category');
    
    const systemInstruction = `You are a helpful AI assistant for NutriFitness, a premium Swiss fitness and nutrition store. 
Your goal is to help users find the perfect products based on their fitness goals, dietary requirements, and questions.
Always be polite, concise, and encourage them to achieve their best body.
Here is the current catalog of products we sell:
${JSON.stringify(products)}

Only recommend products from this list. If they ask for something we don't have, politely suggest the closest alternative. Prices are in CHF.`;

    // Convert messages to Gemini format
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Start a chat session and send the message
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ 
      role: 'assistant', 
      content: response.text 
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
