import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Navigate from "@/components/ui/Navigate";
import CabinDetail from "@/features/cabins/components/CabinDetail";
import { getCabin, getCityById } from "@/features/cabins/api";

type Props = { params: Promise<{ cabinId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));
  const name = cabin?.name ?? "کابین";
  return {
    title: name.length > 30 ? name.slice(0, 30) + "…" : name,
    description: cabin?.description,
  };
}

/**
 * صفحه‌ی جزئیات اقامتگاه.
 *
 * ⚠️ نکته‌ی داده: اندپوینت جزئیات کابین آبجکت `city` را برنمی‌گرداند و
 * فقط `cityId` می‌دهد. پس نام شهر اینجا (سمت سرور) حل می‌شود تا بج مقصد
 * روی گالری نمایش داده شود. اگر `city` از خود پاسخ بیاید (مثل اندپوینت
 * لیست)، درخواست اضافه‌ای زده نمی‌شود.
 */
export default async function CabinPage({ params }: Props): Promise<ReactNode> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));

  if (!cabin) notFound();

  const cityName =
    cabin.city?.name ??
    (typeof cabin.cityId === "number"
      ? (await getCityById(cabin.cityId).catch(() => undefined))?.name
      : undefined);

  return (
    <section className="bg-background-2 min-h-screen pt-10 pb-28 sm:pt-14 lg:pb-14">
      <Container variant="cabin-detail">
        <Navigate
          paths={[
            { id: 1, title: "خانه", href: "/" },
            { id: 2, title: "کابین‌ها", href: "/cabins" },
            { id: 3, title: cabin.name, isSpan: true },
          ]}
        />
      </Container>

      <CabinDetail cabin={cabin} cityName={cityName ?? null} />
    </section>
  );
}
