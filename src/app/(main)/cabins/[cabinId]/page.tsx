import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/ui/Breadcrumb";
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
    <section className="bg-background-2 min-h-screen pt-4 pb-28 sm:pt-7 lg:pb-14">
      <Container size="wide">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "خانه", href: "/" },
            { label: "کابین‌ها", href: "/cabins" },
            { label: cabin.name },
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
