"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Phone,
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

const STRENGTH_BAR_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-400",
  "bg-green-400",
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
    <div className="from-primary-400/40 relative w-full max-w-md rounded-3xl bg-linear-to-br via-white/10 to-transparent p-[1px]">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-8 backdrop-blur-sm md:p-10">
        <div className="absolute -top-24 -left-24 size-48 rounded-full bg-primary-400/10 blur-[100px]" />

        <div className="relative mb-8 text-center">
          <div className="border-primary-400/20 bg-primary-400/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border">
            <UserPlus className="text-primary-400 size-7" />
          </div>
          <h1 className="text-text text-2xl font-bold">ساخت حساب کاربری</h1>
          <p className="mt-2 text-sm text-white/50">
            در چند ثانیه عضو خانواده هورایزن شوید
          </p>
        </div>

        {status === "success" && (
          <div className="relative mb-6 flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
            <CheckCircle2 className="size-5 shrink-0" />
            حساب کاربری شما با موفقیت ساخته شد!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
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
              <div className="mt-2">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        index < strength.score
                          ? STRENGTH_BAR_COLORS[strength.score]
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-white/40">
                  قدرت رمز عبور: {strength.label}
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
            icon={<Lock className="size-5" />}
          />

          <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-white/60 select-none">
            <input
              type="checkbox"
              className="accent-primary-400 mt-1 size-4 shrink-0 rounded"
              required
            />
            <span>
              قوانین و مقررات هورایزن کابینز را می‌پذیرم
            </span>
          </label>

          <Button type="submit" shape="xl" fullWidth disabled={status === "loading"}>
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

        <div className="relative my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">یا</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <p className="relative text-center text-sm text-white/50">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/login"
            className="hover:text-primary-300 font-semibold text-primary-400 transition-colors duration-300"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
