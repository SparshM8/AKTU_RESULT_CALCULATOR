import { useState } from "react";
import { COURSE_TYPES, getGrade, checkPass, marksNeededToThresholds } from "../constants/aktu";
import { extractNumbers, mapNumbersToMarks, serializeMarks } from "../constants/paste";

export default function UniversalSemesterTable({
    semesterNumber,
    courses = [],
    marks = [],
    handleMarkChange,
    handleRemoveCourse,
    calculateSGPA,
    sgpa,
    onBulkPaste,
}) {
    const [pasteOpen, setPasteOpen] = useState(false);
    const [pasteText, setPasteText] = useState("");
    const [copied, setCopied] = useState(false);

    const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);

    const totalObtained = marks.reduce(
        (acc, m) => acc + (parseInt(m.internal) || 0) + (parseInt(m.external) || 0),
        0
    );
    const totalMax = courses.reduce((acc, c) => {
        const spec = COURSE_TYPES[c.type] || COURSE_TYPES.theory;
        return acc + spec.internalMax + spec.externalMax;
    }, 0);
    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

    const handleKeyDown = (e, inputs) => {
        if (e.key === "Enter") {
            const idx = inputs.indexOf(e.target);
            if (idx > -1 && idx < inputs.length - 1) inputs[idx + 1].focus();
        }
    };

    // ---------- Shared per-course rendering ----------
    function courseFields(course, index) {
        const spec = COURSE_TYPES[course.type] || COURSE_TYPES.theory;
        const internal = parseInt(marks[index]?.internal) || 0;
        const external = parseInt(marks[index]?.external) || 0;
        const total = internal + external;
        const filled = internal > 0 || external > 0;
        const grade = getGrade(total);
        const pass = checkPass(course.type, internal, external);
        const needed = filled ? marksNeededToThresholds(course.type, internal, external) : [];

        return { course, index, spec, internal, external, total, filled, grade, pass, needed };
    }

    // ---------- Desktop table row ----------
    function desktopRow(f) {
        const { course, index, spec, filled, grade, pass, needed } = f;
        return (
            <tr key={course.id} className="border-b border-gray-200 hover:bg-primary-50 transition-colors">
                <td className="py-3 px-3 text-gray-800 font-medium">
                    <input
                        type="text"
                        placeholder="Course name"
                        aria-label={`Course ${index + 1} name`}
                        value={course.name}
                        onChange={(e) => handleMarkChange(index, "__name__", e.target.value)}
                        className="w-full min-w-[150px] bg-transparent border-2 border-transparent hover:border-gray-300 focus:border-primary-500 px-1 py-1"
                    />
                </td>
                <td className="py-3 px-3">
                    <select
                        aria-label={`Course type for ${course.name || `course ${index + 1}`}`}
                        value={course.type}
                        onChange={(e) => handleMarkChange(index, "__type__", e.target.value)}
                        className="w-full"
                    >
                        {Object.entries(COURSE_TYPES).map(([key, val]) => (
                            <option key={key} value={key}>
                                {val.label}
                            </option>
                        ))}
                    </select>
                </td>
                <td className="py-3 px-3">
                    <input
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        aria-label={`Credits for ${course.name || `course ${index + 1}`}`}
                        value={course.credits}
                        onChange={(e) => {
                            const v = Math.max(0, Math.min(10, parseInt(e.target.value) || 0));
                            handleMarkChange(index, "__credits__", v);
                        }}
                        className="w-16"
                    />
                </td>
                <td className="py-3 px-3">
                    <input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={spec.internalMax}
                        step={1}
                        aria-label={`Internal marks for ${course.name || `course ${index + 1}`}`}
                        value={marks[index]?.internal ?? ""}
                        onChange={(e) => handleMarkChange(index, "internal", e.target.value)}
                        onKeyDown={(e) =>
                            handleKeyDown(
                                e,
                                Array.from(document.querySelectorAll(`#semester-${semesterNumber} input[type='number']`))
                            )
                        }
                    />
                    <div className="text-[10px] text-gray-400 mt-0.5">/{spec.internalMax}</div>
                </td>
                <td className="py-3 px-3 relative">
                    <input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={spec.externalMax}
                        step={1}
                        aria-label={`External marks for ${course.name || `course ${index + 1}`}`}
                        value={marks[index]?.external ?? ""}
                        onChange={(e) => handleMarkChange(index, "external", e.target.value)}
                        onKeyDown={(e) =>
                            handleKeyDown(
                                e,
                                Array.from(document.querySelectorAll(`#semester-${semesterNumber} input[type='number']`))
                            )
                        }
                    />
                    <div className="text-[10px] text-gray-400 mt-0.5">/{spec.externalMax}</div>
                    {filled && needed.map((n, ni) => (
                        <div key={ni} className="absolute right-2 z-10 group" style={{ top: `${38 + ni * 20}px` }}>
                            <div
                                role="img"
                                aria-label={`+${n.needed} marks for ${n.total}`}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold cursor-help shadow-sm ${
                                    n.isExternal
                                        ? "bg-red-100 border border-red-300 text-red-700"
                                        : "bg-accent-100 border border-accent-300 text-accent-700"
                                }`}
                            >
                                i
                            </div>
                            <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-white text-gray-700 text-xs px-3 py-1.5 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap z-20">
                                {n.isExternal ? (
                                    <span>+{n.needed} ext. marks to pass external</span>
                                ) : (
                                    <span>+{n.needed} marks for {n.total}%</span>
                                )}
                            </div>
                        </div>
                    ))}
                </td>
                <td className="py-3 px-3">
                    {gradeCellContent({ grade, pass })}
                </td>
                <td className="py-3 px-3">
                    <button
                        type="button"
                        aria-label={`Remove course ${index + 1}`}
                        onClick={() => handleRemoveCourse(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors text-lg leading-none"
                        title="Remove course"
                    >
                        ✕
                    </button>
                </td>
            </tr>
        );
    }

    // Returns the grade letter + pass/fail label for a course row.
    function gradeCellContent({ grade, pass }) {
        return (
            <div className="flex flex-col">
                <span className={`font-bold ${grade.point === 0 ? "text-red-600" : "text-gray-800"}`}>
                    {grade.letter} <span className="text-gray-400 font-normal">({grade.point})</span>
                </span>
                {!pass.passed && <span className="text-[10px] text-red-600 font-semibold">FAIL</span>}
                {pass.passed && grade.point > 0 && <span className="text-[10px] text-green-700 font-semibold">Pass</span>}
            </div>
        );
    }

    // ---------- Mobile card ----------
    function mobileCard(f) {
        const { course, index, spec, filled, grade, pass, needed } = f;
        return (
            <div key={course.id} className="course-card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <input
                        type="text"
                        placeholder="Course name"
                        aria-label={`Course ${index + 1} name`}
                        value={course.name}
                        onChange={(e) => handleMarkChange(index, "__name__", e.target.value)}
                        className="w-full min-w-0 bg-transparent border-2 border-transparent hover:border-gray-300 focus:border-primary-500 px-1 py-1 font-medium text-gray-800 text-sm"
                    />
                    <button
                        type="button"
                        aria-label={`Remove course ${index + 1}`}
                        onClick={() => handleRemoveCourse(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors text-lg leading-none shrink-0"
                        title="Remove course"
                    >
                        ✕
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="course-card-label mb-1">Type</p>
                        <select
                            aria-label={`Course type for ${course.name || `course ${index + 1}`}`}
                            value={course.type}
                            onChange={(e) => handleMarkChange(index, "__type__", e.target.value)}
                            className="w-full"
                        >
                            {Object.entries(COURSE_TYPES).map(([key, val]) => (
                                <option key={key} value={key}>
                                    {val.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className="course-card-label mb-1">Credits</p>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            step={1}
                            aria-label={`Credits for ${course.name || `course ${index + 1}`}`}
                            value={course.credits}
                            onChange={(e) => {
                                const v = Math.max(0, Math.min(10, parseInt(e.target.value) || 0));
                                handleMarkChange(index, "__credits__", v);
                            }}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="course-card-label mb-1">
                            Internal <span className="text-gray-300">/ {spec.internalMax}</span>
                        </p>
                        <input
                            type="number"
                            placeholder="0"
                            min={0}
                            max={spec.internalMax}
                            step={1}
                            aria-label={`Internal marks for ${course.name || `course ${index + 1}`}`}
                            value={marks[index]?.internal ?? ""}
                            onChange={(e) => handleMarkChange(index, "internal", e.target.value)}
                            onKeyDown={(e) =>
                                handleKeyDown(
                                    e,
                                    Array.from(document.querySelectorAll(`#semester-${semesterNumber} input[type='number']`))
                                )
                            }
                        />
                    </div>
                    <div>
                        <p className="course-card-label mb-1">
                            External <span className="text-gray-300">/ {spec.externalMax}</span>
                        </p>
                        <input
                            type="number"
                            placeholder="0"
                            min={0}
                            max={spec.externalMax}
                            step={1}
                            aria-label={`External marks for ${course.name || `course ${index + 1}`}`}
                            value={marks[index]?.external ?? ""}
                            onChange={(e) => handleMarkChange(index, "external", e.target.value)}
                            onKeyDown={(e) =>
                                handleKeyDown(
                                    e,
                                    Array.from(document.querySelectorAll(`#semester-${semesterNumber} input[type='number']`))
                                )
                            }
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                    {filled ? (
                        gradeCellContent({ grade, pass })
                    ) : (
                        <span className="text-gray-300 text-sm">Enter marks to see the grade</span>
                    )}
                    {filled && (
                        <div className="flex gap-1.5 items-center flex-wrap justify-end">
                            {needed.map((n, ni) => (
                                <span
                                    key={ni}
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                        n.isExternal
                                            ? "bg-red-50 border-red-300 text-red-700"
                                            : "bg-accent-50 border-accent-300 text-accent-700"
                                    }`}
                                    title={n.isExternal ? `+${n.needed} external marks to pass` : `+${n.needed} total marks for ${n.total}%`}
                                >
                                    {n.isExternal ? `+${n.needed} ext. to pass` : `+${n.needed} → ${n.total}%`}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="card flex flex-col p-4 sm:p-6 md:p-8 rounded-2xl w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary-100 border border-primary-300 text-primary-700 flex items-center justify-center mr-3 text-base sm:text-lg font-bold shrink-0">
                    {semesterNumber}
                </span>
                Semester {semesterNumber}
            </h2>

            {/* Quick actions: bulk paste + copy */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setPasteOpen((v) => !v)}
                    className={`text-xs sm:text-sm font-semibold rounded-lg px-3 py-1.5 border-2 transition-colors ${
                        pasteOpen
                            ? "bg-primary-600 border-primary-700 text-white"
                            : "bg-white border-primary-200 text-primary-700 hover:bg-primary-50"
                    }`}
                    aria-expanded={pasteOpen}
                    aria-controls={`paste-box-${semesterNumber}`}
                >
                    {pasteOpen ? "✕ Close paste" : "⌨ Paste marks"}
                </button>
                <button
                    type="button"
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(serializeMarks(courses, marks));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        } catch (e) {
                            /* clipboard unavailable */
                        }
                    }}
                    className="text-xs sm:text-sm font-semibold rounded-lg px-3 py-1.5 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {copied ? "✓ Copied" : "📋 Copy marks"}
                </button>
            </div>

            {pasteOpen && (
                <div
                    id={`paste-box-${semesterNumber}`}
                    className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4 mb-6"
                >
                    <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-2">
                        Paste this semester&apos;s marks in one step
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500 mb-3">
                        Enter numbers in course order, separated by space, comma or tab. Pairs like
                        &quot;25 65&quot; are read as internal/external; a single number is split by course
                        type (theory 30/70, lab 50/50). Slash pairs like &quot;25/30 65/70&quot; also work.
                        Extra values are ignored; only as many courses as exist are filled.
                    </p>
                    <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder={"e.g.  " + courses.slice(0, 3).map((c) => (COURSE_TYPES[c.type] || COURSE_TYPES.theory).internalMax).join("  ")}
                        rows={3}
                        className="w-full text-sm border-2 border-primary-200 rounded-lg px-3 py-2 bg-white focus:border-primary-500 outline-none resize-y"
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            type="button"
                            onClick={() => {
                                const numbers = extractNumbers(pasteText);
                                if (numbers.length === 0) return;
                                const mapped = mapNumbersToMarks(numbers, courses);
                                if (onBulkPaste) onBulkPaste(mapped);
                                setPasteText("");
                                setPasteOpen(false);
                            }}
                            className="btn-primary text-sm px-4 py-1.5"
                        >
                            {"Fill semester (" + extractNumbers(pasteText).length + " number" + (extractNumbers(pasteText).length === 1 ? "" : "s") + ")"}
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop: horizontal table */}
            <div className="hidden sm:block overflow-x-auto mb-6">
                <table className="w-full min-w-[640px] text-sm md:text-base" role="table" aria-label={`Semester ${semesterNumber} courses`}>
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-3 text-gray-50 rounded-l-lg font-semibold">Course</th>
                            <th className="text-left py-3 px-3 text-gray-50 font-semibold">Type</th>
                            <th className="text-left py-3 px-3 text-gray-50 font-semibold">Credits</th>
                            <th className="text-left py-3 px-3 text-gray-50 font-semibold">Internal</th>
                            <th className="text-left py-3 px-3 text-gray-50 font-semibold rounded-r-lg">External</th>
                            <th className="text-left py-3 px-3 text-gray-50 font-semibold">Grade</th>
                            <th className="py-3 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-gray-500">
                                    No courses yet. Add your courses above to start calculating.
                                </td>
                            </tr>
                        )}
                        {courses.map((course, index) => desktopRow(courseFields(course, index)))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: stacked course cards */}
            <div className="sm:hidden flex flex-col gap-4 mb-6">
                {courses.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                        No courses yet. Tap “+ Add Course” to start.
                    </p>
                )}
                {courses.map((course, index) => mobileCard(courseFields(course, index)))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 mt-auto text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 p-4 rounded-xl">
                <span>
                    Credits: <span className="text-primary-700 font-bold">{totalCredits}</span>
                </span>
                <span>
                    Marks: <span className="text-gray-900 font-bold">{totalObtained}</span>/{totalMax}
                </span>
                <span>
                    %: <span className="text-accent-700 font-bold">{percentage}%</span>
                </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button onClick={calculateSGPA} className="btn-primary w-full sm:w-auto" aria-label={`Calculate SGPA for semester ${semesterNumber}`}>
                    Calculate SGPA
                </button>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800" aria-live="polite">
                    SGPA: <span className="text-primary-700">{sgpa}</span>
                </div>
            </div>
        </div>
    );
}
