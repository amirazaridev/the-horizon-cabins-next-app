"use client";

import { useCallback, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, UserCheck, UserX } from "lucide-react";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import SingleOptionPanel, {
  type SingleOptionItem,
} from "@/components/ui/Filter/panels/SingleOptionPanel";
import { parseUsersFilters, type UsersSearchParams } from "../lib/user-filters";

const STATUS_OPTIONS: SingleOptionItem[] = [
  {
    value: "active",
    label: "فعال",
    icon: <UserCheck className="size-4 shrink-0 text-emerald-500" />,
  },
  {
    value: "inactive",
    label: "غیرفعال",
    icon: <UserX className="size-4 text-danger shrink-0" />,
  },
];

const STATUS_LABELS: Record<string, string> = {
  active: "فعال",
  inactive: "غیرفعال",
};

interface UserListFiltersProps {
  /** عنوان شیت موبایل — بین صفحه‌ی کاربران و مدیران متفاوت است. */
  mobileTitle?: string;
}

/**
 * نوار فیلتر مشترک لیست کاربران (صفحه‌ی «افراد و مهمانان» و «مدیران»).
 *
 * ⭐ منبع حقیقت **URL** است؛ این کامپوننت state فیلتری نگه نمی‌دارد و با هر
 * تغییر یک navigation می‌زند تا لینک قابل اشتراک بماند و back/forward درست
 * کار کند (همان الگوی نوار فیلتر رزروها).
 */
export default function UserListFilters({
  mobileTitle = "فیلتر کاربران",
}: UserListFiltersProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = parseUsersFilters(
    Object.fromEntries(searchParams.entries()) as UsersSearchParams,
  );

  const handleValueChange = useCallback(
    (id: string, value: unknown) => {
      if (id !== "status") return;

      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (value) params.set("status", String(value));
      else params.delete("status");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const items: FilterCardItem[] = [
    {
      id: "status",
      label: "وضعیت حساب",
      icon: <UserCheck className="size-4" />,
      formatLabel: (value) => (value ? STATUS_LABELS[String(value)] : undefined),
      panel: {
        title: "وضعیت حساب",
        size: "md",
        render: ({ value, setValue }) => (
          <SingleOptionPanel
            options={STATUS_OPTIONS}
            value={(value as string | null) ?? null}
            onChange={(next) => setValue(next)}
            allOption={{ label: "همه‌ی کاربران" }}
          />
        ),
      },
    },
  ];

  const clear = () =>
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });

  return (
    <div
      className="border-border bg-background-2/60 flex w-full flex-wrap items-center gap-2 rounded-2xl border p-3"
      aria-busy={isPending}
    >
      <FilterCard
        items={items}
        value={{ status: filters.active }}
        onValueChange={handleValueChange}
        onClearFilters={clear}
        placement="start"
        mobileTitle={mobileTitle}
        mobileApplyLabel="اعمال"
        className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
      />

      <button
        type="button"
        onClick={clear}
        title="پاک کردن فیلترها"
        className="text-text-gray hover:bg-danger/10 hover:text-danger grid size-9.5 shrink-0 place-items-center rounded-xl transition-colors"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
