import { Home, MessageCircle, CheckCircle, Building2, Wrench, Settings, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/tasks", label: "Tasks", icon: CheckCircle },
  { path: "/my-house", label: "My House", icon: Building2 },
  { path: "/pros", label: "Pros", icon: Wrench },
];

const bottomItems = [
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/profile", label: "Profile", icon: User },
];

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[240px] h-screen bg-card border-r border-border/50 flex-shrink-0 sticky top-0">
      {/* Home address header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🏠</span>
          </div>
          <div className="min-w-0">
            <p className="text-body-small font-semibold text-foreground truncate">1234 Elm Street</p>
            <p className="text-caption text-muted-foreground">Yardley, PA 19067</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border/30" />

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 h-11 rounded-xl text-left transition-colors ${
                active
                  ? "bg-background text-primary font-semibold"
                  : "text-foreground hover:bg-background"
              }`}
            >
              <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
              <span className="text-body-small">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-border/30" />

      {/* Bottom items */}
      <div className="px-3 py-3 flex flex-col gap-0.5">
        {bottomItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 h-11 rounded-xl text-left transition-colors ${
                active
                  ? "bg-background text-primary font-semibold"
                  : "text-foreground hover:bg-background"
              }`}
            >
              <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
              <span className="text-body-small">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
