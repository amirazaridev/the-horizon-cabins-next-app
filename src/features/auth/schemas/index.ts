export { normalizeDigits, normalizeText, digitsOnly } from "./normalize";
export { AUTH_MESSAGES, FIELD_LABELS, faNumber } from "./messages";
export {
  AUTH_LIMITS,
  PASSWORD_STRENGTH_SEGMENTS,
  faCount,
} from "../constants/auth-limits";
export {
  NAME_PATTERN,
  EMAIL_PATTERN,
  ASCII_PRINTABLE_PATTERN,
  DIGITS_ONLY_PATTERN,
} from "./patterns";
export {
  PASSWORD_RULES,
  STRENGTH_SEGMENTS,
  getPasswordStrength,
  ruleOf,
  type PasswordRuleId,
  type PasswordStrength,
} from "./password-rules";
export { nameField, emailField, otpField } from "./fields";
export {
  registerStepOneSchema,
  registerVerificationSchema,
  registerPasswordSchema,
} from "./register";
export {
  registerSchema,
  validateEmail,
  validatePassword,
} from "./register-full";
export { loginSchema, forgotPasswordSchema } from "./login";
export type {
  ForgotPasswordValues,
  LoginFormValues,
  RegisterFormValues,
  RegisterPasswordValues,
  RegisterStepOneValues,
  RegisterVerificationValues,
} from "./types";
