import type { HTMLAttributes, ReactNode } from "react";

import Carousel from "@/components/ui/Carousel";

import CabinCardSkeleton, {
  type CabinCardSkeletonVariant,
} from "./CabinCardSkeleton";

export type CabinCardsLayout = "grid" | "carousel" | "responsive";

/** ویژگی‌های داده‌ی دلخواه، مثل `data-preview-card` */
type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export interface CabinCardsSkeletonProps {
  /** تعداد کارت‌های اسکلتی — پیش‌فرض ۶ */
  count?: number;
  /** واریانت کارت — هم‌خوان با `CabinCard` واقعی */
  variant?: CabinCardSkeletonVariant;
  layout?: CabinCardsLayout;
  /** کلاس گرید (برای `grid` و `responsive`) — باید با گرید محتوای واقعی یکی باشد */
  gridClassName?: string;
  /** کلاس هر اسلاید (برای `carousel` و `responsive`) */
  slideClassName?: string;
  /** ویژگی‌های دلخواه روی هر کارت — مثل `data-preview-card` برای انیمیشن GSAP */
  itemProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  className?: string;
  showPrice?: boolean;
}

export default function CabinCardsSkeleton({
  count = 6,
  variant = "default",
  layout = "grid",
  gridClassName = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
  slideClassName = "flex-[0_0_78%]",
  itemProps,
  className = "",
  showPrice = false,
}: CabinCardsSkeletonProps): ReactNode {
  const total = Math.max(1, Math.floor(count));

  const renderCards = () =>
    Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        {...itemProps}
        className={`h-full ${itemProps?.className ?? ""}`.trim()}
      >
        <CabinCardSkeleton
          variant={variant}
          showPrice={showPrice}
          className="h-full"
        />
      </div>
    ));

  if (layout === "carousel") {
    return (
      <div className={className}>
        <Carousel slideClassName={slideClassName} showArrows={false}>
          {renderCards()}
        </Carousel>
      </div>
    );
  }

  if (layout === "responsive") {
    return (
      <div className={className}>
        <div className={`hidden ${gridClassName}`}>{renderCards()}</div>
        <div className="sm:hidden">
          <Carousel slideClassName={slideClassName} showArrows={false}>
            {renderCards()}
          </Carousel>
        </div>
      </div>
    );
  }

  return <div className={`${gridClassName} ${className}`.trim()}>{renderCards()}</div>;
}
