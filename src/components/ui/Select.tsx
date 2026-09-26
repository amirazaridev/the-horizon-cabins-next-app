"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

type SelectOption = {
  value: string;
  label: string;
};

// interface RegisterProps {
//   name?: string;
//   onChange?: SelectHTMLAttributes<HTMLSelectElement>["onChange"];
//   onBlur?: SelectHTMLAttributes<HTMLSelectElement>["onBlur"];
//   ref?: Ref<HTMLSelectElement>;
// }

type SelectProps = ComponentProps<"select"> & {
  options?: SelectOption[];
  //   register?: RegisterProps;
};

function Select({ options = [], className = "", ...props }: SelectProps) {
  return (
    <div className="group relative w-full md:w-auto">
      {/* Select Element */}
      <select
        className={`bg-surface border-border text-text shadow-shadow-soft hover:border-border-strong focus:ring-primary-400/20 focus:border-primary-400/50 w-full cursor-pointer appearance-none rounded-xl border py-2.5 pr-10 pl-4 transition-all duration-200 ease-out hover:shadow-md focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:min-w-45 ${className} `}
        // {...register}
        {...props}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value} className="py-2">
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom Icon */}
      <div className="text-text-gray group-hover:text-primary-400 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200">
        <ChevronDown className="size-5" />
      </div>
    </div>
  );
}

export default Select;
