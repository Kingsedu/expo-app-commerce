import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuth } from "@clerk/clerk-react";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import PageLoader from "./components/PageLoader.jsx";
export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return <PageLoader />;
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}
      >
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
}
