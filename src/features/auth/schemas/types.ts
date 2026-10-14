import { type z } from "zod";

import {
  type forgotPasswordSchema,
  type loginSchema,
} from "./login";
import {
  type registerPasswordSchema,
  type registerStepOneSchema,
  type registerVerificationSchema,
} from "./register";

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
