import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function SearchAction({ href, disabled }: { href: string; disabled: boolean }) {
  const className =
    "flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-400 px-6 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-500 md:mx-1";

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title="برای جستجو، مقصد و تاریخ‌ها را تکمیل کنید"
        className={`${className} hover:bg-primary-400 cursor-not-allowed opacity-40 hover:translate-y-0`}
      >
        جستجو
        <SearchIcon size={18} />
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      جستجو
      <SearchIcon size={18} />
    </Link>
  );
}
