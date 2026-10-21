import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { env, hasGemini, hasGroq } from "@/lib/env";
import type { SpeakEvalResult } from "@/lib/types";

const FALLBACK: SpeakEvalResult = {
  understood: true,
  praise_hi: "बहुत बढ़िया कोशिश! एक बार ऐसे सुनकर दोहराएँ।",
  tip_hi: "धीरे-धीरे बोलें — हर शब्द साफ़।",
  model_en: "",
};

function offlineEval(transcript: string, targetEn: string): SpeakEvalResult {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const t = norm(transcript);
  const target = norm(targetEn);
  const words = target.split(" ").filter(Boolean);
  const hits = words.filter((w) => t.includes(w)).length;
  const ratio = words.length ? hits / words.length : 0;
  const understood = ratio >= 0.5 || t.includes(target.slice(0, 8));

  return {
    understood,
    praise_hi: understood
      ? "वाह! आपने बहुत अच्छा बोला।"
      : "बहुत बढ़िया कोशिश! एक बार ऐसे सुनकर दोहराएँ।",
    tip_hi: understood
      ? "इसी तरह रोज़ थोड़ा अभ्यास जारी रखें।"
      : "मॉडल वाक्य सुनकर धीरे दोहराएँ — कोई जल्दी नहीं।",
    model_en: targetEn,
  };
}

async function evalWithGemini(
  transcript: string,
  targetEn: string,
  targetHi: string,
): Promise<SpeakEvalResult> {
  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey! });
  const prompt = `You are English Sakhi, a warm Hindi-speaking coach for Indian homemakers learning English.
Never say गलत, Wrong, Incorrect, or use a red X tone.
Learner said (speech-to-text, may be imperfect): "${transcript}"
Target English: "${targetEn}"
Target Hindi meaning: "${targetHi}"
Return ONLY compact JSON:
{"understood":boolean,"praise_hi":"warm Hindi praise","tip_hi":"one short Hindi tip","model_en":"natural English phrase to practise"}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const text = response.text?.trim() ?? "";
  const parsed = JSON.parse(text) as SpeakEvalResult;
  return {
    understood: Boolean(parsed.understood),
    praise_hi: parsed.praise_hi || FALLBACK.praise_hi,
    tip_hi: parsed.tip_hi || FALLBACK.tip_hi,
    model_en: parsed.model_en || targetEn,
  };
}

async function evalWithGroq(
  transcript: string,
  targetEn: string,
  targetHi: string,
): Promise<SpeakEvalResult> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Warm Hindi coach for Indian homemakers. Never say Wrong/गलत. JSON only: understood, praise_hi, tip_hi, model_en.",
        },
        {
          role: "user",
          content: `Said: "${transcript}"\nTarget EN: "${targetEn}"\nTarget HI: "${targetHi}"`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error("groq_failed");
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as SpeakEvalResult;
  return {
    understood: Boolean(parsed.understood),
    praise_hi: parsed.praise_hi || FALLBACK.praise_hi,
    tip_hi: parsed.tip_hi || FALLBACK.tip_hi,
    model_en: parsed.model_en || targetEn,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      transcript?: string;
      targetEn?: string;
      targetHi?: string;
    };

    const transcript = body.transcript?.trim() ?? "";
    const targetEn = body.targetEn?.trim() ?? "";
    const targetHi = body.targetHi?.trim() ?? "";

    if (!transcript || !targetEn) {
      return NextResponse.json(
        { ...FALLBACK, praise_hi: "पहले माइक से बोलें, फिर जाँच करें।" },
        { status: 200 },
      );
    }

    try {
      if (hasGemini()) {
        const result = await evalWithGemini(transcript, targetEn, targetHi);
        return NextResponse.json(result);
      }
      if (hasGroq()) {
        const result = await evalWithGroq(transcript, targetEn, targetHi);
        return NextResponse.json(result);
      }
    } catch {
      // fall through to offline heuristic
    }

    return NextResponse.json(offlineEval(transcript, targetEn));
  } catch {
    return NextResponse.json(
      {
        ...FALLBACK,
        praise_hi: "अभी जाँच नहीं हो सकी — फिर भी आपकी कोशिश सराहनीय है।",
      },
      { status: 200 },
    );
  }
}
