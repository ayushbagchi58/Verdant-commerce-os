import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (_jsxs("div", { className: "flex min-h-screen bg-gray-50", children: [_jsx(Sidebar, { mobileOpen: mobileOpen, setMobileOpen: setMobileOpen }), _jsxs("div", { className: "flex flex-col flex-1 w-full min-w-0", children: [_jsx(Header, { toggleSidebar: () => setMobileOpen(true) }), _jsx("main", { className: "flex-1 p-4 sm:p-6 w-full overflow-x-hidden relative z-0", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] })] }));
};
export default DashboardLayout;
