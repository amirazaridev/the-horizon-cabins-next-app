import { type ReactNode } from "react";

type Props = {
  title: string;
  parag: string;
  icon: ReactNode;
};

export default function FeatureItem({ title, icon, parag }: Props): ReactNode {
  return (
    <li className="space-y-2">
      <div className="bg-primary-400/10 *:stroke-primary-400 flex h-12 w-12 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h4 className="text-text font-semibold">{title}</h4>
      <p className="text-text-gray text-sm">{parag}</p>
    </li>
  );
}
