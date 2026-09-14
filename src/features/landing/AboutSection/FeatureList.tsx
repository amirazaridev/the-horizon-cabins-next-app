import { type ReactNode } from "react";
import { ABOUT_FEATURES } from "@/features/landing/shared/constants/about-features";
import FeatureItem from "./FeatureItem";

export default function FeatureList(): ReactNode {
  return (
    <ul className="grid grid-cols-2 gap-6 pt-6">
      {ABOUT_FEATURES.map(({ icon: Icon, ...item }) => (
        <FeatureItem key={item.id} icon={<Icon />} {...item} />
      ))}
    </ul>
  );
}
