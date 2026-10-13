import Input from "@/components/ui/Input";
import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";

export function GuestSearchPanel({
  initial,
  onApply,
}: {
  initial: string;
  onApply: (term: string) => void;
}): ReactNode {
  const [term, setTerm] = useState(initial);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(term.trim());
      }}
    >
      <Input
        label="نام مهمان"
        icon={<Search className="size-4" />}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        clearable
        onClear={() => setTerm("")}
        hint="حداقل ۲ کاراکتر"
      />
      <button
        type="submit"
        className="bg-primary-400 focus-visible:ring-primary-400/60 cursor-pointer rounded-xl py-3 text-sm font-bold text-black transition-transform focus-visible:ring-2 focus-visible:outline-none active:scale-95"
      >
        اعمال جستجو
      </button>
    </form>
  );
}
