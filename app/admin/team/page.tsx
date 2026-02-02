"use client";

// pages/TeamManagement.tsx - Create and manage task force teams
import React, { useState } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Shield,
  Zap,
  Plus,
  Search,
  Filter,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useReportTeams } from "@/hooks/useFaultReports";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeam } from "@/lib/queries/actions";
import { toast } from "sonner";

const TeamManagementPage = () => {
  return (
    <div>
      <TeamManagement />
    </div>
  );
};

export default TeamManagementPage;

const TeamManagement: React.FC = () => {
  const { data: reportTeams, isLoading, error, refetch } = useReportTeams();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTeam,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reportTeams"] });
      toast.success("Teams Created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add teams",
      );
    },
  });

  // Transform reportTeams data to TaskForceTeam format
  const teams: Team[] =
    reportTeams?.map((team, index) => ({
      id: `team-${index + 1}`,
      name: team.name,
      specialty: team.specialty,
      email: team.email,
      description: `${team.specialty} team responsible for handling related faults and repairs`,

      createdAt: new Date().toISOString().split("T")[0],
    })) || [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({
    name: "",
    email: "",
    specialty: "",
  });

  const onCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      reportData: newTeam,
    });
  };

  const specialties = [
    "Transformer Maintenance",
    "Power Line Repair",
    "Grid Infrastructure",
    "Emergency Response",
    "Safety Inspection",
    "Technical Support",
  ];

  const handleAddMember = () => {
    // Implementation for adding member
    setShowAddMemberModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Skeleton Loading Components
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
          <div className="h-10 w-16 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const SearchSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );

  const TeamCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-300 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mb-3 animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stat) => (
              <div key={stat} className="text-center">
                <div className="h-8 w-12 bg-gray-300 rounded mb-1 animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="h-8 w-12 bg-gray-300 rounded mb-1 animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const HeaderSkeleton = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-10 w-40 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <HeaderSkeleton />
        <StatsSkeleton />
        <SearchSkeleton />
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <TeamCardSkeleton key={index} />
          ))}
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
            <h3 className="text-red-800 font-medium">Error loading teams</h3>
          </div>
          <p className="text-red-600 mt-2">
            Failed to load team data. Please try again.
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Task Force Teams
              </h1>
              <p className="text-gray-600">
                Create and manage power infrastructure response teams
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Team
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {teams.length}
              </div>
              <div className="text-sm text-gray-600">Active Teams</div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Specialties</option>
                  {specialties.map((spec) => (
                    <option key={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Teams Found
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first task force team to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Team
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {team.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {team.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {team.specialty}
                          </span>
                          <span className="text-sm text-gray-500">
                            Contact: {team.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <button
                          onClick={() => {
                            setSelectedTeam(team);
                            setShowAddMemberModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Add Member"
                        >
                          <UserPlus className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                          title="Edit Team"
                        >
                          <Edit className="h-5 w-5" />
                        </button> */}
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Team"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Task Force Team
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <form onSubmit={onCreateTeam} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Transformer Response Unit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Email *
                  </label>
                  <input
                    type="email"
                    value={newTeam.email}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="team@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty *
                  </label>
                  <select
                    value={newTeam.specialty}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, specialty: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select specialty</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                =
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !newTeam.name || !newTeam.specialty || mutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Creating Team...." : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Member to {selectedTeam.name}
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select role</option>
                    <option>Team Lead</option>
                    <option>Electrical Engineer</option>
                    <option>Technician</option>
                    <option>Safety Officer</option>
                    <option>Field Operator</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="member@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
