"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, LightbulbIcon, Search } from "lucide-react";

const page = () => {
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
  return (
    <div
      style={{
        backgroundImage: "url('/gridBackground.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
      className="  min-h-screen bg-[url('/gridBackground.png')] relative w-full  bg-no-repeat bg-cover bg-bottom text-base pb-44 "
    >
      <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold flex items-center space-x-2 text-[#050040]"
        >
          <LightbulbIcon size={32} />
          <h1>Faultee</h1>
        </Link>

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
          href="/contact"
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
      <FileComplaint />
    </div>
  );
};

export default page;

// pages/FileComplaint.tsx - User complaint filing page

import {
  AlertTriangle,
  MapPin,
  User,
  MessageSquare,
  Building,
  Phone,
  CheckCircle,
  Zap,
  Send,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CheckCircleOutlined } from "@ant-design/icons";
import { powerProblems } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReport } from "@/lib/queries/actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ComplaintData {
  reporterName: string;
  email: string;
  phoneNumber: string;
  location: string;
  faultType: string;
  description: string;
  severity: string;
}

const FileComplaint: React.FC = () => {
  const navigate = useRouter();
  const [step, setStep] = useState(1);

  const [isSuccess, setIsSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState("");

  const [formData, setFormData] = useState<ComplaintData>({
    reporterName: "",
    email: "",
    phoneNumber: "",
    location: "",
    faultType: "",
    description: "",
    severity: "",
  });

  const [selected, setSelected] = useState(powerProblems[3]);

  const urgencyLevels = [
    {
      id: "low",
      label: "Low",
      color: "text-green-600",
      bg: "bg-green-100",
      description: "No immediate danger",
    },
    {
      id: "medium",
      label: "Medium",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      description: "Needs attention soon",
    },
    {
      id: "high",
      label: "High",
      color: "text-orange-600",
      bg: "bg-orange-100",
      description: "Important issue",
    },
    {
      id: "critical",
      label: "Critical",
      color: "text-red-600",
      bg: "bg-red-100",
      description: "Immediate danger",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      reporterName: "",
      email: "",
      phoneNumber: "",
      location: "",
      faultType: "",
      description: "",
      severity: "",
    });
    setIsSuccess(false);
    setStep(1);
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Issue Details", icon: AlertTriangle },
    { number: 3, title: "Location", icon: MapPin },
    { number: 4, title: "Review & Submit", icon: CheckCircle },
  ];

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addReport,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faultReports"] });
      setComplaintId(data.id);
      setIsSuccess(true);
      toast.success("Complaint Submitted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit complaint",
      );
    },
  });

  const onFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      reportData: formData,
    });
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="border-b">
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Report Power Infrastructure Issue
              </h2>
              <p className="text-gray-600">
                Help us maintain grid reliability by reporting electrical
                problems
              </p>

              <div className="flex items-center justify-between mt-8">
                {steps.map((stepItem, index) => {
                  const StepIcon = stepItem.icon;
                  const isActive = step === stepItem.number;
                  const isCompleted = step > stepItem.number;

                  return (
                    <div key={stepItem.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-base text-gray-500">
                          Step {stepItem.number}
                        </div>
                        <div
                          className={`font-medium ${
                            isActive
                              ? "text-blue-600"
                              : isCompleted
                                ? "text-green-600"
                                : "text-gray-400"
                          }`}
                        >
                          {stepItem.title}
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-0.5 w-16 mx-4 ${
                            step > stepItem.number
                              ? "bg-green-600"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Complaint Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your complaint has been registered. Our team will review it
                shortly.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-6">
                <div className="text-lg font-mono font-bold text-blue-600 mb-2">
                  {complaintId}
                </div>
                <p className="text-base text-gray-600">
                  Complaint Reference Number
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-left">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    How to Track Your Complaint:
                  </h4>
                  <p className="text-sm text-blue-700 space-y-2">
                    1. Copy the Reference Number above. <br />
                    2. Go to the{" "}
                    <Link href="/track" className="underline font-bold">
                      Tracking Page
                    </Link>
                    . <br />
                    3. Paste the ID and click <strong>"Track"</strong> to see
                    live updates.
                  </p>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-base text-green-700">
                    <Clock className="h-4 w-4 mr-2" />
                    Current Status:{" "}
                    <span className="font-semibold ml-1">Pending Review</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          )}

          {/* Form Content */}
          {!isSuccess && (
            <form onSubmit={onFileComplaint} className="p-8">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Personal Information
                      </h3>
                      <p className="text-gray-600">
                        Provide your contact details for follow-up
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="reporterName"
                        value={formData.reporterName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <Phone className="h-5 w-5" />
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Issue Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Issue Details
                      </h3>
                      <p className="text-gray-600">
                        Describe the problem you're experiencing
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-1  gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faultType">Fault Type</Label>
                        <Select
                          value={formData.faultType}
                          onValueChange={(value) => {
                            const selected = powerProblems.find(
                              (problem) => problem.issue === value,
                            );
                            setFormData({
                              ...formData,
                              faultType: value,
                              severity: selected?.severity ?? "",
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fault type" />
                          </SelectTrigger>
                          <SelectContent>
                            {powerProblems.map((problem) => (
                              <SelectItem
                                key={problem.issue}
                                value={problem.issue}
                              >
                                {problem.issue}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <div className="flex items-start space-x-3 mb-3">
                      <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Please provide detailed information about the issue. Include any relevant details like time of occurrence, visible damage, safety concerns, etc."
                      />
                    </div>
                    <p className="text-base text-gray-500">
                      The more details you provide, the faster we can resolve
                      the issue.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Location Details
                      </h3>
                      <p className="text-gray-600">
                        Tell us where the issue is located
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-gray-400 mt-1" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter complete address including landmark"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location Tips
                    </h4>
                    <ul className="text-blue-800 text-base space-y-1">
                      <li>• Include nearest landmark or intersection</li>
                      <li>• Mention transformer number if visible</li>
                      <li>• Specify pole number if available</li>
                      <li>• Add GPS coordinates if possible</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Review & Submit
                      </h3>
                      <p className="text-gray-600">
                        Please review your complaint before submitting
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Personal Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <div className="text-base text-gray-500">Name</div>
                            <div className="font-medium">
                              {formData.reporterName || "Not provided"}
                            </div>
                          </div>
                          <div>
                            <div className="text-base text-gray-500">Email</div>
                            <div className="font-medium">{formData.email}</div>
                          </div>
                          <div>
                            <div className="text-base text-gray-500">Phone</div>
                            <div className="font-medium">
                              {formData.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Issue Details
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <div className="text-base text-gray-500">
                              Category
                            </div>
                            <div className="font-medium">
                              {powerProblems.find(
                                (c) => c.issue === formData.faultType,
                              )?.issue || "Not selected"}
                            </div>
                          </div>
                          <div>
                            <div className="text-base text-gray-500">
                              Urgency
                            </div>
                            <div
                              className={`font-medium ${
                                urgencyLevels.find(
                                  (u) => u.id === formData.severity,
                                )?.color
                              }`}
                            >
                              {
                                urgencyLevels.find(
                                  (u) => u.id === formData.severity,
                                )?.label
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Location
                        </h4>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="font-medium">{formData.location}</div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Description
                        </h4>
                        <div className="bg-white p-4 rounded-lg border whitespace-pre-line">
                          {formData.description || "No description provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Submission Agreement
                        </h4>
                        <p className="text-blue-800 text-base">
                          By submitting this complaint, you agree that you are
                          reporting a genuine electrical infrastructure issue.
                          False reports may lead to legal action. Our team will
                          review your complaint within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
