import { type ReactNode } from "react";
import { getPasswordStrength } from "../lib/validation";

type Props = { password: string };

const STRENGTH_CONFIG = [
  { color: "bg-red-500", glow: "shadow-red-500/30" },
  { color: "bg-orange-500", glow: "shadow-orange-500/30" },
  { color: "bg-yellow-500", glow: "shadow-yellow-500/30" },
  { color: "bg-lime-400", glow: "shadow-lime-400/30" },
  { color: "bg-green-400", glow: "shadow-green-400/30" },
];

export default function CheckPasswordPower({ password }: Props): ReactNode {
  const strength = getPasswordStrength(password);

  return (
    <div className="mt-3">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => {
          const config = STRENGTH_CONFIG[strength.score];
          const isActive = index < strength.score;
          return (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                isActive
                  ? `${config.color} shadow-sm ${config.glow}`
                  : "bg-foreground/8"
              }`}
            />
          );
        })}
      </div>
      <p className="text-text/35 mt-1.5 text-xs">
        قدرت رمز عبور:{" "}
        <span
          className={`font-medium ${strength.score >= 3 ? "text-emerald-400" : strength.score >= 2 ? "text-yellow-600" : "text-red-400"}`}
        >
          {strength.label}
        </span>
      </p>
    </div>
  );
}
