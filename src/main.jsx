import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";

import "react-toastify/dist/ReactToastify.css";
import { Intermediate } from "./intermediate";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Intermediate />
  </React.StrictMode>
);
