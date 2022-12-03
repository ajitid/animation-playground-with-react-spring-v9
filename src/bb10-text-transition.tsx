// A neat text transition effect, useful in a case when there are sequential
// steps involved in completing a process. Inspired from a BlackBerry OS 10
// animation: https://youtu.be/IFbChASQH34?t=200

import { useEffect, useState } from "react";
import cn from "clsx";
import { Link } from "react-router-dom";
import useMeasure from "react-use-measure";
import { useSpring, a } from "@react-spring/web";

import { DefaultLayout } from "./default-layout";
import css from "./bb10-text-transition.module.css";

const texts = [
  {
    title: "Connecting",
    info: "Network Found",
  },
  {
    title: "Waiting for data connection",
    info: "BGD ROBI AXIATA",
  },
  {
    title: "Waiting for data connection",
    info: "airtel",
  },
  {
    title: "Nearly there",
    info: "Setting up for first time use",
  },
];

export const BB10TextTransition = () => {
  const [textIndex, setTextIndex] = useState(0);

  /*
    Okay, this is weird.
    Both react-cool-dimensions and react-use-measure sometimes report an intermediate measure:
      react-cool-dimensions:
        null  → 110.324 → 113.390 or
        null  → 107.542 → 110.324 → 113.390
        ^ consider null as `"auto"`
      react-use-measure:
        0     → 111.344 → 113.390 or
        0     → 113.390 → 113.390 (yes, it repeats same value) [1]
    rather than directly reporting:
        0     → 113.390 (the right value) [2]
    Adding debounce of even 1ms solves it for react-use-measure (it starts
    producing either [1] or [2]) while adding even 15ms gives flaky results for
    react-cool-dimensions.
  */
  const [title, { width: titleWidth }] = useMeasure({ debounce: 1 });
  // adding auto ensures that it doesn't animate the very first time
  const titleStyles = useSpring({ width: titleWidth === 0 ? "auto" : titleWidth });

  const [info, { width: infoWidth }] = useMeasure({ debounce: 1 });
  const infoStyles = useSpring({ width: infoWidth === 0 ? "auto" : infoWidth });

  useEffect(() => {
    const id = setInterval(() => {
      setTextIndex((v) => (v + 1) % texts.length);
    }, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <DefaultLayout>
      <div className={cn("pt-32 flex flex-col items-center min-h-screen", css.bg)}>
        <div className="mb-4">
          Inspiration:{" "}
          <a target="_blank" href="https://youtu.be/IFbChASQH34?t=200" className="text-blue-700">
            Blackberry OS 10 text transition
          </a>
        </div>
        <div className="flex items-center flex-col w-96 p-3 h-32 rounded-md shadow-md bg-white">
          <span className={css.loader}></span>
          <a.div style={titleStyles} className="overflow-hidden mt-6">
            <div className="inline-block whitespace-nowrap" ref={title}>
              {texts[textIndex].title}
            </div>
          </a.div>
          <a.div style={infoStyles} className="overflow-hidden">
            <div className="inline-block whitespace-nowrap" ref={info}>
              {texts[textIndex].info}
            </div>
          </a.div>
        </div>
      </div>
    </DefaultLayout>
  );
};
