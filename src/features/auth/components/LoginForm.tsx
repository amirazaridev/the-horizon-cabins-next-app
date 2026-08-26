"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/features/auth/components/Input";
import { validateEmail, validatePassword } from "@/features/auth/lib/validation";

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
    <div className="from-primary-400/40 relative w-full max-w-md rounded-3xl bg-linear-to-br via-white/10 to-transparent p-[1px]">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-8 backdrop-blur-sm md:p-10">
        <div className="absolute -top-24 -left-24 size-48 rounded-full bg-primary-400/10 blur-[100px]" />

        <div className="relative mb-8 text-center">
          <div className="border-primary-400/20 bg-primary-400/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border">
            <LogIn className="text-primary-400 size-7" />
          </div>
          <h1 className="text-text text-2xl font-bold">ورود به هورایزن</h1>
          <p className="mt-2 text-sm text-white/50">
            به دنیای کابین‌های لوکس خوش آمدید
          </p>
        </div>

        {status === "success" && (
          <div className="relative mb-6 flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
            <CheckCircle2 className="size-5 shrink-0" />
            ورود با موفقیت انجام شد!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
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
            <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60 select-none">
              <input
                type="checkbox"
                className="accent-primary-400 size-4 rounded"
              />
              مرا به خاطر بسپار
            </label>
            <a
              href="#"
              className="hover:text-primary-300 text-sm text-primary-400 transition-colors duration-300"
            >
              فراموشی رمز عبور؟
            </a>
          </div>

          <Button type="submit" shape="xl" fullWidth disabled={status === "loading"}>
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

        <div className="relative my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">یا</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <p className="relative text-center text-sm text-white/50">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="hover:text-primary-300 font-semibold text-primary-400 transition-colors duration-300"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
