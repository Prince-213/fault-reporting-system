"use client";

import { useEffect } from "react";
import { ReminderService } from "@/src/services/reminderService";

export function ReminderProvider() {
  useEffect(() => {
    const reminderService = ReminderService.getInstance();
    return () => reminderService.stop();
  }, []);

  return null;
}
