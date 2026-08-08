import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const menuItems = [
    "Dashboard",
    "Live Map",
    "Prediction",
    "Simulation",
    "Analytics",
    "Settings",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar menuItems={menuItems} />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;