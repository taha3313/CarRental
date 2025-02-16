import { UserProvider } from "./contexts/UserContext"; // Import UserProvider
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./assets/style.css";
import { BrowserRouter } from "react-router-dom";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
