"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/features/auth/components/Input";
import {
  getPasswordStrength,
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/features/auth/lib/validation";

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Status = "idle" | "loading" | "success";

const STRENGTH_CONFIG = [
  { color: "bg-red-500", glow: "shadow-red-500/30" },
  { color: "bg-orange-500", glow: "shadow-orange-500/30" },
  { color: "bg-yellow-500", glow: "shadow-yellow-500/30" },
  { color: "bg-lime-400", glow: "shadow-lime-400/30" },
  { color: "bg-green-400", glow: "shadow-green-400/30" },
];

export default function RegisterForm() {
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const strength = getPasswordStrength(values.password);

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
      fullName:
        values.fullName.trim() ? undefined : "نام و نام خانوادگی الزامی است",
      phone: validatePhone(values.phone),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword:
        values.confirmPassword === values.password
          ? undefined
          : "تکرار رمز عبور با رمز عبور یکسان نیست",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-[1px] rounded-[1.75rem] bg-gradient-to-br from-primary-400/40 via-primary-500/20 to-primary-400/40 opacity-60 blur-sm" />
      <div className="relative overflow-hidden rounded-[1.75rem] bg-surface/90 backdrop-blur-xl">
        <div className="absolute -top-32 -left-32 size-64 rounded-full bg-primary-400/8 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 size-64 rounded-full bg-primary-500/5 blur-[80px]" />

        <div className="relative px-6 py-6 md:px-8 md:py-8">
          <div className="mb-5 text-center">
            <div className="relative mx-auto mb-3 size-12">
              <div className="absolute inset-0 rounded-xl bg-primary-400/10 blur-xl" />
              <div className="relative flex size-12 items-center justify-center rounded-xl border border-primary-400/20 bg-primary-400/10 backdrop-blur-sm">
                <UserPlus className="size-6 text-primary-400" />
              </div>
            </div>
            <h1 className="text-text text-xl font-bold tracking-tight">
              ساخت حساب کاربری
            </h1>
            <p className="mt-1.5 text-xs text-white/40">
              در چند ثانیه عضو خانواده هورایزن شوید
            </p>
          </div>

          {status === "success" && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success backdrop-blur-sm">
              <CheckCircle2 className="size-5 shrink-0" />
              حساب کاربری شما با موفقیت ساخته شد!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="نام و نام خانوادگی"
              placeholder="مثلاً علی رضایی"
              value={values.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
              autoComplete="name"
              icon={<User className="size-5" />}
            />

            <Input
              label="شماره موبایل"
              type="tel"
              dir="ltr"
              placeholder="09123456789"
              value={values.phone}
              onChange={handleChange("phone")}
              error={errors.phone}
              autoComplete="tel"
              icon={<Phone className="size-5" />}
            />

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

            <div>
              <Input
                label="رمز عبور"
                type="password"
                dir="ltr"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange("password")}
                error={errors.password}
                autoComplete="new-password"
                icon={<Lock className="size-5" />}
              />
              {values.password && (
                <div className="mt-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((index) => {
                      const config = STRENGTH_CONFIG[strength.score];
                      const isActive = index < strength.score;
                      return (
                        <span
                          key={index}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            isActive
                              ? `${config.color} shadow-sm ${config.glow}`
                              : "bg-white/8"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-xs text-white/35">
                    قدرت رمز عبور:{" "}
                    <span
                      className="font-medium"
                      style={{
                        color:
                          strength.score >= 3
                            ? "rgba(74,222,128,0.8)"
                            : strength.score >= 2
                              ? "rgba(250,204,21,0.8)"
                              : "rgba(248,113,113,0.8)",
                      }}
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <Input
              label="تکرار رمز عبور"
              type="password"
              dir="ltr"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
              icon={<Shield className="size-5" />}
            />

            <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm leading-relaxed text-white/50 select-none">
              <input
                type="checkbox"
                className="accent-primary-400 mt-1 size-4 shrink-0 rounded"
                required
              />
              <span>
                قوانین و مقررات{" "}
                <a href="#" className="text-primary-400/80 hover:text-primary-400">
                  هورایزن کابینز
                </a>{" "}
                را می‌پذیرم
              </span>
            </label>

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
                  در حال ثبت‌نام...
                </>
              ) : (
                "ایجاد حساب کاربری"
              )}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-medium text-white/30">یا</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <p className="text-center text-sm text-white/40">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-400 transition-colors duration-300 hover:text-primary-300"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
