import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_TITLES = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/products/add": "Add Product",
};
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        message: "New order #1024 received",
        time: "2 min ago",
        read: false,
    },
    {
        id: 2,
        message: "Product stock running low",
        time: "15 min ago",
        read: false,
    },
    { id: 3, message: "Monthly report is ready", time: "1 hr ago", read: true },
];
const USER = {
    name: "Aarav Mehta",
    role: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};
// ─── Injected styles (fonts + dropdown animation only) ────────────────────────
const INJECTED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  .vd-outfit { font-family: 'Outfit', sans-serif; }
  .vd-mono   { font-family: 'Space Mono', monospace; }
  @keyframes vd-drop {
    from { opacity: 0; transform: scale(0.95) translateY(-6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  .vd-drop { animation: vd-drop 0.18s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: top right; }
`;
// ─── Icons ────────────────────────────────────────────────────────────────────
const BellIcon = () => (_jsx("svg", { width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: 1.75, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }));
const ChevronIcon = ({ open }) => (_jsx("svg", { className: `w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", strokeWidth: 2.5, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) }));
const LogoutIcon = () => (_jsx("svg", { width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" }) }));
const SettingsIcon = () => (_jsxs("svg", { width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }));
const ProfileIcon = () => (_jsx("svg", { width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }));
// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = () => (_jsxs("div", { className: "flex items-center gap-2.5 flex-shrink-0 select-none", children: [_jsx("div", { className: "w-9 h-9 flex items-center justify-center flex-shrink-0 transition-shadow duration-300", style: {
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)",
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                boxShadow: "0 0 0 1px rgba(34,197,94,0.3), 0 4px 16px rgba(34,197,94,0.25)",
            }, children: _jsx("div", { className: "w-3.5 h-3.5", style: {
                    border: "2px solid rgba(255,255,255,0.9)",
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                    background: "rgba(255,255,255,0.15)",
                } }) }), _jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsxs("div", { className: "vd-outfit font-bold text-[17px] tracking-[-0.4px] leading-none", children: [_jsx("span", { style: {
                                background: "linear-gradient(135deg, #111827, #374151)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }, children: "Verd" }), _jsx("span", { style: {
                                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }, children: "ant" })] }), _jsx("div", { className: "vd-mono text-[8px] tracking-[1.5px] uppercase text-gray-400 leading-none", children: "Commerce OS" })] })] }));
