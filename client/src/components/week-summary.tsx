import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3 } from "lucide-react";

export function WeekSummary() {
  const { t } = useLanguage();

  const { data: timeEntries } = useQuery({
    queryKey: ["/api/time-entries"],
  });

  const { data: invoices } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Calculate this week's stats
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekEntries = timeEntries?.filter((entry: any) => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= weekStart;
  }) || [];

  const thisWeekInvoices = invoices?.filter((invoice: any) => {
    const invoiceDate = new Date(invoice.createdAt);
    return invoiceDate >= weekStart;
  }) || [];

  const weeklyHours = thisWeekEntries.reduce((sum: number, entry: any) => sum + entry.duration, 0) / 60;
  const weeklyRevenue = thisWeekInvoices.reduce((sum: number, invoice: any) => sum + parseFloat(invoice.total), 0);

  const stats = [
    {
      label: t("stats.hours_logged"),
      value: `${weeklyHours.toFixed(1)}h`,
      percentage: Math.min((weeklyHours / 50) * 100, 100), // Target: 50h per week
      target: "50h",
    },
    {
      label: t("stats.invoices_sent"),
      value: thisWeekInvoices.length.toString(),
      percentage: Math.min((thisWeekInvoices.length / 12) * 100, 100), // Target: 12 invoices per week
      target: "12",
    },
    {
      label: t("stats.revenue_generated"),
      value: `$${weeklyRevenue.toFixed(0)}`,
      percentage: Math.min((weeklyRevenue / 8000) * 100, 100), // Target: $8000 per week
      target: "$8,000",
    },
  ];

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-stellar-white">
          {t("stats.week_summary")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {stats.map((stat, index) => (
          <div key={stat.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <span className="text-stellar-white font-mono">{stat.value}</span>
            </div>
            <div className="w-full bg-space-blue rounded-full h-2">
              <div
                className="bg-gradient-to-r from-neon-blue to-cosmic-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {stat.percentage.toFixed(0)}% of target ({stat.target})
            </p>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="mt-6 space-y-3">
          <Button className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-cosmic-accent font-medium hover:scale-105 transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            {t("actions.new_project")}
          </Button>
          <Button className="w-full px-4 py-3 bg-gradient-to-r from-cosmic-accent to-purple-600 font-medium hover:scale-105 transition-all duration-300">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("actions.view_reports")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
