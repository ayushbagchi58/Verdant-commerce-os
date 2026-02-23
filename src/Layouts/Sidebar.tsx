import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Injected Styles ──────────────────────────────────────────────────────────

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  .sb-outfit { font-family: 'Outfit', sans-serif; }
  .sb-mono   { font-family: 'Space Mono', monospace; }

  @keyframes sb-fadein {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes sb-pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
  }

  .sb-nav-item { animation: sb-fadein 0.25s cubic-bezier(0.16,1,0.3,1) both; }
  .sb-nav-item:nth-child(1) { animation-delay: 0.04s; }
  .sb-nav-item:nth-child(2) { animation-delay: 0.08s; }
  .sb-nav-item:nth-child(3) { animation-delay: 0.12s; }

  .sb-active-indicator {
    background: linear-gradient(135deg, #16a34a, #22c55e);
    box-shadow: 0 0 12px rgba(34,197,94,0.4);
  }
  .sb-active-bg {
    background: linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(74,222,128,0.05) 100%);
  }
  .sb-hover-bg:hover {
    background: rgba(34,197,94,0.06);
  }
  .sb-hover-bg:hover .sb-nav-label {
    color: #16a34a;
  }
  .sb-hover-bg:hover .sb-nav-icon {
    background: rgba(34,197,94,0.1);
    color: #16a34a;
  }
  .sb-collapse-btn:hover {
    background: rgba(34,197,94,0.08);
    color: #16a34a;
    border-color: rgba(34,197,94,0.25);
  }
  .sb-tooltip-popup {
    animation: sb-fadein 0.15s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sb-status-dot {
    animation: sb-pulse-dot 2.5s infinite;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
}

// ─── Menu Config ──────────────────────────────────────────────────────────────

const MENU: NavItem[] = [
  {
    section: "Overview",
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={17} strokeWidth={1.75} />,
  },
  {
    section: "Catalogue",
    name: "Products",
    path: "/products",
    icon: <Package size={17} strokeWidth={1.75} />,
  },
  {
    name: "Add Product",
    path: "/products/add",
    icon: <PackagePlus size={17} strokeWidth={1.75} />,
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

const SidebarLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex items-center gap-2.5 select-none">
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: 36,
        height: 36,
        background:
          "linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)",
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        boxShadow:
          "0 0 0 1.5px rgba(34,197,94,0.3), 0 4px 16px rgba(34,197,94,0.3)",
      }}
    >
      <div
        style={{
          width: 13,
          height: 13,
          border: "2px solid rgba(255,255,255,0.9)",
          clipPath:
            "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          background: "rgba(255,255,255,0.15)",
        }}
      />
    </div>

    {!collapsed && (
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="sb-outfit font-bold text-[17px] tracking-[-0.4px] leading-none whitespace-nowrap">
          <span
            style={{
              background: "linear-gradient(135deg, #111827, #374151)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Verd
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ant
          </span>
        </span>
        <span className="sb-mono text-[7.5px] tracking-[1.5px] uppercase text-gray-400 leading-none whitespace-nowrap">
          Commerce OS
        </span>
      </div>
    )}
  </div>
);

// ─── Sidebar Component ────────────────────────────────────────────────────────

interface Props {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [tooltipItem, setTooltipItem] = useState<{
    name: string;
    y: number;
  } | null>(null);

  // Group items by section
  const grouped: { section: string | null; items: NavItem[] }[] = [];
  let currentGroup: { section: string | null; items: NavItem[] } | null = null;
  for (const item of MENU) {
    if (item.section) {
      currentGroup = { section: item.section, items: [item] };
      grouped.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.items.push(item);
    } else {
      currentGroup = { section: null, items: [item] };
      grouped.push(currentGroup);
    }
  }

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    name: string,
  ) => {
    if (!collapsed) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setTooltipItem({ name, y: rect.top + rect.height / 2 });
  };

  return (
    <>
      <style>{SIDEBAR_STYLES}</style>

      {/* Mobile/Tablet Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          style={{ backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
    <aside
  className={`
    fixed lg:relative
    top-0 left-0
    lg:h-auto
    h-screen
    flex flex-col
    self-stretch
    border-r border-black/[0.06]
    transition-all duration-300 ease-in-out
    z-50

    ${collapsed ? "w-[72px]" : "w-[256px]"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fafffe 100%)",
          boxShadow: "2px 0 24px rgba(0,0,0,0.04), 1px 0 0 rgba(0,0,0,0.05)",
        }}
      >
        {/* ── Logo + Collapse ── */}
        <div className="relative flex items-center justify-between h-16 border-b border-black/[0.06] flex-shrink-0 px-4">
          <SidebarLogo collapsed={collapsed} />

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sb-collapse-btn flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 transition-all duration-200 border border-transparent flex-shrink-0"
          >
            {collapsed ? (
              <ChevronRight size={14} strokeWidth={2.5} />
            ) : (
              <ChevronLeft size={14} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-2.5"
          style={{ scrollbarWidth: "none", overflowX: "visible" }}
        >
          {grouped.map(({ section, items }) => (
            <div key={section ?? "root"} className="mb-1">
              {/* Section Label */}
              {section && !collapsed && (
                <div className="px-3 pb-1.5 pt-3 first:pt-0">
                  <span className="sb-mono text-[9px] uppercase text-gray-400 font-semibold tracking-[0.1em]">
                    {section}
                  </span>
                </div>
              )}
              {section && collapsed && (
                <div className="my-2 mx-2 h-px bg-gray-100" />
              )}

              {/* Nav Items */}
              {items.map((item) => (
                <div
                  key={item.path}
                  className="sb-nav-item relative"
                  onMouseEnter={(e) => handleMouseEnter(e, item.name)}
                  onMouseLeave={() => setTooltipItem(null)}
                >
                  <NavLink
                    to={item.path}
                    end={item.path === "/products"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3
                      px-3 py-2.5 rounded-xl
                      transition-all duration-150 cursor-pointer
                      ${isActive ? "sb-active-bg" : "sb-hover-bg"}
                      ${collapsed ? "justify-center" : ""}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active left bar */}
                        {isActive && (
                          <span
                            className="sb-active-indicator absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                            style={{ height: "60%" }}
                          />
                        )}

                        {/* Icon */}
                        <span
                          className={`sb-nav-icon flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 ${
                            isActive
                              ? "bg-green-500 text-white"
                              : "text-gray-400"
                          }`}
                          style={
                            isActive
                              ? { boxShadow: "0 2px 10px rgba(34,197,94,0.35)" }
                              : {}
                          }
                        >
                          {item.icon}
                        </span>

                        {/* Label */}
                        {!collapsed && (
                          <span
                            className={`sb-nav-label sb-outfit text-[13.5px] font-medium truncate leading-none ${
                              isActive ? "text-green-700" : "text-gray-600"
                            }`}
                          >
                            {item.name}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Status Card ── */}
        {!collapsed && (
          <div className="flex-shrink-0 px-3 pb-4">
            <div
              className="rounded-2xl p-3.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(74,222,128,0.04) 100%)",
                border: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="sb-status-dot w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#22c55e" }}
                />
                <span className="sb-outfit text-[12px] font-semibold text-gray-700">
                  System Status
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Uptime", value: "99.9%" },
                  { label: "API Health", value: "Nominal" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="sb-outfit text-[11px] text-gray-400">
                      {label}
                    </span>
                    <span className="sb-mono text-[10px] text-green-600 font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex-shrink-0 flex justify-center pb-4">
            <span
              className="sb-status-dot w-2 h-2 rounded-full"
              style={{ background: "#22c55e" }}
            />
          </div>
        )}
      </aside>

      {/* ── Tooltip Portal — rendered outside sidebar so it never clips ── */}
      {collapsed && tooltipItem && (
        <div
          className="sb-tooltip-popup pointer-events-none fixed z-[9999]"
          style={{
            left: 84,
            top: tooltipItem.y,
            transform: "translateY(-50%)",
          }}
        >
          {/* Arrow */}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: "6px solid white",
              filter: "drop-shadow(-1px 0 1px rgba(0,0,0,0.06))",
            }}
          />
          <div
            className="sb-outfit text-[12px] font-medium text-gray-800 whitespace-nowrap px-3 py-1.5 rounded-lg"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            {tooltipItem.name}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
