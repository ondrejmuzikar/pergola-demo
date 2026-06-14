"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { pricing } from "@/lib/pricing";
import type { ConfiguratorState } from "@/types/configurator";

type ModelStepProps = {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
};

export function ModelStep({ state, onChange }: ModelStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Choose your pergola
        </h2>
        <p className="mt-2 text-zinc-400">
          Select the architectural style that fits your space.
        </p>
      </div>

      <div className="grid gap-4">
        {pricing.models.map((model) => {
          const isSelected = state.modelId === model.id;

          return (
            <motion.button
              key={model.id}
              type="button"
              onClick={() => onChange({ modelId: model.id })}
              className={cn(
                "group relative w-full rounded-2xl border p-5 text-left transition-all",
                isSelected
                  ? "border-lime-400/60 bg-lime-400/5 ring-1 ring-lime-400/30"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: model.accentColor }}
                    />
                    <h3 className="text-lg font-semibold text-white">
                      {model.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-lime-400/80">{model.tagline}</p>
                  <p className="mt-2 text-sm text-zinc-400">{model.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {model.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs text-zinc-400"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isSelected
                      ? "border-lime-400 bg-lime-400 text-zinc-950"
                      : "border-zinc-700 text-transparent"
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
