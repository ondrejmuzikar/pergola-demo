"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Phone, User } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { getModel, pricing } from "@/src/lib/pricing";
import { formatCurrency } from "@/src/lib/utils";
import type {
  ConfiguratorState,
  LeadFormData,
  PriceBreakdown,
} from "@/src/types/configurator";

type LeadCaptureStepProps = {
  state: ConfiguratorState;
  breakdown: PriceBreakdown;
};

export function LeadCaptureStep({ state, breakdown }: LeadCaptureStepProps) {
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    phone: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  const model = getModel(state.modelId);

  const validate = (): boolean => {
    const next: Partial<LeadFormData> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10">
          <CheckCircle2 className="h-8 w-8 text-lime-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Thank you, {form.name.split(" ")[0]}!</h2>
        <p className="mt-3 max-w-sm text-zinc-400">
          Our design team will contact you within 24 hours with a personalized
          quote for your {model?.name}.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Get your personalized quote
        </h2>
        <p className="mt-2 text-zinc-400">
          Share your details and we&apos;ll prepare a tailored proposal.
        </p>
      </div>

      <div className="rounded-2xl border border-lime-400/20 bg-gradient-to-br from-lime-400/5 to-transparent p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Starting from
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {formatCurrency(breakdown.rangeLow, pricing.currencySymbol)}
          <span className="text-xl text-zinc-500"> – </span>
          {formatCurrency(breakdown.rangeHigh, pricing.currencySymbol)}
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          {model?.name} · {state.width}m × {state.depth}m
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-zinc-300">
            <User className="h-3.5 w-3.5 text-lime-400" />
            Full name
          </Label>
          <Input
            id="name"
            placeholder="John Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-zinc-300">
            <Phone className="h-3.5 w-3.5 text-lime-400" />
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-zinc-300">
            <Mail className="h-3.5 w-3.5 text-lime-400" />
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full">
          Request my quote
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="text-center text-xs text-zinc-600">
          No obligation. We respect your privacy.
        </p>
      </form>
    </div>
  );
}
