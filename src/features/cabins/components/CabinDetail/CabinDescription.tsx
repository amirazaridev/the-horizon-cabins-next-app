import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { Cabin } from "../../lib/data-service";

type Props = {
  cabin: Cabin;
};

export default function CabinDescription({ cabin }: Props): ReactNode {
  return (
    <div>
      <SectionHeading>درباره این اقامتگاه</SectionHeading>
      <p className="leading-loose text-text-gray">{cabin.description}</p>

      <SectionHeading className="mt-10 mb-5">ویژگی‌ها</SectionHeading>
      <div className="flex flex-wrap gap-2.5">
        {cabin.amenities.map((amenitiy) => (
          <div
            key={amenitiy}
            className="hover:border-primary-400/40 hover:text-primary-400 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-sm text-text-gray transition-colors duration-300"
          >
            {amenitiy}
          </div>
        ))}
      </div>

      <SectionHeading className="mt-10 mb-5">امکانات</SectionHeading>
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {cabin.amenities.map((amenity) => (
          <li key={amenity} className="flex items-center gap-3">
            <span className="bg-primary-400/10 flex size-6 shrink-0 items-center justify-center rounded-full">
              <Check className="text-primary-400 size-3.5" />
            </span>
            <span className="text-text/60">{amenity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeading({
  children,
  className = "mb-4",
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <h2 className={`text-xl font-bold text-text ${className}`}>{children}</h2>
  );
}
