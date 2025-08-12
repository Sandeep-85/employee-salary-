export type Role =
  | "Software Engineer"
  | "Data Scientist"
  | "Product Manager"
  | "Designer"
  | "DevOps Engineer"
  | "QA Engineer";

export type LocationTier = "Tier 1" | "Tier 2" | "Tier 3";

export type EducationLevel =
  | "High School"
  | "Bachelor's"
  | "Master's"
  | "PhD";

export interface PredictionInput {
  role: Role;
  yearsExperience: number;
  locationTier: LocationTier;
  education: EducationLevel;
  skills: string[];
}

export interface PredictionBreakdown {
  baseByRole: number;
  experienceAdjustment: number;
  locationAdjustment: number;
  educationAdjustment: number;
  skillsAdjustment: number;
}

export interface PredictionResult {
  currency: string;
  low: number;
  high: number;
  expected: number;
  breakdown: PredictionBreakdown;
}


