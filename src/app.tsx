import "./app.css";

import { BB10TextTransition } from "./bb10-text-transition";

export function App() {
  // font-sans is now applied by tailwind automatically
  // min-h-screen is being used to apply bg-color in case we use it below
  // font color isn't changed, for now
  return (
    <div className="min-h-screen antialiased break-words">
      <BB10TextTransition />
    </div>
  );
}
