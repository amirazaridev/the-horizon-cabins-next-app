import { ReactElement } from "react";
import CardDashContainer from "../../components/CardDashContainer";

const iconBg = {
  indigo: "bg-[linear-gradient(135deg,#6366f1,#4f46e5)]",
  green: "bg-[linear-gradient(135deg,#34d399,#22c55e)]",
  amber: "bg-[linear-gradient(135deg,#fbbf24,#f59e0b)]",
  rose: "bg-[linear-gradient(135deg,#fb7185,#f43f5e)]",
};
function Stat({
  title,
  color,
  icon,
  value,
}: {
  title: string;
  color: keyof typeof iconBg;
  icon: ReactElement;
  value: string | number;
}) {
  return (
    <CardDashContainer className="items-center gap-3.5 flex w-full flex-col">
      {/* icon */}
      <div
        className={`${iconBg[color]} grid size-11.5 place-items-center rounded-xl text-white`}
      >
        {icon}
      </div>

      {/* value */}
      <span className="text-text text-[27px] leading-none font-extrabold tracking-tight">
        {value}
      </span>

      {/* label */}
      <span className="text-text-muted text-sm">{title}</span>
    </CardDashContainer>
  );
}

export default Stat;