function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target))
                return;
            handler();
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}
// ─── Notification Dropdown ────────────────────────────────────────────────────
const NotificationDropdown = ({ notifications, onMarkAllRead, }) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    return (_jsxs("div", { className: "vd-drop absolute right-0 top-full mt-2.5 w-80 bg-white rounded-[18px] border border-black/[0.07] overflow-hidden z-50", style: {
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
        }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3.5 border-b border-gray-100", children: [_jsxs("span", { className: "vd-outfit text-[13px] font-semibold text-gray-900 flex items-center gap-2", children: ["Notifications", unreadCount > 0 && (_jsxs("span", { className: "vd-mono text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-700/[0.15]", children: [unreadCount, " new"] }))] }), unreadCount > 0 && (_jsx("button", { onClick: onMarkAllRead, className: "vd-outfit text-[11px] text-green-600 font-medium hover:opacity-70 transition-opacity bg-transparent border-0 cursor-pointer p-0", children: "Mark all read" }))] }), _jsx("div", { className: "max-h-72 overflow-y-auto", children: notifications.map((n) => (_jsxs("div", { className: `flex items-start gap-2.5 px-4 py-3 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? "bg-green-50 hover:bg-green-100/60" : "hover:bg-gray-50"}`, children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px] ${!n.read ? "bg-green-500" : "bg-gray-300"}`, style: !n.read ? { boxShadow: "0 0 6px rgba(34,197,94,0.4)" } : {} }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "vd-outfit text-[12.5px] text-gray-700 leading-snug", children: n.message }), _jsx("p", { className: "vd-mono text-[10.5px] text-gray-400 mt-0.5", children: n.time })] })] }, n.id))) }), _jsx("div", { className: "px-4 py-2.5 border-t border-gray-100 text-center", children: _jsx("button", { className: "vd-outfit text-[11.5px] text-green-600 font-medium hover:opacity-70 transition-opacity bg-transparent border-0 cursor-pointer", children: "View all notifications \u2192" }) })] }));
};
// ─── User Dropdown ────────────────────────────────────────────────────────────
const UserDropdown = () => (_jsxs("div", { className: "vd-drop absolute right-0 top-full mt-2.5 w-52 bg-white rounded-[18px] border border-black/[0.07] overflow-hidden z-50", style: {
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
    }, children: [_jsxs("div", { className: "px-4 py-3.5 border-b border-gray-100", children: [_jsx("p", { className: "vd-outfit text-[13px] font-semibold text-gray-900 truncate", children: USER.name }), _jsx("p", { className: "vd-mono text-[9.5px] text-gray-400 uppercase tracking-[1px] mt-0.5", children: USER.role })] }), _jsx("div", { className: "py-1.5", children: [
                { icon: _jsx(ProfileIcon, {}), label: "My Profile" },
                { icon: _jsx(SettingsIcon, {}), label: "Settings" },
            ].map(({ icon, label }) => (_jsxs("button", { className: "vd-outfit flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors bg-transparent border-0 cursor-pointer text-left", children: [_jsx("span", { className: "text-gray-400", children: icon }), label] }, label))) }), _jsx("div", { className: "border-t border-gray-100 py-1.5", children: _jsxs("button", { className: "vd-outfit flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors bg-transparent border-0 cursor-pointer text-left", children: [_jsx(LogoutIcon, {}), "Logout"] }) })] }));
// ─── Main Header ──────────────────────────────────────────────────────────────
const Header = ({ toggleSidebar }) => {
    const location = useLocation();
    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [avatarError, setAvatarError] = useState(false);
    const notifRef = useRef(null);
    const userRef = useRef(null);
    useClickOutside(notifRef, () => setNotifOpen(false));
    useClickOutside(userRef, () => setUserOpen(false));
    const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";
    const breadcrumbs = location.pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, arr) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: "/" + arr.slice(0, index + 1).join("/"),
        isLast: index === arr.length - 1,
    }));
    const unreadCount = notifications.filter((n) => !n.read).length;
    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: INJECTED_STYLES }), _jsx("header", { className: "sticky top-0 z-40 w-full border-b border-black/[0.06]", style: {
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.04)",
                }, children: _jsxs("div", { className: "flex items-center justify-between px-4 sm:px-7 h-16 gap-4", children: [_jsxs("div", { className: "flex items-center gap-5 min-w-0 flex-1", children: [_jsx("button", { onClick: toggleSidebar, className: "lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100", children: "\u2630" }), _jsx(Logo, {}), _jsx("div", { className: "hidden sm:block w-px h-8 flex-shrink-0", style: {
                                        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)",
                                    } }), _jsxs("div", { className: "flex flex-col justify-center min-w-0 flex-1", children: [_jsx("h1", { className: "vd-outfit text-[15px] font-semibold text-gray-900 tracking-[-0.2px] leading-tight truncate", children: pageTitle }), breadcrumbs.length > 0 && (_jsxs("nav", { className: "flex items-center gap-1 mt-0.5", "aria-label": "breadcrumb", children: [_jsx("span", { className: "vd-outfit text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors whitespace-nowrap", children: "Home" }), breadcrumbs.map(({ label, isLast }) => (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "vd-outfit text-[11px] text-gray-300", children: "/" }), isLast ? (_jsx("span", { className: "vd-outfit text-[11px] text-green-600 font-medium whitespace-nowrap", children: label })) : (_jsx("span", { className: "vd-outfit text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors whitespace-nowrap", children: label }))] }, label)))] }))] })] }), _jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [_jsxs("div", { ref: notifRef, className: "relative", children: [_jsxs("button", { "aria-label": "Notifications", onClick: () => {
                                                setNotifOpen((p) => !p);
                                                setUserOpen(false);
                                            }, className: `relative flex items-center justify-center w-[38px] h-[38px] rounded-xl border-0 cursor-pointer transition-all duration-150 active:scale-95 outline-none ${notifOpen
                                                ? "bg-green-50 text-green-600"
                                                : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`, children: [_jsx(BellIcon, {}), unreadCount > 0 && (_jsx("span", { className: "vd-mono absolute top-[7px] right-[7px] min-w-[15px] h-[15px] px-[3px] rounded-full text-white text-[8px] font-bold flex items-center justify-center leading-none ring-2 ring-white", style: {
                                                        background: "linear-gradient(135deg, #16a34a, #22c55e)",
                                                    }, children: unreadCount > 9 ? "9+" : unreadCount }))] }), notifOpen && (_jsx(NotificationDropdown, { notifications: notifications, onMarkAllRead: markAllRead }))] }), _jsx("div", { className: "w-px h-6 mx-1", style: {
                                        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)",
                                    } }), _jsxs("div", { ref: userRef, className: "relative", children: [_jsxs("button", { "aria-label": "User menu", onClick: () => {
                                                setUserOpen((p) => !p);
                                                setNotifOpen(false);
                                            }, className: `flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl border-0 cursor-pointer transition-all duration-150 active:scale-[0.98] outline-none ${userOpen ? "bg-gray-100" : "bg-transparent hover:bg-gray-100"}`, children: [!avatarError ? (_jsx("img", { src: USER.avatar, alt: USER.name, className: "w-8 h-8 rounded-[10px] object-cover flex-shrink-0", style: {
                                                        border: "1.5px solid rgba(34,197,94,0.25)",
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                    }, onError: () => setAvatarError(true) })) : (
                                                /* Fallback initials */
                                                _jsx("span", { className: "w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold tracking-[0.5px]", style: {
                                                        background: "linear-gradient(135deg, #16a34a, #22c55e)",
                                                    }, "aria-hidden": true, children: USER.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("") })), _jsxs("div", { className: "hidden sm:flex flex-col items-start leading-tight", children: [_jsx("span", { className: "vd-outfit text-[13px] font-semibold text-gray-900 tracking-[-0.1px]", children: USER.name }), _jsx("span", { className: "vd-mono text-[10px] text-gray-400 mt-0.5 uppercase tracking-[0.3px]", children: USER.role })] }), _jsx(ChevronIcon, { open: userOpen })] }), userOpen && _jsx(UserDropdown, {})] })] })] }) })] }));
};
export default Header;
