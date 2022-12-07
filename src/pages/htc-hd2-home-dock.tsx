// Inspiration: HTC HD2's phone dock https://youtu.be/HvKCMYVuvRM?t=277

import { useRef } from "react";
import useMeasure from "react-use-measure";
import { useSpring, a } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import {
  HomeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MusicalNoteIcon,
  FireIcon,
  CalculatorIcon,
  DocumentTextIcon,
  MapIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ShoppingBagIcon,
  PuzzlePieceIcon,
  LifebuoyIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import { DefaultLayout } from "@/default-layout";
import { snap } from "@/uff/snap";

const icons = [
  HomeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MusicalNoteIcon,
  FireIcon,
  CalculatorIcon,
  DocumentTextIcon,
  MapIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ShoppingBagIcon,
  PuzzlePieceIcon,
  LifebuoyIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
];

const SCREEN_WIDTH = 480;
const SCRUB_WIDTH = 86;

export const HtcHd2HomeDock = () => {
  const deviceRef = useRef<HTMLDivElement>(null);
  const [dockItemsRef, { width: dockWidth }] = useMeasure();

  const [{ x }, scrubAnim] = useSpring(() => ({
    x: 0,
    config: {
      frequency: 0,
      damping: 1,
    },
  }));
  const bindDrag = useDrag(
    ({ offset: [ox], first, down, last }) => {
      // we animate on `first` cond. only to reset spring's `config` because it would have been modified on `last` cond.
      if (first)
        scrubAnim.start({
          x: ox,
          config: {
            frequency: 0,
            damping: 1,
          },
        });

      if (down) scrubAnim.start({ x: ox });

      if (last) {
        if (icons.length <= 1) {
          scrubAnim.start({ x: 0, config: { damping: 1, frequency: 0.2 } });
        } else {
          const snappingPoints = Array(icons.length);
          const segmentLength =
            (Math.min(SCREEN_WIDTH, dockWidth) - SCRUB_WIDTH) / (snappingPoints.length - 1);
          for (let i = 0; i < snappingPoints.length; i++) {
            snappingPoints[i] = i * segmentLength;
          }
          const x = snap(snappingPoints)(ox)!;
          scrubAnim.start({ x, config: { damping: 1, frequency: 0.2 } });
        }
      }
    },
    {
      axis: "x",
      bounds: deviceRef,
      filterTaps: true,
      from: () => [x.get(), 0],
    }
  );

  const dockX =
    dockWidth > SCREEN_WIDTH
      ? x.to([0, SCREEN_WIDTH - SCRUB_WIDTH], [0, dockWidth - SCREEN_WIDTH]).to((v) => v * -1)
      : 0;

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-700 pb-24 grid place-items-center">
        <div
          className={`h-[480px] w-[${SCREEN_WIDTH}px] bg-slate-500 rounded relative overflow-hidden`}
          ref={deviceRef}
        >
          <div data-id="screen-behind-dock" className="h-full"></div>
          <a.div
            ref={dockItemsRef}
            style={{ x: dockX }}
            data-id="dock--items"
            className="whitespace-nowrap bg-slate-300 bottom-0 absolute"
          >
            {icons.map((Icon, idx) => (
              <div className="py-2 px-3 inline-block" key={idx}>
                <Icon className="w-16 inline-block text-slate-700" />
              </div>
            ))}
          </a.div>
          <a.div
            {...bindDrag()}
            style={{ x }}
            data-id="dock--scrub"
            className={`bottom-0 absolute bg-violet-700 opacity-25 h-24 w-[${SCRUB_WIDTH}px] touch-none`}
          ></a.div>
        </div>
      </div>
    </DefaultLayout>
  );
};
