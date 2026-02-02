"use client";

// pages/ComplaintList.tsx - All complaints page with assignment functionality
import React, { useState } from "react";
import {
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Eye,
  UserPlus,
  MoreVertical,
  ChevronDown,
  MapPin,
  Zap,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  useFaultReports,
  useDelegateStaff,
  useConfirmResolution,
  useReportTeams,
} from "@/hooks/useFaultReports";
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

const AdminComplaintPage = () => {
  return (
    <div>
      <ComplaintList />
    </div>
  );
};

export default AdminComplaintPage;

const ComplaintList: React.FC = () => {
  const { data: faultReports, isLoading, error, refetch } = useFaultReports();
  const delegateStaffMutation = useDelegateStaff();
  const confirmResolutionMutation = useConfirmResolution();

  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<FaultReport | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // Transform faultReports data
  const transformToComplaintData = (reports: FaultReport[]) => {
    return (
      reports?.map((report) => ({
        id: report.id,
        name: report.reporter_name,
        email: report.email,
        phone: report.phone_number,
        address: report.location,
        category: report.fault_type,
        urgency:
          report.severity.charAt(0).toUpperCase() + report.severity.slice(1),
        message: report.description,
        status: report.status,
        assignedTeam: report.delegated_to || undefined,
        createdAt: new Date(report.timestamp).toLocaleString(),
        updatedAt: report.resolved_at
          ? new Date(report.resolved_at).toLocaleString()
          : report.delegated_at
          ? new Date(report.delegated_at).toLocaleString()
          : new Date(report.timestamp).toLocaleString(),
        progress: calculateProgress(report.status),
      })) || []
    );
  };

  const calculateProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "delegated":
        return 50;
      case "resolved":
        return 100;
      default:
        return 0;
    }
  };

  const filteredComplaints = faultReports?.filter((report) => {
    if (filter !== "all" && report.status !== filter) return false;
    if (
      search &&
      !report.id.toLowerCase().includes(search.toLowerCase()) &&
      !report.fault_type.toLowerCase().includes(search.toLowerCase()) &&
      !report.location.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "delegated":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "resolved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
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

  const handleAssignTeam = async (complaintId: string, teamName: string) => {
    try {
      await delegateStaffMutation.mutateAsync({
        reportId: complaintId,
        delegatedTo: teamName,
      });
      setShowAssignModal(false);
      setSelectedTeam("");
      toast.success("Team assigned successfully!");
    } catch (error) {
      console.error("Failed to assign team:", error);
      toast.error("Failed to assign team. Please try again.");
    }
  };

  const handleMarkResolved = async (complaintId: string) => {
    try {
      await confirmResolutionMutation.mutateAsync({ reportId: complaintId });
      toast.success("Complaint marked as resolved!");
    } catch (error) {
      console.error("Failed to mark as resolved:", error);
      toast.error("Failed to mark as resolved. Please try again.");
    }
  };

  const handleSelectComplaint = (complaint: FaultReport) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  const getStatusText = (status: string) => {
    return status.toUpperCase();
  };

  const handleDelegateStaff = async (reportId: string, teamName: string) => {
    try {
      await delegateStaffMutation.mutateAsync({
        reportId,
        delegatedTo: teamName,
      });
      // Show success message
      alert("Staff delegated successfully!");
    } catch (error) {
      // Show error message
      alert("Failed to delegate staff. Please try again.");
    }
  };

  // Handle confirm resolution
  const handleConfirmResolution = async (reportId: string) => {
    try {
      await confirmResolutionMutation.mutateAsync({ reportId });
      // Show success message
      alert("Report marked as resolved!");
    } catch (error) {
      // Show error message
      alert("Failed to mark report as resolved. Please try again.");
    }
  };

  const { data: reportTeams, isLoading: teamLoading } = useReportTeams();

  const getProgressLabel = (progress: number) => {
    if (progress === 0) return "Pending Review";
    if (progress < 30) return "Assigned to Team";
    if (progress < 70) return "In Progress";
    if (progress < 100) return "Almost Complete";
    return "Resolved";
  };

  // Skeleton Loading Components
  const HeaderSkeleton = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );

  const SearchSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:flex-none">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <th key={index} className="text-left py-4 px-6">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((cellIndex) => (
                  <td key={cellIndex} className="py-4 px-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <HeaderSkeleton />
        <SearchSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">
              Error loading complaints
            </h3>
          </div>
          <p className="text-red-600 mt-2">
            Failed to load complaint data. Please try again.
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

  const complaints = transformToComplaintData(faultReports || []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                All Complaints ({faultReports?.length || 0})
              </h1>
              <p className="text-gray-600">
                Manage and assign power infrastructure complaints
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by ID, category, or location..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="delegated">Assigned</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {selectedComplaints.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {selectedComplaints.length} selected
                    </span>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                      disabled={delegateStaffMutation.isPending}
                    >
                      {delegateStaffMutation.isPending ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Assigning...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Team
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 py-4 px-6">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedComplaints(
                              faultReports?.map((report) => report.id) || []
                            );
                          } else {
                            setSelectedComplaints([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Complaint ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Urgency
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Progress
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Assigned Team
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints?.map((report) => {
                    const statusColors = getStatusColor(report.status);
                    const progress = calculateProgress(report.status);
                    return (
                      <tr
                        key={report.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={selectedComplaints.includes(report.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedComplaints([
                                  ...selectedComplaints,
                                  report.id,
                                ]);
                              } else {
                                setSelectedComplaints(
                                  selectedComplaints.filter(
                                    (id) => id !== report.id
                                  )
                                );
                              }
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {report.id.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium">{report.fault_type}</div>
                          <div className="text-sm text-gray-500">
                            {report.location}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(
                              report.severity
                            )}`}
                          >
                            {report.severity.charAt(0).toUpperCase() +
                              report.severity.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text}`}
                          >
                            {getStatusText(report.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-32">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">
                                {getProgressLabel(progress)}
                              </span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  progress < 30
                                    ? "bg-yellow-500"
                                    : progress < 70
                                    ? "bg-blue-500"
                                    : progress < 100
                                    ? "bg-green-500"
                                    : "bg-green-600"
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {report.delegated_to ? (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {report.delegated_to}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSelectComplaint(report)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-6 w-6" />
                            </button>
                            {report.status !== "resolved" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedComplaint(report);
                                    setShowAssignModal(true);
                                  }}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Assign Team"
                                  disabled={delegateStaffMutation.isPending}
                                >
                                  {delegateStaffMutation.isPending &&
                                  selectedComplaint?.id === report.id ? (
                                    <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <UserPlus className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleMarkResolved(report.id)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Mark Resolved"
                                  disabled={confirmResolutionMutation.isPending}
                                >
                                  {confirmResolutionMutation.isPending &&
                                  selectedComplaints.includes(report.id) ? (
                                    <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredComplaints?.length || 0} of{" "}
                {faultReports?.length || 0} complaints
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Assign Team Modal */}
          {showAssignModal && selectedComplaint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assign Team to Complaint
                  </h3>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    disabled={delegateStaffMutation.isPending}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Complaint ID:</span>{" "}
                      {selectedComplaint.id.slice(0, 8)}...
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Category:</span>{" "}
                      {selectedComplaint.fault_type}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Team
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={delegateStaffMutation.isPending}
                    >
                      <option value="">Select a team</option>
                      {reportTeams?.map((team) => (
                        <option key={team.id} value={team.name}>
                          {team.name} specializes in ({team.specialty} )
                        </option>
                      ))}
                    </select>
                  </div>

                  {delegateStaffMutation.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center text-red-700">
                        <XCircle className="h-5 w-5 mr-2" />
                        Failed to assign team. Please try again.
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowAssignModal(false);
                        setSelectedTeam("");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={delegateStaffMutation.isPending}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleAssignTeam(selectedComplaint.id, selectedTeam)
                      }
                      disabled={
                        !selectedTeam || delegateStaffMutation.isPending
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {delegateStaffMutation.isPending ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Assigning...
                        </>
                      ) : (
                        "Assign Team"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Complaint Details Modal */}
          {showDetailsModal && selectedComplaint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Complaint Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Reporter Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Name</div>
                          <div className="font-medium">
                            {selectedComplaint.reporter_name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Contact</div>
                          <div className="font-medium">
                            {selectedComplaint.phone_number}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedComplaint.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Issue Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">
                            Fault Type
                          </div>
                          <div className="font-medium">
                            {selectedComplaint.fault_type}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Severity</div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(
                              selectedComplaint.severity
                            )}`}
                          >
                            {selectedComplaint.severity
                              .charAt(0)
                              .toUpperCase() +
                              selectedComplaint.severity.slice(1)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Status</div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              getStatusColor(selectedComplaint.status).bg
                            } ${getStatusColor(selectedComplaint.status).text}`}
                          >
                            {getStatusText(selectedComplaint.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Location
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium">
                        {selectedComplaint.location}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Description
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                      {selectedComplaint.description}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Progress Timeline
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            {getProgressLabel(
                              calculateProgress(selectedComplaint.status)
                            )}
                          </span>
                          <span className="font-medium">
                            {calculateProgress(selectedComplaint.status)}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              calculateProgress(selectedComplaint.status) < 30
                                ? "bg-yellow-500"
                                : calculateProgress(selectedComplaint.status) <
                                  70
                                ? "bg-blue-500"
                                : calculateProgress(selectedComplaint.status) <
                                  100
                                ? "bg-green-500"
                                : "bg-green-600"
                            }`}
                            style={{
                              width: `${calculateProgress(
                                selectedComplaint.status
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        {["Pending", "Assigned", "Resolved"].map(
                          (step, index) => {
                            const stepProgress = index * 50;
                            const isActive =
                              calculateProgress(selectedComplaint.status) >=
                              stepProgress;
                            return (
                              <div key={step} className="text-center">
                                <div
                                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                    isActive
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  {isActive ? "✓" : index + 1}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {step}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    {selectedComplaint.status !== "resolved" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedComplaint(selectedComplaint);
                            setShowDetailsModal(false);
                            setShowAssignModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          disabled={delegateStaffMutation.isPending}
                        >
                          {delegateStaffMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Assigning...
                            </>
                          ) : (
                            "Assign Team"
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleMarkResolved(selectedComplaint.id)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          disabled={confirmResolutionMutation.isPending}
                        >
                          {confirmResolutionMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Resolving...
                            </>
                          ) : (
                            "Mark Resolved"
                          )}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
