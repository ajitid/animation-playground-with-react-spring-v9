// src: https://twitter.com/ty___ler/status/1570879641015156737
import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { SpringValue, easings, useSpring } from "@react-spring/web";

/**
 * Hook that animates height when args.animationKey changes
 *
 * Ex:
 *   const animatedBlock = useAnimatedHeight({
 *     animationKey: key,
 *   })
 *
 *   return (
 *     <animated.div style={animatedBlock.style}>
 *       <div ref={animatedBlock.measuredInnerRef}>
 *         {content}
 *       </div>
 *     </animated.div>
 *   )
 */
export function useAnimatedHeight<AnimationKey>(args: { animationKey: AnimationKey }): {
  style: {
    height: SpringValue<string | number>;
  };
  measuredInnerRef: React.RefObject<HTMLDivElement>;
} {
  const measuredInnerRef = useRef<HTMLDivElement>(null);
  const [prevAnimationKey, setPrevAnimationKey] = useState(args.animationKey);
  useLayoutEffect(() => {
    setPrevAnimationKey(args.animationKey);
  }, [args.animationKey]);
  const [prevHeight, setPrevHeight] = useState<number | null>(null);
  const [animateHeight, setAnimateHeight] = useState<number | null>(null);

  const animatedStyle = useSpring({
    height: animateHeight ?? "auto",
    onRest: useCallback(() => {
      setAnimateHeight(null);
    }, []),
    config: {
      duration: 400,
      easing: easings.easeOutQuart,
      clamp: true,
    },
  });

  if (args.animationKey !== prevAnimationKey && prevHeight === null) {
    /**
     * This block runs right before we render, only if the
     * prevHeight value is not set.
     */
    const currentAnimatedValue = animatedStyle.height.get();
    const prevHeightOrCurrentAnimation =
      typeof currentAnimatedValue === "number"
        ? currentAnimatedValue
        : measuredInnerRef.current?.getBoundingClientRect().height ?? 0;

    animatedStyle.height.set(prevHeightOrCurrentAnimation);
    setPrevHeight(prevHeightOrCurrentAnimation);
  } else if (prevHeight !== null && args.animationKey === prevAnimationKey) {
    /**
     * This this block runs right after a render, only
     * if the prevHeight field is set.
     */
    setAnimateHeight(measuredInnerRef.current?.getBoundingClientRect().height ?? null);
    setPrevHeight(null);
  }

  return {
    style: animatedStyle,
    measuredInnerRef: measuredInnerRef,
  };
}
