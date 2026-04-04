import { RawAnalysisResult, RawFinding } from "./gemini";
import { Language, translations } from "./translations";

export interface LifestyleData {
  sleepHours: number;
  activityLevel: "Low" | "Moderate" | "High";
  stressLevel: "Low" | "Moderate" | "High";
}

export interface Finding {
  name: string;
  value: string;
  referenceRange: string;
  status: "normal" | "needs_attention" | "unclear";
  severity: "low" | "moderate" | "high";
  implication: string;
}

export interface HealthReport {
  documentType: string;
  confidence: {
    extractionConfidence: number;
    imageQuality: "low" | "medium" | "high";
    imageClarityFeedback: string;
    dataCompleteness: "High" | "Partial" | "Low";
  };
  clinical: {
    findings: Finding[];
    clinicalRiskScore: number;
    clinicalRiskLevel: string;
    summary: string;
  };
  lifestyle: {
    sleepScore: number;
    activityScore: number;
    stressScore: number;
    lifestyleScore: number;
    lifestyleRiskLevel: string;
  };
  correlation: {
    combinedRiskScore: number;
    combinedRiskLevel: string;
    drivers: { factor: string; impact: string }[];
    insight: string;
  };
  decisionSupport: {
    level: "low" | "moderate" | "high";
    title: string;
    verdict: string;
    meaning: string;
    why: string;
    action: string;
    immediateActions: string[];
    keyDrivers: string[];
    humanLayer: string;
    specificMessages?: {
      lines: string[];
      actions: string[];
    };
    possibleContributors: string[];
  };
  actions: {
    followUpPriority: "low" | "moderate" | "high";
    nextSteps: string[];
  };
  safety: {
    disclaimer: string;
  };
}

function getSmartLabel(score: number, type: "clinical" | "lifestyle", lang: Language): string {
  const t = translations[lang].report.labels;
  if (type === "clinical") {
    if (score < 25) return t.clinicalLow;
    if (score < 55) return t.clinicalModerate;
    return t.clinicalHigh;
  } else {
    if (score >= 80) return t.lifestyleOptimal;
    if (score >= 60) return t.lifestyleModerate;
    return t.lifestyleSuboptimal;
  }
}

function generateCorrelation(
  findings: Finding[],
  lifestyleInput: LifestyleData,
  lifestyleResult: any,
  lang: Language
) {
  const t = translations[lang].report;
  const abnormalFindings = findings.filter(f => f.status === "needs_attention");
  const abnormalNames = abnormalFindings.map(f => f.name.toLowerCase());

  const hasLowRBC = abnormalNames.some(n => n.includes("rbc"));
  const hasLowHCT = abnormalNames.some(n => n.includes("hct") || n.includes("hematocrit"));
  const poorSleep = lifestyleInput.sleepHours < 7;
  const highStress = lifestyleInput.stressLevel.toLowerCase() === "high";
  const moderateStress = lifestyleInput.stressLevel.toLowerCase() === "moderate";

  const drivers: { factor: string; impact: string }[] = [];
  let combinedRiskScore = 0;
  let insight = t.insights.stable;

  if (hasLowRBC) {
    drivers.push({ factor: t.drivers.rbc, impact: t.drivers.impacts.rbc });
    combinedRiskScore += 20;
  }
  if (hasLowHCT) {
    drivers.push({ factor: t.drivers.hct, impact: t.drivers.impacts.hct });
    combinedRiskScore += 15;
  }
  if (poorSleep) {
    drivers.push({ factor: t.drivers.sleep, impact: t.drivers.impacts.sleep });
    combinedRiskScore += 15;
  }
  if (highStress || moderateStress) {
    const factorName = highStress ? t.drivers.stress : t.drivers.modStress;
    drivers.push({ factor: factorName, impact: t.drivers.impacts.stress });
    combinedRiskScore += (highStress ? 20 : 10);
  }

  if ((hasLowRBC || hasLowHCT) && (poorSleep || moderateStress || highStress)) {
    insight = t.insights.abnormal;
    combinedRiskScore += 15;
  } else if (abnormalFindings.length > 0) {
    insight = t.insights.mild;
  }

  combinedRiskScore = Math.min(combinedRiskScore, 100);

  return {
    combinedRiskScore,
    combinedRiskLevel: getSmartLabel(combinedRiskScore, "clinical", lang),
    drivers,
    insight
  };
}

function getSleepAdvice(sleepHours: number, lang: Language): string {
  const t = translations[lang].report.actions;
  if (sleepHours < 6) {
    return t.sleepLow.replace("{current}", sleepHours.toString());
  }
  if (sleepHours >= 6 && sleepHours <= 9) {
    return t.sleepHealthy.replace("{current}", sleepHours.toString());
  }
  return t.sleepHigh.replace("{current}", sleepHours.toString());
}

