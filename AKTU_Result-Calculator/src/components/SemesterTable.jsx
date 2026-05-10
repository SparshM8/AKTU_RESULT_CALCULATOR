import React from 'react';

export default function SemesterTable({
    semesterNumber,
    subjects = [],
    marks = [],
    credits = [],
    handleInputChange,
    totalCredits,
    sgpa,
    calculateSGPA
}) {
    const safeMarks = marks.length === subjects.length
        ? marks
        : subjects.map((_, index) => marks[index] || { internal: "", theory: "" });

    return (
        <div className="card flex flex-col p-6 sm:p-8 rounded-2xl w-full max-w-2xl">
            <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-6 flex items-center">
                <span className="h-10 w-10 rounded-lg bg-primary-100 border border-primary-300 text-primary-700 flex items-center justify-center mr-4 text-lg font-bold">
                    {semesterNumber}
                </span>
                <span className="sr-only">Semester</span>
                Semester {semesterNumber}
            </h2>

            <table className="w-full mb-6 text-sm sm:text-base" role="table" aria-label={`Semester ${semesterNumber} subjects`}>
                <thead className="bg-gray-900">
                    <tr>
                        <th className="text-left py-3 px-4 text-gray-50 rounded-l-lg font-semibold">Subject</th>
                        <th className="text-left py-3 px-4 text-gray-50 font-semibold">Internal</th>
                        <th className="text-left py-3 px-4 text-gray-50 rounded-r-lg font-semibold">External</th>
                    </tr>
                </thead>

                <tbody>
                    {subjects.map((subject, index) => {
                        const isLab = String(subject).toLowerCase().includes('lab');
                        const internalMax = isLab ? 50 : 30;
                        const externalMax = isLab ? 50 : 70;

                        return (
                            <tr key={index} className="border-b border-gray-200 hover:bg-primary-50 transition-colors">
                                <td className="py-3 px-4 text-gray-800 font-medium">
                                    {subject} <span className="text-gray-500">({credits[index] || 0})</span>
                                </td>

                                <td className="py-3 px-4">
                                    <input
                                        className="w-full"
                                        placeholder="0"
                                        min={0}
                                        max={internalMax}
                                        step={1}
                                        type="number"
                                        aria-label={`Internal marks for ${subject}`}
                                        value={safeMarks[index]?.internal || ""}
                                        onChange={(e) => handleInputChange(index, "internal", e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const inputs = Array.from(document.querySelectorAll("input[type='number']"));
                                                const idx = inputs.indexOf(e.target);
                                                if (idx > -1 && idx < inputs.length - 1) inputs[idx + 1].focus();
                                            }
                                        }}
                                    />
                                </td>

                                <td className="py-3 px-4 relative">
                                    <input
                                        className="w-full"
                                        placeholder="0"
                                        type="number"
                                        min={0}
                                        max={externalMax}
                                        step={1}
                                        aria-label={`External marks for ${subject}`}
                                        value={safeMarks[index]?.theory || ""}
                                        onChange={(e) => handleInputChange(index, "theory", e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const inputs = Array.from(document.querySelectorAll("input[type='number']"));
                                                const idx = inputs.indexOf(e.target);
                                                if (idx > -1 && idx < inputs.length - 1) inputs[idx + 1].focus();
                                            }
                                        }}
                                    />

                                    {(() => {
                                        const internal = parseInt(safeMarks[index]?.internal) || 0;
                                        const theory = parseInt(safeMarks[index]?.theory) || 0;
                                        if (internal === 0 && theory === 0) return null;

                                        const total = internal + theory;
                                        const thresholds = [40, 45, 50, 60, 70, 80, 90];
                                        let nextThreshold = null;

                                        for (const t of thresholds) {
                                            if (total < t) {
                                                if (t - total <= 2) nextThreshold = t;
                                                break;
                                            }
                                        }

                                        if (!nextThreshold) return null;
                                        const diff = nextThreshold - total;

                                        return (
                                            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 group">
                                                <div role="img" aria-label={`+${diff} marks needed`} className="w-5 h-5 bg-accent-100 border border-accent-300 text-accent-700 rounded-full flex items-center justify-center text-xs font-bold cursor-help shadow-sm animate-pulse">i</div>
                                                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 hidden group-hover:block bg-white text-gray-700 text-[10px] sm:text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap z-20" role="tooltip">
                                                    <span>⚠️ +{diff} marks for {nextThreshold}</span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 mt-auto text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 p-4 rounded-xl">
                <span>Credits: <span className="text-primary-700 font-bold">{totalCredits}</span></span>

                {(() => {
                    const totalObtained = safeMarks.reduce((acc, curr) => acc + (parseInt(curr.internal) || 0) + (parseInt(curr.theory) || 0), 0);
                    const totalMax = safeMarks.length * 100;
                    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

                    return (
                        <>
                            <span>Marks: <span className="text-gray-900 font-bold">{totalObtained}</span>/{totalMax}</span>
                            <span>%: <span className="text-accent-700 font-bold">{percentage}%</span></span>
                        </>
                    );
                })()}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button onClick={calculateSGPA} className="btn-primary" aria-label={`Calculate SGPA for semester ${semesterNumber}`}>
                    Calculate SGPA
                </button>

                <div className="text-2xl sm:text-3xl font-bold text-gray-800" aria-live="polite">
                    SGPA: <span className="text-primary-700">{sgpa}</span>
                </div>
            </div>
        </div>
    );
}
