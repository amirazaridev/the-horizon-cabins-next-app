import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Eyebrow from "@/components/ui/Eyebrow";

type Props = {
  eyebrow: string;
  title: ReactNode;
  href?: string;
  hrefLabel?: string;
};

//* تیتر مشترک سکشن‌های لندینگ.
export default function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel = "مشاهده همه",
}: Props): ReactNode {
  return (
    <div className="mb-7 flex items-end justify-between gap-5 md:mb-9">
      <div>
        <Eyebrow className="text-text mb-2">{eyebrow}</Eyebrow>
        <h2 className="text-text text-2xl font-extrabold tracking-tight sm:text-3xl md:text-[34px]">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-text-gray hover:text-text hidden items-center gap-2 text-xs transition sm:flex"
        >
          {hrefLabel}
          <ArrowLeft size={15} />
        </Link>
      )}
    </div>
  );
}
