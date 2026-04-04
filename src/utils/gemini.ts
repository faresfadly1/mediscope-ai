import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface RawFinding {
  name: string;
  value: string;
  referenceRange: string;
  status: "normal" | "needs_attention" | "unclear";
  abnormalityStrength: "none" | "mild" | "moderate" | "severe";
  note: string;
}

export interface RawAnalysisResult {
  documentType: string;
  imageQuality: "low" | "medium" | "high";
  imageClarityFeedback: string;
  dataCompleteness: "High" | "Partial" | "Low";
  extractionConfidence: number;
  findings: RawFinding[];
  summary: string;
}

export async function analyzeMedicalImage(
  base64Image: string, 
  mimeType: string
): Promise<RawAnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are an AI medical document analyzer for a hackathon prototype.
Analyze the uploaded document (image or PDF), which may be a prescription, lab report, or medical note.
Your job is NOT to diagnose.
Return ONLY valid JSON.

Tasks:
1. Identify the document type (e.g., lab report, prescription).
2. Evaluate document readability (high, medium, low) and provide specific feedback on clarity.
3. Assess data completeness (High, Partial, Low).
4. Extract the most important medical findings (test values, medications, observations).
5. For each finding, include:
   - name
   - value
   - referenceRange (if visible)
   - status: normal | needs_attention | unclear
   - abnormalityStrength: none | mild | moderate | severe
   - note (short explanation)

6. Provide:
   - extractionConfidence (0–100)
   - short summary (2–3 lines)

STRICT RULES:
- Do NOT give medical diagnosis
- Do NOT prescribe treatment
- Do NOT hallucinate values
- If unsure → mark as "unclear"

Return JSON only. No extra text.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(",")[1] || base64Image,
              mimeType,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          documentType: { type: Type.STRING },
          imageQuality: { type: Type.STRING, enum: ["low", "medium", "high"] },
          imageClarityFeedback: { type: Type.STRING },
          dataCompleteness: { type: Type.STRING, enum: ["High", "Partial", "Low"] },
          extractionConfidence: { type: Type.NUMBER },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                referenceRange: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["normal", "needs_attention", "unclear"] },
                abnormalityStrength: { type: Type.STRING, enum: ["none", "mild", "moderate", "severe"] },
                note: { type: Type.STRING },
              },
              required: ["name", "value", "referenceRange", "status", "abnormalityStrength", "note"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["documentType", "imageQuality", "imageClarityFeedback", "dataCompleteness", "extractionConfidence", "findings", "summary"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI assistant");
  }
}
