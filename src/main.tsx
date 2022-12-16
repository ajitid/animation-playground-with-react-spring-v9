import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import "./main.css";

import { BB10TextTransition } from "./pages/bb10-text-transition";
import { FluidSombreroList } from "./pages/fluid-sombrero-list";
import { HtcHd2HomeDock } from "./pages/htc-hd2-home-dock";
import { ListItemTransition } from "./pages/list-item-transition";
import { ScrollWarpImages } from "./pages/scroll-warp-images";
import { WireAndSockets } from "./pages/wire-and-sockets";

const PageLink = (props: { text: string; link: string }) => (
  <Link to={props.link} className="text-blue-700">
    {props.text}
  </Link>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="mx-3 mt-2">
        <p>The examples have not been optimised for mobile use. Prefer using desktop instead.</p>
        <ul className="mt-3">
          <li className="mb-3">
            <a
              target="_blank"
              href="https://github.com/ajitid/animation-playground-rs9-anew"
              className="text-blue-700"
            >
              Codebase
            </a>
          </li>
          <li>
            <PageLink text="BB OS 10 text transition" link="bb10-text-transition" />
          </li>
          <li>
            <PageLink text="Home dock for HTC HD2" link="htc-hd2-home-dock" />
          </li>
          <li>
            <PageLink text="[FIXME] Chat bubbles" link="chat-bubbles" />
          </li>
          <li>
            <PageLink text="A connection with a wire and sockets" link="wire-and-sockets" />
          </li>
          <li>
            <PageLink text="A list with ripple effect" link="ripple-list" />
          </li>
          <li>
            <PageLink text="Scroll warp" link="scroll-warp" />
          </li>
        </ul>
      </div>
    ),
  },
  {
    path: "bb10-text-transition",
    element: <BB10TextTransition />,
  },
  {
    path: "htc-hd2-home-dock",
    element: <HtcHd2HomeDock />,
  },
  {
    path: "chat-bubbles",
    element: <ListItemTransition />,
  },
  {
    path: "wire-and-sockets",
    element: <WireAndSockets />,
  },
  {
    path: "ripple-list",
    element: <FluidSombreroList />,
  },
  {
    path: "scroll-warp",
    element: <ScrollWarpImages />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
