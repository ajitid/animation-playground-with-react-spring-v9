import { FC, WC } from "@/shared/types";

export const DefaultLayout: FC<WC> = ({ children }) => {
  // font-sans is now applied by tailwind automatically
  // min-h-screen is being used to apply bg-color in case we use it below
  // font color isn't changed, for now
  return <div className="min-h-screen antialiased break-words" children={children} />;
};
