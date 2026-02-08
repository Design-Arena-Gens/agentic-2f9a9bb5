import { Dialog } from "@headlessui/react";
import {
  ArrowTrendingUpIcon,
  BeakerIcon,
  Cog6ToothIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

type Props = {
  open: boolean;
  onClose: (value: boolean) => void;
};

const stages = [
  {
    title: "Automate Ideation",
    description:
      "Streamline trend discovery, persona calibration, and script scaffolding with AI prompts tailored to each channel.",
    icon: SparklesIcon
  },
  {
    title: "Accelerate Editing",
    description:
      "Generate motion templates, scene breakdowns, and caption packs while preserving human-in-the-loop approvals.",
    icon: BeakerIcon
  },
  {
    title: "Orchestrate Distribution",
    description:
      "Deploy content to every platform with metadata tuned for retention, CTR, and community engagement.",
    icon: Cog6ToothIcon
  },
  {
    title: "Optimize With Telemetry",
    description:
      "Adaptive insights surface retention cliffs, winning hooks, and iteration experiments per persona.",
    icon: ArrowTrendingUpIcon
  }
];

export function InitialSetupModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-40">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl overflow-hidden rounded-3xl border border-muted bg-background p-8 shadow-2xl shadow-accent/10">
          <Dialog.Title className="text-3xl font-semibold text-white">
            Autonomous Channel Director
          </Dialog.Title>
          <Dialog.Description className="mt-2 max-w-2xl text-sm text-slate-300">
            This command deck deploys multi-platform social video pipelines. Define a persona and
            our automation layer handles ideation, scripting, editing, and distribution with smart
            human review gates.
          </Dialog.Description>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {stages.map((stage) => (
              <div
                key={stage.title}
                className="group rounded-2xl border border-slate-800 bg-black/40 p-5 transition hover:border-accent/70 hover:bg-black/60"
              >
                <stage.icon className="h-8 w-8 text-accent" />
                <h3 className="mt-4 text-lg font-semibold text-white">{stage.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{stage.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => onClose(false)}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent/90"
            >
              Enter Command Deck
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
