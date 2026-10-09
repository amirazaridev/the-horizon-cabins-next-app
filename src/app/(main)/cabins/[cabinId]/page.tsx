import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Navigate from "@/components/ui/Navigate";
import CabinDetail from "@/features/cabins/components/CabinDetail";
import {
  getBookedDates,
  getCabin,
  getCabinPriceCalendar,
  getCityById,
} from "@/features/cabins/api";
import { getPublicSettings } from "@/features/settings/api";
import { getCurrentUser } from "@/features/auth/services/session.service";

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

 
//? صفحه‌ی جزئیات اقامتگاه.

export default async function CabinPage({ params }: Props): Promise<ReactNode> {
  const { cabinId } = await params;
  const id = Number(cabinId);

  const cabin = await getCabin(id);
  if (!cabin) notFound();

  const [cityName, settings, priceCalendar, bookedRanges, currentUser] =
    await Promise.all([
      cabin.city?.name ??
        (typeof cabin.cityId === "number"
          ? getCityById(cabin.cityId)
              .then((city) => city?.name)
              .catch(() => undefined)
          : undefined),
      getPublicSettings(),
      getCabinPriceCalendar(id),
      getBookedDates(id),
      getCurrentUser(),
    ]);

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

      <CabinDetail
        cabin={cabin}
        cityName={cityName ?? null}
        isAuthenticated={Boolean(currentUser)}
        booking={{
          settings,
          calendarDays: priceCalendar?.days ?? [],
          bookedRanges,
        }}
      />
    </section>
  );
}
