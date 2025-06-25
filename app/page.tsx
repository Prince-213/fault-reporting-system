"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Zap, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { sendEmail } from "@/lib/utils";

export default function ReportFault() {
  const [formData, setFormData] = useState({
    reporterName: "",
    phoneNumber: "",
    location: "",
    faultType: "",
    description: "",
    severity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create new report
    const newReport = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: "pending",
      delegatedTo: null,
      delegatedAt: null,
      resolvedAt: null,
      delegatedWarning: false,
      resolutionWarning: false,
    };

    // Save to localStorage (simulating database)
    const existingReports = JSON.parse(
      localStorage.getItem("faultReports") || "[]"
    );
    existingReports.push(newReport);
    localStorage.setItem("faultReports", JSON.stringify(existingReports));

    const emailBody = `
                    Location: ${formData.location}\n
                    A report has been submitted by ${formData.reporterName}\n
                    Report: ${formData.description}\n
                    Please assign a personnel to handle this report as soon as possible.
                  `;

    await sendEmail("Admin", emailBody);

    toast.success("Fault Reported Successfully");

    // Reset form
    setFormData({
      reporterName: "",
      phoneNumber: "",
      location: "",
      faultType: "",
      description: "",
      severity: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <header className="flex mb-10 justify-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/admin">Admin Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/super-admin">Super Admin Dashboard</Link>
        </Button>
      </header>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-12 w-12 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              PowerGrid Report
            </h1>
          </div>
          <p className="text-gray-600">
            Report electrical faults and transformer issues in your area
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Report Electrical Fault
            </CardTitle>
            <CardDescription>
              Please provide detailed information about the electrical issue
              you're experiencing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reporterName">Full Name</Label>
                  <Input
                    id="reporterName"
                    value={formData.reporterName}
                    onChange={(e) =>
                      setFormData({ ...formData, reporterName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Address</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Street address, landmarks, area name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faultType">Fault Type</Label>
                  <Select
                    value={formData.faultType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, faultType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fault type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="power-outage">Power Outage</SelectItem>
                      <SelectItem value="transformer-fault">
                        Transformer Fault
                      </SelectItem>
                      <SelectItem value="cable-damage">Cable Damage</SelectItem>
                      <SelectItem value="voltage-fluctuation">
                        Voltage Fluctuation
                      </SelectItem>
                      <SelectItem value="street-light">
                        Street Light Issue
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Low - Minor inconvenience
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium - Affecting multiple homes
                      </SelectItem>
                      <SelectItem value="high">
                        High - Safety hazard/Large area
                      </SelectItem>
                      <SelectItem value="critical">
                        Critical - Emergency situation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide detailed description of the issue, when it started, and any other relevant information"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Submit Fault Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
