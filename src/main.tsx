import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "./api/client";
import { AuthProvider } from "./auth/AuthContext";
import { Layout } from "./components/Layout";
import { ChurchesPage } from "./pages/ChurchesPage";
import { GuardPage } from "./pages/GuardPage";
import { GuardsPage } from "./pages/GuardsPage";
import { HealthFacilitiesPage } from "./pages/HealthFacilitiesPage";
import { LoginPage } from "./pages/LoginPage";
import { ServicePage } from "./pages/ServicePage";
import { ServicesPage } from "./pages/ServicesPage";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Refused or missing records won't change by asking again.
      retry: (failures, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failures < 2,
    },
  },
});

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/services" replace /> },
      { path: "guards", element: <GuardsPage /> },
      { path: "guards/:id", element: <GuardPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "services/:id", element: <ServicePage /> },
      { path: "churches", element: <ChurchesPage /> },
      { path: "health_facilities", element: <HealthFacilitiesPage /> },
      { path: "*", element: <Navigate to="/services" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
