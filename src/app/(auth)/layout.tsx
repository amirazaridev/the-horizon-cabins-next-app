import type { ReactNode } from "react";
import Logo from "@/components/ui/Logo";
import CopyrightText from "@/components/ui/CopyrightText";

/**
 * پوسته‌ی مشترک صفحه‌های ورود/ثبت‌نام.
 *
 * ⚠️ چرا `overflow-hidden` روی این ظرف هست؟
 * سه لکه‌ی نورانی تزئینی (blur orb) با `absolute` و اندازه‌های ۶۰۰px و
 * ۵۰۰px بیرون از کادر قرار می‌گیرند (`right-[-10%]`، `left-[-5%]`،
 * `-right-32`). بدون برش، این‌ها عرض سند را از viewport بیشتر می‌کنند و
 * کل صفحه اسکرول افقی می‌گیرد.
 *
 * `overflow-hidden` اینجا بی‌خطر است — برخلاف صفحه‌ی جزئیات اقامتگاه که
 * `position: sticky` دارد، در این صفحه هیچ عنصر چسبانی وجود ندارد، پس
 * تبدیل‌شدن این ظرف به scroll container مشکلی ایجاد نمی‌کند.
 *
 * ⚠️ چرا `min-h-dvh` و نه `justify-center` تنها؟
 * با `min-h-dvh` + `justify-between`، فوتر (متن کپی‌رایت) همیشه به کف
 * viewport می‌چسبد و فرم در مرکز می‌ماند. اگر فقط `justify-center` باشد،
 * در نمایشگرهای بلند دو نوار خالی بزرگ بالا و پایین باز می‌شود و در
 * نمایشگرهای کوتاه فوتر از دید خارج می‌شود.
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="bg-background relative flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-1">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-primary-400/10 absolute top-[-20%] right-[-10%] size-150 rounded-full blur-[120px]" />
        <div className="bg-primary-500/10 absolute bottom-[-15%] left-[-5%] size-125 rounded-full blur-[100px]" />
        <div className="bg-primary-400/10 absolute top-1/2 left-1/2 size-75 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      {/* ناحیه‌ی میانی: فرم در مرکز، با فضای کمینه‌ی امن از بالا و پایین */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <div className="mb-6">
          <Logo />
        </div>

        <div className="w-full">{children}</div>
      <CopyrightText />
      </div>

    </div>
  );
}
