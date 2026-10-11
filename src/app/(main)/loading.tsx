import type { ReactNode } from "react";

import LandingPreloader from "@/features/landing/components/LandingPreloader";

export default function Loading(): ReactNode {
  return (
    <>
      <LandingPreloader autoHide={false} />
      <div role="status" className="sr-only">
        در حال بارگذاری صفحه…
      </div>
    </>
  );
}
