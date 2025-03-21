import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#1A1040] border-t border-[#9D4EDD]/20 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="https://res.cloudinary.com/dkp6hsvoy/image/upload/v1742542723/interview-buddy-logo.png" 
              alt="InterviewBuddy Logo" 
              className="h-10 sm:h-12"
            />
            <p className="text-sm text-[#D1D7E0]/70 mt-2 text-center md:text-left">
              AI-powered interview preparation platform
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-3 text-[#D1D7E0]">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="/dashboard" className="text-sm text-[#D1D7E0]/70 hover:text-[#05FFF8] transition-colors duration-200">
                Dashboard
              </a>
              <a href="/how-to-use" className="text-sm text-[#D1D7E0]/70 hover:text-[#05FFF8] transition-colors duration-200">
                How to Use
              </a>
            </div>
          </div>
          
          {/* Feedback */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="font-semibold mb-3 text-[#D1D7E0]">Feedback</h4>
            <a href="/feedback" className="text-sm text-[#D1D7E0]/70 hover:text-[#05FFF8] transition-colors duration-200">
              Share your thoughts
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#9D4EDD]/20 text-center text-xs sm:text-sm text-[#D1D7E0]/50">
          © {new Date().getFullYear()} InterviewBuddy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer