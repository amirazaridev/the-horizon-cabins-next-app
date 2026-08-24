import { Ref, type ReactNode } from "react";

type Props = {
  ref?: Ref<HTMLDivElement>;
  subTitle: string;
  title: string;
  titlePri: string | ReactNode;
  parag?: string;
  className?: string;
  forCabin?: boolean;
};

export default function SectionTitle({
  ref,
  subTitle,
  title,
  titlePri,
  parag,
  className = "",
  forCabin = false,
}: Props): ReactNode {
  return (
    <div ref={ref} className={`mb-16 text-center ${className}`}>
      <span
        className={`text-primary-400 text-sm font-medium tracking-wider ${forCabin ? "cabins-subtext" : ""}`}
      >
        {subTitle}
      </span>
      <h2
        className={`text-text mt-4 text-4xl font-bold md:text-6xl ${forCabin ? "cabins-heading-line" : ""}`}
      >
        {title}
        <br />
        <span
          className={`text-primary-400 ${forCabin ? "cabins-eyebrow" : ""}`}
        >
          {titlePri}
        </span>
      </h2>
      {parag && (
        <p className={`mx-auto mt-4 max-w-2xl text-white/50`}>{parag}</p>
      )}
    </div>
  );
}
