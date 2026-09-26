
import OptionRow from "@/components/ui/filter/OptionRow";
import { Pagination } from "@/components/ui/Pagination";
import { MapPin } from "lucide-react";
import { type ReactNode } from "react";

const cities = [{ id: 1, name: "sasa" }];
type City = (typeof cities)[number];

export default function page(): ReactNode {
  return (
   <Pagination currentPage={10} totalPages={10} basePath="/cabins"/>
  );
}
