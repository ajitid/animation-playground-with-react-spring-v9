// Inspiration: HTC HD2's phone dock https://youtu.be/HvKCMYVuvRM?t=277

import { useRef, useState } from "react";
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
const screenWidthClassname = `w-[480px]`;
const SCRUB_WIDTH = 94;
const scrubWidthClassname = `w-[94px]`;

export const HtcHd2HomeDock = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const SelectedIcon = icons[selectedItem];

  const deviceRef = useRef<HTMLDivElement>(null);
  const [dockItemsRef, { width: dockWidth }] = useMeasure();

  const [{ x }, scrubAnim] = useSpring(
    () => ({
      x: 0,
      config: {
        frequency: 0,
        damping: 1,
      },
      onChange(v) {
        setSelectedItem(getSnappedPoint(dockWidth, v.value.x).i);
      },
    }),
    [dockWidth]
  );
  const bindDrag = useDrag(
    ({ offset: [ox], first, down, last }) => {
      if (first) {
        setIsDragging(true);
        // we animate on `first` cond. only to reset spring's `config` because it would have been modified on `last` cond.
        scrubAnim.start({
          x: ox,
          config: {
            frequency: 0,
            damping: 1,
          },
        });
      }

      if (down) scrubAnim.start({ x: ox, immediate: true });

      if (last) {
        setIsDragging(false);
        const { x } = getSnappedPoint(dockWidth, ox);
        scrubAnim.start({ x, config: { damping: 1, frequency: 0.13 } });
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

  const moveTo = (i: number) => {
    scrubAnim.start({
      x:
        icons.length <= 1
          ? 0
          : ((Math.min(dockWidth, SCREEN_WIDTH) - SCRUB_WIDTH) / (icons.length - 1)) * i,
      config: { damping: 1, frequency: 0.3 },
    });
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-zinc-800 pb-24 grid place-items-center">
        <div
          className={`h-[480px] ${screenWidthClassname} rounded relative overflow-hidden`}
          ref={deviceRef}
        >
          <div data-id="screen-behind-dock" className="h-full p-4 text-sky-800 text-lg bg-sky-100">
            Grab the scrubber at the bottom and scrub along X axis to reveal hidden dock items.
            <br />
            Inspiration:{" "}
            <a href="https://youtu.be/HvKCMYVuvRM?t=277" target="_blank" className="underline">
              HTC HD2 homescreen dock
            </a>
            <br />
            Not optimised for mobile view.
          </div>
          <a.div
            ref={dockItemsRef}
            style={{ x: dockX }}
            data-id="dock--items"
            className="whitespace-nowrap bg-sky-200 bottom-0 absolute"
          >
            {icons.map((Icon, idx) => (
              <div onPointerDown={() => moveTo(idx)} className="py-2 px-3 inline-block" key={idx}>
                <Icon className="w-16 inline-block text-slate-700" />
              </div>
            ))}
          </a.div>
          <a.div
            {...bindDrag()}
            style={{ x }}
            data-id="dock--scrub"
            className={`bottom-0 absolute shadow-md bg-sky-50 h-24 ${scrubWidthClassname} touch-none grid place-items-center rounded-t ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <SelectedIcon className="w-16 text-slate-800" />
          </a.div>
        </div>
      </div>
    </DefaultLayout>
  );
};

const getSnappedPoint = (dockWidth: number, offset: number) => {
  if (icons.length <= 1) {
    return { i: 0, x: 0 };
  } else {
    const snappingPoints: number[] = Array(icons.length);
    const segmentLength =
      (Math.min(SCREEN_WIDTH, dockWidth) - SCRUB_WIDTH) / (snappingPoints.length - 1);
    for (let i = 0; i < snappingPoints.length; i++) {
      snappingPoints[i] = i * segmentLength;
    }
    const x = snap(snappingPoints)(offset)!;
    return { i: snappingPoints.indexOf(x), x };
  }
};
