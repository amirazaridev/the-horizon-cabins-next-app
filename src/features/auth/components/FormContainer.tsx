import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import BackDropBlur from "@/components/ui/BackDropBlur";

type Props = {
  for: "login" | "register";
  title?: string;
  description?: string;
  /** محتوای اضافی زیر فرم اصلی (قبل از خط جداکننده). */
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * قاب مشترک فرم‌های ورود/ثبت‌نام.
 *
 * ⚠️ عنوان و توضیح حالا قابل بازنویسی‌اند: فرم ثبت‌نام مرحله‌ای باید
 * بتواند در هر مرحله سرتیتر خودش را عوض کند (مثلاً «تایید ایمیل»)،
 * در حالی که قاب، لوگو و لینک متقابل ثابت می‌مانند.
 *
 * ⚠️ واحد ریسپانسیو: پدینگ و شعاع گوشه در موبایل کوچک‌تر است؛ `max-w-md`
 * باعث می‌شود در تبلت/دسکتاپ فرم از عرض خوانا پهن‌تر نشود.
 */
export default function FormContainer({
  for: forType,
  title,
  description,
  footer,
  children,
}: Props): ReactNode {
  const isFormLogin = forType === "login";

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="bg-surface/90 shadow-primary-300/15 relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl">
        <BackDropBlur type="double-top-down" />

        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 text-center">
            <div className="relative mx-auto mb-3 size-12">
              <div className="bg-primary-400/10 absolute inset-0 rounded-xl blur-xl" />
              <div className="border-primary-400/20 bg-primary-400/10 relative flex size-12 items-center justify-center rounded-xl border backdrop-blur-sm">
                {isFormLogin ? (
                  <LogIn className="text-primary-400 size-6" />
                ) : (
                  <UserPlus className="text-primary-400 size-6" />
                )}
              </div>
            </div>

            <h1 className="text-text text-xl font-bold tracking-tight">
              {title ??
                (isFormLogin ? "ورود به هورایزن" : "ساخت حساب کاربری")}
            </h1>
            <p className="text-text-gray mt-1.5 text-xs">
              {description ??
                (isFormLogin
                  ? "به دنیای کابین‌های لوکس خوش آمدید"
                  : "در چند ثانیه عضو خانواده هورایزن شوید")}
            </p>
          </div>

          {children}

          {footer}

          <div className="my-5 flex items-center gap-4">
            <span className="via-foreground/10 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
            <span className="text-text/30 text-xs font-medium">یا</span>
            <span className="via-foreground/10 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
          </div>

          <p className="text-text-gray text-center text-sm">
            {isFormLogin ? "حساب کاربری ندارید" : "قبلاً ثبت‌نام کرده‌اید"}

            <Link
              href={isFormLogin ? "/register" : "/login"}
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-300"
            >
              {isFormLogin ? "ثبت‌نام کنید" : "وارد شوید"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
