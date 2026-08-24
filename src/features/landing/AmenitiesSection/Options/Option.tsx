import CardContainer from "@/components/ui/CardContainer";
import { TOption } from "@/types/TOptionLandingPage";
import { type ReactNode } from "react";

type Props = TOption;

export default function Option({ icon, parag, title }: Props): ReactNode {
  return (
    <CardContainer className="amenity-item group hover:border-primary-400/30 hover:bg-slate-800">
      <div className="text-primary-400 bg-primary-400/10 group-hover:bg-primary-400/20 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="leading-relaxed text-white/50">{parag}</p>
    </CardContainer>
  );
}
