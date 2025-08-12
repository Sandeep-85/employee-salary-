import { NextResponse } from "next/server";
import { predictSalary } from "@/lib/predict";
import type { PredictionInput } from "@/types/prediction";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PredictionInput;

    // Basic validation
    if (!body || !body.role || body.yearsExperience === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = predictSalary({
      role: body.role,
      yearsExperience: Number(body.yearsExperience) || 0,
      locationTier: body.locationTier,
      education: body.education,
      skills: Array.isArray(body.skills) ? body.skills : [],
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }
}


