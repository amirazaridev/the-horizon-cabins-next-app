import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  href?: string;
  hrefLabel?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel = "مشاهده همه",
}: Props) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5 md:mb-9">
      <div>
        <div className="text-text mb-2 flex items-center gap-3 text-xs font-semibold">
          <span className="bg-primary-400 h-px w-8" />
          {eyebrow}
        </div>
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
