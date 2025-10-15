import { useTimer } from "@/hooks/use-timer";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { User, Square } from "lucide-react";

export function Header() {
  const { t } = useLanguage();
  const { elapsedTime, isRunning, stopTimer } = useTimer();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="glass p-6 border-b border-neon-blue/20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stellar-white">
            {t("dashboard.title")}
          </h2>
          <p className="text-gray-400 mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Timer */}
          {isRunning && (
            <div className="glass p-4 rounded-lg cosmic-glow">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm text-gray-400">{t("timer.current")}</p>
                  <p className="font-mono text-lg text-neon-blue">
                    {formatTime(elapsedTime)}
                  </p>
                </div>
                <Button
                  onClick={stopTimer}
                  size="sm"
                  variant="destructive"
                  className="px-4 py-2"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-accent to-neon-blue flex items-center justify-center">
              <User className="text-stellar-white w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-stellar-white">Sarah Chen</p>
              <p className="text-xs text-gray-400">CS Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
