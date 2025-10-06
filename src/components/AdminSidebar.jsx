import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  Settings,
  Shield,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    permission: "view_dashboard"
  },
  {
    title: "Consultants",
    href: "/admin/consultants",
    icon: UserCheck,
    permission: "manage_consultants"
  },
  {
    title: "Seekers",
    href: "/admin/seekers",
    icon: Users,
    permission: "manage_seekers"
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    permission: "view_analytics"
  },
  {
    title: "Admin Management",
    href: "/admin/admins",
    icon: Shield,
    permission: "system_admin"
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: "manage_settings"
  },
  {
    title: "Logs",
    href: "/admin/logs",
    icon: FileText,
    permission: "view_logs"
  }
];

export default function AdminSidebar({ adminData, onLogout, className }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    onLogout();
  };

  const hasPermission = (permission) => {
    return adminData?.permissions?.includes(permission) || false;
  };

  const filteredNavItems = adminNavItems.filter(item => hasPermission(item.permission));

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-brand-teal" />
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">The Consultant</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-brand-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{adminData?.fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">{adminData?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-teal text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 