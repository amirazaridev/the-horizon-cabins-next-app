import Filter from "@/components/ui/Filter";
import MainFilter from "@/features/dashboard/main/MainPageFilter";
import MainPageLayout from "@/features/dashboard/main/MainPageLayout";

function page() {
  return (
    <>
      <div className="flex justify-between flex-col gap-y-5 md:flex-row">
        <div className="">
          <h2 className="text-text text-3xl font-semibold">داشبورد</h2>
          <p className="text-text-gray">خلاصه‌ای از وضعیت کلبه‌های هوریزون.</p>
        </div>
        <div className="flex">
          <MainFilter />
        </div>
      </div>
      <div>
        <MainPageLayout />
      </div>
    </>
  );
}

export default page;
