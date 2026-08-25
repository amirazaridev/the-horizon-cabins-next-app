import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

type Props = {
  paths: {
    id: number;
    title: string;
    href?: string | undefined;
    isSpan?: boolean;
  }[];
};

export default function Navigate({ paths }: Props): ReactNode {
  return (
    <nav className="text-text-gray mb-6 flex items-center gap-1.5 text-sm">
      {paths.map((item, index) => (
        <Fragment key={item.id}>
          {item.isSpan ? (
            <span className="text-text/80">{item.title}</span>
          ) : (
            <Link href={item.href ? item.href : ""}>{item.title}</Link>
          )}

          {index + 1 !== paths.length && <ChevronRight className="size-4" />}
        </Fragment>
      ))}
    </nav>
  );
}
