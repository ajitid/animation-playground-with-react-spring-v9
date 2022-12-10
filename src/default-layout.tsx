import cn from "clsx";

import { FC, WC } from "@/shared/types";

export const DefaultLayout: FC<WC<{ className?: string }>> = ({ children, className }) => {
  // font-sans is now applied by tailwind automatically
  // min-h-screen is being used to apply bg-color in case we use it below
  // font color isn't changed, for now
  return (
    <div className={cn("min-h-screen antialiased break-words", className)} children={children} />
  );
};
