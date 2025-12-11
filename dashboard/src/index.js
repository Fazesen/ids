import "./index.css";
import "./theme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const GOOGLE_CLIENT_ID = "864560338866-0jga4tbskltiq6qveaimdctb4qojdvka.apps.googleusercontent.com"; // <- your client id

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
