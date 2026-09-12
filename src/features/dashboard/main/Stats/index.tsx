import { CalendarDays, DollarSign, ChartArea, TrendingUp } from "lucide-react";
import Stat from "./Stat";
import { formatCurrency } from "@/libs/format";

function Stats({
  bookings = [{ totalPrice: 10 }, { totalPrice: 12 }],
  confirmedStays = [{ numNights: 10 }, { numNights: 5 }],
  cabinCount = 10,
  numDays = 5,
}:any) {
  const sales = bookings.reduce((acc: number, cur) => acc + cur.totalPrice, 0);
  const occupancy =
    confirmedStays.reduce((acc: number, cur) => acc + cur.numNights, 0) /
    (numDays * cabinCount);

  return (
    <div className="mt-8 mb-5 grid grid-cols-1 lg:gap-10 gap-5  sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        title="کل رزروها"
        value={bookings.length}
        color="indigo"
        icon={<CalendarDays className="size-5.75" />}
      />
      <Stat
        title="کل فروش"
        value={formatCurrency(sales)}
        color="green"
        icon={<DollarSign className="size-5.75" />}
      />
      <Stat
        title="تحویل امروز"
        value={confirmedStays.length}
        color="amber"
        icon={<ChartArea className="size-5.75" />}
      />
      <Stat
        title="نرخ اشغال"
        value={Math.round(occupancy * 100) + "%"}
        color="rose"
        icon={<TrendingUp className="size-5.75" />}
      />
    </div>
  );
}

export default Stats;
