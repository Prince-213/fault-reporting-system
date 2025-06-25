"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Alert as UIAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Clock,
  User,
  MapPin,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboardHeader";

interface FaultReport {
  id: string;
  reporterName: string;
  phoneNumber: string;
  location: string;
  faultType: string;
  description: string;
  severity: string;
  timestamp: string;
  status: "pending" | "delegated" | "resolved";
  delegatedTo: string | null;
  delegatedAt: string | null;
  resolvedAt: string | null;
}

interface SystemAlert {
  id: string;
  type: "delegation_overdue" | "resolution_overdue";
  reportId: string;
  message: string;
  timestamp: string;
}

interface User {
  email: string;
  role: string;
}

export default function SuperAdminDashboard() {
  const [reports, setReports] = useState<FaultReport[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  const loadReports = () => {
    const savedReports = JSON.parse(
      localStorage.getItem("faultReports") || "[]"
    );
    setReports(savedReports);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      loadReports();
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      window.location.href = "/login";
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const checkForAlerts = () => {
    const savedReports = JSON.parse(
      localStorage.getItem("faultReports") || "[]"
    );
    const now = new Date();
    const newAlerts: SystemAlert[] = [];

    savedReports.forEach((report: FaultReport) => {
      const reportTime = new Date(report.timestamp);
      const timeSinceReport =
        (now.getTime() - reportTime.getTime()) / (1000 * 60); // in minutes

      // Check for delegation overdue (more than 1 minute without delegation)
      if (report.status === "pending" && timeSinceReport > 1) {
        const alertMessage = `ALERT: Report ${report.id} at ${report.location} has not been delegated for ${Math.floor(timeSinceReport)} minutes!`;
        console.log(`🚨 DELEGATION OVERDUE: ${alertMessage}`);

        newAlerts.push({
          id: `delegation_${report.id}`,
          type: "delegation_overdue",
          reportId: report.id,
          message: alertMessage,
          timestamp: now.toISOString(),
        });
      }

      // Check for resolution overdue (delegated but not resolved)
      if (report.status === "delegated" && report.delegatedAt) {
        const delegationTime = new Date(report.delegatedAt);
        const timeSinceDelegation =
          (now.getTime() - delegationTime.getTime()) / (1000 * 60); // in minutes

        // Alert if delegated for more than 5 minutes without resolution (you can adjust this threshold)
        if (timeSinceDelegation > 5) {
          const alertMessage = `ALERT: Report ${report.id} delegated to ${report.delegatedTo} has not been resolved for ${Math.floor(timeSinceDelegation)} minutes!`;
          console.log(`🚨 RESOLUTION OVERDUE: ${alertMessage}`);

          newAlerts.push({
            id: `resolution_${report.id}`,
            type: "resolution_overdue",
            reportId: report.id,
            message: alertMessage,
            timestamp: now.toISOString(),
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "delegated":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const reportTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - reportTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const pendingReports = reports.filter((r) => r.status === "pending");
  const delegatedReports = reports.filter((r) => r.status === "delegated");
  const resolvedReports = reports.filter((r) => r.status === "resolved");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Zap className="h-8 w-8 mr-2 text-purple-600" />
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor all fault reports and system alerts
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Active Alerts</div>
              <div className="text-2xl font-bold text-red-600 flex items-center">
                <Bell className="h-5 w-5 mr-1" />
                {alerts.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Reports</div>
              <div className="text-2xl font-bold text-gray-900">
                {reports.length}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              System Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <UIAlert key={alert.id} className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">
                    {alert.type === "delegation_overdue"
                      ? "Delegation Overdue"
                      : "Resolution Overdue"}
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    {alert.message}
                  </AlertDescription>
                </UIAlert>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {pendingReports.length}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {delegatedReports.length}
                  </div>
                  <div className="text-sm text-gray-500">Delegated</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {resolvedReports.length}
                  </div>
                  <div className="text-sm text-gray-500">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {alerts.length}
                  </div>
                  <div className="text-sm text-gray-500">Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <div className="grid gap-6">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Reports Yet
                </h3>
                <p className="text-gray-500">
                  Fault reports will appear here when submitted.
                </p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center text-lg">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        {report.location}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Report ID: {report.id} • {formatTime(report.timestamp)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {getTimeSince(report.timestamp)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Reporter
                      </div>
                      <div className="text-sm text-gray-600">
                        {report.reporterName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {report.phoneNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Fault Type
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {report.faultType.replace("-", " ")}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Description
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {report.description}
                    </div>
                  </div>

                  {report.delegatedTo && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center text-sm text-blue-800">
                        <User className="h-4 w-4 mr-2" />
                        Delegated to:{" "}
                        <strong className="ml-1">{report.delegatedTo}</strong>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {formatTime(report.delegatedAt!)}
                      </div>
                    </div>
                  )}

                  {report.resolvedAt && (
                    <div className="mb-4 p-3 bg-green-50 rounded-md">
                      <div className="flex items-center text-sm text-green-800">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolved on: {formatTime(report.resolvedAt)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
