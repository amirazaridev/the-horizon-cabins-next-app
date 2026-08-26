"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/features/auth/components/Input";
import {
  validateEmail,
  validatePassword,
} from "@/features/auth/lib/validation";

type FormValues = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Status = "idle" | "loading" | "success";

export default function LoginForm() {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(field: keyof FormValues) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="from-primary-400/40 via-primary-500/20 to-primary-400/40 absolute -inset-px rounded-[1.75rem] bg-linear-to-br opacity-60 blur-sm" />
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 backdrop-blur-xl">
        <div className="bg-primary-400/8 absolute -top-32 -left-32 size-64 rounded-full blur-[100px]" />
        <div className="bg-primary-500/5 absolute -right-32 -bottom-32 size-64 rounded-full blur-[80px]" />

        <div className="relative px-6 py-6 md:px-8 md:py-8">
          <div className="mb-5 text-center">
            <div className="relative mx-auto mb-3 size-12">
              <div className="bg-primary-400/10 absolute inset-0 rounded-xl blur-xl" />
              <div className="border-primary-400/20 bg-primary-400/10 relative flex size-12 items-center justify-center rounded-xl border backdrop-blur-sm">
                <LogIn className="text-primary-400 size-6" />
              </div>
            </div>
            <h1 className="text-text text-xl font-bold tracking-tight">
              ورود به هورایزن
            </h1>
            <p className="mt-1.5 text-xs text-white/40">
              به دنیای کابین‌های لوکس خوش آمدید
            </p>
          </div>

          {status === "success" && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-300 backdrop-blur-sm">
              <CheckCircle2 className="size-5 shrink-0" />
              ورود با موفقیت انجام شد!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="ایمیل"
              type="email"
              dir="ltr"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange("email")}
              error={errors.email}
              autoComplete="email"
              icon={<Mail className="size-5" />}
            />

            <Input
              label="رمز عبور"
              type="password"
              dir="ltr"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange("password")}
              error={errors.password}
              autoComplete="current-password"
              icon={<Lock className="size-5" />}
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/50 select-none">
                <input
                  type="checkbox"
                  className="accent-primary-400 size-4 rounded border-white/20"
                />
                مرا به خاطر بسپار
              </label>
              <a
                href="#"
                className="text-primary-400/80 hover:text-primary-400 text-sm transition-colors duration-300"
              >
                فراموشی رمز عبور؟
              </a>
            </div>

            <Button
              type="submit"
              shape="xl"
              fullWidth
              disabled={status === "loading"}
              className="mt-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                "ورود به حساب"
              )}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-medium text-white/30">یا</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <p className="text-center text-sm text-white/40">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-300"
            >
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
