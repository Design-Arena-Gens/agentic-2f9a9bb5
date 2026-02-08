'use client';

import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  BoltIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ClockIcon,
  FilmIcon,
  PlusIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Automation, AutomationRunLog } from "../../lib/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { InitialSetupModal } from "./InitialSetupModal";
import { NewAutomationForm } from "./NewAutomationForm";
import { RunLogDrawer } from "./RunLogDrawer";
import { SectionHeader } from "./SectionHeader";
import { StatCard } from "./StatCard";

type AutomationWithMeta = Automation & {
  healthScore: number;
  automationVelocity: number;
};

const iconMap: Record<string, JSX.Element> = {
  ideation: <SparklesIcon className="h-6 w-6 text-accent" />,
  script: <BoltIcon className="h-6 w-6 text-accent" />,
  recording: <FilmIcon className="h-6 w-6 text-accent" />,
  editing: <FilmIcon className="h-6 w-6 text-accent" />,
  thumbnail: <SparklesIcon className="h-6 w-6 text-accent" />,
  captions: <SparklesIcon className="h-6 w-6 text-accent" />,
  distribution: <CalendarDaysIcon className="h-6 w-6 text-accent" />,
  analytics: <ChartBarSquareIcon className="h-6 w-6 text-accent" />
};

export function AutomationDashboard() {
  const [automations, setAutomations] = useState<AutomationWithMeta[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationWithMeta | null>(null);
  const [runLogs, setRunLogs] = useState<AutomationRunLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [initialModalOpen, setInitialModalOpen] = useState(true);
  const [runDrawerOpen, setRunDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchAutomations = async () => {
      const response = await fetch("/api/automations");
      const data: Automation[] = await response.json();
      const augmented = data.map(augmentAutomation);
      setAutomations(augmented);
      if (augmented.length > 0 && !selectedAutomation) {
        setSelectedAutomation(augmented[0]);
      }
    };
    fetchAutomations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedAutomation) return;
    const fetchLogs = async () => {
      const response = await fetch(`/api/run-logs?automationId=${selectedAutomation.id}`);
      if (!response.ok) return;
      const data: AutomationRunLog[] = await response.json();
      setRunLogs(data);
    };
    fetchLogs();
  }, [selectedAutomation]);

  const aggregateStats = useMemo(() => {
    if (automations.length === 0) return null;
    const totals = automations.reduce(
      (acc, automation) => {
        acc.views += automation.performance.views;
        acc.watchTime += automation.performance.watchTimeMinutes;
        acc.engagements += automation.performance.engagements;
        acc.health += automation.healthScore;
        return acc;
      },
      { views: 0, watchTime: 0, engagements: 0, health: 0 }
    );
    return {
      totalViews: totals.views,
      totalWatchTime: totals.watchTime,
      totalEngagements: totals.engagements,
      avgHealth: Math.floor(totals.health / automations.length)
    };
  }, [automations]);

  const handleCreate = async (payload: Record<string, unknown>) => {
    setIsSubmitting(true);
    const response = await fetch("/api/automations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const automation = augmentAutomation(await response.json());
      setAutomations((prev) => [automation, ...prev]);
      setSelectedAutomation(automation);
      setIsCreating(false);
    }
    setIsSubmitting(false);
  };

  const handleRun = async () => {
    if (!selectedAutomation) return;
    setRunDrawerOpen(true);
    const response = await fetch(`/api/automations/${selectedAutomation.id}/run`, {
      method: "POST"
    });
    if (response.ok) {
      const log: AutomationRunLog = await response.json();
      setRunLogs((prev) => [log, ...prev]);
      setAutomations((prev) =>
        prev.map((automation) =>
          automation.id === selectedAutomation.id ? augmentAutomation(automation) : automation
        )
      );
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-12">
      {aggregateStats && (
        <SectionHeader
          onCreate={() => setIsCreating(true)}
          stats={[
            {
              id: "views",
              label: "Lifetime Views",
              value: aggregateStats.totalViews.toLocaleString(),
              trend: "+12.4%",
              icon: <ChartBarSquareIcon className="h-5 w-5 text-accent" />
            },
            {
              id: "watch",
              label: "Watch Minutes",
              value: aggregateStats.totalWatchTime.toLocaleString(),
              trend: "+8.9%",
              icon: <ClockIcon className="h-5 w-5 text-accent" />
            },
            {
              id: "engagements",
              label: "Engagements",
              value: aggregateStats.totalEngagements.toLocaleString(),
              trend: "+16.3%",
              icon: <BoltIcon className="h-5 w-5 text-accent" />
            },
            {
              id: "health",
              label: "Automation Health",
              value: `${aggregateStats.avgHealth}%`,
              trend: "Stable",
              icon: <SparklesIcon className="h-5 w-5 text-accent" />
            }
          ]}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="group flex items-center justify-center gap-2 rounded-xl border border-muted bg-muted/60 px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:bg-muted/80 hover:shadow-glow"
          >
            <PlusIcon className="h-5 w-5 text-accent transition group-hover:text-foreground" />
            Launch New Automation
          </button>

          <div className="flex flex-col gap-3">
            {automations.map((automation) => (
              <button
                key={automation.id}
                onClick={() => setSelectedAutomation(automation)}
                className={clsx(
                  "flex flex-col gap-3 rounded-2xl border border-muted bg-muted/50 p-4 text-left transition hover:border-accent hover:bg-muted/70",
                  selectedAutomation?.id === automation.id && "border-accent bg-muted/80 shadow-glow"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">{automation.name}</p>
                    <p className="text-xs text-slate-400">
                      {automation.primaryPlatform} · {automation.schedule.frequency}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-slate-300">
                    {automation.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-end justify-between text-xs text-slate-400">
                  <p>{automation.persona}</p>
                  <p>
                    Next run{" "}
                    {formatDistanceToNow(parseISO(automation.schedule.nextRun), {
                      addSuffix: true
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedAutomation ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-muted bg-muted/40 p-6 shadow-lg shadow-black/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-white">
                    {selectedAutomation.name}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-slate-300">
                    Persona: {selectedAutomation.persona}. Target:{" "}
                    {selectedAutomation.targetAudience}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-y-2 text-xs text-slate-400">
                  <p>
                    Created {formatDistanceToNow(parseISO(selectedAutomation.createdAt), {
                      addSuffix: true
                    })}
                  </p>
                  {selectedAutomation.lastRunAt && (
                    <p>
                      Last automation fired{" "}
                      {formatDistanceToNow(parseISO(selectedAutomation.lastRunAt), {
                        addSuffix: true
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Automation Health"
                  value={`${selectedAutomation.healthScore}%`}
                  badge="Stable"
                />
                <StatCard
                  label="Velocity"
                  value={`${selectedAutomation.automationVelocity} ops/hr`}
                  badge="Autopilot"
                />
                <StatCard
                  label="Cross-Post Channels"
                  value={selectedAutomation.crossPost.length.toString()}
                  badge={selectedAutomation.crossPost.join(", ")}
                />
                <StatCard
                  label="Last Run Views"
                  value={selectedAutomation.performance.views.toLocaleString()}
                  badge="Across all channels"
                />
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Automation Flow</h2>
                  <button
                    className="rounded-full border border-accent px-4 py-2 text-xs font-medium text-accent transition hover:bg-accent hover:text-background"
                    onClick={handleRun}
                  >
                    Fire Automation
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {selectedAutomation.steps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-2xl border border-slate-800 bg-black/40 p-4 transition hover:border-accent/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-2">
                          {iconMap[step.type] ?? <SparklesIcon className="h-6 w-6 text-accent" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{step.title}</p>
                          <p className="text-xs text-slate-400 capitalize">{step.type}</p>
                        </div>
                        {step.requiresHumanReview && (
                          <span className="ml-auto rounded-full bg-warning/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-warning">
                            Review
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{step.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          {step.durationMinutes} min
                        </span>
                        {step.tools.map((tool) => (
                          <span key={tool} className="rounded-full bg-slate-800 px-3 py-1">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-muted bg-muted/30 p-6">
              <h2 className="text-lg font-semibold text-white">Recent Automation Runs</h2>
              <p className="mt-1 text-xs text-slate-400">
                Autonomous execution telemetry, including generated assets and action notes.
              </p>

              <div className="mt-5 flex flex-col gap-4">
                {runLogs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => {
                      setRunDrawerOpen(true);
                    }}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-black/40 p-4 text-left transition hover:border-accent/70 hover:bg-black/60"
                  >
                    <div className="flex items-center justify-between text-sm text-white">
                      <p>
                        {formatDistanceToNow(parseISO(log.startedAt), {
                          addSuffix: true
                        })}
                      </p>
                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {log.messages[0]?.message ?? "Automation execution event"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-800 bg-muted/30 p-12 text-center">
            <SparklesIcon className="h-10 w-10 text-accent" />
            <p className="text-lg font-semibold text-white">Launch your first automation</p>
            <p className="max-w-sm text-sm text-slate-400">
              Draft a persona, define your platforms, and the studio will orchestrate scripting,
              editing, and distribution with human-in-the-loop guardrails.
            </p>
            <button
              className="rounded-full border border-accent px-5 py-2 text-xs font-semibold text-accent transition hover:bg-accent hover:text-background"
              onClick={() => setIsCreating(true)}
            >
              Create Automation
            </button>
          </div>
        )}
      </div>

      <InitialSetupModal open={initialModalOpen} onClose={() => setInitialModalOpen(false)} />

      <Transition show={isCreating} as={Fragment}>
        <Dialog onClose={setIsCreating} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-3xl border border-muted bg-background/95 p-6 shadow-2xl">
                <NewAutomationForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsCreating(false)}
                  loading={isSubmitting}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <RunLogDrawer open={runDrawerOpen} onClose={setRunDrawerOpen} logs={runLogs} />
    </div>
  );
}

const augmentAutomation = (automation: Automation): AutomationWithMeta => {
  const healthScore = Math.min(
    100,
    Math.floor(
      45 +
        automation.performance.engagements / 50 +
        automation.performance.views / 1000 +
        automation.steps.filter((step) => !step.requiresHumanReview).length * 4
    )
  );
  const automationVelocity = Math.max(
    10,
    Math.floor(automation.steps.length * 12 - automation.performance.conversionRate * 3)
  );
  return {
    ...automation,
    healthScore,
    automationVelocity
  };
};
