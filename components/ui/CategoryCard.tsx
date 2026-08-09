import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryCardProps {
  id: string;
  title: string;
  emoji: string;
  colorClass: string;
  className?: string;
}

export function CategoryCard({ id, title, emoji, colorClass, className }: CategoryCardProps) {
  return (
    <Link 
      href={`/categories/${id}`}
      className={cn("relative overflow-hidden rounded-3xl p-4 md:p-6 w-full h-[140px] md:h-[180px] flex flex-col justify-end shadow-soft cursor-pointer hover:shadow-float transition-all group", colorClass, className)}
    >
      <div className="absolute top-3 right-3 text-6xl md:text-7xl opacity-90 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
        {emoji}
      </div>
      <div className="relative z-10">
        <h4 className="text-white font-bold text-base md:text-lg leading-tight">{title}</h4>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </Link>
  );
}
