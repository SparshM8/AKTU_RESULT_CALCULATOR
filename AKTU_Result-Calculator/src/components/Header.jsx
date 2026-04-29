import React from 'react';

export default function Header() {
  return (
    <header className="w-full py-5 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-primary-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">AKTU Result Calculator</h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Built for fast SGPA and YGPA checks</p>
              </div>
            </div>
            <nav className="text-sm text-gray-700 hidden sm:flex items-center gap-5">
              <a href="#" className="hover:text-primary-700 transition-colors duration-200 font-semibold">Guide</a>
              <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR" target="_blank" rel="noreferrer" className="hover:text-accent-700 transition-colors duration-200 font-semibold">Source</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
