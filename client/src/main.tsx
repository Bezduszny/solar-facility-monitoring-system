import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import App from "./App";
import FacilityView from "./components/Facility";
import { CreateFacility, UpdateFacility } from "./components/FacilityForm";
import Facilities from "./components/FacilityList";

const apolloClient = new ApolloClient({
  link: createUploadLink({
    uri: `${import.meta.env.VITE_BACKEND_URL}/graphql/`,
  }),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Facilities />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <UpdateFacility />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <CreateFacility />,
      },
    ],
  },
  {
    path: "/facility/:id",
    element: <App />,
    children: [{ path: "/facility/:id", element: <FacilityView /> }],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw Error("Root element not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
