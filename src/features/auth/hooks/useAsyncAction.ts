"use client";

import { useCallback, useState } from "react";

export type AuthAction =
  | "sendingCode"
  | "verifyingCode"
  | "registering"
  | "loggingIn";

type UseAsyncActionResult<TAction extends string> = {
  /** عملیات در جریان، یا `null` وقتی همه چیز بیکار است. */
  pending: TAction | null;
  /** آیا عملیات مشخصی در جریان است؟ */
  is: (action: TAction) => boolean;
  /** آیا هیچ عملیاتی در جریان است؟ — برای disable کردن کل فرم. */
  isAnyPending: boolean;
  run: <T>(action: TAction, task: () => Promise<T>) => Promise<T>;
};

export function useAsyncAction<TAction extends string = AuthAction>(): UseAsyncActionResult<TAction> {
  const [pending, setPending] = useState<TAction | null>(null);

  const run = useCallback(
    async <T,>(action: TAction, task: () => Promise<T>): Promise<T> => {
      setPending(action);
      try {
        return await task();
      } finally {
        setPending(null);
      }
    },
    [],
  );

  const is = useCallback((action: TAction) => pending === action, [pending]);

  return { pending, is, isAnyPending: pending !== null, run };
}
