
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/types";
import { Home, User, Users, CalendarDays, Settings, Brain, Briefcase, CalendarClock, Users2, Presentation, Tv2 } from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  user: UserProfile | null;
}

export function SidebarNav({ className, user, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  const commonItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const menteeItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/mentors", label: "Find Mentors", icon: Users },
    { href: "/dashboard/schedule", label: "My Schedule", icon: CalendarDays },
    { href: "/dashboard/recommendations", label: "AI Suggestions", icon: Brain },
    { href: "/dashboard/group-sessions", label: "Browse Group Sessions", icon: Presentation },
    { href: "/dashboard/webinars", label: "Browse Webinars", icon: Tv2 },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const mentorItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/availability", label: "Set Availability", icon: CalendarClock },
    { href: "/dashboard/schedule", label: "My Schedule", icon: CalendarDays },
    { href: "/dashboard/my-group-sessions", label: "My Group Sessions", icon: Users2 },
    { href: "/dashboard/my-webinars", label: "My Webinars", icon: Tv2 },
    { href: "/dashboard/mentees", label: "My Mentees", icon: Briefcase },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const items = user?.role === "mentor" ? mentorItems : (user?.role === "mentee" ? menteeItems : commonItems);
  // Deduplicate items based on href, keeping the order of the role-specific list
  const uniqueItems = items.reduce((acc, current) => {
    if (!acc.find(item => item.href === current.href)) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof items);


  return (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-2 bg-sidebar rounded-lg shadow-sm text-sidebar-foreground",
        className
      )}
      {...props}
    >
      {uniqueItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href ? "default" : "ghost"}
          className={cn(
            "w-full justify-start",
            pathname === item.href
              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
          )}
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
