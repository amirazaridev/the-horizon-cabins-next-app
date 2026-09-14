import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag, Wallet } from "lucide-react";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import type { ReactNode } from "react";

import { getCabin } from "@/features/cabins/lib/data-service";
import CabinGallery from "@/features/cabins/components/CabinDetail/CabinGallery";
import SpecsGrid from "@/features/cabins/components/CabinDetail/SpecsGrid";
import CabinDescription from "@/features/cabins/components/CabinDetail/CabinDescription";
import BadgeTitle from "@/components/ui/BadgeTitle";
import CardDashContainer from "@/features/dashboard/components/CardDashContainer";
import CabinLocation from "@/features/dashboard/cabins/components/CabinLocation";
import CabinDetailsActions from "@/features/dashboard/cabins/components/CabinDetailsActions";
import { formatCurrency } from "@/libs/utils/format";

type Props = { params: Promise<{ cabinId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));
  return { title: `${cabin?.name ?? "سوییت"} | داشبورد` };
}

export default async function DashboardCabinDetailPage({
  params,
}: Props): Promise<ReactNode> {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));

  if (!cabin) notFound();

  const hasDiscount = cabin.discount > 0;
  const finalPrice = hasDiscount
    ? cabin.regularPrice - cabin.discount
    : cabin.regularPrice;
  const createdAt = formatJalali(new Date(cabin.createdAt), "d MMMM yyyy", {
    locale: faIR,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* بازگشت */}
      <Link
        href="/dashboard/cabins"
        className="text-text-gray hover:text-primary-400 flex w-fit items-center gap-1 text-sm transition-colors"
      >
        <ChevronRight className="size-4" />
        بازگشت به لیست سوییت‌ها
      </Link>

      {/* گالری + هدر روی تصویر */}
      <CabinGallery images={cabin.images} altBase={cabin.name}>
        <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10 flex flex-wrap items-end justify-between gap-4 sm:right-8 sm:bottom-8 sm:left-8">
          <div>
            <BadgeTitle className="text-text/80 mb-2 gap-2 px-3.5 py-1.5 text-xs">
              <Tag className="text-primary-400 size-3.5" />
              کد سوییت: {cabin.id.toLocaleString("fa-IR")}
            </BadgeTitle>
            <h1 className="text-text text-2xl font-bold sm:text-4xl">
              {cabin.name}
            </h1>
          </div>
          <BadgeTitle className="gap-x-2 px-4 py-2">
            <Wallet className="text-primary-400 size-4" />
            <span className="text-text font-bold">
              {formatCurrency(finalPrice)} تومان / شب
            </span>
            {hasDiscount && (
              <span className="text-text/50 text-sm line-through">
                {formatCurrency(cabin.regularPrice)}
              </span>
            )}
          </BadgeTitle>
        </div>
      </CabinGallery>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* ستون اصلی */}
        <div className="flex flex-col gap-10 lg:col-span-2">
          <SpecsGrid cabin={cabin} />
          <CabinDescription cabin={cabin} />
          <CabinLocation cabin={cabin} />
        </div>

        {/* سایدبار مدیریتی */}
        <CardDashContainer className="flex flex-col gap-4 p-5 lg:sticky lg:top-20">
          <h3 className="text-text font-semibold">اطلاعات مالی</h3>

          <div className="flex flex-col gap-2.5 text-sm">
            <InfoRow
              label="قیمت اصلی / شب"
              value={`${formatCurrency(cabin.regularPrice)} تومان`}
            />
            {hasDiscount && (
              <InfoRow
                label="تخفیف"
                value={`${formatCurrency(cabin.discount)} تومان`}
                tone="danger"
              />
            )}
          </div>

          <div className="border-border flex items-center justify-between border-t pt-3">
            <span className="text-text font-semibold">قیمت نهایی / شب</span>
            <span className="text-primary-400 text-lg font-extrabold tabular-nums">
              {formatCurrency(finalPrice)}
            </span>
          </div>

          <p className="text-text-gray text-xs">ثبت شده در {createdAt}</p>

          <CabinDetailsActions cabinId={cabin.id} />
        </CardDashContainer>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-gray">{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          tone === "danger" ? "text-danger" : "text-text"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
