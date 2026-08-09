import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, subtitle, icon, className, trend }: StatCardProps) {
  return (
    <div className={cn("p-5 rounded-3xl bg-surface shadow-soft flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-gray-700">
          {icon}
        </div>
        {trend === "up" && <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">+12%</span>}
        {trend === "down" && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">-4%</span>}
      </div>
      <div>
        <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
