import { z } from "zod";

import {
  forgotPasswordSchema,
  loginSchema,
} from "./login";
import {
  registerPasswordSchema,
  registerStepOneSchema,
  registerVerificationSchema,
} from "./register";

/**
 * تایپ‌های مشتق‌شده از اسکیماها.
 *
 * ⚠️ از `z.input` استفاده می‌کنیم نه `z.infer`: فرم‌های React Hook Form
 * با «ورودی» کار می‌کنند (قبل از transform). اگر `z.infer` بدهیم، فیلدهایی
 * که `transform` دارند (مثل کد تایید) تایپ خروجی می‌گیرند و RHF خطا می‌دهد.
 */

type StepOneSchema = typeof registerStepOneSchema;
type VerificationSchema = typeof registerVerificationSchema;
type PasswordSchema = typeof registerPasswordSchema;
type LoginSchema = typeof loginSchema;
type ForgotPasswordSchema = typeof forgotPasswordSchema;

export type RegisterStepOneValues = z.input<StepOneSchema>;
export type RegisterVerificationValues = z.input<VerificationSchema>;
export type RegisterPasswordValues = z.input<PasswordSchema>;
export type RegisterFormValues = RegisterStepOneValues &
  RegisterVerificationValues &
  RegisterPasswordValues;
export type LoginFormValues = z.input<LoginSchema>;
export type ForgotPasswordValues = z.input<ForgotPasswordSchema>;
