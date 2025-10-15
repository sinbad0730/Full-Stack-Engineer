import { StarfieldBackground } from "@/components/starfield-background";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { TimeTracking } from "@/components/time-tracking";
import { QuickInvoice } from "@/components/quick-invoice";
import { RecentActivity } from "@/components/recent-activity";
import { WeekSummary } from "@/components/week-summary";

export default function Dashboard() {
  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        <Header />
        
        <main className="p-6 space-y-6">
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeTracking />
            <QuickInvoice />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <WeekSummary />
          </div>
        </main>
      </div>
    </div>
  );
}
