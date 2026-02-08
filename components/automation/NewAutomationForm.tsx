'use client';

import { useMemo, useState } from "react";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3),
  persona: z.string().min(10),
  targetAudience: z.string().min(5),
  primaryPlatform: z.enum(["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter"]),
  crossPost: z.array(z.enum(["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter"])),
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "custom"])
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  persona: "",
  targetAudience: "",
  primaryPlatform: "YouTube",
  crossPost: [],
  frequency: "weekly"
};

type Props = {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

const platforms: FormValues["primaryPlatform"][] = [
  "YouTube",
  "TikTok",
  "Instagram",
  "LinkedIn",
  "Twitter"
];

const frequencies: FormValues["frequency"][] = ["daily", "weekly", "biweekly", "monthly", "custom"];

export function NewAutomationForm({ onSubmit, onCancel, loading }: Props) {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const crossPostOptions = useMemo(
    () => platforms.filter((platform) => platform !== values.primaryPlatform),
    [values.primaryPlatform]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = formSchema.safeParse(values);
    if (!result.success) {
      const validation: Partial<Record<keyof FormValues, string>> = {};
      Object.entries(result.error.formErrors.fieldErrors).forEach(([key, value]) => {
        validation[key as keyof FormValues] = value?.[0];
      });
      setErrors(validation);
      return;
    }
    setErrors({});
    await onSubmit(result.data);
    setValues(defaultValues);
  };

  const toggleCrossPost = (platform: FormValues["primaryPlatform"]) => {
    setValues((prev) => {
      const exists = prev.crossPost.includes(platform);
      return {
        ...prev,
        crossPost: exists ? prev.crossPost.filter((p) => p !== platform) : [...prev.crossPost, platform]
      };
    });
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <header className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Launch New Automation</h2>
          <p className="mt-2 text-sm text-slate-300">
            Define your automation persona, output cadence, and cross-posting blueprint. All flows ship with intelligent guardrails and asset delivery.
          </p>
        </div>
        <SparklesIcon className="h-10 w-10 text-accent" />
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Automation Name"
          error={errors.name}
          input={
            <input
              className="w-full rounded-xl border border-slate-800 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-accent"
              value={values.name}
              onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Creator Growth Sprint"
            />
          }
        />
        <FormField
          label="Primary Platform"
          error={undefined}
          input={
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setValues((prev) => ({ ...prev, primaryPlatform: platform }))}
                  className={clsx(
                    "rounded-xl border px-3 py-2 text-sm font-medium transition",
                    values.primaryPlatform === platform
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-slate-800 bg-black/40 text-slate-300 hover:border-accent/60"
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          }
        />
        <FormField
          label="Persona Tone & POV"
          error={errors.persona}
          fullWidth
          input={
            <textarea
              className="w-full rounded-xl border border-slate-800 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-accent"
              rows={3}
              value={values.persona}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, persona: event.target.value }))
              }
              placeholder="Hybrid storyteller blending data-proven hooks with cinematic editing cues."
            />
          }
        />
        <FormField
          label="Target Audience"
          error={errors.targetAudience}
          fullWidth
          input={
            <textarea
              className="w-full rounded-xl border border-slate-800 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-accent"
              rows={3}
              value={values.targetAudience}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, targetAudience: event.target.value }))
              }
              placeholder="Bootstrapped SaaS founders scaling demand gen with video-first content."
            />
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
        <FormField
          label="Cadence"
          error={undefined}
          input={
            <div className="flex flex-wrap gap-2">
              {frequencies.map((frequency) => (
                <button
                  key={frequency}
                  type="button"
                  onClick={() => setValues((prev) => ({ ...prev, frequency }))}
                  className={clsx(
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
                    values.frequency === frequency
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-slate-800 bg-black/40 text-slate-300 hover:border-accent/60"
                  )}
                >
                  {frequency}
                </button>
              ))}
            </div>
          }
        />
        <FormField
          label="Cross-Post Channels"
          error={undefined}
          input={
            <div className="flex flex-wrap gap-2">
              {crossPostOptions.map((platform) => {
                const active = values.crossPost.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => toggleCrossPost(platform)}
                    className={clsx(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition",
                      active
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-slate-800 bg-black/40 text-slate-300 hover:border-accent/60"
                    )}
                  >
                    {active && <CheckIcon className="h-4 w-4" />}
                    {platform}
                  </button>
                );
              })}
            </div>
          }
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Launching..." : "Deploy Automation"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  input: React.ReactNode;
  error?: string;
  fullWidth?: boolean;
};

function FormField({ label, input, error, fullWidth }: FieldProps) {
  return (
    <label className={clsx("flex flex-col gap-2", fullWidth && "md:col-span-2")}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {input}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
