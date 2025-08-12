import type {
  PredictionBreakdown,
  PredictionInput,
  PredictionResult,
  Role,
} from "@/types/prediction";

const ROLE_BASELINE_USD: Record<Role, number> = {
  "Software Engineer": 90000,
  "Data Scientist": 95000,
  "Product Manager": 105000,
  "Designer": 80000,
  "DevOps Engineer": 100000,
  "QA Engineer": 75000,
};

// Static FX for display purposes. Replace with a live FX source if needed.
const USD_TO_INR = 83; // approximate

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function experienceMultiplier(yearsExperience: number): number {
  // 0 yrs = 0.9x, 10 yrs = ~1.5x, 20 yrs caps at ~1.8x
  const y = clamp(yearsExperience, 0, 30);
  return clamp(0.9 + Math.log2(1 + y) * 0.25, 0.8, 1.8);
}

function locationMultiplier(tier: PredictionInput["locationTier"]): number {
  switch (tier) {
    case "Tier 1":
      return 1.25; // SF/NY/London
    case "Tier 2":
      return 1.0; // major cities
    case "Tier 3":
    default:
      return 0.85; // smaller markets / remote low COL
  }
}

function educationMultiplier(level: PredictionInput["education"]): number {
  switch (level) {
    case "High School":
      return 0.9;
    case "Bachelor's":
      return 1.0;
    case "Master's":
      return 1.08;
    case "PhD":
      return 1.12;
  }
}

function skillsMultiplier(skills: string[], role: Role): number {
  if (skills.length === 0) return 1.0;
  const normalized = skills.map((s) => s.trim().toLowerCase());

  const premiumSkillSets: Record<Role, string[]> = {
    "Software Engineer": ["system design", "distributed", "rust", "go", "aws", "kubernetes"],
    "Data Scientist": ["ml", "machine learning", "deep learning", "nlp", "pytorch", "tensorflow"],
    "Product Manager": ["growth", "a/b", "analytics", "strategy"],
    "Designer": ["ux research", "motion", "3d", "system"],
    "DevOps Engineer": ["kubernetes", "terraform", "aws", "gcp", "sre"],
    "QA Engineer": ["automation", "cypress", "playwright", "performance"],
  };

  const matches = normalized.filter((s) => premiumSkillSets[role].some((p) => s.includes(p))).length;
  // Each relevant premium skill adds up to +2.5%, capped at +15%
  return clamp(1 + Math.min(matches * 0.025, 0.15), 0.9, 1.3);
}

export function predictSalary(input: PredictionInput): PredictionResult {
  const base = ROLE_BASELINE_USD[input.role];
  const expMul = experienceMultiplier(input.yearsExperience);
  const locMul = locationMultiplier(input.locationTier);
  const eduMul = educationMultiplier(input.education);
  const sklMul = skillsMultiplier(input.skills, input.role);

  const expectedUsd = base * expMul * locMul * eduMul * sklMul;

  // Range ±15% with slight widening for low experience
  const variance = clamp(0.15 + (5 - Math.min(input.yearsExperience, 5)) * 0.01, 0.12, 0.2);
  const lowInr = Math.round(expectedUsd * (1 - variance) * USD_TO_INR);
  const highInr = Math.round(expectedUsd * (1 + variance) * USD_TO_INR);
  const expectedInr = Math.round(expectedUsd * USD_TO_INR);

  const breakdown: PredictionBreakdown = {
    baseByRole: Math.round(base * USD_TO_INR),
    experienceAdjustment: Math.round(base * (expMul - 1) * USD_TO_INR),
    locationAdjustment: Math.round(base * (locMul - 1) * USD_TO_INR),
    educationAdjustment: Math.round(base * (eduMul - 1) * USD_TO_INR),
    skillsAdjustment: Math.round(base * (sklMul - 1) * USD_TO_INR),
  };

  return {
    currency: "INR",
    low: lowInr,
    high: highInr,
    expected: expectedInr,
    breakdown,
  };
}


