import { OPTION_AMENITIES } from "@/constants/option-amenities-section";
import { type ReactNode } from "react";
import Option from "./Option";

export default function Options(): ReactNode {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {OPTION_AMENITIES.map((amenity) => (
        <Option key={amenity.id} {...amenity} />
      ))}
    </div>
  );
}
