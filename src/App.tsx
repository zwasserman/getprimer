import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";
import DesktopSidebar from "@/components/DesktopSidebar";
import HubPage from "@/pages/HubPage";
import TasksPage from "@/pages/TasksPage";
import ProsPage from "@/pages/ProsPage";
import MyHousePage from "@/pages/MyHousePage";
import HomeProfileDetailPage from "@/pages/HomeProfileDetailPage";
import OnboardingPage from "@/pages/OnboardingPage";
import ChatPage from "@/pages/ChatPage";
import NotFound from "./pages/NotFound";
import ChatModal from "@/components/ChatModal";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showTabBar = !location.pathname.startsWith("/onboarding");
  const [chatOpen, setChatOpen] = useState(false);
  const isChatRoute = location.pathname === "/chat";

  useEffect(() => {
    const handler = () => setChatOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar — hidden on mobile */}
      {showTabBar && <DesktopSidebar />}

      {/* Main content area */}
      <main className="flex-1 min-w-0 lg:max-h-screen lg:overflow-y-auto">
        <div className="lg:max-w-[900px] lg:mx-auto">
          <Routes>
            <Route path="/" element={<HubPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/pros" element={<ProsPage />} />
            <Route path="/my-house" element={<MyHousePage />} />
            <Route path="/my-house/profile" element={<HomeProfileDetailPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      {/* Floating chat bubble — desktop only, hidden on /chat */}
      {showTabBar && !isChatRoute && (
        <button
          onClick={() => navigate("/chat")}
          className="hidden lg:flex fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-elevated items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Mobile bottom tab bar — hidden on desktop */}
      {showTabBar && !chatOpen && <BottomTabBar onChatOpen={() => setChatOpen(true)} />}

      {/* Mobile chat modal — only on mobile */}
      <div className="lg:hidden">
        <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
