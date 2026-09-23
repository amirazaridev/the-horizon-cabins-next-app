
import Link from "next/link";
import { Home } from "lucide-react";
import Container from "@/components/ui/Container";
import { PROPERTY_CATEGORIES } from "@/features/landing/constants/horizon-home";

export default function Categories() {
  return (
    <section
      id="categories"
      className="hz-reveal relative overflow-hidden bg-background pt-6 pb-10 sm:pt-8 sm:pb-12 md:pt-10 md:pb-16"
    >
      <Container>
        <div className="hz-category-heading mb-7 flex items-end justify-between gap-5 md:mb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-gray">
              <span className="h-px w-7 bg-primary-400" />
              جستجوی سریع
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
              چه نوع اقامتگاهی می‌خواهی؟
            </h2>
          </div>
          <Link
            href="/cabins"
            className="hidden text-xs font-medium text-text-gray transition-colors hover:text-primary-400 sm:block"
          >
            مشاهده همه اقامتگاه‌ها
          </Link>
        </div>

        <div className="hz-category-grid grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-1">
          {PROPERTY_CATEGORIES.map((item) => {
            const Icon = item.icon ?? Home;

            return (
              <Link
                key={item.id}
                href="/cabins"
                className="hz-category-card group flex min-h-20.5 items-center gap-3 rounded-2xl px-2 py-3 transition-all duration-300 hover:bg-surface-raised sm:px-3"
              >
                <span className="hz-category-icon flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary-400/40 group-hover:bg-primary-400/10 group-hover:text-primary-500">
                  <Icon size={25} strokeWidth={1.65} />
                </span>

                <span className="min-w-0 text-right">
                  <span className="block truncate text-sm font-bold text-text transition-colors group-hover:text-primary-500">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[10px] text-text-gray sm:text-[11px]">
                    {item.meta}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}