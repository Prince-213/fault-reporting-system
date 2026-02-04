"use client";
// pages/Dashboard.tsx - Admin dashboard homepage
import React from "react";
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  ChevronRight,
  Activity,
  Shield,
  MapPin,
  Building,
} from "lucide-react";
import Link from "next/link";
import { useFaultReports } from "@/hooks/useFaultReports";

const Dashboard: React.FC = () => {
  const { data: faultReports, isLoading, error, refetch } = useFaultReports();

  // Calculate stats from faultReports data
  const calculateStats = () => {
    if (!faultReports) return null;

    const totalComplaints = faultReports.length;
    const pendingReview = faultReports.filter(
      (report) => report.status === "pending",
    ).length;
    const inProgress = faultReports.filter(
      (report) => report.status === "delegated",
    ).length;
    const resolved = faultReports.filter(
      (report) => report.status === "resolved",
    ).length;

    // Calculate percentage changes (example - in real app you might want to compare with previous period)
    const totalChange = "+" + Math.round((totalComplaints / 100) * 12) + "%"; // Example calculation
    const pendingChange = pendingReview > 10 ? "+5%" : "-2%";
    const inProgressChange = inProgress > 5 ? "+23%" : "-5%";
    const resolvedChange = resolved > 800 ? "+8%" : "-3%";

    return {
      totalComplaints,
      pendingReview,
      inProgress,
      resolved,
      totalChange,
      pendingChange,
      inProgressChange,
      resolvedChange,
    };
  };

  const statsData = calculateStats();

  const stats = [
    {
      title: "Total Complaints",
      value: statsData?.totalComplaints?.toString() || "0",
      change: statsData?.totalChange || "+0%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Pending Review",
      value: statsData?.pendingReview?.toString() || "0",
      change: statsData?.pendingChange || "+0%",
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "In Progress",
      value: statsData?.inProgress?.toString() || "0",
      change: statsData?.inProgressChange || "+0%",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Resolved",
      value: statsData?.resolved?.toString() || "0",
      change: statsData?.resolvedChange || "+0%",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  // Get severity distribution
  const getSeverityDistribution = () => {
    if (!faultReports) return { critical: 0, high: 0, medium: 0, low: 0 };

    return {
      critical: faultReports.filter((report) => report.severity === "critical")
        .length,
      high: faultReports.filter((report) => report.severity === "high").length,
      medium: faultReports.filter((report) => report.severity === "medium")
        .length,
      low: faultReports.filter((report) => report.severity === "low").length,
    };
  };

  // Get recent complaints from faultReports
  const getRecentComplaints = () => {
    if (!faultReports) return [];

    // Sort by timestamp descending and take first 5
    const sorted = [...faultReports]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 5);

    return sorted.map((report) => ({
      id: report.id.slice(0, 8).toUpperCase(),
      category: report.fault_type,
      urgency:
        report.severity.charAt(0).toUpperCase() + report.severity.slice(1),
      location: report.location,
      time: formatTimeAgo(report.timestamp),
      status: report.status,
    }));
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const reportTime = new Date(timestamp);
    const diffMs = now.getTime() - reportTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Get team performance based on delegation
  const getTeamPerformance = () => {
    if (!faultReports) return [];

    // Count complaints by team/assigned_to
    const teamStats = faultReports.reduce(
      (acc, report) => {
        if (report.delegated_to) {
          if (!acc[report.delegated_to]) {
            acc[report.delegated_to] = {
              name: report.delegated_to,
              complaints: 0,
              resolved: 0,
              pending: 0,
            };
          }
          acc[report.delegated_to].complaints++;
          if (report.status === "resolved") {
            acc[report.delegated_to].resolved++;
          } else if (report.status === "delegated") {
            acc[report.delegated_to].pending++;
          }
        }
        return acc;
      },
      {} as Record<
        string,
        { name: string; complaints: number; resolved: number; pending: number }
      >,
    );

    // Convert to array and calculate efficiency
    return Object.values(teamStats).map((team, index) => ({
      id: index + 1,
      name: team.name,
      members: Math.floor(Math.random() * 5) + 3, // Mock data for members
      active: team.pending,
      complaints: team.complaints,
      efficiency:
        team.complaints > 0
          ? Math.round((team.resolved / team.complaints) * 100)
          : 100,
    }));
  };

  const teams = getTeamPerformance();
  const recentComplaints = getRecentComplaints();
  const severityDistribution = getSeverityDistribution();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "delegated":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyLower = urgency?.toLowerCase();
    switch (urgencyLower) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Skeleton Loading Component (same as before)
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-20 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const RecentComplaintsSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4].map((index) => (
                <th key={index} className="text-left py-3 px-6">
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((rowIndex) => (
              <tr key={rowIndex} className="border-b">
                <td className="py-4 px-6">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const TeamPerformanceSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((teamIndex) => (
            <div key={teamIndex} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="h-5 w-40 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-5 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden animate-pulse">
                  <div
                    className="h-full bg-gray-300"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HeaderSkeleton = () => (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-blue-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <HeaderSkeleton />
        <StatsSkeleton />
        <div className="grid lg:grid-cols-2 gap-8">
          <RecentComplaintsSkeleton />
          <TeamPerformanceSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">Error loading data</h3>
          </div>
          <p className="text-red-600 mt-2">
            Failed to load fault reports. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Fault Reports Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time overview of all system faults and team performance
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Refresh Data
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 border dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                <p className="text-2xl font-bold dark:text-gray-100">
                  {statsData?.totalComplaints || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {severityDistribution.critical}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Response Time</p>
                <p className="text-2xl font-bold dark:text-gray-100">4.2h</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {statsData?.totalComplaints
                    ? Math.round(
                        (statsData.resolved / statsData.totalComplaints) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-black rounded-xl shadow-sm p-6 border dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} dark:bg-opacity-20 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color} dark:opacity-90`} />
                </div>
                <div
                  className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Complaints */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Complaints
            </h2>
            <Link
              href="/dashboard/complaints"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All <ChevronRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Urgency
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {faultReports?.slice(0, 3)?.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium truncate text-gray-900 dark:text-gray-100">
                        {complaint.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {complaint.time}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium dark:text-gray-200">
                        {complaint.category}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {complaint.location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(complaint.severity)}`}
                      >
                        {complaint.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}
                      >
                        {complaint.status.replace("-", " ").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Team Performance
            </h2>
            <Link
              href="/dashboard/teams"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              Manage Teams <ChevronRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {team.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <Users className="inline h-4 w-4 mr-1" />
                          {team.members} members
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          <Activity className="inline h-4 w-4 mr-1" />
                          {team.active} active
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">
                          <AlertTriangle className="inline h-4 w-4 mr-1" />
                          {team.complaints} complaints
                        </div>
                      </div>
                    </div>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {team.efficiency}% Efficiency
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Workload</span>
                      <span>{team.complaints} tasks</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          team.complaints > 10
                            ? "bg-red-500"
                            : team.complaints > 5
                              ? "bg-orange-500"
                              : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(team.complaints * 8, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Severity Distribution Chart */}
      <div className="mt-8 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Severity Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Critical
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {severityDistribution.critical}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <div className="mt-2 h-2 bg-red-200 dark:bg-red-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{
                  width: `${statsData?.totalComplaints ? (severityDistribution.critical / statsData.totalComplaints) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  High
                </div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {severityDistribution.high}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500 dark:text-orange-400" />
            </div>
            <div className="mt-2 h-2 bg-orange-200 dark:bg-orange-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{
                  width: `${statsData?.totalComplaints ? (severityDistribution.high / statsData.totalComplaints) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  Medium
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {severityDistribution.medium}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="mt-2 h-2 bg-yellow-200 dark:bg-yellow-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{
                  width: `${statsData?.totalComplaints ? (severityDistribution.medium / statsData.totalComplaints) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Low
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {severityDistribution.low}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
            <div className="mt-2 h-2 bg-green-200 dark:bg-green-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${statsData?.totalComplaints ? (severityDistribution.low / statsData.totalComplaints) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
