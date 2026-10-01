import type { ReactNode } from "react";
import SectionHeading from "./SectionHeading";

type Props = {
  /** شناسه‌ی سکشن — لینک مستقیم و هدف Scroll Spy */
  id: string;
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * قاب یکنواخت سکشن‌های صفحه‌ی جزئیات.
 *
 * سه کار می‌کند که اگر در هر سکشن دستی تکرار شود، دیر یا زود یکی‌شان
 * جا می‌ماند: ست‌کردن `id` برای لینک مستقیم، کلاس `hz-scroll-mt` برای
 * جبران ارتفاع نوار چسبان، و جداکننده‌ی یکسان بین بخش‌ها.
 */
export default function SectionShell({
  id,
  title,
  hint,
  action,
  children,
  className = "",
}: Props): ReactNode {
  return (
    <section
      id={id}
      className={`hz-scroll-mt border-foreground/10 border-t pt-10 ${className}`}
    >
      <SectionHeading className="mb-5" hint={hint} action={action}>
        {title}
      </SectionHeading>
      {children}
    </section>
  );
}
