"use client";

import { Label } from "@/src/components/ui/label";
import { Slider } from "@/src/components/ui/slider";
import { pricing } from "@/src/lib/pricing";
import type { ConfiguratorState } from "@/src/types/configurator";

type DimensionsStepProps = {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
};

function DimensionControl({
  label,
  value,
  config,
  onChange,
}: {
  label: string;
  value: number;
  config: (typeof pricing.dimensions)["width"];
  onChange: (value: number) => void;
}) {
  const steps = Math.round((config.max - config.min) / config.step) + 1;
  const sliderValue = Math.round((value - config.min) / config.step);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-center justify-between">
        <Label className="text-base text-white">{label}</Label>
        <span className="text-2xl font-semibold tabular-nums text-lime-400">
          {value}
          <span className="ml-1 text-sm font-normal text-zinc-500">
            {config.unit}
          </span>
        </span>
      </div>
      <Slider
        min={0}
        max={steps - 1}
        step={1}
        value={[sliderValue]}
        onValueChange={([v]) => onChange(config.min + v * config.step)}
      />
      <div className="flex justify-between text-xs text-zinc-600">
        <span>
          {config.min}
          {config.unit}
        </span>
        <span>
          {config.max}
          {config.unit}
        </span>
      </div>
    </div>
  );
}

export function DimensionsStep({ state, onChange }: DimensionsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Set your dimensions
        </h2>
        <p className="mt-2 text-zinc-400">
          Drag the sliders to match your outdoor space.
        </p>
      </div>

      <div className="space-y-4">
        <DimensionControl
          label={pricing.dimensions.width.label}
          value={state.width}
          config={pricing.dimensions.width}
          onChange={(width) => onChange({ width })}
        />
        <DimensionControl
          label={pricing.dimensions.depth.label}
          value={state.depth}
          config={pricing.dimensions.depth}
          onChange={(depth) => onChange({ depth })}
        />
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
        <p className="text-sm text-zinc-400">
          Coverage area:{" "}
          <span className="font-medium text-white">
            {(state.width * state.depth).toFixed(1)} m²
          </span>
        </p>
      </div>
    </div>
  );
}
