"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, Shield, ShieldCheck, Menu } from "lucide-react";

interface DashboardUser {
  email: string;
  role: string;
}

export function DashboardHeader() {
  const [user, setUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    // Get user data from localStorage (in a real app, you'd use proper auth)
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getRoleIcon = (role: string) => {
    return role === "super-admin" ? (
      <ShieldCheck className="h-4 w-4" />
    ) : (
      <Shield className="h-4 w-4" />
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === "super-admin" ? "default" : "secondary";
  };

  const getInitials = (email: string) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <header className="sticky mb-10 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" w-[80%] mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-4">
          {/* Role Badge */}
          <Badge
            variant={getRoleBadgeVariant(user.role)}
            className="hidden sm:flex items-center gap-1"
          >
            {getRoleIcon(user.role)}
            {user.role === "super-admin" ? "Super Admin" : "Admin"}
          </Badge>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getRoleIcon(user.role)}
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.role === "super-admin" ? "Super Admin" : "Admin"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
