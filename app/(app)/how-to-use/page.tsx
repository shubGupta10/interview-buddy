"use client";

import React from "react";
import { 
  LogIn, 
  Building2, 
  Layers, 
  Settings, 
  FileQuestion,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HowToUse() {
  const router = useRouter()
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
          How to Use <span className="text-[#05FFF8] font-medium">InterviewBuddy</span>
        </h1>
        <p className="text-xl text-[#D1D7E0]/80 mb-6">
          Follow these steps to prepare for your interviews
        </p>
      </div>

      {/* Overview Card */}
      {/* <div className="mb-10 bg-transparent p-6 rounded-xl">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#05FFF8]">Getting Started</h2>
            <p className="text-[#D1D7E0]/70">
              InterviewBuddy helps you prepare for interviews by organizing your preparation 
              by companies and interview rounds. Follow these exact steps to get started.
            </p>
          </div>
        </div>
      </div> */}

      {/* Steps List */}
      <div className="space-y-6 mb-10 max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="p-6 bg-gradient-to-r from-[#1A1040] to-[#231651] rounded-xl shadow-lg border border-[#9D4EDD]/30 hover:shadow-[#9D4EDD]/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#9D4EDD]/20 rounded-full text-[#05FFF8]">
              <LogIn size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-[#05FFF8]">Step 1: Login to InterviewBuddy</h2>
          </div>
          <p className="text-[#D1D7E0]/80 pl-12">
            Login with your credentials. After successful login, you will be automatically 
            redirected to your personal dashboard.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 bg-gradient-to-r from-[#1A1040] to-[#231651] rounded-xl shadow-lg border border-[#9D4EDD]/30 hover:shadow-[#9D4EDD]/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#9D4EDD]/20 rounded-full text-[#05FFF8]">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-[#05FFF8]">Step 2: Create a Company</h2>
          </div>
          <p className="text-[#D1D7E0]/80 pl-12">
            From your dashboard, click on the "Create New Company" button. Enter the name 
            of the company you're interviewing with (e.g., Google, Amazon, Microsoft) and click "Add Company".
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-6 bg-gradient-to-r from-[#1A1040] to-[#231651] rounded-xl shadow-lg border border-[#9D4EDD]/30 hover:shadow-[#9D4EDD]/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#9D4EDD]/20 rounded-full text-[#05FFF8]">
              <Layers size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-[#05FFF8]">Step 3: Create Interview Rounds</h2>
          </div>
          <p className="text-[#D1D7E0]/80 pl-12">
            After creating a company, click on the "Open" button to access that company's page. 
            From the dropdown menu, select the type of interview round you want to prepare for 
            (e.g., System Design, Coding, Behavioral) and click "Create Round".
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-6 bg-gradient-to-r from-[#1A1040] to-[#231651] rounded-xl shadow-lg border border-[#9D4EDD]/30 hover:shadow-[#9D4EDD]/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#9D4EDD]/20 rounded-full text-[#05FFF8]">
              <Settings size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-[#05FFF8]">Step 4: Configure Round Settings</h2>
          </div>
          <p className="text-[#D1D7E0]/80 pl-12">
            Open the newly created round by clicking on it. Inside the round, you'll find options 
            to select difficulty level and programming language (if applicable). Choose the 
            appropriate settings based on your preparation needs.
          </p>
        </div>

        {/* Step 5 */}
        <div className="p-6 bg-gradient-to-r from-[#1A1040] to-[#231651] rounded-xl shadow-lg border border-[#9D4EDD]/30 hover:shadow-[#9D4EDD]/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#9D4EDD]/20 rounded-full text-[#05FFF8]">
              <FileQuestion size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-[#05FFF8]">Step 5: Generate Interview Questions</h2>
          </div>
          <p className="text-[#D1D7E0]/80 pl-12">
            Click the "Generate Questions" button to receive real-life interview questions 
            tailored to your selected company, round type, difficulty level, and programming 
            language. These questions are based on actual interviews at your target company.
          </p>
        </div>
      </div>

      {/* Get Started CTA */}
      <div className="text-center bg-gradient-to-r from-[#231651] to-[#1A1040] rounded-xl p-8 border border-[#9D4EDD]/30 shadow-lg hover:shadow-[#9D4EDD]/20 transition-all duration-300">
        <h2 className="text-3xl font-bold text-[#05FFF8] mb-4">
          Ready to Start Your Interview Prep?
        </h2>
        <p className="text-[#D1D7E0]/80 mb-6 max-w-xl mx-auto">
          Return to your dashboard and follow these steps to begin preparing for your interviews.
        </p>
        <button onClick={() => {router.push("/dashboard")}}  className="cursor-pointer bg-[#05FFF8] hover:bg-[#05FFF8]/80 text-[#1A1040] px-8 py-3 rounded-lg shadow-lg hover:shadow-[#05FFF8]/20 transition-all duration-300 flex items-center gap-2 text-lg font-medium mx-auto">
          Go to Dashboard
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}