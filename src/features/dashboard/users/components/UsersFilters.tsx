"use client";

import { useCallback, useTransition, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search, UserCheck, UserX } from "lucide-react";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import SingleOptionPanel, {
  type SingleOptionItem,
} from "@/components/ui/Filter/panels/SingleOptionPanel";
import Input from "@/components/ui/Input";
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

/**
 * نوار فیلتر صفحه‌ی کاربران.
 *
 * ⭐ منبع حقیقت **URL** است؛ این کامپوننت state فیلتری نگه نمی‌دارد و با هر
 * تغییر یک navigation می‌زند تا لینک قابل اشتراک بماند و back/forward درست
 * کار کند (همان الگوی نوار فیلتر رزروها).
 */
export default function UsersFilters(): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = parseUsersFilters(
    Object.fromEntries(searchParams.entries()) as UsersSearchParams,
  );

  const apply = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      mutate(params);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const handleValueChange = useCallback(
    (id: string, value: unknown) => {
      apply((params) => {
        if (id === "status") {
          if (value) params.set("status", String(value));
          else params.delete("status");
          return;
        }
        if (id === "q") {
          const term = String(value ?? "").trim();
          if (term) params.set("q", term);
          else params.delete("q");
        }
      });
    },
    [apply],
  );

  const items: FilterCardItem[] = [
    {
      id: "status",
      label: "وضعیت حساب",
      icon: <UserCheck className="size-4" />,
      formatLabel: (value) =>
        value ? STATUS_LABELS[String(value)] : undefined,
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
    {
      id: "q",
      label: "جستجو",
      icon: <Search className="size-4" />,
      formatLabel: (value) => (value ? `«${String(value)}»` : undefined),
      panel: {
        title: "جستجوی کاربر",
        size: "md",
        render: ({ value, setValue, close }) => (
          <UserSearchPanel
            initial={(value as string) ?? ""}
            onApply={(term) => {
              setValue(term);
              close();
            }}
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
        value={{
          status: filters.active,
          q: filters.query,
        }}
        onValueChange={handleValueChange}
        onClearFilters={clear}
        placement="start"
        mobileTitle="فیلتر کاربران"
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

/* ==========================================================================
   پنل جستجو
   ========================================================================== */

function UserSearchPanel({
  initial,
  onApply,
}: {
  initial: string;
  onApply: (term: string) => void;
}): ReactNode {
  const [term, setTerm] = useState(initial);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(term.trim());
      }}
    >
      <Input
        label="ایمیل یا نام کاربر"
        icon={<Search className="size-4" />}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        clearable
        onClear={() => setTerm("")}
        hint="حداقل ۲ کاراکتر"
      />
      <button
        type="submit"
        className="bg-primary-400 focus-visible:ring-primary-400/60 cursor-pointer rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:outline-none"
      >
        اعمال جستجو
      </button>
    </form>
  );
}
