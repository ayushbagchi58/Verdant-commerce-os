import { useEffect, useState, useMemo } from "react";
import { getProduct } from "../API/Functions/getProduct.api";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Rating {
  rate: number;
  count: number;
}

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

/* ───────────────── Animations ───────────────── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const fadeSlideVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ───────────────── Skeleton ───────────────── */

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
      <div className="h-4 bg-gray-100 rounded-lg w-2/3 animate-pulse" />
      <div className="h-5 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
    </div>
  </div>
);

/* ───────────────── Star Rating ───────────────── */

const StarRating = ({ rate }: { rate: number }) => {
  const filled = Math.floor(rate);
  const partial = rate - filled;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <defs>
            <linearGradient id={`star-grad-${i}-${rate}`} x1="0" x2="1" y1="0" y2="0">
              <stop
                offset={i < filled ? "100%" : i === filled ? `${partial * 100}%` : "0%"}
                stopColor="#22C55E"
              />
              <stop
                offset={i < filled ? "100%" : i === filled ? `${partial * 100}%` : "0%"}
                stopColor="#D1FAE5"
              />
            </linearGradient>
          </defs>
          <path
            d="M6 1l1.34 2.72L10.5 4.2l-2.25 2.19.53 3.11L6 7.96 3.22 9.5l.53-3.11L1.5 4.2l3.16-.48z"
            fill={`url(#star-grad-${i}-${rate})`}
          />
        </svg>
      ))}
    </div>
  );
};

/* ───────────────── Product Card ───────────────── */

