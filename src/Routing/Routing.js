import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(DashboardLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/products", element: _jsx(Products, {}) }), _jsx(Route, { path: "/products/add", element: _jsx(AddProduct, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Error404, {}) })] }) }));
};
export default Routing;
