import { Home, MessageCircle, CheckCircle, Wrench, Building2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/tasks", label: "Tasks", icon: CheckCircle },
  { path: "/my-house", label: "My House", icon: Building2 },
  { path: "/pros", label: "Pros", icon: Wrench },
];

interface BottomTabBarProps {
  onChatOpen?: () => void;
}

const BottomTabBar = ({ onChatOpen }: BottomTabBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (path: string) => {
    if (path === "/chat" && onChatOpen) {
      onChatOpen();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <nav className="flex items-center gap-0.5 bg-card rounded-full px-2 py-2 shadow-elevated">
        {tabs.map((tab) => {
          const isActive = tab.path === "/chat" ? false : location.pathname.startsWith(tab.path) && (tab.path !== "/" || location.pathname === "/");
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-full transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-active"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={20} className="relative z-10" />
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  className="text-xs font-semibold relative z-10 whitespace-nowrap"
                >
                  {tab.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomTabBar;
