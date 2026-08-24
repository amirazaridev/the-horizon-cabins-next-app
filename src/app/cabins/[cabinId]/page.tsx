import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import CabinDetail from "@/features/cabins/components/CabinDetail";
import { getCabin } from "@/features/cabins/lib/data-service";

type Props = { params: Promise<{ cabinId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));
  return {
    title: `${cabin?.name ?? "کابین"} | هورایزن کابینز`,
    description: cabin?.description,
  };
}

export default async function CabinPage({ params }: Props): Promise<ReactNode> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));

  if (!cabin) notFound();

  return (
    <section className="min-h-screen bg-slate-950 py-10 sm:py-14" dir="rtl">
      <Container>
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-text-gray">
          <Link href="/" className="transition-colors hover:text-primary-400">
            خانه
          </Link>
          <ChevronRight className="size-4" />
          <Link
            href="/cabins"
            className="transition-colors hover:text-primary-400"
          >
            کابین‌ها
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-white/80">{cabin.name}</span>
        </nav>

        <CabinDetail cabin={cabin} />
      </Container>
    </section>
  );
}
