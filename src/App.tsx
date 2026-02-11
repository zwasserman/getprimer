import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";
import HubPage from "@/pages/HubPage";
import ChatPage from "@/pages/ChatPage";
import TasksPage from "@/pages/TasksPage";

import ProsPage from "@/pages/ProsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const showTabBar = !location.pathname.startsWith("/onboarding");

  return (
    <>
      <Routes>
        <Route path="/" element={<HubPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        
        <Route path="/pros" element={<ProsPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showTabBar && <BottomTabBar />}
    </>
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
