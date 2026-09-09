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
import FormContainer from "./FormContainer";
import CheckPasswordPower from "./CheckPasswordPower";

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
      fullName: values.fullName.trim()
        ? undefined
        : "نام و نام خانوادگی الزامی است",
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
    <FormContainer for="register">
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
          {values.password && <CheckPasswordPower password={values.password} />}
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

        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm leading-relaxed text-text-gray select-none">
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
    </FormContainer>
  );
}
