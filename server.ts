import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: "20mb" }));

app.post("/api/analyze", async (req, res) => {
  const { base64Image, mimeType } = req.body ?? {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY on the server." });
  }

  if (!base64Image || !mimeType) {
    return res.status(400).json({ error: "base64Image and mimeType are required." });
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";

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
   - extractionConfidence (0-100)
   - short summary (2-3 lines)

STRICT RULES:
- Do NOT give medical diagnosis
- Do NOT prescribe treatment
- Do NOT hallucinate values
- If unsure, mark the item as "unclear"

Return JSON only. No extra text.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: String(base64Image).split(",")[1] || String(base64Image),
                mimeType: String(mimeType),
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
          required: [
            "documentType",
            "imageQuality",
            "imageClarityFeedback",
            "dataCompleteness",
            "extractionConfidence",
            "findings",
            "summary",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    console.error("Gemini server analysis failed", error);
    return res.status(500).json({ error: "Gemini analysis failed." });
  }
});

app.listen(port, () => {
  console.log(`MediScope analysis API listening on http://localhost:${port}`);
});
