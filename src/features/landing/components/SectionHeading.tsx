import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = { eyebrow: string; title: React.ReactNode; href?: string; hrefLabel?: string };

export default function HorizonSectionHeading({ eyebrow, title, href, hrefLabel = "مشاهده همه" }: Props) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5 md:mb-9">
      <div>
        <div className="mb-2 flex items-center gap-3 text-xs font-semibold text-text"><span className="h-px w-8 bg-primary-400" />{eyebrow}</div>
        <h2 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl md:text-[34px]">{title}</h2>
      </div>
      {href && <Link href={href} className="hidden items-center gap-2 text-xs text-text-gray transition hover:text-text sm:flex">{hrefLabel}<ArrowLeft size={15} /></Link>}
    </div>
  );
}
