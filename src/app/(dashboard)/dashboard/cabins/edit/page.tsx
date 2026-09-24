import { getCities } from "@/features/cabins/api";
import { getCabin } from "@/features/cabins/api";
import CabinForm from "@/features/dashboard/cabins/components/CabinForm";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const metadata = { title: "ویرایش اقامتگاه" };

type SearchParams = Promise<{
  cabinId?: string;
}>;

export default async function EditCabinPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const params = await searchParams;
  const cabinId = Number(params.cabinId);

  if (!Number.isInteger(cabinId) || cabinId <= 0) {
    notFound();
  }

  const [cabin, cities] = await Promise.all([getCabin(cabinId), getCities()]);

  if (!cabin) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-text text-2xl font-bold sm:text-3xl">
          ویرایش سوییت
        </h2>
        <p className="text-text-gray mt-1 text-sm">
          اطلاعات سوییت «{cabin.name}» را ویرایش کنید.
        </p>
      </div>

      <CabinForm mode="edit" cabin={cabin} cities={cities} />
    </div>
  );
}
