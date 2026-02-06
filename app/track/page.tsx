"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Clock,
  MapPin,
  AlertCircle,
  Users,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Menu,
  LightbulbIcon,
  X,
} from "lucide-react";
import { fetchComplaintById } from "@/lib/queries/actions";
import Link from "next/link";

// Sample data structure matching your schema
interface FaultReport {
  id: string;
  reporter_name: string;
  email: string;
  phone_number: string;
  location: string;
  fault_type: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  status: "pending" | "delegated" | "resolved";
  delegated_to: string | null;
  delegated_at: string | null;
  resolved_at: string | null;
}

interface Team {
  id: string;
  name: string;
  specialty: string;
  email: string;
  description: string;
  createdAt: string;
}

const TrackingPage = () => {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState<FaultReport | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    // Handle menu toggle
    useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isMenuOpen]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId.trim()) {
      setError("Please enter a complaint ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { complaint, team, error } = await fetchComplaintById(complaintId);

      if (error) {
        setError(error);
        setComplaint(null);
        setTeam(null);
      } else {
        setComplaint(complaint);
        setTeam(team);
      }
    } catch (err) {
      setError("An error occurred while tracking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-500",
          text: "Complaint Received",
          icon: Clock,
        };
      case "delegated":
        return { color: "bg-blue-500", text: "Team Assigned", icon: Users };
      case "resolved":
        return {
          color: "bg-green-500",
          text: "Issue Resolved",
          icon: CheckCircle,
        };
      default:
        return { color: "bg-gray-500", text: "Unknown", icon: AlertCircle };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className=" min-h-screen bg-[url('/gridBackground.png')] relative w-full  bg-no-repeat bg-cover bg-bottom pt-2   px-4"
      style={{
        backgroundImage: "url('/gridBackground.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full pb-4">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold flex items-center space-x-2 text-[#050040]"
        >
          <LightbulbIcon size={32} />
          <h1>Faultee</h1>
        </a>

        {/* Desktop Menu */}
        <div
          id="menu"
          className={`
              max-md:absolute max-md:top-0 max-md:left-0 max-md:h-full 
              max-md:bg-white/50 max-md:backdrop-blur max-md:flex-col 
              max-md:justify-center flex items-center gap-8 font-medium
              ${
                isMenuOpen
                  ? "max-md:w-full"
                  : "max-md:w-0 max-md:overflow-hidden"
              }
              max-md:transition-all max-md:duration-300
              md:flex
            `}
        >
          <Link href="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>

          <Link
            href="/track"
            className="hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            <span>Track Complaint</span>
          </Link>

          <Link
            href="/admin"
            className="hover:text-gray-600 transition-colors font-medium text-blue-600"
          >
            Dashboard
          </Link>

          {/* Close Menu Button (Mobile) */}
          <button
            id="close-menu"
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contact Button (Desktop) */}
        <Link
          href={"/contact"}
          className="hidden md:block bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition"
        >
          Contact Us
        </Link>

        {/* Open Menu Button (Mobile) */}
        <button
          id="open-menu"
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Electrical Fault Complaint Tracker
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your complaint ID to track the status of your reported
            electrical issue
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    placeholder="Enter your Complaint ID (e.g., COMP-2024-001)"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Tracking..." : "Track Complaint"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {complaint && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Complaint Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Tracker */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <AlertCircle className="text-blue-600" />
                  Complaint Status Tracker
                </h2>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-6 z-0"></div>
                  <div
                    className={`absolute -translate-y-6 left-0 top-1/2 h-1 ${complaint.status === "resolved" ? "w-full" : complaint.status === "delegated" ? "w-2/3" : "w-1/3"} bg-gradient-to-r from-blue-500 to-blue-600 -translate-y-1/2 z-0 transition-all duration-1000`}
                  ></div>

                  <div className="relative flex justify-between items-center z-10">
                    {["pending", "delegated", "resolved"].map(
                      (stepStatus, index) => {
                        const config = getStatusConfig(stepStatus);
                        const isActive =
                          stepStatus === "pending" ||
                          (stepStatus === "delegated" &&
                            ["delegated", "resolved"].includes(
                              complaint.status,
                            )) ||
                          (stepStatus === "resolved" &&
                            complaint.status === "resolved");

                        return (
                          <div
                            key={stepStatus}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${isActive ? config.color + " text-white scale-110 shadow-lg" : "bg-gray-200 text-gray-400"}`}
                            >
                              <config.icon size={24} />
                            </div>
                            <span
                              className={`text-sm font-medium ${isActive ? "text-gray-800" : "text-gray-400"}`}
                            >
                              {config.text}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 text-center">
                              {stepStatus === "pending" &&
                                formatDate(complaint.timestamp)}
                              {stepStatus === "delegated" &&
                                formatDate(complaint.delegated_at)}
                              {stepStatus === "resolved" &&
                                formatDate(complaint.resolved_at)}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Complaint Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Complaint ID
                      </label>
                      <p className="text-lg font-mono font-semibold text-gray-800">
                        {complaint.id}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Fault Type
                      </label>
                      <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                        <AlertCircle size={18} className="text-blue-600" />
                        {complaint.fault_type}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Location
                      </label>
                      <p className="text-gray-700 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        {complaint.location}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Severity
                      </label>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(complaint.severity)}`}
                      >
                        {complaint.severity.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Reported On
                      </label>
                      <p className="text-gray-700 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />
                        {formatDate(complaint.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Team & Reporter Info */}
            <div className="space-y-8">
              {/* Assigned Team */}
              {team && complaint.status !== "pending" && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Users className="text-green-600" />
                    Assigned Team
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Team Name
                      </label>
                      <p className="text-lg font-medium text-gray-800">
                        {team.name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Specialty
                      </label>
                      <p className="text-gray-700">{team.specialty}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <p className="text-gray-700 text-sm">
                        {team.description}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Contact Email
                      </label>
                      <p className="text-gray-700 flex items-center gap-2">
                        <Mail size={16} className="text-blue-600" />
                        {team.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reporter Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Your Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-gray-800">{complaint.reporter_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      {complaint.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      {complaint.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-semibold text-blue-800 mb-4">
                  Current Status Summary
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-800">
                      {complaint.status === "pending" && "Awaiting Assignment"}
                      {complaint.status === "delegated" && "Team Deployed"}
                      {complaint.status === "resolved" && "Issue Resolved"}
                    </p>
                    <p className="text-blue-600 text-sm">
                      Last updated:{" "}
                      {formatDate(
                        complaint.resolved_at ||
                          complaint.delegated_at ||
                          complaint.timestamp,
                      )}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${getStatusConfig(complaint.status).color} bg-opacity-20`}
                  >
                    {React.createElement(
                      getStatusConfig(complaint.status).icon,
                      {
                        size: 28,
                        className: getStatusConfig(
                          complaint.status,
                        ).color.replace("bg-", "text-"),
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {!complaint && !error && (
          <div className="mt-12 text-center text-gray-500">
            <p className="mb-2">Need help finding your Complaint ID?</p>
            <p className="text-sm">
              Check your confirmation email or contact our support at
              support@energy-department.gov
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
