import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import "./main.css";

import { BB10TextTransition } from "./pages/bb10-text-transition";
import { HtcHd2HomeDock } from "./pages/htc-hd2-home-dock";
import { ListItemTransition } from "./pages/list-item-transition";
import { WireAndSockets } from "./pages/wire-and-scokets";

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
        </ul>
      </div>
    ),
  },
  {
    path: "bb10-text-transition",
    element: <BB10TextTransition />,
  },
  {
    path: "list-items",
    element: <ListItemTransition />,
  },
  {
    path: "htc-hd2-home-dock",
    element: <HtcHd2HomeDock />,
  },
  {
    path: "wire-and-sockets",
    element: <WireAndSockets />,
  },
  {
    path: "chat-bubbles",
    element: <ListItemTransition />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
