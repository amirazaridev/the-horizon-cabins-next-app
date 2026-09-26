"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Select from "./Select";

interface SortByOption {
  value: string;
  label: string;
}

interface SortByProps {
  options: SortByOption[];
}

function SortBy({ options }: SortByProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", e.target.value);
    if (params.get("page")) params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <Select value={sortBy} onChange={handleChange} options={options} />
    </div>
  );
}

export default SortBy;
