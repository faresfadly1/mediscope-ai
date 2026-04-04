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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function buildFallbackAnalysis(mimeType: string): RawAnalysisResult {
  const documentType = mimeType === "application/pdf" ? "Lab report PDF" : "Medical image";

  return {
    documentType,
    imageQuality: "medium",
    imageClarityFeedback: "Demo mode is active, so this is a simulated analysis summary for presentation purposes.",
    dataCompleteness: "Partial",
    extractionConfidence: 72,
    findings: [
      {
        name: "Hemoglobin",
        value: "13.1 g/dL",
        referenceRange: "12.0 - 15.5 g/dL",
        status: "normal",
        abnormalityStrength: "none",
        note: "Within the expected reference range in demo mode.",
      },
      {
        name: "White Blood Cells",
        value: "11.4 x10^9/L",
        referenceRange: "4.0 - 11.0 x10^9/L",
        status: "needs_attention",
        abnormalityStrength: "mild",
        note: "Slightly elevated in this simulated example.",
      },
      {
        name: "Platelets",
        value: "265 x10^9/L",
        referenceRange: "150 - 450 x10^9/L",
        status: "normal",
        abnormalityStrength: "none",
        note: "Appears within range in demo mode.",
      },
    ],
    summary:
      "Demo analysis generated because a live Gemini API key is not configured for this public deployment. Upload and scoring flows still work for showcasing the product experience.",
  };
}

export async function analyzeMedicalImage(
  base64Image: string, 
  mimeType: string
): Promise<RawAnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64Image,
        mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Analysis endpoint unavailable, switching to demo mode", e);
    return buildFallbackAnalysis(mimeType);
  }
}
