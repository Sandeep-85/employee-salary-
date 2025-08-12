"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ResultsCard from "./ResultsCard";
import AnimatedBackground from "./AnimatedBackground";
import { Sparkles, ArrowRight } from "lucide-react";

const ROLE_OPTIONS = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Designer",
  "DevOps Engineer",
  "QA Engineer",
] as const;

const LOCATION_TIER_OPTIONS = ["Tier 1", "Tier 2", "Tier 3"] as const;

const EDUCATION_OPTIONS = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
] as const;

const schema = z.object({
  role: z.enum(ROLE_OPTIONS),
  yearsExperience: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((n) => !Number.isNaN(n), { message: "Enter a valid number" })
    .pipe(z.number().min(0).max(40)),
  locationTier: z.enum(LOCATION_TIER_OPTIONS),
  education: z.enum(EDUCATION_OPTIONS),
  skillsCsv: z.string().optional().default(""),
});

type FormValues = z.input<typeof schema>;

export default function SalaryForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    | { expected: number; low: number; high: number; currency: string }
    | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {
    role: "Software Engineer",
    yearsExperience: "3",
    locationTier: "Tier 2",
    education: "Bachelor's",
    skillsCsv: "TypeScript, React, AWS",
  }});

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setResult(null);
    try {
      const parsed = schema.parse(values);
      const payload = {
        role: parsed.role,
        yearsExperience: parsed.yearsExperience,
        locationTier: parsed.locationTier,
        education: parsed.education,
        skills: parsed.skillsCsv
          ? parsed.skillsCsv.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Prediction failed");
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to predict salary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <AnimatedBackground />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fuchsia-500" />
            <h2 className="text-lg font-semibold">Employee Salary Predictor</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-foreground/80">Role</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none transition focus:border-fuchsia-500/50"
                {...register("role")}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-foreground/80">Years Experience</label>
              <input
                type="number"
                step="1"
                min={0}
                max={40}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none transition focus:border-fuchsia-500/50"
                {...register("yearsExperience")}
              />
              {errors.yearsExperience && (
                <p className="mt-1 text-xs text-red-400">{errors.yearsExperience.message as string}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-foreground/80">Location Tier</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none transition focus:border-fuchsia-500/50"
                {...register("locationTier")}
              >
                {LOCATION_TIER_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-foreground/80">Education</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none transition focus:border-fuchsia-500/50"
                {...register("education")}
              >
                {EDUCATION_OPTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-foreground/80">Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. TypeScript, React, AWS"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 outline-none transition placeholder:text-foreground/40 focus:border-fuchsia-500/50"
                {...register("skillsCsv")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 font-medium text-white shadow-lg transition hover:brightness-110 active:brightness-95 disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict Salary"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-stretch">
          <div className="flex w-full items-center">
            {result ? (
              <ResultsCard
                expected={result.expected}
                low={result.low}
                high={result.high}
                currency={result.currency}
              />
            ) : (
              <div className="w-full rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-foreground/70">
                Your prediction will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


