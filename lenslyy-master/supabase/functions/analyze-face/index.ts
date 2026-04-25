import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert eyewear stylist and face-shape analyst.
Analyze the person's face in the image and determine their face shape.
Then recommend the best glasses styles for them.

You MUST call the function 'recommend_eyewear' with the structured result.
Face shape MUST be exactly one of: "Round", "Oval", "Square", "Heart".
Frame shapes MUST be from: "Round", "Square", "Aviator", "Cat-eye", "Wayfarer", "Rectangle".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this face and recommend the best eyewear styles." },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_eyewear",
              description: "Return face shape analysis and eyewear recommendation.",
              parameters: {
                type: "object",
                properties: {
                  faceShape: { type: "string", enum: ["Round", "Oval", "Square", "Heart"] },
                  confidence: { type: "number", description: "0 to 1" },
                  reasoning: { type: "string", description: "1-2 sentences why this is the face shape." },
                  recommendedFrames: {
                    type: "array",
                    items: { type: "string", enum: ["Round", "Square", "Aviator", "Cat-eye", "Wayfarer", "Rectangle"] },
                  },
                  styleAdvice: { type: "string", description: "2-3 sentence styling tip explaining why these frames suit the user." },
                  avoid: { type: "string", description: "Frames or styles to avoid." },
                },
                required: ["faceShape", "confidence", "reasoning", "recommendedFrames", "styleAdvice", "avoid"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "recommend_eyewear" } },
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("AI gateway error", response.status, txt);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "No structured response from AI" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-face error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});