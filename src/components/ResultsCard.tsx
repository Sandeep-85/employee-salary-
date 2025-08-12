"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  expected: number;
  low: number;
  high: number;
  currency: string;
}

export default function ResultsCard({ expected, low, high, currency }: Props) {
  const format = (n: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={expected}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-4 text-sm uppercase tracking-widest text-foreground/70">Predicted Salary</div>
        <div className="mb-6 text-4xl font-bold">{format(expected)}</div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 text-foreground/70">Low</div>
            <div className="text-lg font-semibold">{format(low)}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 text-foreground/70">High</div>
            <div className="text-lg font-semibold">{format(high)}</div>
          </div>
        </div>

        <div className="mt-6 h-2 w-full rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(20, (expected - low) / (high - low + 1e-6) * 100))}%` }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


