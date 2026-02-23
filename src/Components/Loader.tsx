import React from "react";
import Logo from "../../public/logo.png"; // adjust path

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-6">

        {/* Logo with subtle glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl animate-pulse" />

          <div className="relative flex items-center justify-center w-28 h-28 rounded-2xl bg-white border border-gray-200 shadow-xl">
            <img
              src={Logo}
              alt="Verdant Commerce OS"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-wide text-gray-800">
            Verdant
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Commerce OS
          </p>
        </div>

      <div className="relative flex items-center justify-center">
  <div className="w-10 h-10 rounded-full border-2 border-gray-300" />
  <div className="absolute w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
</div>

        {/* Status text */}
        <p className="text-sm text-gray-500 tracking-wide animate-pulse">
          Preparing your workspace…
        </p>
      </div>
    </div>
  );
};

export default Loader;