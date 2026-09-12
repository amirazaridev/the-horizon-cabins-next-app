import CardDashContainer from "../../../components/CardDashContainer";
import TodayItem from "./TodayItem";

function TodayActivity() {
  const activities = [
    { id: 1, status: "checked-in", numNights: 4, guest: { fullName: "امیر" } },
    { id: 2, status: "checked-in", numNights: 4, guest: { fullName: "حسین" } },
    { id: 3, status: "unconfirmed", numNights: 4, guest: { fullName: "فرهاد" } },
    { id: 4, status: "checked-in", numNights: 4, guest: { fullName: "فرهاد" } },
    { id: 5, status: "checked-in", numNights: 4, guest: { fullName: "فرهاد" } },
    { id: 6, status: "unconfirmed", numNights: 4, guest: { fullName: "فرهاد" } },
  ];

  return (
    <CardDashContainer className="flex w-full flex-col gap-5 overflow-x-hidden p-5 max-h-110">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text">فعالیت امروز</h3>
        <p className="text-sm text-text-gray">تحویل و تخلیه برای امروز</p>
      </div>

      {activities?.length > 0 ? (
        <div className="flex flex-col gap-3 overflow-scroll">
          {activities.map((act) => (
            <TodayItem activity={act} key={act.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-text-gray">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span className="text-sm">فعالیتی برای امروز ثبت نشده</span>
        </div>
      )}
    </CardDashContainer>
  );
}

export default TodayActivity;