import { useState, useEffect } from "react";
import "./App.css";
import GithubStar from "./components/GithubStar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Calculator from "./components/Calculator";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (guideOpen) {
      const guideElement = document.getElementById("guide");
      guideElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [guideOpen]);

  return (
    <div className="min-h-screen pt-8 px-4 sm:pt-12 sm:px-8 relative z-10">
      <Header onGuideClick={() => setGuideOpen((open) => !open)} guideOpen={guideOpen} />

      <main className="max-w-7xl mx-auto">
        <div id="box1" className="flex flex-col justify-center items-center mb-8 sm:mb-12 mt-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-gray-500 mb-3">For Every AKTU Student · 2026 Session Friendly</p>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold leading-tight text-gray-900 mb-3 text-center px-2 max-w-4xl">
            Result First. Friction Never.
          </h2>
          <div className="h-1 w-24 bg-primary-600 rounded-full mb-4"></div>
          <p className="text-sm text-gray-600 text-center mt-2 max-w-xl leading-relaxed">
            Add your own courses, enter internal and external marks, and get SGPA, YGPA and CGPA instantly — built on AKTU&apos;s official grading ordinance.{" "}
            <span className="text-gray-500">Maintained by</span>{" "}
            <a
              className="font-semibold text-primary-700 hover:text-primary-800 transition-colors duration-200"
              href="https://github.com/SparshM8"
              target="_blank"
              rel="noopener noreferrer"
            >
              @SparshM8
            </a>
          </p>
        </div>

        {guideOpen && (
          <section id="guide" className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 scroll-mt-8">
            <div className="card overflow-hidden border-primary-200 shadow-[0_12px_30px_rgba(31,41,55,0.08)]">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Quick Guide</p>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-4">How to use the calculator</h3>
                  <div className="space-y-3 text-sm sm:text-base text-gray-700">
                    <p>1. Pick your admission batch so the percentage uses the correct formula.</p>
                    <p>2. Add your courses with name, type (Theory / Lab / Project), and credits. Add as many semesters as you have completed.</p>
                    <p>3. Fill internal and external marks for each course; the predicted grade and pass status update as you type.</p>
                    <p>4. Press <span className="font-semibold text-primary-700">Calculate SGPA</span> per semester; YGPA and CGPA with percentage appear automatically.</p>
                  </div>
                </div>

                <aside className="bg-gray-50 p-6 sm:p-8 lg:p-10">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">AKTU Rules Built In</p>
                    <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                      <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600 shrink-0"></span><span>Grade scale: O = 10 (≥90) down to F = 0 (&lt;40), per the official ordinance.</span></li>
                      <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent-600 shrink-0"></span><span>Pass check: theory needs ≥21 external and ≥40 total; labs need ≥25 external.</span></li>
                      <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-700 shrink-0"></span><span>Percentage: (CGPA − 0.75) × 10 for 2018-19+ batches; CGPA × 10 before that.</span></li>
                      <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-400 shrink-0"></span><span>Everything is saved in your browser — refresh safely.</span></li>
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        )}

        <Calculator />

        <div className="text-center text-sm mt-12 pb-4">
          <p className="text-gray-700">
            This is an unofficial study tool based on the AKTU B.Tech Ordinance (2018-19, revised). Final results are governed by the university —{" "}
            <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR/issues" className="text-primary-700 hover:text-primary-800 font-semibold transition-colors">report issues</a>.
          </p>
          <p className="text-gray-600 mt-3">Support the project with a star on <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR" className="text-accent-700 hover:text-accent-800 font-semibold transition-colors">GitHub</a>.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8"><GithubStar /></div>

        <Footer />

        <Analytics />
      </main>
    </div>
  );
}

export default App;
