import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#1A1040] border-t border-[#9D4EDD]/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold text-[#FF2A6D]">InterviewBuddy</span>
            <p className="text-sm text-[#D1D7E0]/70 mt-2">AI-powered interview preparation platform</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold mb-2">Quick Links</h4>
              <a href="#features" className="text-sm text-[#D1D7E0]/70 hover:text-[#05FFF8]">Features</a>
              <a href="#how-it-works" className="text-sm text-[#D1D7E0]/70 hover:text-[#05FFF8]">How It Works</a>
              <a href="/how-to-use" className="text-sm text-[#D1D7E0]/70 hover:text-[#05FFF8]">Instructions</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#9D4EDD]/20 text-center text-sm text-[#D1D7E0]/50">
          © {new Date().getFullYear()} InterviewBuddy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer