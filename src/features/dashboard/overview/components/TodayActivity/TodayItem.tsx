import Button from "@/components/ui/Button";
import { Check, X } from "lucide-react";

function TodayItem({ activity }: any) {
  const { status, numNights, guest: { fullName } = {} } = activity;
  const isArriving = status === "unconfirmed";

  return (
    <div className="bg-background hover:bg-surface-raised flex flex-col gap-3 rounded-lg px-4 py-3 transition-colors duration-200 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`size-2 shrink-0 rounded-full ${
            isArriving ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />
        <div className="min-w-0">
          <p className="text-text truncate text-sm font-medium">{fullName}</p>
          <p className="text-text-gray mt-0.5 text-xs">{numNights} شب اقامت</p>
        </div>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          isArriving ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {isArriving ? <Check className="size-4" /> : <X className="size-4" />}
        {isArriving ? "ورود" : "خروج"}
      </span>

      <Button
        shape="xl"
        size="md"
        variant={`${isArriving ? "success" : "warning"}`}
      >
        {isArriving ? "تحویل" : "تخلیه"}
      </Button>
    </div>
  );
}

export default TodayItem;
