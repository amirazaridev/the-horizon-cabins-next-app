import { type ReactNode } from "react";
import { ABOUT_FEATURES } from "@/constants/about-features";
import FeatureItem from "./FeatureItem";

export default function FeatureList(): ReactNode {
  return (
    <ul className="grid grid-cols-2 gap-6 pt-6">
      {ABOUT_FEATURES.map((item) => (
        <FeatureItem key={item.id} {...item} />
      ))}
    </ul>
  );
}
