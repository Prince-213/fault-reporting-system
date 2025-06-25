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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  MapPin,
  Zap,
  CheckCircle,
  UserPlus,
  ArrowLeft,
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

interface User {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<FaultReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<FaultReport | null>(
    null
  );
  const [staffName, setStaffName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
    const interval = setInterval(loadReports, 1000); // Refresh every second
    return () => clearInterval(interval);
  }, []);

  const loadReports = () => {
    const savedReports = JSON.parse(
      localStorage.getItem("faultReports") || "[]"
    );
    setReports(savedReports);
  };

  const delegateStaff = () => {
    if (!selectedReport || !staffName) return;

    const updatedReports = reports.map((report) =>
      report.id === selectedReport.id
        ? {
            ...report,
            status: "delegated" as const,
            delegatedTo: staffName,
            delegatedAt: new Date().toISOString(),
          }
        : report
    );

    localStorage.setItem("faultReports", JSON.stringify(updatedReports));
    setReports(updatedReports);
    setIsDialogOpen(false);
    setStaffName("");
    setSelectedReport(null);

    toast({
      title: "Staff Delegated",
      description: `${staffName} has been assigned to handle this issue.`,
    });
  };

  const confirmResolution = (reportId: string) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            status: "resolved" as const,
            resolvedAt: new Date().toISOString(),
          }
        : report
    );

    localStorage.setItem("faultReports", JSON.stringify(updatedReports));
    setReports(updatedReports);

    toast({
      title: "Issue Resolved",
      description: "The fault has been marked as resolved.",
    });
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

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      window.location.href = "/login";
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Zap className="h-8 w-8 mr-2 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage electrical fault reports and delegate staff
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Reports</div>
            <div className="text-2xl font-bold text-gray-900">
              {reports.length}
            </div>
          </div>
        </div>

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

                  <div className="flex space-x-2">
                    {report.status === "pending" && (
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Delegate Staff
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delegate Staff Member</DialogTitle>
                            <DialogDescription>
                              Assign a staff member to handle this electrical
                              fault.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="staffName">
                                Staff Member Name
                              </Label>
                              <Input
                                id="staffName"
                                value={staffName}
                                onChange={(e) => setStaffName(e.target.value)}
                                placeholder="Enter staff member name"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={delegateStaff}
                              disabled={!staffName}
                            >
                              Delegate Staff
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {report.status === "delegated" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmResolution(report.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Resolution
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
