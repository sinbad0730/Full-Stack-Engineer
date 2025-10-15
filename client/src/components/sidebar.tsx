import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Clock, 
  FileText, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Settings,
  Rocket
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { t, currentLanguage, setLanguage } = useLanguage();

  const navItems = [
    { href: "/", icon: BarChart3, label: "nav.dashboard" },
    { href: "/time-tracking", icon: Clock, label: "nav.time_tracking" },
    { href: "/invoices", icon: FileText, label: "nav.invoices" },
    { href: "/customers", icon: Users, label: "nav.customers" },
    { href: "/projects", icon: FolderOpen, label: "nav.projects" },
    { href: "/reports", icon: TrendingUp, label: "nav.reports" },
    { href: "/settings", icon: Settings, label: "nav.settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass z-40 p-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-cosmic-accent flex items-center justify-center cosmic-glow">
          <Rocket className="text-stellar-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-stellar-white">CosmicDesk</h1>
          <p className="text-xs text-gray-400">Customer Service Hub</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cosmic-purple to-neon-blue text-stellar-white cosmic-glow"
                  : "hover:bg-space-blue text-gray-300 hover:text-stellar-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{t(item.label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Selector */}
      <div className="mt-8 p-4 glass rounded-lg">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("settings.language")}
        </label>
        <Select value={currentLanguage} onValueChange={setLanguage}>
          <SelectTrigger className="w-full bg-space-blue text-stellar-white border-neon-blue/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">🇺🇸 English</SelectItem>
            <SelectItem value="es">🇪🇸 Español</SelectItem>
            <SelectItem value="fr">🇫🇷 Français</SelectItem>
            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
