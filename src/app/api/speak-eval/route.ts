import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { env, hasGemini, hasGroq } from "@/lib/env";
import { speechMatchesTarget } from "@/lib/speakMatch";
import type { SpeakEvalResult } from "@/lib/types";

const MATCH: SpeakEvalResult = {
  understood: true,
  praise_hi: "वाह! आपने बहुत अच्छा बोला।",
  tip_hi: "इसी तरह रोज़ थोड़ा अभ्यास जारी रखें।",
  model_en: "",
};

const RETRY: SpeakEvalResult = {
  understood: false,
  praise_hi: "बहुत बढ़िया कोशिश! एक बार ऐसे सुनकर दोहराएँ।",
  tip_hi: "मॉडल वाक्य सुनकर वही शब्द धीरे बोलें।",
  model_en: "",
};

function withModel(result: SpeakEvalResult, modelEn: string): SpeakEvalResult {
  return { ...result, model_en: modelEn || result.model_en };
}

async function praiseWithGemini(
  transcript: string,
  targetEn: string,
  targetHi: string,
): Promise<SpeakEvalResult> {
  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey! });
  const prompt = `You are English Sakhi, a warm Hindi-speaking coach for Indian homemakers learning English.
Never say गलत, Wrong, Incorrect, or use a red X tone.
The learner's words already match the target. Write praise only.
Learner said: "${transcript}"
Target English: "${targetEn}"
Target Hindi meaning: "${targetHi}"
Return ONLY compact JSON:
{"understood":true,"praise_hi":"warm Hindi praise","tip_hi":"one short Hindi tip","model_en":"${targetEn}"}`;

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
    understood: true,
    praise_hi: parsed.praise_hi || MATCH.praise_hi,
    tip_hi: parsed.tip_hi || MATCH.tip_hi,
    model_en: targetEn,
  };
}

async function praiseWithGroq(
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
            "Warm Hindi coach. The learner already matched the target. Never say Wrong/गलत. JSON only: understood true, praise_hi, tip_hi, model_en.",
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
    understood: true,
    praise_hi: parsed.praise_hi || MATCH.praise_hi,
    tip_hi: parsed.tip_hi || MATCH.tip_hi,
    model_en: targetEn,
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
        withModel(
          {
            ...RETRY,
            praise_hi: "पहले माइक पर टैप करके बोलें, फिर जाँच करें।",
            tip_hi: "शांत जगह पर पूरा वाक्य बोलें।",
          },
          targetEn,
        ),
      );
    }

    if (!speechMatchesTarget(transcript, targetEn)) {
      return NextResponse.json(withModel(RETRY, targetEn));
    }

    try {
      if (hasGemini()) {
        const result = await praiseWithGemini(transcript, targetEn, targetHi);
        return NextResponse.json(result);
      }
      if (hasGroq()) {
        const result = await praiseWithGroq(transcript, targetEn, targetHi);
        return NextResponse.json(result);
      }
    } catch {
      // The words already match — praise without the model.
    }

    return NextResponse.json(withModel(MATCH, targetEn));
  } catch {
    return NextResponse.json({
      understood: false,
      praise_hi: "अभी जाँच नहीं हो सकी — फिर से कोशिश करें।",
      tip_hi: "नेट धीमा हो तो भी वाक्य सुनकर दोहराएँ।",
      model_en: "",
    });
  }
}
