"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { login } from "../services/auth.service";
import type { AuthError } from "../types/auth.types";
import Checkbox from "./Checkbox";
import FormContainer from "./FormContainer";
import Input from "./Input";

/**
 * فرم ورود.
 *
 * ⚠️ کل منطق فرم اینجاست و UI هیچ دانشی از API ندارد؛ فقط
 * `auth.service.login` را صدا می‌زند. برای اتصال واقعی، تنها
 * `services/auth.service.ts` عوض می‌شود.
 *
 * حالت اعتبارسنجی: `mode: "onTouched"` — یعنی خطا بعد از اولین خروج از
 * فیلد نشان داده می‌شود، نه با هر کاراکتر (که تجربه‌ی تایپ را آزار می‌دهد)
 * و نه فقط بعد از submit (که دیر است). بعد از اولین خطا `reValidateMode`
 * روی `onChange` است تا کاربر همان لحظه‌ی اصلاح، تایید ببیند.
 */
export default function LoginForm(): ReactNode {
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    const result = await login({
      email: values.email,
      password: values.password,
      rememberMe: Boolean(values.rememberMe),
    });

    if (!result.ok) {
      // خطای فیلد → روی همان ورودی؛ خطای کلی → بنر بالای فرم.
      if (result.error.field === "email" || result.error.field === "password") {
        setError(result.error.field, { message: result.error.message });
      }
      setFormError(result.error);
      return;
    }

    // ⚠️ TODO(backend): در اینجا توکن را ذخیره و کاربر را به مقصد هدایت کنید.
    // مثلاً: `router.push(nextPath)` بعد از نوشتن کوکی نشست.
    setSucceeded(true);
  }

  const isBusy = isSubmitting || succeeded;

  return (
    <FormContainer for="login">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && !formError.field && (
          <div
            role="alert"
            className="border-danger-strong/30 bg-danger/8 text-danger rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed"
          >
            {formError.message}
          </div>
        )}

        <Input
          label="ایمیل"
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="size-5" />}
          error={errors.email?.message}
          disabled={isBusy}
          {...register("email")}
        />

        <Input
          label="رمز عبور"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock className="size-5" />}
          error={errors.password?.message}
          disabled={isBusy}
          {...register("password")}
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

        <Button
          type="submit"
          shape="xl"
          fullWidth
          disabled={isBusy || !isValid}
          className="mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              در حال ورود...
            </>
          ) : succeeded ? (
            "خوش آمدید!"
          ) : (
            "ورود به حساب"
          )}
        </Button>
      </form>
    </FormContainer>
  );
}
