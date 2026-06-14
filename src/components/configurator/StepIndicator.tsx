"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

const STEPS = [
  { id: 1, label: "Model" },
  { id: 2, label: "Dimensions" },
  { id: 3, label: "Options" },
  { id: 4, label: "Quote" },
];

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-10 flex items-center justify-between">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isActive && "bg-lime-400 text-zinc-950",
                  isComplete && "bg-lime-400/20 text-lime-400",
                  !isActive && !isComplete && "bg-zinc-800 text-zinc-500"
                )}
                animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isComplete ? "✓" : step.id}
              </motion.div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive ? "text-white" : "text-zinc-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="mx-2 h-px flex-1 bg-zinc-800">
                <motion.div
                  className="h-full bg-lime-400"
                  initial={{ width: "0%" }}
                  animate={{ width: isComplete ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
