import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, UserPlus } from "lucide-react";

export function RecentActivity() {
  const { t } = useLanguage();

  const { data: timeEntries } = useQuery({
    queryKey: ["/api/time-entries"],
  });

  const { data: invoices } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Combine and sort recent activities
  const activities = [
    ...(timeEntries?.slice(-5).map((entry: any) => ({
      id: entry.id,
      type: "time_entry",
      title: "Time entry logged",
      description: `${entry.description} - ${Math.floor(entry.duration / 60)}h ${entry.duration % 60}m`,
      time: entry.createdAt,
      status: "logged",
      icon: Clock,
      gradient: "from-neon-blue to-cosmic-accent",
    })) || []),
    ...(invoices?.slice(-3).map((invoice: any) => ({
      id: invoice.id,
      type: "invoice",
      title: `Invoice ${invoice.invoiceNumber} generated`,
      description: `$${invoice.total}`,
      time: invoice.createdAt,
      status: "completed",
      icon: FileText,
      gradient: "from-green-400 to-blue-500",
    })) || []),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-400/20 text-green-400";
      case "logged":
        return "bg-blue-400/20 text-blue-400";
      case "new":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "bg-gray-400/20 text-gray-400";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-stellar-white">
          {t("activity.title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No recent activity
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-space-blue/30 rounded-lg"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${activity.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-stellar-white w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-stellar-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatTimeAgo(activity.time)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
