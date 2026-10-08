import { CalendarX2 } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";

type Props = {
  /** متن توضیح — بسته به تب فعال متفاوت است. */
  description?: string;
};

/** حالت خالی صفحه‌ی رزروها. */
export default function BookingsEmptyState({ description }: Props): ReactNode {
  return (
    <div className="border-foreground/10 bg-surface/50 flex flex-col items-center rounded-3xl border border-dashed px-6 py-14 text-center">
      <span className="bg-primary-400/10 text-primary-400 grid size-16 place-items-center rounded-2xl">
        <CalendarX2 className="size-8" />
      </span>
      <h3 className="text-text mt-5 text-lg font-bold">رزروی برای نمایش نیست</h3>
      <p className="text-text-gray mt-2 max-w-sm text-sm leading-relaxed">
        {description ??
          "وقتی اقامتگاهی را رزرو کنید، وضعیت و جزئیات آن همین‌جا نمایش داده می‌شود."}
      </p>
      <Button href="/cabins" shape="xl" className="mt-6">
        مشاهده اقامتگاه‌ها
      </Button>
    </div>
  );
}
