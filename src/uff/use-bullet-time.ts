import { raf } from "@react-spring/shared";
import { useControls } from "leva";
import { useEffect } from "react";

const orig = raf.now;

/**
 * Gives a Leva control with which you can do bullet time (slow down whole animation)
 */
export const useBulletTime = () => {
  useEffect(() => {
    return () => {
      raf.now = orig;
    };
  }, []);

  useControls({
    bulletTime: {
      label: "bullet time",
      value: 1,
      min: 1,
      max: 5,
      step: 1,
      onChange(v: number) {
        raf.now = () => orig() / 10 ** (v - 1);
      },
    },
  });
};
