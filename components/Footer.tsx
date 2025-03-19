import React from 'react'

function Footer() {
  return (
    <footer className="w-full bg-transparent text-white py-8">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-lg font-semibold text-blue-400">InterviewBuddy</div>

        <nav className="mt-4 md:mt-0 flex space-x-6">
            <a href="/how-to-use" className="text-gray-300 hover:text-blue-400 transition">How to Use</a>
            <a href="/contact" className="text-gray-300 hover:text-blue-400 transition">Contact</a>
        </nav>

        <p className="text-sm text-gray-400 mt-4 md:mt-0">
            &copy; 2025 InterviewBuddy. All rights reserved.
        </p>
    </div>
</footer>

  )
}

export default Footer