function generateActionSteps(
  findings: Finding[],
  lifestyleInput: LifestyleData,
  followUpPriority: string,
  lang: Language
): string[] {
  const t = translations[lang].report.actions;
  const actions: string[] = [];
  const abnormalNames = findings
    .filter(f => f.status === "needs_attention")
    .map(f => f.name.toLowerCase());

  if (abnormalNames.some(n => n.includes("rbc") || n.includes("hct") || n.includes("hematocrit"))) {
    actions.push(t.blood);
  }

  actions.push(getSleepAdvice(lifestyleInput.sleepHours, lang));

  if (lifestyleInput.stressLevel.toLowerCase() === "high") {
    actions.push(t.stress);
  }

  if (lifestyleInput.activityLevel.toLowerCase() === "low") {
    actions.push(t.activity);
  }

  if (actions.length < 3) {
    actions.push(t.symptoms);
  }

  return actions.slice(0, 4);
}

function calculateSleepScore(hours: number): number {
  if (hours < 5) return 35;
  if (hours < 6) return 50;
  if (hours < 7) return 70;
  if (hours <= 9) return 100;
  if (hours <= 10) return 85;
  return 70;
}

function calculateActivityScore(level: string): number {
  switch (level.toLowerCase()) {
    case "low": return 45;
    case "moderate": return 80;
    case "high": return 100;
    default: return 60;
  }
}

function calculateStressScore(level: string): number {
  switch (level.toLowerCase()) {
    case "low": return 100;
    case "moderate": return 70;
    case "high": return 35;
    default: return 60;
  }
}

function mapSeverity(strength: string): "low" | "moderate" | "high" {
  switch (strength.toLowerCase()) {
    case "none":
    case "mild":
      return "low";
    case "moderate":
      return "moderate";
    case "severe":
      return "high";
    default:
      return "moderate";
  }
}

function generateImplication(finding: RawFinding, lang: Language): string {
  const t = translations[lang].report.implications;
  const name = finding.name.toLowerCase();
  if (name.includes("rbc") || name.includes("hematocrit") || name.includes("hct")) {
    return t.oxygen;
  }
  if (name.includes("wbc")) {
    return t.immune;
  }
  if (name.includes("glucose") || name.includes("sugar")) {
    return t.glucose;
  }
  return finding.note || t.default;
}

function getFindingRiskWeight(finding: Finding): number {
  if (finding.status === "normal") return 0;
  if (finding.status === "unclear") return 8;

  switch (finding.severity) {
    case "low": return 12;
    case "moderate": return 22;
    case "high": return 35;
    default: return 15;
  }
}

function calculateClinicalRiskScore(findings: Finding[]): number {
  const total = findings.reduce((sum, finding) => sum + getFindingRiskWeight(finding), 0);
  return Math.min(total, 100);
}

function getFollowUpPriority(
  clinicalRiskScore: number,
  combinedRiskScore: number,
  findings: Finding[]
): "low" | "moderate" | "high" {
  const hasHighSeverity = findings.some(f => f.severity === "high");
  const needsAttentionCount = findings.filter(f => f.status === "needs_attention").length;

  if (hasHighSeverity || clinicalRiskScore >= 60 || combinedRiskScore >= 70) return "high";
  if (needsAttentionCount >= 1 || clinicalRiskScore >= 30 || combinedRiskScore >= 40) return "moderate";
  return "low";
}

function normalizeConfidence(rawConfidence: number = 75, imageQuality: string = "medium") {
  let adjusted = rawConfidence;
  if (imageQuality === "low") adjusted -= 15;
  if (imageQuality === "medium") adjusted -= 5;
  adjusted = Math.max(0, Math.min(100, adjusted));
  return { extractionConfidence: adjusted, imageQuality: imageQuality as "low" | "medium" | "high" };
}

function getConcernLevel(clinicalRisk: number, combinedRisk: number, findings: Finding[]): "low" | "moderate" | "high" {
  const hasHighSeverity = findings.some(f => f.severity === "high");
  const needsAttention = findings.filter(f => f.status === "needs_attention").length;

  if (hasHighSeverity || combinedRisk >= 70 || clinicalRisk >= 60) {
    return "high";
  }

  if (needsAttention >= 1 || combinedRisk >= 40 || clinicalRisk >= 30) {
    return "moderate";
  }

  return "low";
}

