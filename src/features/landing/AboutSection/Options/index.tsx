
import { type ReactNode } from "react";
import { OPTIONS_ABOUT } from "@/constants/option-about-section";
import Option from "./Option";



export default function options(): ReactNode {
  return (
    <ul className="grid grid-cols-2 gap-6 pt-6">
      {OPTIONS_ABOUT.map((item) => (
        <Option key={item.id} {...item} />
      ))}
    </ul>
  );
}
