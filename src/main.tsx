import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import "./main.css";

import { BB10TextTransition } from "./pages/bb10-text-transition";
import { HtcHd2HomeDock } from "./pages/htc-hd2-home-dock";
import { ListItemTransition } from "./pages/list-item-transition";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="mx-3 mt-2">
        Not created webpage for home as I've only made{" "}
        <Link to="bb10-text-transition" className="text-blue-700">
          BB OS 10 text transition
        </Link>
        . Find{" "}
        <a
          target="_blank"
          href="https://github.com/ajitid/animation-playground-rs9-anew"
          className="text-blue-700"
        >
          Github repo here
        </a>
        .
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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
