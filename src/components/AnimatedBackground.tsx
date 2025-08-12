"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -inset-[20%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/15 via-indigo-500/10 to-transparent blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,.15),transparent)]" />
      <div
        className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_65%)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(0,0,0,.06) 25px), repeating-linear-gradient(90deg,transparent,transparent 24px,rgba(0,0,0,.06) 25px)",
        }}
      />
    </div>
  );
}


