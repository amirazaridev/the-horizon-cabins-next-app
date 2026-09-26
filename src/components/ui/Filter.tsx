"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTransition, useRef, useEffect } from "react";
import { type ReactNode } from "react";

type Props = {
  filterOptions: { title: string; value: string }[];
  filterField: string;
};

export default function Filter({
  filterOptions,
  filterField,
}: Props): ReactNode {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const filterRef = useRef<HTMLDivElement>(null);
  const hasClicked = useRef(false);

  useEffect(() => {
    if (hasClicked.current && !isPending && filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      hasClicked.current = false;
    }
  }, [isPending]);

  const currentFilter =
    searchParams?.get(filterField) ?? filterOptions[0].value;

  function handleFilter(filter: string): void {
    hasClicked.current = true;
    const params = new URLSearchParams(searchParams);
    params.set(filterField, filter);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div
      ref={filterRef}
      className="border-foreground/5 bg-surface/50 flex flex-wrap gap-2 rounded-2xl border p-1 backdrop-blur-sm"
    >
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilter(option.value)}
          disabled={isPending}
          className={`focus:ring-primary-400/50 relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 focus:ring-2 focus:outline-none ${
            option.value === currentFilter
              ? "bg-primary-400 shadow-primary-400/25 text-black shadow-lg"
              : "text-text-gray hover:bg-foreground/5 hover:text-text"
          }`}
        >
          {option.title}
        </button>
      ))}
    </div>
  );
}
