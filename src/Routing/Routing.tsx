import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import Loader from "../Components/Loader";

// Lazy load pages
const Home = lazy(() => import("../Pages/Home"));
const Products = lazy(() => import("../Pages/Products"));
const AddProduct = lazy(() => import("../Pages/AddProduct"));
const Error404 = lazy(() => import("../Pages/Error404"));



const Routing = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default Routing;