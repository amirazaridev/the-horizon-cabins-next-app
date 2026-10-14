import { z } from "zod";

import { registerPasswordSchema, registerStepOneSchema, registerVerificationSchema } from "./register";
import { emailField } from "./fields";
import { AUTH_LIMITS } from "../constants/auth-limits";
import { AUTH_MESSAGES, FIELD_LABELS } from "./messages";

export const registerSchema = registerStepOneSchema
  .merge(registerVerificationSchema)
  .merge(
    z.object({
      password: z.string(),
      confirmPassword: z.string(),
    }),
  )
  .superRefine((values, ctx) => {
    const passwordResult = registerPasswordSchema.safeParse({
      password: values.password,
      confirmPassword: values.confirmPassword,
      acceptedTerms: true,
    });

    if (passwordResult.success) return;
    for (const issue of passwordResult.error.issues) {
      ctx.addIssue({ ...issue, path: issue.path });
    }
  });

export function validateEmail(value: string): string | null {
  const result = emailField.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}

export function validatePassword(value: string): string | null {
  const result = z
    .string()
    .min(1, AUTH_MESSAGES.required(FIELD_LABELS.password))
    .min(
      AUTH_LIMITS.passwordMin,
      AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin),
    )
    .safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}
