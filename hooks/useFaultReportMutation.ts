"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  delegateStaffToReport,
  confirmResolutionOfReport,
} from "@/lib/queries/actions";

// Type definitions matching your server actions
interface DelegateStaffParams {
  reportId: string;
  delegatedTo: string;
}

interface ConfirmResolutionParams {
  reportId: string;
}

export function useDelegateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, delegatedTo }: DelegateStaffParams) => {
      const result = await delegateStaffToReport({ reportId, delegatedTo });

      // Check if there was an error
      if (result instanceof Error) {
        throw new Error("Failed to delegate staff");
      }

      return result;
    },
    onMutate: async ({ reportId, delegatedTo }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["faultReports"] });

      // Snapshot the previous value
      const previousReports = queryClient.getQueryData(["faultReports"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["faultReports"], (old: any) => {
        return old.map((report: any) =>
          report.id === reportId
            ? {
                ...report,
                status: "delegated",
                delegated_to: delegatedTo,
                delegated_at: new Date().toISOString(),
              }
            : report,
        );
      });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousReports) {
        queryClient.setQueryData(["faultReports"], context.previousReports);
      }

      // Show error toast or notification
      console.error("Failed to delegate staff:", err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["faultReports"] });
    },
  });
}

export function useConfirmResolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId }: ConfirmResolutionParams) => {
      const result = await confirmResolutionOfReport({ reportId });

      // Check if there was an error
      if (result instanceof Error) {
        throw new Error("Failed to confirm resolution");
      }

      return result;
    },
    onMutate: async ({ reportId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["faultReports"] });

      // Snapshot the previous value
      const previousReports = queryClient.getQueryData(["faultReports"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["faultReports"], (old: any) => {
        return old.map((report: any) =>
          report.id === reportId
            ? {
                ...report,
                status: "resolved",
                resolved_at: new Date().toISOString(),
              }
            : report,
        );
      });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousReports) {
        queryClient.setQueryData(["faultReports"], context.previousReports);
      }

      // Show error toast or notification
      console.error("Failed to confirm resolution:", err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["faultReports"] });
    },
  });
}
