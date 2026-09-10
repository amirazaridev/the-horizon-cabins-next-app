import Filter from "@/components/ui/Filter";
import MainFilter from "@/features/dashboard/main/MainPageFilter";

function page() {
  return (
    <div>
      <div className="flex justify-between">
        <div className="">
          <h2 className="text-text text-3xl font-semibold">داشبورد</h2>
          <p className="text-text-gray">خلاصه‌ای از وضعیت کلبه‌های هوریزون.</p>
        </div>
        <div>
          <MainFilter />

        </div>
      </div>
    </div>
  );
}

export default page;
