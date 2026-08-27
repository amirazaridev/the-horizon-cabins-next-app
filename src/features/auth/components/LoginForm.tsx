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
import FormContainer from "./FormContainer";

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
    <FormContainer for="login">
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
    </FormContainer>
  );
}
