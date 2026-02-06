"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight, LightbulbIcon, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TestInput from "@/components/custom-input";

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

  const [searchValue, setSearchValue] = useState("");
  const [inputState, setInputState] = useState<"default" | "error" | "success">(
    "default",
  );

  const handleClear = () => {
    setSearchValue("");
    setInputState("default");
  };

  return (
    <div className=" relative w-full h-screen overflow-hidden">
      <section
        className="bg-[url('/gridBackground.png')] relative w-full overflow-hidden h-screen bg-no-repeat bg-cover bg-bottom text-sm pb-44"
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

        {/* Announcement Banner */}
        <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32 cursor-pointer transition-colors">
          <span>Report & Continuous Monitoring</span>
          <button className="flex items-center gap-1 font-medium">
            <span>Read more</span>
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54"
                stroke="#050040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Main Heading */}
        <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
          Critical Infrastructure Reporting System
        </h5>

        {/* Description */}
        <p className="text-base md:text-lg text-pretty mx-auto max-w-2xl text-center mt-6 max-md:px-2">
          Ensure grid reliability, public safety, and rapid response to
          transformer faults, downed power lines, and utility emergencies
          through intelligent analytics and community reporting.
        </p>

        {/* CTA Buttons */}
        <div className="mx-auto w-full flex items-center justify-center gap-3 mt-4">
          <Link
            href="/complaint"
            className="flex text-base font-semibold items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3 transition-colors"
          >
            <span>Report Complaint</span>
            <svg
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.25.5 4.75 4l-3.5 3.5"
                stroke="#050040"
                strokeOpacity=".4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      <div className=" hidden  z-50 h-[25vh]  -bottom-6 absolute gap-8 w-[150%]  lg:w-[110%] lg:grid grid-cols-7">
        <div className=" w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={"/american-public-power-association-dR3Fb6dBEc0-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full lg:col-span-2 relative rounded-lg overflow-hidden">
          <Image
            src={"/fre-sonneveld-q6n8nIrDQHE-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={"/md_jerry-1G5gtser-qY-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full lg:col-span-2 relative rounded-lg overflow-hidden">
          <Image
            src={"/tom-ru-lW0_9bQYHvA-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={"/american-public-power-association-dR3Fb6dBEc0-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
      </div>

      <div className="  z-50 h-[25vh] lg:hidden  -bottom-6 absolute gap-3 w-[150%]  lg:w-[110%] w-full grid grid-cols-4">
        <div className=" w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={"/american-public-power-association-dR3Fb6dBEc0-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full lg:col-span-2 relative rounded-lg overflow-hidden">
          <Image
            src={"/fre-sonneveld-q6n8nIrDQHE-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={"/md_jerry-1G5gtser-qY-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
        <div className=" w-full h-full lg:col-span-2 relative rounded-lg overflow-hidden">
          <Image
            src={"/tom-ru-lW0_9bQYHvA-unsplash.jpg"}
            alt=" "
            fill
            className=" object-cover object-center bg-center bg-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PrebuiltUIHero;
