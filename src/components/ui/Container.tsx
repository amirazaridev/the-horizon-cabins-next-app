import { ComponentProps, type ReactNode } from "react";

type Variant = "default" | "cabin-detail";

const containerClass: Record<Variant, string> = {
  default: "mx-auto max-w-7xl px-5 md:px-0",
  /**
   * ⚠️ `overflow-x-hidden` از این واریانت برداشته شد.
   *
   * دلیل فنی: `overflow-x: hidden` روی یک والد، محور عمودی را هم به
   * `auto` تبدیل می‌کند و آن والد را به یک scroll container تبدیل
   * می‌کند. در نتیجه `position: sticky` نوار تب چسبان و aside رزرو
   * به‌جای viewport به همین ظرف (که اسکرولی ندارد) می‌چسبید و عملاً
   * کار نمی‌کرد. گاردِ سرریز افقی از قبل در `globals.css`
   * (`html { overflow-x: hidden }`) وجود دارد، پس چیزی از دست نمی‌رود.
   *
   * ⚠️ عرض `86rem` (در برابر `80rem` پیشین): این صفحه یک گرید دوستونی
   * است (ستون محتوا + aside رزرو `25rem`) و تقویم قیمت هم ستون‌های روز
   * را باید کنار هم جا کند. با عرض بیشتر، هر ماه فضای کافی می‌گیرد و
   * تقویم در لپ‌تاپ‌های معمول دو‌ماهه و خوانا می‌ماند. این واریانت
   * فقط در همین صفحه (بدنه، بردکرامب و تب‌های چسبان) استفاده می‌شود و
   * `default` دست‌نخورده است.
   */
  "cabin-detail": "mx-auto max-w-[86rem] px-3 md:px-8 lg:px-0",
};

type Props = ComponentProps<"div"> & { variant?: Variant };
export default function Container({
  variant = "default",
  children,
  className,
  ...otherProps
}: Props): ReactNode {
  return (
    <div className={`${containerClass[variant]} ${className}`} {...otherProps}>
      {children}
    </div>
  );
}
