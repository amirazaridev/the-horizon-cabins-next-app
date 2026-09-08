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
  const eyebrowClass = forCabin ? "section-title-eyebrow " : "";
  const lineClass = forCabin ? "section-title-line " : "";
  const subtextClass = forCabin ? "section-title-subtext " : "";

  return (
    <div ref={ref} className={`mb-16 text-center ${className}`}>
      <span
        className={`${eyebrowClass}text-primary-400 text-sm font-medium tracking-wider`}
      >
        {subTitle}
      </span>
      <h2 className="text-text mt-4 text-4xl font-bold md:text-6xl">
        <span className={lineClass}>{title}</span>
        <br />
        <span className={`${lineClass}text-primary-400`}>{titlePri}</span>
      </h2>
      {parag && (
        <p
          className={`${subtextClass}mx-auto mt-4 max-w-2xl text-text-gray`}
        >
          {parag}
        </p>
      )}
    </div>
  );
}
