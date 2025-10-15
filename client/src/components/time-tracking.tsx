import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTimer } from "@/hooks/use-timer";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TimeTracking() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isRunning, startTimer, stopTimer } = useTimer();
  
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: timeEntries } = useQuery({
    queryKey: ["/api/time-entries"],
  });

  const startTimerMutation = useMutation({
    mutationFn: async ({ projectId, description }: { projectId: string; description: string }) => {
      const response = await apiRequest("POST", "/api/timer/start", { projectId, description });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({ title: "Timer started", description: "Time tracking has begun" });
    },
  });

  const stopTimerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/timer/stop");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({ title: "Timer stopped", description: "Time entry saved" });
    },
  });

  const handleStartTimer = () => {
    if (!selectedProject || !taskDescription) {
      toast({
        title: "Missing information",
        description: "Please select a project and enter a task description",
        variant: "destructive"
      });
      return;
    }

    startTimerMutation.mutate({ projectId: selectedProject, description: taskDescription });
    startTimer();
  };

  const handleStopTimer = () => {
    stopTimerMutation.mutate();
    stopTimer();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const recentEntries = timeEntries?.slice(-3) || [];

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-stellar-white">
            {t("timetracking.title")}
          </CardTitle>
          <Button
            onClick={isRunning ? handleStopTimer : handleStartTimer}
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-neon-blue to-cosmic-accent hover:scale-105"
            }`}
            disabled={startTimerMutation.isPending || stopTimerMutation.isPending}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                {t("timer.stop")}
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t("timetracking.start")}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-300 mb-2">
            {t("timetracking.project")}
          </Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full bg-space-blue text-stellar-white border-neon-blue/30">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project: any) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task Description */}
        <div>
          <Label className="text-sm font-medium text-gray-300 mb-2">
            {t("timetracking.task")}
          </Label>
          <Input
            type="text"
            placeholder="What are you working on?"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full bg-space-blue text-stellar-white border-neon-blue/30"
          />
        </div>

        {/* Recent Time Entries */}
        <div>
          <h4 className="text-lg font-semibold text-stellar-white mb-4">
            {t("timetracking.recent")}
          </h4>
          <div className="space-y-3">
            {recentEntries.map((entry: any) => {
              const project = projects?.find((p: any) => p.id === entry.projectId);
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-space-blue/50 rounded-lg"
                >
                  <div>
                    <p className="text-stellar-white font-medium">{entry.description}</p>
                    <p className="text-gray-400 text-sm">{project?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neon-blue font-mono">
                      {formatDuration(entry.duration)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {entry.isRunning ? "Running" : new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
