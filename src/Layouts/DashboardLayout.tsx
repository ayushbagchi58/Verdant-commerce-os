import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <div className="flex min-h-screen bg-gray-50">

  {/* Sidebar */}
  <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

  {/* Right Content Area */}
 <div className="flex flex-col flex-1 w-full min-w-0">

    {/* Header */}
    <Header toggleSidebar={() => setMobileOpen(true)} />

    {/* Main Content */}
<main className="flex-1 p-4 sm:p-6 w-full overflow-x-hidden relative z-0">
     <Outlet/>
    </main>

    {/* Footer */}
    <Footer />

  </div>

</div>
  );
};

export default DashboardLayout;
