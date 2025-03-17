"use client"

import React from "react"

interface BackgroundWrapperProps {
  children: React.ReactNode
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  return (
    <div className="min-h-screen bg-[#1A1040] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed w-64 h-64 bg-[#FF2A6D] opacity-10 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="fixed w-96 h-96 bg-[#05FFF8] opacity-10 rounded-full blur-3xl -bottom-32 -right-32"></div>
      <div className="fixed w-32 h-32 bg-[#9D4EDD] opacity-10 rounded-full blur-2xl bottom-20 left-20"></div>
      <div className="fixed w-48 h-48 bg-[#FF2A6D] opacity-10 rounded-full blur-2xl top-40 right-20"></div>
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default BackgroundWrapper