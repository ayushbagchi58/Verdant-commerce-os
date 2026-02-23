import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getProduct } from "../API/Functions/getProduct.api";
import { getOrders } from "../API/Functions/getOrders.api";
const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [orders, setOrders] = useState([]);
    /* Fetch Products */
    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const [productRes, orderRes] = await Promise.all([
                    getProduct(),
                    getOrders(),
                ]);
                setProducts(productRes.data);
                setOrders(orderRes.data);
            }
            catch {
                setError("Failed to load dashboard");
            }
            finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);
    /* Stats calculation */
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.length * 500;
        const totalValue = products.reduce((sum, p) => sum + p.price, 0);
        const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
        const categories = new Set(products.map((p) => p.category)).size;
        return {
            totalProducts,
            totalValue,
            avgPrice,
            categories,
            totalOrders,
            totalRevenue,
        };
    }, [products, orders]);
    /* Animations */
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };
    /* Loading */
    if (loading)
        return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-32 bg-white rounded-2xl shadow animate-pulse" }, i))) }));
    if (error)
        return _jsx("div", { className: "text-red-500 text-center py-10", children: error });
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
      
        .dashboard-root h1,
        .dashboard-root h2,
        

        .mesh-bg {
          background:
            radial-gradient(ellipse 80% 60% at 10% -10%, rgba(34,197,94,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 95% 10%, rgba(74,222,128,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 110%, rgba(34,197,94,0.05) 0%, transparent 60%),
            #f8faf9;
        }

        .glass-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
        }

        .stat-glow {
          box-shadow:
            0 0 0 1px rgba(34,197,94,0.1),
            0 4px 6px -1px rgba(0,0,0,0.04),
            0 2px 4px -2px rgba(0,0,0,0.02),
            0 20px 40px -12px rgba(34,197,94,0.08);
        }

        .stat-glow:hover {
          box-shadow:
            0 0 0 1px rgba(34,197,94,0.2),
            0 8px 16px -4px rgba(0,0,0,0.06),
            0 30px 60px -15px rgba(34,197,94,0.15);
        }

        .product-card-shadow {
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.04),
            0 8px 32px -8px rgba(0,0,0,0.08),
            0 32px 64px -16px rgba(34,197,94,0.06);
        }

        .icon-glow {
          box-shadow:
            0 4px 12px rgba(34,197,94,0.35),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .progress-track {
          background: linear-gradient(90deg, rgba(34,197,94,0.08), rgba(74,222,128,0.05));
        }

        .progress-fill {
          background: linear-gradient(90deg, #16a34a, #22C55E, #4ADE80);
          box-shadow: 0 0 8px rgba(34,197,94,0.5);
        }

        .product-row-hover:hover {
          background: linear-gradient(135deg, rgba(34,197,94,0.04), rgba(74,222,128,0.02));
        }

        .badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .header-accent {
          background: linear-gradient(135deg, #22C55E, #4ADE80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .divider-line {
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent);
        }

        .live-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        .shine-effect {
          position: relative;
          overflow: hidden;
        }

        .shine-effect::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.5) 50%,
            transparent 60%
          );
          transform: skewX(-15deg);
          transition: none;
        }

        .shine-effect:hover::after {
          animation: shine-sweep 0.6s ease forwards;
        }

        @keyframes shine-sweep {
          0% { left: -75%; }
          100% { left: 125%; }
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: capitalize;
          background: rgba(34,197,94,0.08);
          color: #15803d;
          border: 1px solid rgba(34,197,94,0.12);
        }
      ` }), _jsxs(motion.div, { variants: container, initial: "hidden", animate: "show", className: "space-y-8 dashboard-root mesh-bg min-h-screen p-1", children: [_jsxs(motion.div, { variants: item, className: "relative", children: [_jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "live-dot w-2 h-2 rounded-full bg-green-500 inline-block" }), _jsx("span", { className: "badge text-green-600 tracking-widest", children: "Live Dashboard" })] }), _jsxs("h1", { className: "text-2xl font-bold text-gray-800 leading-tight", children: ["Store", " ", _jsx("span", { className: "header-accent", children: "Overview" })] }), _jsx("p", { className: "text-gray-400 mt-1 text-sm font-light", children: "Welcome back. Here's your store at a glance." })] }), _jsxs("div", { className: "glass-card rounded-xl px-4 py-2 flex items-center gap-2 border border-green-100", children: [_jsx("span", { className: "text-xs text-gray-400 font-light", children: new Date().toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }) }), _jsx("div", { className: "w-1 h-1 rounded-full bg-green-400" }), _jsx("span", { className: "text-xs text-green-600 font-medium", children: "Live" })] })] }), _jsx("div", { className: "divider-line h-px mt-6" })] }), _jsxs(motion.div, { variants: container, className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6", children: [_jsx(StatCard, { title: "Total Products", value: stats.totalProducts, icon: "\uD83D\uDCE6", trend: "+12%", sub: "from last week" }), _jsx(StatCard, { title: "Categories", value: stats.categories, icon: "\uD83D\uDCC1", trend: "+2", sub: "new this month" }), _jsx(StatCard, { title: "Inventory Value", value: `₹${stats.totalValue.toFixed(2)}`, icon: "\uD83D\uDCB0", trend: "+8.4%", sub: "vs last month" }), _jsx(StatCard, { title: "Average Price", value: `₹${stats.avgPrice.toFixed(2)}`, icon: "\uD83D\uDCCA", trend: "Stable", sub: "across catalog" }), _jsx(StatCard, { title: "Orders", value: stats.totalOrders, icon: "\uD83D\uDED2", trend: "+24", sub: "since yesterday" }), _jsx(StatCard, { title: "Revenue", value: `₹${stats.totalRevenue}`, icon: "\uD83D\uDCB0", trend: "+18.2%", sub: "this quarter" })] }), _jsxs(motion.div, { variants: item, className: "glass-card product-card-shadow rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center text-sm shine-effect", style: {
                                                    background: "linear-gradient(135deg,#22C55E,#4ADE80)",
                                                    boxShadow: "0 4px 10px rgba(34,197,94,0.3)",
                                                }, children: "\uD83D\uDECD\uFE0F" }), _jsx("h2", { className: "font-bold text-gray-800 text-base", style: { fontFamily: "'Syne', sans-serif" }, children: "Recent Products" })] }), _jsxs("span", { className: "badge text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100", children: [products.slice(0, 5).length, " items"] })] }), _jsxs("div", { className: "flex items-center gap-4 px-3 mb-3", children: [_jsx("div", { className: "w-14 flex-shrink-0" }), _jsx("div", { className: "flex-1", children: _jsx("span", { className: "badge text-gray-400", children: "Product" }) }), _jsx("span", { className: "badge text-gray-400 w-24 text-right", children: "Price" })] }), _jsx("div", { className: "divider-line h-px mb-4" }), _jsx("div", { className: "space-y-2", children: products.slice(0, 5).map((product, idx) => (_jsx(ProductRow, { product: product, index: idx }, product.id))) })] })] })] }));
};
export default Home;
/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon, trend, sub, }) => (_jsxs(motion.div, { whileHover: { y: -5, transition: { type: "spring", stiffness: 300 } }, className: "\r\n      bg-white\r\n      rounded-2xl\r\n      p-6\r\n      stat-glow\r\n      border\r\n      border-gray-100\r\n      shine-effect\r\n      relative\r\n      overflow-hidden\r\n    ", children: [_jsx("div", { className: "absolute inset-0 opacity-[0.015] pointer-events-none", style: {
                backgroundImage: "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
            } }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-gray-400 text-sm font-light tracking-wide", children: title }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mt-1 stat-card-value", children: value }), trend && sub && (_jsxs("div", { className: "flex items-center gap-1.5 mt-2", children: [_jsx("span", { className: "text-xs font-semibold text-green-600", style: { fontFamily: "'Syne', sans-serif" }, children: trend }), _jsx("span", { className: "text-xs text-gray-400 font-light", children: sub })] }))] }), _jsx("div", { className: "\r\n            w-12\r\n            h-12\r\n            flex\r\n            items-center\r\n            justify-center\r\n            rounded-xl\r\n            text-xl\r\n            flex-shrink-0\r\n            icon-glow\r\n            shine-effect\r\n          ", style: {
                                background: "linear-gradient(135deg,#22C55E,#4ADE80)",
                            }, children: icon })] }), _jsx("div", { className: "mt-4 h-1 progress-track rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: "70%" }, transition: { duration: 1, ease: "easeOut", delay: 0.3 }, className: "h-full progress-fill rounded-full" }) })] })] }));
/* ─── Product Row ────────────────────────────────────────────────────────── */
const ProductRow = ({ product, index, }) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.07, type: "spring", stiffness: 200 }, whileHover: { scale: 1.02, transition: { type: "spring", stiffness: 300 } }, className: "\r\n      product-row-hover\r\n      flex\r\n      items-center\r\n      gap-4\r\n      p-3\r\n      rounded-xl\r\n      cursor-pointer\r\n      transition-all\r\n      duration-200\r\n      group\r\n      border\r\n      border-transparent\r\n      hover:border-green-100\r\n    ", children: [_jsx("span", { className: "\r\n        w-5\r\n        h-5\r\n        flex-shrink-0\r\n        flex\r\n        items-center\r\n        justify-center\r\n        text-xs\r\n        font-bold\r\n        text-gray-300\r\n        group-hover:text-green-400\r\n        transition-colors\r\n        duration-200\r\n      ", style: { fontFamily: "'Syne', sans-serif" }, children: String(index + 1).padStart(2, "0") }), _jsx("div", { className: "\r\n        w-14\r\n        h-14\r\n        object-contain\r\n        bg-gray-50\r\n        p-2\r\n        rounded-lg\r\n        flex\r\n        items-center\r\n        justify-center\r\n        flex-shrink-0\r\n        group-hover:bg-green-50\r\n        transition-colors\r\n        duration-200\r\n        border\r\n        border-gray-100\r\n        group-hover:border-green-100\r\n        overflow-hidden\r\n      ", children: _jsx("img", { src: product.image, alt: product.title, className: "w-full h-full object-contain" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-gray-700 line-clamp-1 text-sm group-hover:text-gray-900 transition-colors duration-200", children: product.title }), _jsx("div", { className: "mt-1", children: _jsx("span", { className: "tag-pill", children: product.category }) })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsxs("div", { className: "font-bold text-[#22C55E] text-sm", style: { fontFamily: "'Syne', sans-serif" }, children: ["\u20B9", product.price] }), _jsx(motion.div, { className: "w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200", style: { background: "rgba(34,197,94,0.1)" }, children: _jsx("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", children: _jsx("path", { d: "M2 5h6M6 3l2 2-2 2", stroke: "#22C55E", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })] })] }));
