import React from 'react';
import { ArrowRight, Brain, Target, Zap, Code, Users, MessageSquare, CheckCircle2, ArrowUpRight, Sparkles, Layout, Shield, Clock } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-transparent text-[#D1D7E0] antialiased">
      {/* Hero Section */}
      <div className="relative pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-30">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#231651] border border-[#9D4EDD]/30 text-sm mb-8">
                <span className="flex h-2 w-2 rounded-full bg-[#05FFF8] animate-pulse"></span>
                Now with AI-powered mock interviews
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Master Your <span className="text-[#FF2A6D]">Interview</span> Game with InterviewBuddy
              </h1>
              <p className="text-xl mb-8 text-[#D1D7E0]/80 max-w-2xl">
                Prepare smarter with AI-powered interview questions tailored to your needs. From technical to behavioral rounds, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <button className="w-full sm:w-auto bg-[#FF2A6D] hover:bg-[#FF2A6D]/90 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 group transition-all duration-300 transform hover:translate-y-[-2px]">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold border border-[#9D4EDD]/30 hover:border-[#9D4EDD] flex items-center justify-center gap-2 transition-all duration-300 transform hover:translate-y-[-2px] hover:bg-[#231651]">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A6D]/20 to-[#05FFF8]/20 rounded-3xl transform rotate-3"></div>
                <div className="relative rounded-3xl overflow-hidden border border-[#9D4EDD]/20 bg-[#231651]">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80"
                    alt="InterviewBuddy Dashboard"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose InterviewBuddy Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Why Choose InterviewBuddy?</h2>
            <p className="text-xl text-[#D1D7E0]/70 max-w-2xl mx-auto">
              Experience the future of interview preparation with our AI-powered platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-[#FF2A6D]" />,
                title: "AI-Driven Accuracy",
                description: "Get high-quality, industry-relevant questions tailored to your needs"
              },
              {
                icon: <Layout className="w-6 h-6 text-[#05FFF8]" />,
                title: "Customizable Rounds",
                description: "Tailor your interview practice as per the company and job role"
              },
              {
                icon: <Shield className="w-6 h-6 text-[#9D4EDD]" />,
                title: "Secure Platform",
                description: "Your preparation data is always private and protected"
              },
              {
                icon: <Clock className="w-6 h-6 text-[#FF2A6D]" />,
                title: "Continuous Learning",
                description: "Save and improve question sets over time for better results"
              }
            ].map((item, index) => (
              <div key={index} className="group relative p-6 rounded-2xl bg-[#231651] border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/40 transition-all duration-300 transform hover:translate-y-[-4px]">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-[#1A1040] mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#D1D7E0]/70 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Everything you need to ace your interviews</h2>
            <p className="text-xl text-[#D1D7E0]/70 max-w-2xl mx-auto">
              Comprehensive tools and features designed to make your interview preparation effective and efficient.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-6 h-6" />,
                title: "Technical Rounds",
                description: "Language-specific questions for programming interviews",
                features: ["Custom difficulty levels", "Real-time feedback", "Code execution"],
                gradient: "from-[#FF2A6D]/20 to-[#9D4EDD]/20"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Behavioral Rounds",
                description: "Practice common behavioral questions with AI feedback",
                features: ["STAR method guidance", "Voice analysis", "Improvement tips"],
                gradient: "from-[#9D4EDD]/20 to-[#05FFF8]/20"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "System Design",
                description: "Learn to design scalable systems and architectures",
                features: ["Interactive diagrams", "Best practices", "Real-world examples"],
                gradient: "from-[#05FFF8]/20 to-[#FF2A6D]/20"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                <div className="relative p-8 rounded-2xl bg-[#231651] border border-[#9D4EDD]/20 group-hover:border-[#9D4EDD]/40 transition-all duration-300 h-full transform hover:translate-y-[-4px]">
                  <div className="absolute right-8 top-8">
                    <ArrowUpRight className="w-5 h-5 text-[#9D4EDD]/40 group-hover:text-[#05FFF8] transition-colors" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#1A1040] w-fit mb-6 group-hover:bg-[#231651] transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-[#D1D7E0]/70 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#05FFF8]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A6D]/20 to-[#05FFF8]/20"></div>
            <div className="relative bg-[#231651] border border-[#9D4EDD]/20 rounded-3xl p-12 md:p-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold mb-6">Ready to transform your interview preparation?</h2>
                <p className="text-xl mb-8 text-[#D1D7E0]/80">
                  Join thousands of professionals who are preparing smarter with InterviewBuddy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#FF2A6D] hover:bg-[#FF2A6D]/90 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 group transition-all duration-300 transform hover:translate-y-[-2px]">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;