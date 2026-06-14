"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivePreview } from "@/components/configurator/LivePreview";
import { StepIndicator } from "@/components/configurator/StepIndicator";
import { DimensionsStep } from "@/components/configurator/steps/DimensionsStep";
import { LeadCaptureStep } from "@/components/configurator/steps/LeadCaptureStep";
import { ModelStep } from "@/components/configurator/steps/ModelStep";
import { OptionsStep } from "@/components/configurator/steps/OptionsStep";
import {
  calculatePrice,
  getDefaultState,
} from "@/lib/pricing";
import type { ConfiguratorState } from "@/types/configurator";

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

export function Configurator() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [state, setState] = useState<ConfiguratorState>(getDefaultState);

  const breakdown = useMemo(() => calculatePrice(state), [state]);

  const updateState = (updates: Partial<ConfiguratorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const nextStep = () => goToStep(Math.min(step + 1, TOTAL_STEPS));
  const prevStep = () => goToStep(Math.max(step - 1, 1));

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-lime-400/5 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-lime-400/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-400"
          >
            Pergola Studio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            Design your perfect pergola
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-zinc-400"
          >
            Configure in minutes. Crafted to last a lifetime.
          </motion.p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          {/* Form panel */}
          <div className="order-2 lg:order-1">
            <StepIndicator currentStep={step} />

            <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/30 p-6 backdrop-blur-sm sm:p-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {step === 1 && (
                    <ModelStep state={state} onChange={updateState} />
                  )}
                  {step === 2 && (
                    <DimensionsStep state={state} onChange={updateState} />
                  )}
                  {step === 3 && (
                    <OptionsStep state={state} onChange={updateState} />
                  )}
                  {step === 4 && (
                    <LeadCaptureStep state={state} breakdown={breakdown} />
                  )}
                </motion.div>
              </AnimatePresence>

              {step < 4 && (
                <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-6">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={step === 1 ? "invisible" : ""}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={nextStep}>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="mt-8 border-t border-zinc-800/60 pt-6">
                  <Button variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to options
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Live preview */}
          <div className="order-1 lg:order-2">
            <LivePreview
              state={state}
              breakdown={breakdown}
              step={step}
              showExactPrice={step < 4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
