import type { ReactNode } from "react";
import SectionHeading from "./SectionHeading";

type Props = {
  /** شناسه‌ی سکشن — لینک مستقیم و هدف Scroll Spy */
  id: string;
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function SectionShell({
  id,
  title,
  hint,
  action,
  children,
  className = "",
}: Props): ReactNode {
  return (
    <section
      id={id}
      className={`hz-scroll-mt scrolmt border-foreground/10 border-t pt-10 ${className}`}
    >
      <SectionHeading className="mb-5" hint={hint} action={action}>
        {title}
      </SectionHeading>
      {children}
    </section>
  );
}
