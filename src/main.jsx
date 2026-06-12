import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/host-grotesk";
import "@fontsource-variable/plus-jakarta-sans";
import { App } from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
