"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { FIELD_LABELS, loginSchema, type LoginFormValues } from "../schemas";
import { login } from "../services/auth.service";
import type { AuthError } from "../types/auth.types";
import { useAsyncAction } from "../hooks/useAsyncAction";
import Checkbox from "./Checkbox";
import ErrorBanner from "./ErrorBanner";
import FormContainer from "./FormContainer";
import StateField from "./StateField";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

/**
 * فرم ورود.
 *
 * ⚠️ کل منطق این‌جاست و UI هیچ دانشی از API ندارد؛ فقط
 * `auth.service.login` را صدا می‌زند. برای اتصال واقعی، تنها
 * `services/auth.service.ts` عوض می‌شود.
 *
 * حالت اعتبارسنجی: `mode: "onTouched"` — خطا بعد از اولین خروج از فیلد
 * نشان داده می‌شود، نه با هر کاراکتر (که تجربه‌ی تایپ را آزار می‌دهد)
 * و نه فقط بعد از submit (که دیر است). بعد از اولین خطا `reValidateMode`
 * روی `onChange` است تا کاربر همان لحظه‌ی اصلاح، تایید ببیند.
 */
export default function LoginForm(): ReactNode {
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const action = useAsyncAction<"loggingIn">();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { control, handleSubmit, register, formState } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      mode: "onTouched",
      defaultValues: { email: "", password: "", rememberMe: false },
    });

  const isBusy = action.isAnyPending || succeeded;

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    const result = await action.run("loggingIn", () =>
      login({
        email: values.email,
        password: values.password,
        rememberMe: Boolean(values.rememberMe),
      }),
    );

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    setSucceeded(true);

    const from = searchParams.get("from");
    const destination =
      (from && from.startsWith("/")) || from?.startsWith("%2F")
        ? from
        : result.data.redirectTo;

    router.replace(destination);
    router.refresh();
  }

  return (
    <FormContainer for="login">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <ErrorBanner
          message={!formError?.field ? formError?.message : undefined}
        />

        <StateField
          control={control}
          name="email"
          label={FIELD_LABELS.email}
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="size-5" />}
          disabled={isBusy}
        />

        <StateField
          control={control}
          name="password"
          label={FIELD_LABELS.password}
          type="password"
          dir="ltr"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock className="size-5" />}
          disabled={isBusy}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Checkbox {...register("rememberMe")} disabled={isBusy}>
            مرا به خاطر بسپار
          </Checkbox>

          <Link
            href="/forgot-password"
            className="text-primary-400/80 hover:text-primary-400 text-sm transition-colors duration-300"
          >
            فراموشی رمز عبور؟
          </Link>
        </div>

        <SubmitButton
          shape="xl"
          fullWidth
          className="mt-2"
          label={succeeded ? "خوش آمدید!" : "ورود به حساب"}
          loadingLabel="در حال ورود..."
          isLoading={action.is("loggingIn")}
          disabled={isBusy || !formState.isValid}
        />
      </form>
    </FormContainer>
  );
}
