import Link from "next/link";
import Container from "@/components/ui/Container";
import { type Category } from "@/features/cabins/api/getCategories";
import { getCategoryIcon } from "@/features/cabins/config/category-icons";

export default async function Categories({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section
      id="categories"
      className="bg-background relative overflow-hidden px-4 pt-6 pb-10 sm:pt-8 sm:pb-12 md:px-6 md:pt-10 md:pb-6"
    >
      <Container>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-0">
          {categories.map((item) => {
            const Icon = getCategoryIcon(item.icon);

            return (
              <Link
                key={item.id}
                href={`/cabins?category=${item.slug}`}
                className="group hover:bg-surface-raised flex min-h-17 items-center gap-3 rounded-2xl px-2 py-3 transition-all duration-300 sm:px-3"
              >
                <span className="border-border bg-surface text-text group-hover:border-primary-400/40 group-hover:bg-primary-400/10 group-hover:text-primary-500 flex size-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:-translate-y-0.5">
                  <Icon size={25} strokeWidth={1.65} />
                </span>

                <span className="min-w-0 text-right">
                  <span className="text-text group-hover:text-primary-500 block truncate text-sm font-bold transition-colors">
                    {item.title}
                  </span>
                  <span className="text-text-gray mt-1 block text-[10px] sm:text-[11px]">
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
