import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import "./main.css";

import { BB10TextTransition } from "./bb10-text-transition";
import { ListItemTransition } from "./list-item-transition";

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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
