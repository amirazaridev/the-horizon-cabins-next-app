"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import { faNumber } from "../schemas";
import {
  REGISTER_STEPS,
  getRegisterStepIndex,
} from "../constants/register-steps";
import type { RegisterStep } from "../types/auth.types";

type Props = {
  //*  مرحله‌ی فعال. 
  current: RegisterStep;
  maxReached: number;
  onStepClick?: (step: RegisterStep) => void;
};

type StepState = "done" | "current" | "upcoming";

const CIRCLE_STYLES: Record<StepState, string> = {
  current:
    "border-primary-400/50 bg-primary-400/15 text-primary-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]",
  done: "border-primary-400/30 bg-primary-400/10 text-primary-400",
  upcoming: "border-foreground/12 text-text/35",
};

const LABEL_STYLES: Record<StepState, string> = {
  current: "text-text",
  done: "text-text/60",
  upcoming: "text-text/35",
};


function Stepper({ current, maxReached, onStepClick }: Props) {
  const currentIndex = getRegisterStepIndex(current);
  const lastIndex = REGISTER_STEPS.length - 1;
  const total = faNumber(REGISTER_STEPS.length);

  return (
    <ol className="flex items-start" aria-label="مراحل ثبت‌نام">
      {REGISTER_STEPS.map((step, index) => {
        const state: StepState =
          index < currentIndex
            ? "done"
            : index === currentIndex
              ? "current"
              : "upcoming";
        const isReachable = index <= maxReached && state !== "current";
        const Icon = step.icon;

        return (
          <li
            key={step.id}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-2"
            aria-current={state === "current" ? "step" : undefined}
          >
            <button
              type="button"
              disabled={!isReachable}
              onClick={() => onStepClick?.(step.id)}
              aria-label={`مرحله ${faNumber(index + 1)} از ${total}: ${step.title}`}
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold outline-none transition-[color,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-primary-400/50 enabled:cursor-pointer enabled:hover:border-primary-400/40 ${CIRCLE_STYLES[state]}`}
            >
              {state === "done" ? (
                <Check className="size-4.5" aria-hidden="true" />
              ) : (
                <Icon className="size-4.5" aria-hidden="true" />
              )}
            </button>

            {/* خط رابط به مرحله‌ی بعد (به‌جز آخری) */}
            {index < lastIndex && (
              <span
                aria-hidden="true"
                className="absolute top-5 start-[calc(50%+1.75rem)] h-px w-[calc(100%-3.5rem)] overflow-hidden bg-foreground/12"
              >
                <span
                  className={`block h-full bg-primary-400/60 transition-[width] duration-500 motion-reduce:transition-none ${
                    index < currentIndex ? "w-full" : "w-0"
                  }`}
                />
              </span>
            )}

            <span
              className={`max-w-full truncate px-1 text-center text-xs font-semibold transition-colors duration-300 motion-reduce:transition-none sr-only sm:not-sr-only ${LABEL_STYLES[state]}`}
            >
              {step.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default memo(Stepper);