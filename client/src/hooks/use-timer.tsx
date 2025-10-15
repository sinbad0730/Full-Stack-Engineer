import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

export function useTimer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  const { data: runningEntry } = useQuery({
    queryKey: ["/api/time-entries/running"],
    refetchInterval: 5000, // Check every 5 seconds
  });

  useEffect(() => {
    if (runningEntry && runningEntry.isRunning) {
      setIsRunning(true);
      startTimeRef.current = new Date(runningEntry.startTime).getTime();
      
      // Calculate elapsed time from start time
      const updateElapsed = () => {
        if (startTimeRef.current) {
          const now = Date.now();
          setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));
        }
      };

      updateElapsed();
      intervalRef.current = setInterval(updateElapsed, 1000);
    } else {
      setIsRunning(false);
      setElapsedTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [runningEntry]);

  const startTimer = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));
      }
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return {
    elapsedTime,
    isRunning,
    startTimer,
    stopTimer,
  };
}