function generateImmediateActions(
  findings: Finding[],
  lifestyleInput: LifestyleData,
  lang: Language
): string[] {
  const t = translations[lang].report.immediateActions;
  const actions: string[] = [];
  const abnormalNames = findings
    .filter(f => f.status === "needs_attention")
    .map(f => f.name.toLowerCase());

  const hasLowRBC = abnormalNames.some(n => n.includes("rbc") || n.includes("hct") || n.includes("hematocrit"));
  const highStress = lifestyleInput.stressLevel.toLowerCase() === "high";
  const poorSleep = lifestyleInput.sleepHours < 7;

  if (hasLowRBC) {
    actions.push(...t.rbc);
  }
  if (highStress) {
    actions.push(...t.stress);
  }
  if (poorSleep) {
    actions.push(...t.sleep);
  }

  if (actions.length === 0) {
    actions.push(...t.default);
  }

  // Deduplicate and limit to 4 most relevant
  return Array.from(new Set(actions)).slice(0, 4);
}

function buildReportSpecificMessage(
  findings: Finding[],
  lifestyle: LifestyleData,
  lang: Language
): { lines: string[]; actions: string[] } {
  const t = translations[lang].report.actions;
  const hasLowVitaminD = findings.some(f => f.name.includes("Vitamin D") && f.status === "needs_attention");
  const rbcNormal = findings.some(f => f.name === "RBC" && f.status === "normal");
  const hgbNormal = findings.some(f => f.name === "HGB" && f.status === "normal");
  const hctNormal = findings.some(f => f.name === "HCT" && f.status === "normal");
  const plateletIndicesHigh =
    findings.some(f => f.name === "MPV" && f.status === "needs_attention") ||
    findings.some(f => f.name === "PDW" && f.status === "needs_attention") ||
    findings.some(f => f.name === "P-LCR" && f.status === "needs_attention");

  const lines: string[] = [];
  const actions: string[] = [];

  if (hasLowVitaminD) {
    lines.push(t.mainAbnormalVitaminD);
    actions.push(t.lowVitaminD);
  }

  if (rbcNormal && hgbNormal && hctNormal) {
    lines.push(t.noAnemia);
  }

  if (plateletIndicesHigh) {
    lines.push(t.plateletHigh);
  }

  if (lifestyle.sleepHours < 7 || lifestyle.sleepHours > 9) {
    actions.push(getSleepAdvice(lifestyle.sleepHours, lang));
  }

  if (lifestyle.stressLevel.toLowerCase() === "high") {
    actions.push(t.reduceStress);
  }

  if (actions.length === 0) {
    actions.push(t.noLifestyleChange);
  }

  return { lines, actions };
}

function generatePossibleContributors(
  findings: Finding[],
  lifestyle: LifestyleData,
  lang: Language
): string[] {
  const t = translations[lang].report.contributors;
  const contributors: string[] = [];

  // Check findings
  const abnormalFindings = findings.filter(f => f.status === "needs_attention");
  
  const hasLowVitaminD = abnormalFindings.some(f => f.name.toLowerCase().includes("vitamin d"));
  const hasLowIron = abnormalFindings.some(f => f.name.toLowerCase().includes("ferritin") || f.name.toLowerCase().includes("iron"));
  const hasGlucoseIssues = abnormalFindings.some(f => f.name.toLowerCase().includes("glucose") || f.name.toLowerCase().includes("sugar"));
  const hasImmuneIssues = abnormalFindings.some(f => f.name.toLowerCase().includes("wbc"));

  if (hasLowVitaminD) contributors.push(t.vitaminD);
  if (hasLowIron) contributors.push(t.iron);
  if (hasGlucoseIssues) contributors.push(t.glucose);
  if (hasImmuneIssues) contributors.push(t.immune);

  // Check lifestyle
  if (lifestyle.sleepHours < 7) contributors.push(t.sleep);
  if (lifestyle.stressLevel.toLowerCase() === "high") contributors.push(t.stress);
  if (lifestyle.activityLevel.toLowerCase() === "low") contributors.push(t.activity);

  // Fallback if nothing specific
  if (contributors.length === 0 && abnormalFindings.length > 0) {
    contributors.push(t.general);
  }

  // Limit to 3-4 most relevant
  return Array.from(new Set(contributors)).slice(0, 4);
}

