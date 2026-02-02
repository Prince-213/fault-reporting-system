"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFaultReports,
  delegateStaffToReport,
  confirmResolutionOfReport,
  fetchReportTeams,
  addTeam as addTeamAction,
} from "@/lib/queries/actions";

import {
  useDelegateStaff,
  useConfirmResolution,
} from "./useFaultReportMutation";


export function useFaultReports() {
  return useQuery({
    queryKey: ["faultReports"],
    queryFn: async () => {
      const data = await fetchFaultReports();
      return data || [];
    },
    // Optional: Add refetch interval for real-time updates
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/* export function useDelegateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      delegatedTo,
    }: {
      reportId: string;
      delegatedTo: string;
    }) => {
      const result = await delegateStaffToReport({ reportId, delegatedTo });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch fault reports after delegation
      queryClient.invalidateQueries({ queryKey: ["faultReports"] });
    },
  });
}

export function useConfirmResolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId }: { reportId: string }) => {
      const result = await confirmResolutionOfReport({ reportId });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch fault reports after resolution
      queryClient.invalidateQueries({ queryKey: ["faultReports"] });
    },
  });
} */

export function useReportTeams() {
  return useQuery({
    queryKey: ["reportTeams"],
    queryFn: async () => {
      const data = await fetchReportTeams();
      return data || [];
    },
    // Optional: Add refetch interval for real-time updates
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useAddTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamData: {
      name: string;
      specialty: string;
      email: string;
    }) => {
      const result = await addTeamAction({ reportData: teamData });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch teams after successful addition
      queryClient.invalidateQueries({ queryKey: ["reportTeams"] });
    },
    onError: (error) => {
      console.error("Failed to add team:", error);
    },
  });
}

export { useDelegateStaff, useConfirmResolution };
