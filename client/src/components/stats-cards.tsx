import { useQuery } from "@tanstack/react-query";
import { Clock, FileText, FolderOpen, DollarSign, TrendingUp, AlertTriangle, Plus } from "lucide-react";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass p-6 rounded-xl animate-pulse">
            <div className="h-16 bg-space-blue/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Hours",
      value: stats?.todayHours || "0.0",
      change: "+12% vs yesterday",
      changeType: "positive",
      icon: Clock,
      gradient: "from-neon-blue to-cosmic-accent",
    },
    {
      title: "Pending Invoices",
      value: stats?.pendingInvoices || "0",
      change: "5 overdue",
      changeType: "warning",
      icon: FileText,
      gradient: "from-cosmic-accent to-purple-600",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects || "0",
      change: "3 new this week",
      changeType: "info",
      icon: FolderOpen,
      gradient: "from-green-400 to-blue-500",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.monthlyRevenue || "0"}`,
      change: "+8% vs last month",
      changeType: "positive",
      icon: DollarSign,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <Plus className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="glass p-6 rounded-xl cosmic-glow animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-neon-blue mt-2">
                  {card.value}
                </p>
                <p className={`text-sm mt-1 flex items-center gap-1 ${getChangeColor(card.changeType)}`}>
                  {getChangeIcon(card.changeType)}
                  {card.change}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-full flex items-center justify-center`}>
                <Icon className="text-stellar-white text-xl" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
