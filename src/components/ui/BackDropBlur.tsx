import { type ReactNode } from "react";

type Props = { type?: "center" | "double" };

export default function BackDropBlur({ type = "center" }: Props): ReactNode {
  if (type === "double")
    return (
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="bg-primary-400/20 absolute top-1/4 right-0 h-96 w-96 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-blue-400/20 blur-[150px]" />
      </div>
    );

  return (
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/2 size-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/13 blur-[200px]" />
    </div>
  );
}
