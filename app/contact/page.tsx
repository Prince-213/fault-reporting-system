"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, LightbulbIcon, Search } from "lucide-react";

import {
  PhoneOutlined,
  WhatsAppOutlined,
  MailOutlined,
  FormOutlined,
} from "@ant-design/icons";

const PrebuiltUIHero: React.FC = () => {
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
    <div className=" relative w-full min-h-screen">
      <section
        className="bg-[url('/gridBackground.png')] relative w-full min-h-screen bg-no-repeat bg-cover bg-bottom text-sm pb-44"
        style={{
          backgroundImage: "url('/gridBackground.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        {/* Navigation */}
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
              max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen 
              max-md:bg-white/50 max-md:backdrop-blur max-md:flex-col 
              max-md:justify-center flex items-center gap-8 font-medium
              ${isMenuOpen ? "max-md:w-full" : "max-md:w-0 max-md:overflow-hidden"}
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

        {/* Main Heading */}
        <h5 className="text-4xl md:text-7xl font-semibold max-w-[850px] text-center mx-auto mt-14">
          Contact Us
        </h5>

        {/* Description */}
        <p className="text-base lg:text-lg font-medium text-gray-600  text-pretty mx-auto lg:max-w-[60%] text-center mt-6 max-md:px-2">
          We're here to help you report and resolve electrical faults in your
          neighborhood quickly and efficiently. Whether it's a sparking pole,
          streetlight outage, fallen wire, power surge, or any other electrical
          issue. For urgent safety risks (e.g., live wires on the ground, fire
          hazards), call immediately using the numbers below — do not wait.
        </p>

        {/* CTA Buttons */}
        <br />
        <ContactInfo />
      </section>
    </div>
  );
};

export default PrebuiltUIHero;

// components/ContactInfo.tsx

const ContactInfo: React.FC = () => {
  return (
    <div className="py-10 px-4 md:px-8 ">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Helpline & Contact Channels
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            24/7 support for urgent electrical faults • Quick response for
            safety issues
          </p>
        </div>

        {/* Main Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Phone Helpline */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                  <PhoneOutlined />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Main Helpline
                  </h3>
                  <p className="text-sm text-gray-500">
                    24/7 Urgent Fault Reporting
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-gray-700">
                <a
                  href="tel:+2348030001234"
                  className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  +234 803 000 1234
                </a>
                <a
                  href="tel:+2349091112222"
                  className="block text-lg font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  +234 909 111 2222{" "}
                  <span className="text-sm text-gray-500">
                    (Emergency Only)
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl">
                  <WhatsAppOutlined />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    WhatsApp Helpline
                  </h3>
                  <p className="text-sm text-gray-500">
                    Send photos • Fastest for follow-up
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/2347065556789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xl font-medium text-green-600 hover:text-green-800 transition-colors"
              >
                +234 706 555 6789
              </a>
            </div>
          </div>

          {/* Email & Online Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                  <MailOutlined />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Email & Online Form
                  </h3>
                  <p className="text-sm text-gray-500">
                    Non-urgent • Attach documents
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:support@neighborhoodfaults.ng"
                  className="block text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  support@neighborhoodfaults.ng
                </a>

                <a
                  href="/submit-complaint"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FormOutlined />
                  Submit Complaint Online
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Small Trust Note */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            Urgent safety issues → We aim to acknowledge within{" "}
            <strong className="text-gray-800">30 minutes</strong>
          </p>
          <p className="mt-1">
            General complaints → First response within{" "}
            <strong className="text-gray-800">24 hours</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
