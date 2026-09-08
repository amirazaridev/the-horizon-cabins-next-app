import Image from "next/image";
import { type ReactNode } from "react";
import authImageUrl from "@/assets/images/auth.png";
import Button from "@/components/ui/Button";
import { User, UserRoundPlus } from "lucide-react";

type Props = {};

export default function BookingAuthCheck({}: Props): ReactNode {
  return (
    <div className="bg-surface/60 border-foreground/10 flex min-h-50 flex-col overflow-hidden rounded-3xl border  shadow-md backdrop-blur-md md:flex-row-reverse lg:col-span-5 pb-10 md:pb-0">
        <Image
        className="mx-auto"
        height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 33vw"
          alt="auth-image"
          src={authImageUrl}
        />
      <div className="gap-y-3 lg:justify-center px-9 sm:px-17 md:py-10 md:px-10 flex flex-col">
        <div className="text-2xl md:text-3xl lg:text-4xl font-medium">
          برای انتخاب تاریخ و رزرو <br />
          ابتدا وارد <span className="text-primary-400">حساب کاربری</span> شوید
        </div>
        <p className="text-text-gray text-sm md:text-base">
          برای مشاهده تقویم و انتخاب تاریخ اقامت وارد حساب کاربری خود شوید یا
          ثبت‌نام کنید
        </p>
        <div className="flex gap-x-2">
          <Button href="/login" shape="xl">
            <User />
            ورود به حساب کاربری
          </Button>
          <Button href="/register" variant="outline" shape="xl">
            <UserRoundPlus />
            ثبت نام
          </Button>
        </div>
      </div>
    </div>
  );
}
