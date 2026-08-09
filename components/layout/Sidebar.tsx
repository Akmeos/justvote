"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, User, Trophy, PlayCircle, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Tableau de bord", href: "/dashboard", icon: Home },
    { label: "Tendances", href: "/trends", icon: Compass },
    { label: "Classement", href: "/leaderboard", icon: Trophy },
    { label: "Proposer un quiz", href: "/propose-quiz", icon: PlusCircle },
    { label: "Admin", href: "/admin", icon: Settings },
    { label: "Profil", href: "/profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface h-screen sticky top-0 border-r border-gray-100 shadow-soft z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">J</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Just Vote
          </h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-500 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon size={20} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-gradient-to-br from-primary-light/20 to-primary/10 p-4 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-light rounded-full blur-2xl opacity-30 -mr-8 -mt-8"></div>
          <h3 className="font-bold text-gray-800 mb-1">Passer Premium</h3>
          <p className="text-xs text-gray-500 mb-3">Débloque des badges et stats exclusifs.</p>
          <button className="w-full bg-surface text-primary font-semibold text-sm py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
            Débloquer
          </button>
        </div>
      </div>
    </aside>
  );
}
