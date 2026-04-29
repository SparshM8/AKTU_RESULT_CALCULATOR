import { useState } from 'react';

export default function Header({ onGuideClick, guideOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-5 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card px-5 py-4">
          <div className="flex items-center justify-between gap-4">
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
              <button
                type="button"
                onClick={onGuideClick}
                aria-expanded={guideOpen}
                aria-controls="guide"
                className="hover:text-primary-700 transition-colors duration-200 font-semibold"
              >
                Guide
              </button>
              <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR" target="_blank" rel="noreferrer" className="hover:text-accent-700 transition-colors duration-200 font-semibold">Source</a>
            </nav>
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg border-2 border-gray-300 bg-white text-gray-700"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <path d="M4 4l12 12M16 4L4 16" />
                ) : (
                  <>
                    <path d="M3 5h14" />
                    <path d="M3 10h14" />
                    <path d="M3 15h14" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <div className={`sm:hidden overflow-hidden transition-all duration-200 ${mobileMenuOpen ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
            <nav className="pt-4 border-t border-gray-200 flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  onGuideClick();
                  setMobileMenuOpen(false);
                }}
                aria-expanded={guideOpen}
                aria-controls="guide"
                className="rounded-full bg-primary-50 px-4 py-2 font-semibold text-primary-700 border border-primary-200"
              >
                Guide
              </button>
              <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR" target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-gray-50 px-4 py-2 font-semibold text-gray-700 border border-gray-200">Source</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
