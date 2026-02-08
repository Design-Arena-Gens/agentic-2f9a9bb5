import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";

import { AutomationRunLog } from "../../lib/types";

type Props = {
  open: boolean;
  onClose: (value: boolean) => void;
  logs: AutomationRunLog[];
};

export function RunLogDrawer({ open, onClose, logs }: Props) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-40">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 flex flex-col items-end">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-150"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-muted bg-background/95 p-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Automation Telemetry
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-slate-400">
                Execution logs, generated asset drops, and optimization highlights for each run.
              </Dialog.Description>

              <div className="mt-6 flex flex-col gap-4">
                {logs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-800 bg-black/40 p-5">
                    <div className="flex items-center justify-between text-sm text-white">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-accent" />
                        <p>
                          {formatDistanceToNow(parseISO(log.startedAt), {
                            addSuffix: true
                          })}
                        </p>
                      </div>
                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                        {log.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {log.messages.map((message) => (
                        <div
                          key={message.timestamp + message.stepId}
                          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                        >
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            {formatDistanceToNow(parseISO(message.timestamp), {
                              addSuffix: true
                            })}
                          </p>
                          <p className="mt-2 text-sm text-slate-200">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-800 bg-black/40 p-6 text-center text-sm text-slate-400">
                    No automation runs yet. Fire your flow to populate telemetry.
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
