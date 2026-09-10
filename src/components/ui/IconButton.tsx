import { ComponentProps } from "react";

type Props = ComponentProps<"button">;
function IconButton({ className, children, ...props }: Props) {
  return (
    <button
      className={`flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
