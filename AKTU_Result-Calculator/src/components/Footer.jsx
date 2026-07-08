

export default function Footer() {
  return (
    <footer className="w-full mt-16 py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Made with <span className="text-red-500">❤️</span> for AKTU students — <a href="https://github.com/SparshM8/AKTU_RESULT_CALCULATOR" target="_blank" rel="noreferrer" className="text-primary-700 hover:text-primary-800 font-semibold transition-colors">View on GitHub</a>
            </div>
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} SGPA Calculator</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
