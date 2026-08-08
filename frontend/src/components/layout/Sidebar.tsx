interface SidebarProps {
  menuItems: string[];
}

function Sidebar({ menuItems }: SidebarProps) {
  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-slate-800 bg-slate-900 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item}
            className="rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;