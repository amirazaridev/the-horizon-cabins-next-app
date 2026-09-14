import { getCities } from "@/features/cabins/api";
import CabinForm from "@/features/dashboard/cabins/components/CabinForm";
import type { ReactNode } from "react";

export const metadata = { title: "اضافه کردن سوییت" };

export default async function AddCabinPage(): Promise<ReactNode> {
  const cities = await getCities();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-text text-2xl font-bold sm:text-3xl">
          اضافه کردن سوییت
        </h2>
        <p className="text-text-gray mt-1 text-sm">
          اطلاعات سوییت جدید را وارد کنید.
        </p>
      </div>

      <CabinForm mode="add" cities={cities} />
    </div>
  );
}
