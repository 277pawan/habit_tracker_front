import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Identity from "./pages/Identity";
import Habits from "./pages/Habits";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Boosts from "./pages/Boosts";
import Reflection from "./pages/Reflection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const IndexRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    navigate(token ? '/dashboard' : '/login');
  }, [navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/identity" element={<Identity />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/boosts" element={<Boosts />} />
          <Route path="/reflection" element={<Reflection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
