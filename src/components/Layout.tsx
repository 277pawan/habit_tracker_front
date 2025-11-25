import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Target,
  Calendar,
  BarChart3,
  Zap,
  BookOpen,
  LogOut,
  BookOpenCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { TabsList } from "@radix-ui/react-tabs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    api.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/identity", icon: BookOpenCheck, label: "Identity" },
    { path: "/habits", icon: Target, label: "Habits" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/boosts", icon: Zap, label: "Boosts" },
    { path: "/reflection", icon: BookOpen, label: "Reflect" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <BookOpenCheck className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Habit Identity
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 p-2"
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