const ProductCard = ({
  product,
  firstLoad,
  view,
}: {
  product: Product;
  firstLoad: boolean;
  view: "grid" | "list";
}) => {
  return (
    <motion.div
      variants={firstLoad ? undefined : cardVariants}
      initial={firstLoad ? false : "hidden"}
      animate="visible"
      whileHover={{ y: -6, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      className={`
        group relative bg-white border border-gray-100/80 rounded-2xl
        transition-all duration-300 overflow-hidden cursor-pointer
        ${view === "list" ? "flex items-center gap-4 p-4" : "p-0"}
      `}
      style={{
        background: "linear-gradient(160deg, #ffffff 0%, #f6fffe 60%, #f0fdf4 100%)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 20px 60px rgba(34,197,94,0.18), 0 8px 24px rgba(34,197,94,0.1), 0 0 0 1px rgba(34,197,94,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)";
      }}
    >
      {/* Prismatic top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-t-2xl z-10"
        style={{
          background: "linear-gradient(90deg, #16A34A, #22C55E, #4ADE80, #86EFAC, #22C55E, #16A34A)",
          backgroundSize: "200% 100%",
          animation: "shimmerLine 2s linear infinite",
        }}
      />

      {/* Glass inner highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl pointer-events-none opacity-40"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, transparent 100%)",
        }}
      />

      {/* Ambient glow blob */}
      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none blur-2xl"
        style={{ background: "radial-gradient(circle, #4ADE80 0%, transparent 70%)" }}
      />

      {/* Image Container */}
      <div
        className={`
          relative flex items-center justify-center overflow-hidden
          ${view === "list"
            ? "w-24 h-24 rounded-xl flex-shrink-0"
            : "aspect-square p-6"
          }
        `}
        style={{
          background:
            view === "list"
              ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
              : "linear-gradient(145deg, #f8fafc 0%, #f0fdf4 100%)",
        }}
      >
        {/* Subtle grid pattern on image bg */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, #22C55E22 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <img
          src={product.image}
          alt={product.title}
          className="relative z-10 max-h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_8px_16px_rgba(34,197,94,0.3)]"
        />

        {/* Category ribbon */}
        <div className="absolute top-2 left-[-35px] rotate-[-45deg] z-20">
          <span
            className="text-white text-[9px] font-bold px-8 py-[3px] tracking-widest uppercase"
            style={{
              background: "linear-gradient(90deg, #15803D, #16A34A, #22C55E)",
              boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
            }}
          >
            {product.category}
          </span>
        </div>

        {/* Rating badge */}
        {view === "grid" && (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full z-20"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(34,197,94,0.2)",
              boxShadow: "0 2px 8px rgba(34,197,94,0.12)",
            }}
          >
            <span className="text-[9px]">⭐</span>
            <span className="text-[10px] font-bold text-[#16A34A]">{product.rating.rate}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`${view === "list" ? "flex-1" : "p-4 pt-3"} flex flex-col gap-1.5 relative z-10`}>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] leading-snug group-hover:text-gray-900 transition-colors">
          {product.title}
        </h3>

        {view === "list" && (
          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span
              className="text-lg font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #15803D, #16A34A, #22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹{product.price}
            </span>
          </div>

          {view === "list" && (
            <div className="flex items-center gap-1.5">
              <StarRating rate={product.rating.rate} />
              <span className="text-xs text-gray-400">({product.rating.count})</span>
            </div>
          )}
        </div>

        {/* Add to Cart */}
        {view === "grid" && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="mt-1 w-full py-1.5 rounded-xl text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #15803D 0%, #16A34A 50%, #22C55E 100%)",
              boxShadow: "0 4px 16px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span className="relative z-10 tracking-wide">Add to Cart</span>
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, #16A34A 0%, #22C55E 50%, #4ADE80 100%)",
              }}
            />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

/* ───────────────── Premium Dropdown ───────────────── */

const PremiumDropdown = ({ value, options, onChange }: DropdownProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm hover:border-[#22C55E] hover:shadow-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-gray-700 font-medium"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        {value}
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition duration-150 ease-out"
        enterFrom="opacity-0 scale-95 translate-y-1"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }}
        >
          <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #16A34A, #22C55E, #4ADE80)" }} />
          {options.map((option) => (
            <Menu.Item key={option}>
              {({ active }) => (
                <button
                  onClick={() => onChange(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 flex items-center gap-2 ${
                    active ? "bg-gradient-to-r from-green-50 to-emerald-50 text-[#16A34A] font-semibold" : "text-gray-700"
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />}
                  {!active && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                  {option}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

/* ───────────────── Main Page ───────────────── */

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [firstLoad, setFirstLoad] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  /* ───────────────── Fetch ───────────────── */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProduct();
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err: any) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    setFirstLoad(false);
  }, []);

  /* ───────────────── Search ───────────────── */

  const handleSearch = () => {
    setSearch(query);
    setHasSearched(true);
    setShowSuggestions(false);
  };

  useEffect(() => {
    let data = [...products];
    if (hasSearched && query) {
      data = data.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      data = data.filter((product) => product.category === selectedCategory);
    }
    if (sortBy === "priceLow") data.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") data.sort((a, b) => b.price - a.price);
    setFiltered(data);
  }, [query, hasSearched, selectedCategory, sortBy, products]);

  /* ───────────────── Filtering and sorting ───────────────── */

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map((p) => p.category))];
    return cats;
  }, [products]);

  /* ───────────────── Pagination ───────────────── */

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  /* ───────────────── UI ───────────────── */

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl">⚠️</div>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.04); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .search-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15), 0 8px 24px rgba(34,197,94,0.12);
        }
        .card-grid-hover:hover {
          transform: translateY(-6px);
        }
      `}</style>

      <div className="w-full relative">
        {/* ── Decorative Background Orbs ── */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute top-[-120px] right-[-120px] w-[360px] h-[360px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, #22C55E 0%, #16A34A 40%, transparent 70%)",
              animation: "floatOrb 8s ease-in-out infinite",
            }}
          />
        </div>
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #4ADE80 0%, transparent 70%)",
              animation: "floatOrb 10s ease-in-out infinite reverse",
            }}
          />
        </div>

        <div className="relative z-10 w-full">
          {/* ── Header ── */}
          <div className="mb-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {/* Animated accent bar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-1 h-7 rounded-full"
                      style={{ background: "linear-gradient(180deg, #22C55E, #15803D)" }}
                    />
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-40"
                      style={{
                        background: "#22C55E",
                        animation: "pulseRing 2s ease-out infinite",
                      }}
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Products List
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mt-0.5 ml-4">
                  Browse, search and manage your product inventory
                </p>
              </div>

              {/* Live count badge */}
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-green-100"
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                    boxShadow: "0 2px 8px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-xs font-semibold text-[#16A34A]">
                    {filtered.length} Products
                  </span>
                </motion.div>
              )}
            </div>

            {/* ── Search + Controls ── */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[180px] max-w-sm search-glow rounded-xl transition-all duration-300">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#22C55E] shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-400"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                />
              </div>

              <PremiumDropdown
                value={selectedCategory}
                options={categories}
                onChange={setSelectedCategory}
              />

              <PremiumDropdown
                value={
                  sortBy === "default"
                    ? "Sort By"
                    : sortBy === "priceLow"
                    ? "Price: Low to High"
                    : "Price: High to Low"
                }
                options={["Sort By", "Price: Low to High", "Price: High to Low"]}
                onChange={(value) => {
                  if (value === "Price: Low to High") setSortBy("priceLow");
                  else if (value === "Price: High to Low") setSortBy("priceHigh");
                  else setSortBy("default");
                }}
              />

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSearch}
                className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl relative overflow-hidden transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #15803D 0%, #16A34A 50%, #22C55E 100%)",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {/* Shimmer effect */}
                <span
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                  }}
                />
                <span className="relative z-10">Search</span>
              </motion.button>

              {/* View Toggle */}
              <div
                className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  minWidth: "auto",
                }}
              >
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    view === "grid"
                      ? "text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={
                    view === "grid"
                      ? {
                          background: "linear-gradient(135deg, #15803D, #22C55E)",
                          boxShadow: "0 2px 8px rgba(34,197,94,0.35)",
                        }
                      : {}
                  }
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    view === "list"
                      ? "text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={
                    view === "list"
                      ? {
                          background: "linear-gradient(135deg, #15803D, #22C55E)",
                          boxShadow: "0 2px 8px rgba(34,197,94,0.35)",
                        }
                      : {}
                  }
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                  List
                </button>
              </div>
            </div>

            {/* ── Search Result Text ── */}
            <AnimatePresence>
              {hasSearched && (
                <motion.div
                  variants={fadeSlideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-4 text-sm text-gray-500"
                >
                  {filtered.length > 0 ? (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold"
                        style={{ background: "linear-gradient(135deg, #16A34A, #22C55E)" }}
                      >
                        ✓
                      </span>
                      Showing
                      <span className="font-semibold text-gray-800 mx-0.5">{filtered.length}</span>
                      results for
                      <span className="font-semibold text-[#22C55E] ml-0.5">"{query}"</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-500 font-medium">
                      <span className="text-base">🔍</span>
                      No results found for "{query}"
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Suggestions ── */}
          <div className="relative">
            {showSuggestions && query && (
              <div
                className="absolute top-full mt-2 w-full bg-white border rounded-xl overflow-hidden z-50"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }}
              >
                <div className="h-0.5" style={{ background: "linear-gradient(90deg, #16A34A, #22C55E)" }} />
                {products
                  .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setQuery(product.title);
                        setHasSearched(true);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-[#22C55E] cursor-pointer text-sm transition-colors flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                      {product.title}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ── Filter Chips ── */}
          <AnimatePresence>
            {(selectedCategory !== "All" || sortBy !== "default") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mt-4 flex-wrap overflow-hidden"
              >
                {selectedCategory !== "All" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 border border-green-200 text-[#16A34A] px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                      boxShadow: "0 1px 4px rgba(34,197,94,0.15)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="hover:text-red-500 transition-colors ml-0.5 font-bold"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {sortBy !== "default" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 border border-green-200 text-[#16A34A] px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                      boxShadow: "0 1px 4px rgba(34,197,94,0.15)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    Sort: {sortBy === "priceLow" ? "Low → High" : "High → Low"}
                    <button
                      onClick={() => setSortBy("default")}
                      className="hover:text-red-500 transition-colors ml-0.5 font-bold"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                <button
                  onClick={() => { setSelectedCategory("All"); setSortBy("default"); }}
                  className="text-xs text-red-400 font-medium hover:text-red-600 hover:underline transition-colors ml-1"
                >
                  Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Divider ── */}
          <div className="mt-5 mb-5 relative">
            <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 rounded-full opacity-60"
              style={{ background: "linear-gradient(90deg, #22C55E, #4ADE80)" }}
            />
          </div>

          {/* ── Grid ── */}
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial={firstLoad ? false : "hidden"}
            animate="visible"
            className={`
              grid gap-5
              ${
                view === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1"
              }
            `}
          >
            {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}

            <AnimatePresence>
              {!loading &&
                paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    firstLoad={firstLoad}
                    view={view}
                  />
                ))}
            </AnimatePresence>
          </motion.div>

          {/* ── Empty State ── */}
          {!loading && paginatedProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                🛍️
              </div>
              <p className="text-gray-500 font-semibold">No products found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </motion.div>
          )}

          {/* ── Premium Pagination ── */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mt-10"
            >
              <p className="text-sm text-gray-500">
                Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
                <span className="font-semibold text-gray-700">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-[#22C55E] hover:text-[#22C55E] hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  ← Prev
                </motion.button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const active = page === currentPage;

                  return (
                    <motion.button
                      key={page}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 text-sm rounded-lg font-semibold transition-all duration-200 ${
                        active
                          ? "text-white border-transparent"
                          : "bg-white border border-gray-200 hover:border-[#22C55E] hover:text-[#22C55E] hover:bg-green-50 text-gray-600"
                      }`}
                      style={
                        active
                          ? {
                              background: "linear-gradient(135deg, #15803D 0%, #22C55E 100%)",
                              boxShadow: "0 4px 14px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                            }
                          : { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                      }
                    >
                      {page}
                    </motion.button>
                  );
                })}

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-[#22C55E] hover:text-[#22C55E] hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  Next →
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;