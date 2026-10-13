import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export type BreadcrumbItem = {
  //* برچسب نمایشی. */
  label: string;
  /*
   * اگر بدهید آیتم لینک می‌شود.
   * آخرین آیتم را معمولاً بدون `href` بگذارید تا به‌شکل متن جاری رندر شود.
   */
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  //* فاصله/چیدمان بیرونی — پیش‌تر `mb-6` داخل کامپوننت هاردکد بود. */
  className?: string;
};

export default function Breadcrumb({
  items,
  className = "",
}: Props): ReactNode {
  return (
    <nav
      aria-label="مسیر صفحه"
      className={`text-text-gray flex items-center gap-1.5 text-xs lg:text-sm ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isLink = Boolean(item.href) && !isLast;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {isLink ? (
              <Link href={item.href as string}>{item.label}</Link>
            ) : (
              <span
                className="text-text/80"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
