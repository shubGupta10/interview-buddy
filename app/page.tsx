"use client"

import React, { useEffect, useState } from 'react';
import { ArrowRight, Brain, Target, Zap, Code, Users, MessageSquare, CheckCircle2, ArrowUpRight, Sparkles, Layout, Shield, Clock, GraduationCap, Briefcase, Brush, BookOpen, Settings, UserCheck, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Home() {
  const router = useRouter()
  const rounds = ["Tech Round", "Coding Round", "Behaviour Round", "System Design", "HR Round"];
  const [index, setIndex] = useState(0);
  const [animationState, setAnimationState] = useState("visible");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState("exit");
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % rounds.length);
        setAnimationState("entrance");
        setTimeout(() => {
          setAnimationState("visible");
        }, 200);
      }, 200);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Define animation classes based on state
  const getAnimationClasses = () => {
    switch (animationState) {
      case "exit":
        return "opacity-0 -translate-y-8 scale-95";
      case "entrance":
        return "opacity-0 translate-y-8 scale-95";
      case "visible":
      default:
        return "opacity-100 translate-y-0 scale-100";
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#D1D7E0] antialiased">
      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#231651] border border-[#9D4EDD]/30 text-sm mb-8">
                <span className="flex h-2 w-2 rounded-full bg-[#FF2A6D] animate-pulse"></span>
                AI-Powered Interview Prep
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 overflow-hidden">
                Master Your Next{" "}
                <span
                  className={`text-[#FF2A6D] inline-block transition-all duration-600 ease-out ${getAnimationClasses()}`}
                >
                  {rounds[index]}
                </span>
              </h1>
              <p className="text-xl mb-8 text-[#D1D7E0]/80 max-w-2xl mx-auto lg:mx-0">
                InterviewBuddy helps you prepare for technical, behavioral, and system design interviews with customized questions tailored to your needs with deep explanation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <button onClick={() => { router.push("/dashboard") }} className="cursor-pointer w-full sm:w-auto bg-[#FF2A6D] hover:bg-[#FF2A6D]/90 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 group transition-all duration-300 transform hover:translate-y-[-2px]">
                  Get Started
                </button>
                <button onClick={() => { router.push("/how-to-use") }} className="cursor-pointer w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold border border-[#9D4EDD]/30 hover:border-[#9D4EDD] flex items-center justify-center gap-2 transition-all duration-300 transform hover:translate-y-[-2px] hover:bg-[#231651]">
                  Know More
                </button>
              </div>
            </div>
            <div className="flex-1 max-w-lg mx-auto lg:mx-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#231651] rounded-3xl transform rotate-3 border border-[#9D4EDD]/30"></div>
                <div className="relative rounded-3xl overflow-hidden border border-[#9D4EDD]/20 bg-[#231651] shadow-lg shadow-[#FF2A6D]/10">
                  <div className="bg-[#1A1040] p-3 border-b border-[#9D4EDD]/20 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF2A6D]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#9D4EDD]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#05FFF8]"></div>
                    </div>
                    <div className="text-xs text-[#D1D7E0]/70">Technical Interview</div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="text-[#05FFF8] font-semibold mb-2">Python - Medium</div>
                      <h3 className="text-lg font-bold">Implement a function to find the longest substring without repeating characters</h3>
                    </div>
                    <div className="bg-[#1A1040] p-4 rounded-lg border border-[#9D4EDD]/20 mb-4">
                      <div className="text-sm text-[#D1D7E0]/70 mb-1">Example:</div>
                      <div className="text-sm space-y-1">
                        <p>Input: "abcabcbb"</p>
                        <p>Output: 3 (The answer is "abc")</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button className="text-sm px-4 py-2 rounded-lg border border-[#9D4EDD]/40 hover:border-[#9D4EDD] transition-colors cursor-pointer">
                        Generate New
                      </button>
                      <button onClick={() => router.push("/dashboard")} className="text-sm bg-[#FF2A6D] hover:bg-[#FF2A6D]/90 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer">
                        Save Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose InterviewBuddy Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose InterviewBuddy?</h2>
          <p className="text-xl text-[#D1D7E0]/70 max-w-3xl mx-auto">
            InterviewBuddy simplifies preparation for technical, behavioral, and system design interviews by generating fresh, AI-powered questions that adapt to your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-[#FF2A6D]" />,
              title: "AI-Generated Questions",
              description: "Get personalized, role-specific questions tailored to your target companies and positions."
            },
            {
              icon: <Target className="w-6 h-6 text-[#05FFF8]" />,
              title: "Customizable Difficulty",
              description: "Adjust difficulty levels to match your preparation needs, from beginner to expert."
            },
            {
              icon: <Code className="w-6 h-6 text-[#05FFF8]" />,
              title: "Language-Specific Practice",
              description: "Practice with questions tailored to Python, JavaScript, C++, and more."
            },
            {
              icon: <Layout className="w-6 h-6 text-[#05FFF8]" />,
              title: "Multiple Interview Types",
              description: "Practice for System Design, Technical, and Behavioral interviews all in one place."
            },
            {
              icon: <BookOpen className="w-6 h-6 text-[#FFD700]" />,
              title: "Generate Deep & Meaningful Explanations",
              description: "Get detailed explanations with examples, key points, and structured breakdowns for better understanding."
            },
            {
              icon: <Brush className="w-6 h-6 text-[#FF8C00]" />,
              title: "Beautiful & Intuitive UI",
              description: "Enjoy a clean, modern, and user-friendly design for a seamless interview prep experience."
            }
          ].map((item, index) => (
            <div key={index} className="group relative p-6 rounded-2xl bg-[#231651] border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/40 transition-all duration-300 transform hover:translate-y-[-4px]">
              <div className="flex flex-col">
                <div className="p-3 rounded-xl bg-[#1A1040] w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-[#D1D7E0]/70 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 bg-[#231651]/50 rounded-3xl my-8 sm:my-12 lg:my-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">How InterviewBuddy Works</h2>
          <p className="text-lg sm:text-xl text-[#D1D7E0]/70 max-w-3xl mx-auto">
            A simple yet powerful process to help you prepare for your interviews effectively.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 lg:gap-12 relative">
          {[
            {
              step: "01",
              title: "Create an Account",
              description: "Sign up and access your personalized dashboard to start your interview preparation.",
              icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />
            },
            {
              step: "02",
              title: "Set Up Your Practice",
              description: "Select company, interview type, difficulty level, and programming language (if applicable).",
              icon: <Target className="w-8 h-8 sm:w-10 sm:h-10" />
            },
            {
              step: "03",
              title: "Generate & Practice",
              description: "Get AI-generated questions based on your criteria and practice with them at your own pace.",
              icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
            }
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#1A1040] border border-[#9D4EDD]/20 h-full">
                <div className="absolute -top-5 sm:-top-6 left-4 sm:-left-5 w-10 h-10 rounded-full bg-[#FF2A6D] flex justify-center items-center text-white font-bold shadow-md">
                  {item.step}
                </div>
                <div className="mb-6 text-[#05FFF8] flex justify-center items-center pt-2 sm:pt-0">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                <p className="text-[#D1D7E0]/70 text-center">{item.description}</p>
              </div>
              {index < 2 && (
                <>
                  {/* Arrow for desktop */}
                  <div className="hidden md:block absolute top-1/2 -right-6 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-[#9D4EDD]" />
                  </div>
                  {/* Arrow for mobile */}
                  <div className="md:hidden flex justify-center w-full my-4">
                    <ArrowDown className="w-6 h-6 text-[#9D4EDD]" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/how-to-use" className="bg-[#FF2A6D] hover:bg-[#ff2a4e] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold flex items-center justify-center gap-2 group transition-all duration-300 transform hover:translate-y-[-2px]">
            Detailed Instructions
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Who is it for */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-[#231651]/50 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Who is InterviewBuddy For?</h2>
          <p className="text-xl text-[#D1D7E0]/70 max-w-3xl mx-auto">
            Whether you're preparing for your next job or looking to hire the best talent, InterviewBuddy has you covered.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Job Seekers & Professionals",
              description: "Practice real interview scenarios with AI-generated questions tailored to your needs.",
              icon: <Briefcase className="w-10 h-10 text-[#FF2A6D]" />,
            },
            {
              title: "Hiring Managers & Recruiters",
              description: "Streamline your hiring process by generating targeted, role-specific interview questions effortlessly.",
              icon: <Users className="w-10 h-10 text-[#05FFF8]" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-[#1A1040] border border-[#9D4EDD]/20 transition-all duration-300 transform hover:translate-y-[-4px]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-[#D1D7E0]/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[#1A1040]"></div>
          <div className="relative border border-[#9D4EDD]/20 rounded-3xl p-8 sm:p-12 md:p-20 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Ready to Ace Your Next Interview?</h2>
              <p className="text-lg sm:text-xl text-[#D1D7E0]/70 mb-8 sm:mb-10 md:mb-12">
                Join InterviewBuddy today and start preparing smarter, not harder. Get access to AI-powered question generation and detailed explanations to boost your confidence.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => { router.push("/dashboard") }}
                  className="bg-[#FF2A6D] hover:bg-[#FF2A6D]/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold flex items-center justify-center gap-2 group transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  Start Preparing Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
