import BackDropBlur from "@/components/ui/BackDropBlur";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren, type ReactNode } from "react";

type Props = PropsWithChildren & { for: "login" | "register" };

export default function FormContainer({
  for: forType,
  children,
}: Props): ReactNode {
  const isFormLogin = forType === "login";
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="bg-surface/90 shadow-primary-300/15 relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl">
        <BackDropBlur type="double-top-down" />
        <div className="relative px-6 py-6 md:px-8 md:py-8">
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
              {isFormLogin ? "ساخت حساب کاربری" : "ورود به هورایزن"}
            </h1>
            <p className="mt-1.5 text-xs text-white/40">
              {isFormLogin
                ? "به دنیای کابین‌های لوکس خوش آمدید"
                : "در چند ثانیه عضو خانواده هورایزن شوید"}
            </p>
          </div>

          {children}
          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-medium text-white/30">یا</span>
            <span className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <p className="text-center text-sm text-white/40">
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
