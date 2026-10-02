import { z } from "zod";

import { AUTH_LIMITS } from "../constants/auth-limits";
import { AUTH_MESSAGES, FIELD_LABELS } from "./messages";
import { emailField } from "./fields";

/** ورود با ایمیل و رمز عبور. */
export const loginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, AUTH_MESSAGES.required(FIELD_LABELS.password))
    .min(
      AUTH_LIMITS.passwordMin,
      AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin),
    ),
  rememberMe: z.boolean().default(false),
});

/** فراموشی رمز عبور — فقط ایمیل. */
export const forgotPasswordSchema = z.object({
  email: emailField,
});
