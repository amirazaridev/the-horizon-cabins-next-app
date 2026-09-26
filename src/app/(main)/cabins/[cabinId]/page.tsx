import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import CabinDetail from "@/features/cabins/components/CabinDetail";
import { getCabin } from "@/features/cabins/api";
import Navigate from "@/components/ui/Navigate";

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

export default async function CabinPage({ params }: Props): Promise<ReactNode> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));

  if (!cabin) notFound();

  return (
    <section className="bg-background-2 min-h-screen py-10 sm:py-14">
      <Container variant="cabin-detail">
        <Navigate
          paths={[
            { id: 1, title: "خانه", href: "/" },
            { id: 2, title: "کابین‌ها", href: "/cabins" },
            { id: 3, title: cabin.name, isSpan: true },
          ]}
        />

        <CabinDetail cabin={cabin} />
      </Container>
    </section>
  );
}
