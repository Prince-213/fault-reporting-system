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
  PlusCircle,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboardHeader";
import {
  addTeam,
  confirmResolutionOfReport,
  delegateStaffToReport,
} from "@/lib/actions";
import { sendUpdateEmail } from "@/lib/utils";
import { toast } from "sonner";

interface FaultReport {
  id: string;
  reporter_name: string;
  email: string;
  phone_number: string;
  location: string;
  fault_type: string;
  description: string;
  severity: string;
  timestamp: string;
  status: "pending" | "delegated" | "resolved";
  delegated_to: string | null;
  delegated_at: string | null;
  resolved_at: string | null;
}

interface User {
  email: string;
  role: string;
}

interface Team {
  name: string;
  specialty: string;
  email: string;
}

export default function AdminDashboard({
  reportsData,
  teamData,
}: {
  reportsData: FaultReport[] | null;
  teamData: Team[] | null;
}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // New: Delegation teams (prototype list)

  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    specialty: "",
    email: "",
  });

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // ✅ Create Delegation Team
  const handleCreateTeam = async () => {
    if (!newTeam.name || !newTeam.specialty || !newTeam.email) {
      toast.info("Please fill all fields.");
      return;
    }
    await addTeam({ reportData: newTeam });
    setNewTeam({ name: "", specialty: "", email: "" });
    setIsCreateTeamDialogOpen(false);
    toast.success(`${newTeam.name} added to the delegation list.`);
  };

  // ✅ Assign existing team to report
  const handleDelegateStaff = async (reportId: string, email: string) => {
    if (!selectedStaff) return;
    try {
      setLoading(true);
      await delegateStaffToReport({ reportId, delegatedTo: selectedStaff });
      setIsAssignDialogOpen(false);
      toast.success(`${selectedStaff} has been delegated to handle the issue.`);
      await sendUpdateEmail(
        "Reporter",
        email,
        "You're team has been delegated a task to resolve."
      );
    } catch {
      toast.error("Failed to assign staff. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm report resolution
  const confirmResolution = async (reportId: string, email: string) => {
    try {
      setLoading(true);
      await confirmResolutionOfReport({ reportId });
      toast.success("The fault has been marked as resolved.");
      await sendUpdateEmail(
        "Reporter",
        email,
        "The issue you reported has been resolved."
      );
    } catch {
      toast.error("Could not resolve report.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper functions
  const getSeverityColor = (s: string) =>
    ({
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }[s] || "bg-gray-100 text-gray-800");

  const getStatusColor = (s: string) =>
    ({
      pending: "bg-red-100 text-red-800",
      delegated: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
    }[s] || "bg-gray-100 text-gray-800");

  const formatTime = (t: string) => new Date(t).toLocaleString();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    else window.location.href = "/login";
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center text-gray-900">
              <Zap className="h-8 w-8 mr-2 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage electrical fault reports and staff assignments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateTeamDialogOpen(true)}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Delegation Team
            </Button>
          </div>
        </div>

        {/* Create Delegation Team Dialog */}
        <Dialog
          open={isCreateTeamDialogOpen}
          onOpenChange={setIsCreateTeamDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Delegation Team</DialogTitle>
              <DialogDescription>
                Add a staff or team to handle fault reports.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, name: e.target.value })
                  }
                  placeholder="Team/Staff Name"
                />
              </div>
              <div>
                <Label>Specialty</Label>
                <Input
                  value={newTeam.specialty}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, specialty: e.target.value })
                  }
                  placeholder="e.g. Transformer Maintenance"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={newTeam.email}
                  type="email"
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, email: e.target.value })
                  }
                  placeholder=""
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateTeamDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reports */}
        <div className="grid gap-6">
          {reportsData?.length ? (
            reportsData.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center text-lg">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        {report.location}
                      </CardTitle>
                      <CardDescription>
                        Report ID: {report.id} • {formatTime(report.timestamp)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Reporter
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.reporter_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.phone_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Fault Type
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {report.fault_type.replace("-", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Description
                    </p>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {report.description}
                    </div>
                  </div>

                  {report.status === "pending" && (
                    <Dialog
                      open={
                        isAssignDialogOpen && selectedReportId === report.id
                      }
                      onOpenChange={setIsAssignDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedReportId(report.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Delegate Staff
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Team to Report</DialogTitle>
                          <DialogDescription>
                            Select a team from the list below.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Label>Select Team</Label>
                          <select
                            className="w-full border rounded-md p-2"
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                          >
                            <option value="">Select a team...</option>
                            {teamData?.map((team, idx) => (
                              <option key={idx} value={team.name}>
                                {team.name} — {team.specialty}
                              </option>
                            ))}
                          </select>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAssignDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() =>
                              handleDelegateStaff(report.id, report.email)
                            }
                            disabled={!selectedStaff || loading}
                          >
                            {loading ? "Assigning..." : "Assign Team"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {report.status === "delegated" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading}
                      onClick={() => confirmResolution(report.id, report.email)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {loading ? "Resolving..." : "Mark as Resolved"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
