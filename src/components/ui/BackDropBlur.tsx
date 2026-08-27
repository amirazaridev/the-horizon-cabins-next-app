import { type ReactNode } from "react";

type Props = { type?: "center" | "double" | "double-top-down" };

export default function BackDropBlur({ type = "center" }: Props): ReactNode {
  if (type === "double")
    return (
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="bg-primary-400/20 absolute top-1/4 right-0 h-96 w-96 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-blue-400/20 blur-[150px]" />
      </div>
    );
  if (type === "double-top-down")
    return (
      <>
        <div className="bg-primary-400/25 absolute -top-32 -left-32 size-64 rounded-full blur-[100px]" />
        <div className="bg-primary-500/25 absolute -right-32 -bottom-32 size-64 rounded-full blur-[80px]" />
      </>
    );
  return (
    <div className="absolute inset-0">
      <div className="bg-primary-400/13 absolute top-1/2 left-1/2 size-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[200px]" />
    </div>
  );
}
