import pricingConfig from "@/config/pricing.json";
import type {
  ConfiguratorState,
  Model,
  PriceBreakdown,
  PricingConfig,
} from "@/types/configurator";

export const pricing: PricingConfig = pricingConfig;

export function getModel(modelId: string): Model | undefined {
  return pricing.models.find((m) => m.id === modelId);
}

export function getDefaultState(): ConfiguratorState {
  return {
    modelId: pricing.models[0].id,
    width: pricing.dimensions.width.default,
    depth: pricing.dimensions.depth.default,
    lighting: "none",
    heating: "none",
    extras: [],
  };
}

function dimensionCost(
  value: number,
  config: PricingConfig["dimensions"]["width"]
): number {
  const unitsAboveMin = (value - config.min) / config.step;
  return unitsAboveMin * config.pricePerUnit;
}

function optionPrice(category: keyof PricingConfig["options"], choiceId: string): number {
  const categoryConfig = pricing.options[category];
  const choice = categoryConfig.choices.find((c) => c.id === choiceId);
  return choice?.price ?? 0;
}

function extrasPrice(extras: string[]): number {
  return extras.reduce((sum, id) => sum + optionPrice("extras", id), 0);
}

export function calculatePrice(state: ConfiguratorState): PriceBreakdown {
  const model = getModel(state.modelId);
  const base = model?.basePrice ?? 0;

  const widthCost = dimensionCost(state.width, pricing.dimensions.width);
  const depthCost = dimensionCost(state.depth, pricing.dimensions.depth);
  const dimensions = widthCost + depthCost;

  const lighting = optionPrice("lighting", state.lighting);
  const heating = optionPrice("heating", state.heating);
  const extras = extrasPrice(state.extras);
  const options = lighting + heating + extras;

  const total = base + dimensions + options;
  const variance = pricing.priceRangeVariance;

  return {
    base,
    dimensions,
    options,
    total,
    rangeLow: total * (1 - variance),
    rangeHigh: total * (1 + variance),
  };
}

export function getOptionLabel(
  category: keyof PricingConfig["options"],
  choiceId: string
): string {
  const choice = pricing.options[category].choices.find((c) => c.id === choiceId);
  return choice?.name ?? choiceId;
}
