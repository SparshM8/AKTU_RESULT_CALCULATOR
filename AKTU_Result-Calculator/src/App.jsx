import { useState, useEffect } from "react";
import "./App.css";
import YearComponent from "./components/YearComponent";
import GithubStar from "./components/GithubStar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [selectedYear, setSelectedYear] = useState("1");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevent browser save dialog
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000); // Hide after 3 seconds
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (guideOpen) {
      const guideElement = document.getElementById('guide');
      guideElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [guideOpen]);

  return (
    <div className="min-h-screen pt-8 px-4 sm:pt-12 sm:px-8 relative z-10">
      <Header onGuideClick={() => setGuideOpen((open) => !open)} guideOpen={guideOpen} />

      <main className="max-w-7xl mx-auto">
        <div id="box1" className="flex flex-col justify-center items-center mb-8 sm:mb-12 mt-8">
        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-gray-500 mb-3">2026 Session Friendly</p>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold leading-tight text-gray-900 mb-3 text-center px-2 max-w-4xl">
          Result First. Friction Never.
        </h2>
        <div className="h-1 w-24 bg-primary-600 rounded-full mb-4"></div>
        <p className="text-sm text-gray-600 text-center mt-2 max-w-xl leading-relaxed">
          Enter marks, get SGPA and YGPA instantly, and keep your progress saved locally. <br /> <span className="text-gray-500">Maintained by</span>{" "}
          <a
            className="font-semibold text-primary-700 hover:text-primary-800 transition-colors duration-200"
            href="https://github.com/SparshM8"
            target="_blank"
            rel="noopener noreferrer"
          >
            @SparshM8
          </a>
        </p>

        <div className="mt-8">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-6 py-3 rounded-lg font-semibold cursor-pointer border-2 border-gray-300 hover:border-primary-400 bg-white text-gray-900 shadow-sm"
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      {guideOpen && (
        <section id="guide" className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 scroll-mt-8">
          <div className="card overflow-hidden border-primary-200 shadow-[0_12px_30px_rgba(31,41,55,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-200">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Quick Guide</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-4">How to use the calculator</h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-700">
                  <p>1. Choose your year from the dropdown above.</p>
                  <p>2. Fill internal and external marks for each subject in the semester tables.</p>
                  <p>3. Press <span className="font-semibold text-primary-700">Calculate SGPA</span> to compute the semester score.</p>
                  <p>4. After both semesters are filled, use <span className="font-semibold text-accent-700">Calculate YGPA</span> for the yearly result.</p>
                </div>
              </div>

              <aside className="bg-gray-50 p-6 sm:p-8 lg:p-10">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">Helpful Notes</p>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600 shrink-0"></span><span>Your entries are saved locally in the browser.</span></li>
                    <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent-600 shrink-0"></span><span>Use the Reset button if you want to clear one year's data.</span></li>
                    <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-700 shrink-0"></span><span>The interface works on desktop and mobile without a separate app.</span></li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {selectedYear && <div className="max-w-7xl mx-auto px-4 sm:px-6"><YearComponent year={parseInt(selectedYear)} /></div>}

      <div className="text-center text-sm mt-12 pb-4">
        <p className="text-gray-700">To report issues and request features, visit the <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR/issues" className="text-primary-700 hover:text-primary-800 font-semibold transition-colors">Issues page</a>.</p>
        <p className="text-gray-600 mt-3">Support the project with a star on <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR" className="text-accent-700 hover:text-accent-800 font-semibold transition-colors">GitHub</a>.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8"><GithubStar /></div>

      {/* Save Notification Popup */}
      <div
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${showSaveToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-gray-800">
          <div className="bg-green-400 rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium text-sm sm:text-base">Data saved into Local Storage.</span>
        </div>
      </div>

      <Footer />

      <Analytics />
      </main>
    </div>
  );
}

export default App;
