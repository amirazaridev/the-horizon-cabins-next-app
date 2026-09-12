import DurationChart from "./DurationChart";
import SalesChart from "./SalesChart";
import Stats from "./Stats";
import TodayActivity from "./TodayActivity";

function MainPageLayout() {
  const fakeConfirmedStays = [
    {
      id: 1,
      startDate: new Date("2026-09-12"),
      endDate: new Date("2026-09-13"),
      numNights: 1,
      numGuests: 2,
      cabinPrice: 800_000,
      extrasPrice: 50_000,
      totalPrice: 850_000,
      status: "confirmed",
      hasBreakfast: true,
      isPaid: true,
      observations: "Early check-in requested",
      cabinId: 3,
      guestId: 12,
      createdAt: new Date("2026-09-11"),
      updatedAt: new Date("2026-09-11"),
    },
    {
      id: 2,
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-14"),
      numNights: 4,
      numGuests: 3,
      cabinPrice: 2_400_000,
      extrasPrice: 120_000,
      totalPrice: 2_520_000,
      status: "checked-out",
      hasBreakfast: false,
      isPaid: true,
      observations: null,
      cabinId: 5,
      guestId: 27,
      createdAt: new Date("2026-09-09"),
      updatedAt: new Date("2026-09-09"),
    },
    {
      id: 3,
      startDate: new Date("2026-09-07"),
      endDate: new Date("2026-09-14"),
      numNights: 7,
      numGuests: 4,
      cabinPrice: 4_200_000,
      extrasPrice: 250_000,
      totalPrice: 4_450_000,
      status: "checked-out",
      hasBreakfast: true,
      isPaid: true,
      observations: "Anniversary trip — flowers arranged",
      cabinId: 2,
      guestId: 8,
      createdAt: new Date("2026-09-06"),
      updatedAt: new Date("2026-09-06"),
    },
    {
      id: 4,
      startDate: new Date("2026-09-05"),
      endDate: new Date("2026-09-21"),
      numNights: 16,
      numGuests: 5,
      cabinPrice: 9_600_000,
      extrasPrice: 600_000,
      totalPrice: 10_200_000,
      status: "confirmed",
      hasBreakfast: true,
      isPaid: false,
      observations: "Long family stay — needs extra towels",
      cabinId: 1,
      guestId: 41,
      createdAt: new Date("2026-09-03"),
      updatedAt: new Date("2026-09-03"),
    },
  ];

  return (
    <div className="px-10 lg:px-8">
      <Stats confirmedStays={fakeConfirmedStays} />
      <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row lg:h-110">
        <TodayActivity />
        <DurationChart confirmedStays={fakeConfirmedStays} />
      </div>
      <SalesChart bookings={fakeConfirmedStays} numDays={10} />
    </div>
  );
}

export default MainPageLayout;
