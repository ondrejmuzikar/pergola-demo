"use client";

import { motion } from "framer-motion";
import { Check, Flame, Lightbulb, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getModel, pricing } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import type { ConfiguratorState, PriceBreakdown } from "@/types/configurator";

type LivePreviewProps = {
  state: ConfiguratorState;
  breakdown: PriceBreakdown;
  step: number;
  showExactPrice?: boolean;
};

export function LivePreview({
  state,
  breakdown,
  step,
  showExactPrice = true,
}: LivePreviewProps) {
  const model = getModel(state.modelId);
  const lighting = pricing.options.lighting.choices.find(
    (c) => c.id === state.lighting
  );
  const heating = pricing.options.heating.choices.find(
    (c) => c.id === state.heating
  );
  const selectedExtras = pricing.options.extras.choices.filter((c) =>
    state.extras.includes(c.id)
  );

  const hasLighting = state.lighting !== "none";
  const hasHeating = state.heating !== "none";

  return (
    <Card className="sticky top-8 overflow-hidden border-zinc-800/60 bg-zinc-950/60 shadow-2xl shadow-black/40">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ backgroundColor: model?.previewColor ?? "#0a0a0a" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        {/* Pergola structure visualization */}
        <motion.div
          className="absolute inset-x-[12%] bottom-[18%] top-[28%]"
          animate={{
            width: `${50 + (state.width / pricing.dimensions.width.max) * 20}%`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{ margin: "0 auto", left: 0, right: 0 }}
        >
          {/* Posts */}
          <div className="absolute bottom-0 left-0 h-full w-1.5 rounded-full bg-zinc-600/80" />
          <div className="absolute bottom-0 right-0 h-full w-1.5 rounded-full bg-zinc-600/80" />

          {/* Roof / louvers */}
          <motion.div
            className="absolute left-0 right-0 top-0 flex flex-col gap-1"
            style={{ height: `${30 + (state.depth / pricing.dimensions.depth.max) * 15}%` }}
          >
            {Array.from({ length: model?.id === "bioclimatic" ? 8 : 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-sm"
                style={{
                  backgroundColor: model?.accentColor ?? "#a3e635",
                  opacity: model?.id === "retractable" ? 0.6 : 0.85,
                }}
                animate={{
                  rotateX: model?.id === "bioclimatic" ? (i % 2 === 0 ? 12 : -8) : 0,
                }}
              />
            ))}
          </motion.div>

          {/* Lighting glow */}
          {hasLighting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -inset-x-2 bottom-0 h-8 rounded-full blur-xl"
              style={{ backgroundColor: model?.accentColor, opacity: 0.5 }}
            />
          )}

          {/* Glass walls preview */}
          {state.extras.includes("glass-walls") && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.25, scaleY: 1 }}
              className="absolute inset-y-4 left-2 right-2 border border-white/30 bg-sky-200/10 backdrop-blur-sm"
            />
          )}
        </motion.div>

        {/* Heating indicators */}
        {hasHeating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-[22%] left-1/2 flex -translate-x-1/2 gap-3"
          >
            {Array.from({
              length: state.heating === "infrared-4" ? 4 : 2,
            }).map((_, i) => (
              <Flame
                key={i}
                className="h-4 w-4 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]"
              />
            ))}
          </motion.div>
        )}

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-zinc-950/70 px-3 py-1 text-xs font-medium text-lime-400 backdrop-blur-sm">
            Live Preview
          </span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl tracking-tight">
          {model?.name ?? "Select a model"}
        </CardTitle>
        <CardDescription>
          {state.width}m × {state.depth}m
          {model?.tagline && ` · ${model.tagline}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {hasLighting && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/10 px-3 py-1 text-xs text-lime-400">
              <Lightbulb className="h-3 w-3" />
              {lighting?.name}
            </span>
          )}
          {hasHeating && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-400/10 px-3 py-1 text-xs text-orange-300">
              <Flame className="h-3 w-3" />
              {heating?.name}
            </span>
          )}
          {selectedExtras.map((extra) => (
            <span
              key={extra.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
            >
              <Sparkles className="h-3 w-3" />
              {extra.name}
            </span>
          ))}
        </div>

        {model?.features && (
          <ul className="space-y-1.5 border-t border-zinc-800/80 pt-4">
            {model.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-xs text-zinc-400"
              >
                <Check className="h-3 w-3 shrink-0 text-lime-400" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-zinc-800/80 pt-4">
          {step === 4 || !showExactPrice ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Starting from
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {formatCurrency(breakdown.rangeLow, pricing.currencySymbol)}
                <span className="text-zinc-500"> – </span>
                {formatCurrency(breakdown.rangeHigh, pricing.currencySymbol)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Final quote depends on site survey & installation
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Estimated total
              </p>
              <motion.p
                key={breakdown.total}
                initial={{ opacity: 0.5, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-2xl font-semibold tracking-tight text-lime-400"
              >
                {formatCurrency(breakdown.total, pricing.currencySymbol)}
              </motion.p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