export function buildHealthReport(
  documentResult: RawAnalysisResult,
  lifestyleInput: LifestyleData,
  lang: Language = "en"
): HealthReport {
  const t = translations[lang].report;
  const ui = translations[lang].ui;
  // 1. Calculate Lifestyle
  const sleepScore = calculateSleepScore(lifestyleInput.sleepHours);
  const activityScore = calculateActivityScore(lifestyleInput.activityLevel);
  const stressScore = calculateStressScore(lifestyleInput.stressLevel);
  const lifestyleScore = Math.round(sleepScore * 0.4 + activityScore * 0.25 + stressScore * 0.35);
  const lifestyle = {
    sleepScore,
    activityScore,
    stressScore,
    lifestyleScore,
    lifestyleRiskLevel: getSmartLabel(lifestyleScore, "lifestyle", lang)
  };

  // 2. Normalize Findings
  const findings: Finding[] = (documentResult.findings || []).map(f => ({
    name: f.name || "Unknown",
    value: f.value || "",
    referenceRange: f.referenceRange || "",
    status: f.status || "unclear",
    severity: mapSeverity(f.abnormalityStrength),
    implication: generateImplication(f, lang)
  }));

  // 3. Clinical Risk
  const clinicalRiskScore = calculateClinicalRiskScore(findings);
  const clinicalRiskLevel = getSmartLabel(clinicalRiskScore, "clinical", lang);

  // 4. Correlation
  const correlation = generateCorrelation(findings, lifestyleInput, lifestyle, lang);

  // 5. Decision Support (Simplest + Strongest + Direct)
  const level = getConcernLevel(clinicalRiskScore, correlation.combinedRiskScore, findings);
  let title, verdict, meaning, why, action, humanLayer;
  const keyDrivers: string[] = [];

  // Identify Key Drivers
  findings.filter(f => f.status === "needs_attention").forEach(f => keyDrivers.push(f.name));
  if (lifestyleInput.sleepHours < 7) keyDrivers.push(t.drivers.sleep);
  if (lifestyleInput.stressLevel === "High") keyDrivers.push(t.drivers.stress);
  if (lifestyleInput.stressLevel === "Moderate") keyDrivers.push(t.drivers.modStress);
  if (lifestyleInput.activityLevel === "Low") keyDrivers.push(t.drivers.activity);

  // Construct Data-Backed Why (Numbers)
  const components: string[] = [];
  findings.filter(f => f.status === "needs_attention").forEach(f => components.push(`${f.name} (${f.value})`));
  components.push(`${lifestyleInput.sleepHours}${ui.h} ${ui.sleepHours.toLowerCase()}`);
  components.push(`${ui[lifestyleInput.stressLevel.toLowerCase() as keyof typeof ui]} ${ui.stressLevel.toLowerCase()}`);
  why = components.join(" + ") + " → " + (level === "low" ? t.whySuffix : t.whySuffixReduced);

  if (level === "low") {
    title = ui.low;
    verdict = t.verdicts.low;
    meaning = t.meanings.low;
    action = getSleepAdvice(lifestyleInput.sleepHours, lang);
    humanLayer = t.humanLayer.low;
  } else if (level === "moderate") {
    title = ui.moderate;
    verdict = t.verdicts.moderate;
    meaning = t.meanings.moderate;
    const sleepAdvice = getSleepAdvice(lifestyleInput.sleepHours, lang);
    action = t.actions.moderateAction.replace("{sleepAdvice}", sleepAdvice);
    humanLayer = t.humanLayer.moderate;
  } else {
    title = ui.high;
    verdict = t.verdicts.high;
    meaning = t.meanings.high;
    const sleepAdvice = getSleepAdvice(lifestyleInput.sleepHours, lang);
    action = t.actions.highAction.replace("{sleepAdvice}", sleepAdvice);
    humanLayer = t.humanLayer.high;
  }

  // 6. Actions
  const immediateActions = generateImmediateActions(findings, lifestyleInput, lang);
  const specificMessages = buildReportSpecificMessage(findings, lifestyleInput, lang);
  const possibleContributors = generatePossibleContributors(findings, lifestyleInput, lang);
  const followUpPriority = getFollowUpPriority(
    clinicalRiskScore,
    correlation.combinedRiskScore,
    findings
  );
  const nextSteps = generateActionSteps(findings, lifestyleInput, followUpPriority, lang);

  return {
    documentType: documentResult.documentType || "Unknown medical document",
    confidence: {
      ...normalizeConfidence(documentResult.extractionConfidence, documentResult.imageQuality),
      imageClarityFeedback: documentResult.imageClarityFeedback,
      dataCompleteness: documentResult.dataCompleteness
    },
    clinical: {
      findings,
      clinicalRiskScore,
      clinicalRiskLevel,
      summary: documentResult.summary || ""
    },
    lifestyle,
    correlation,
    decisionSupport: {
      level,
      title,
      verdict,
      meaning,
      why,
      action,
      immediateActions,
      keyDrivers: keyDrivers.slice(0, 3),
      humanLayer,
      specificMessages,
      possibleContributors
    },
    actions: {
      followUpPriority,
      nextSteps
    },
    safety: {
      disclaimer: ui.medicalDisclaimer
    }
  };
}
