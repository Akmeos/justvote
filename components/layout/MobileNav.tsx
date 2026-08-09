"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, Trophy, PlayCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [showPlayArrow, setShowPlayArrow] = useState(false);

  useEffect(() => {
    const handleOnboardingCompleted = () => {
      setShowPlayArrow(true);
    };
    window.addEventListener("onboarding-completed", handleOnboardingCompleted);
    return () => window.removeEventListener("onboarding-completed", handleOnboardingCompleted);
  }, []);

  const navItems = [
    { label: "Tendances", href: "/trends", icon: Compass },
    { label: "Classement", href: "/leaderboard", icon: Trophy },
    { label: "Accueil", href: "/dashboard", icon: PlayCircle }, // Center glowing item
    { label: "Proposer", href: "/propose-quiz", icon: PlusCircle },
    { label: "Profil", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 px-6 py-4 pb-safe flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
      {navItems.map((item, index) => {
        const isCenter = index === 2;
        const isActive = pathname === item.href;

        return (
          <div key={item.href} className="relative flex flex-col items-center">
            {isCenter && showPlayArrow && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-xl border border-amber-300 whitespace-nowrap flex items-center gap-1">
                  <span>Joue ici !</span> 🚀
                </span>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-amber-400 -mt-0.5" />
              </div>
            )}

            <Link
              href={item.href}
              onClick={() => {
                if (isCenter) setShowPlayArrow(false);
              }}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isCenter 
                  ? "-mt-8 bg-gradient-to-tr from-primary to-primary-light text-white p-4 rounded-full shadow-float hover:scale-105 active:scale-95 ring-4 ring-purple-500/20" 
                  : isActive 
                  ? "text-primary font-black scale-105" 
                  : "text-gray-400 hover:text-primary font-medium"
              )}
            >
              <item.icon size={isCenter ? 26 : 22} className={cn("transition-transform duration-300", !isCenter && isActive && "scale-110")} />
              {!isCenter && <span className="text-[10px]">{item.label}</span>}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
