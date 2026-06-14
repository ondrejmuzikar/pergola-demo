"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { pricing } from "@/lib/pricing";
import type { ConfiguratorState, PricingConfig } from "@/types/configurator";

type OptionsStepProps = {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
};

function SingleSelectGroup({
  category,
  categoryKey,
  selected,
  onSelect,
}: {
  category: PricingConfig["options"]["lighting"];
  categoryKey: "lighting" | "heating";
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-white">{category.label}</h3>
        <p className="text-sm text-zinc-500">{category.description}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {category.choices.map((choice) => {
          const isSelected = selected === choice.id;
          return (
            <motion.button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-lime-400/50 bg-lime-400/5"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              )}
              whileTap={{ scale: 0.98 }}
            >
              <p className="font-medium text-white">{choice.name}</p>
              {choice.price > 0 && (
                <p className="mt-1 text-sm text-lime-400/80">
                  +{formatCurrency(choice.price, pricing.currencySymbol)}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function MultiSelectGroup({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const category = pricing.options.extras;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-white">{category.label}</h3>
        <p className="text-sm text-zinc-500">{category.description}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {category.choices.map((choice) => {
          const isSelected = selected.includes(choice.id);
          return (
            <motion.button
              key={choice.id}
              type="button"
              onClick={() => onToggle(choice.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-lime-400/50 bg-lime-400/5"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              )}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-white">{choice.name}</p>
                <div
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded border transition-colors",
                    isSelected
                      ? "border-lime-400 bg-lime-400"
                      : "border-zinc-600"
                  )}
                />
              </div>
              <p className="mt-1 text-sm text-lime-400/80">
                +{formatCurrency(choice.price, pricing.currencySymbol)}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function OptionsStep({ state, onChange }: OptionsStepProps) {
  const toggleExtra = (id: string) => {
    const extras = state.extras.includes(id)
      ? state.extras.filter((e) => e !== id)
      : [...state.extras, id];
    onChange({ extras });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Customize your experience
        </h2>
        <p className="mt-2 text-zinc-400">
          Add lighting, heating, and premium extras.
        </p>
      </div>

      <SingleSelectGroup
        category={pricing.options.lighting}
        categoryKey="lighting"
        selected={state.lighting}
        onSelect={(lighting) => onChange({ lighting })}
      />

      <SingleSelectGroup
        category={pricing.options.heating}
        categoryKey="heating"
        selected={state.heating}
        onSelect={(heating) => onChange({ heating })}
      />

      <MultiSelectGroup selected={state.extras} onToggle={toggleExtra} />
    </div>
  );
}
