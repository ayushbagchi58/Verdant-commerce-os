import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  .vdf-outfit { font-family: 'Outfit', sans-serif; }
  .vdf-mono   { font-family: 'Space Mono', monospace; }
`;
const GitHubIcon = () => (_jsx("svg", { width: "14", height: "14", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" }) }));
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: FOOTER_STYLES }), _jsx("footer", { className: "w-full border-t border-black/[0.06] mt-auto", style: {
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 -1px 0 rgba(0,0,0,0.03)",
                }, children: _jsxs("div", { className: "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-6", children: [_jsxs("div", { className: "flex flex-col gap-2.5", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-8 h-8 flex items-center justify-center flex-shrink-0 transition-shadow duration-300", style: {
                                                        background: "linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)",
                                                        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                                                        boxShadow: "0 0 0 1px rgba(34,197,94,0.25), 0 3px 12px rgba(34,197,94,0.2)",
                                                    }, children: _jsx("div", { className: "w-3 h-3", style: {
                                                            border: "2px solid rgba(255,255,255,0.9)",
                                                            clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                                                            background: "rgba(255,255,255,0.15)",
                                                        } }) }), _jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsxs("span", { className: "vdf-outfit font-bold text-[15px] tracking-[-0.3px] leading-none", children: [_jsx("span", { style: {
                                                                        background: "linear-gradient(135deg, #111827, #374151)",
                                                                        WebkitBackgroundClip: "text",
                                                                        WebkitTextFillColor: "transparent",
                                                                        backgroundClip: "text",
                                                                    }, children: "Verd" }), _jsx("span", { style: {
                                                                        background: "linear-gradient(135deg, #16a34a, #22c55e)",
                                                                        WebkitBackgroundClip: "text",
                                                                        WebkitTextFillColor: "transparent",
                                                                        backgroundClip: "text",
                                                                    }, children: "ant" })] }), _jsx("span", { className: "vdf-mono text-[7.5px] tracking-[1.5px] uppercase text-gray-400 leading-none", children: "Commerce OS" })] })] }), _jsx("p", { className: "vdf-outfit text-[12px] text-gray-400 max-w-[240px] leading-relaxed", children: "Premium admin dashboard for managing products, orders, and analytics efficiently." })] }), _jsxs("div", { className: "flex flex-wrap gap-x-1 gap-y-1 items-center", children: [[
                                            { label: "Help Center", path: "/help" },
                                            { label: "Privacy Policy", path: "/privacy" },
                                            { label: "Terms of Service", path: "/terms" },
                                            { label: "Contact", path: "/contact" },
                                        ].map((item) => (_jsx(Link, { to: item.path, className: "vdf-outfit text-[12px] text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 duration-150", children: item.label }, item.label))), _jsxs(Link, { to: "https://github.com/ayushbagchi58", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 duration-150 no-underline", children: [_jsx(GitHubIcon, {}), _jsx("span", { className: "vdf-outfit", children: "GitHub" })] })] })] }), _jsx("div", { className: "mt-6 h-px w-full", style: {
                                background: "linear-gradient(to right, transparent, rgba(0,0,0,0.07) 20%, rgba(0,0,0,0.07) 80%, transparent)",
                                // marginTop:"-100px"
                            } }), _jsxs("div", { className: "mt-4 flex flex-col md:flex-row items-center justify-between gap-3", children: [_jsxs("p", { className: "vdf-outfit text-[11.5px] text-gray-400", children: ["\u00A9 ", currentYear, " ", _jsx("span", { className: "text-gray-500 font-medium", children: "Verdant" }), ". All rights reserved."] }), _jsx("span", { className: "vdf-mono text-[9px] tracking-[1px] uppercase text-gray-400 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50", children: "v1.0.0" })] })] }) })] }));
};
export default Footer;
