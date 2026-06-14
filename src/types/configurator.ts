import type pricingConfig from "@/config/pricing.json";

export type PricingConfig = typeof pricingConfig;

export type Model = PricingConfig["models"][number];

export type OptionChoice = {
  id: string;
  name: string;
  price: number;
  preview?: string;
};

export type ConfiguratorState = {
  modelId: string;
  width: number;
  depth: number;
  lighting: string;
  heating: string;
  extras: string[];
};

export type PriceBreakdown = {
  base: number;
  dimensions: number;
  options: number;
  total: number;
  rangeLow: number;
  rangeHigh: number;
};

export type LeadFormData = {
  name: string;
  phone: string;
  email: string;
};
