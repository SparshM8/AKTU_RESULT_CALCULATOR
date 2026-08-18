import { COURSE_TYPES, getGrade, checkPass, marksNeededToThresholds } from "../constants/aktu";

export default function UniversalSemesterTable({
    semesterNumber,
    courses = [],
    marks = [],
    handleMarkChange,
    handleRemoveCourse,
    calculateSGPA,
    sgpa,
}) {
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

    return (
        <div className="card flex flex-col p-6 sm:p-8 rounded-2xl w-full">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-6 flex items-center">
                <span className="h-10 w-10 rounded-lg bg-primary-100 border border-primary-300 text-primary-700 flex items-center justify-center mr-4 text-lg font-bold">
                    {semesterNumber}
                </span>
                Semester {semesterNumber}
            </h2>

            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 mb-6">
                <table className="w-full min-w-[640px] text-sm sm:text-base" role="table" aria-label={`Semester ${semesterNumber} courses`}>
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
                        {courses.map((course, index) => {
                            const spec = COURSE_TYPES[course.type] || COURSE_TYPES.theory;
                            const internal = parseInt(marks[index]?.internal) || 0;
                            const external = parseInt(marks[index]?.external) || 0;
                            const total = internal + external;
                            const filled = internal > 0 || external > 0;
                            const grade = getGrade(total);
                            const pass = checkPass(course.type, internal, external);
                            const needed = filled ? marksNeededToThresholds(course.type, internal, external) : [];

                            return (
                                <tr key={course.id} className="border-b border-gray-200 hover:bg-primary-50 transition-colors">
                                    <td className="py-3 px-3 text-gray-800 font-medium">
                                        <input
                                            type="text"
                                            placeholder="Course name"
                                            aria-label={`Course ${index + 1} name`}
                                            value={course.name}
                                            onChange={(e) => {
                                                const newCourses = [...courses];
                                                newCourses[index] = { ...newCourses[index], name: e.target.value };
                                                // Propagated via parent prop? name is managed by parent — use same handler
                                                // We emit through handleMarkChange with a special key for safety:
                                                handleMarkChange(index, "__name__", e.target.value);
                                            }}
                                            className="w-full min-w-[150px] bg-transparent border-2 border-transparent hover:border-gray-300 focus:border-primary-500 px-1 py-1"
                                        />
                                    </td>
                                    <td className="py-3 px-3">
                                        <select
                                            aria-label={`Course type for ${course.name || `course ${index + 1}`}`}
                                            value={course.type}
                                            onChange={(e) => {
                                                const newCourses = [...courses];
                                                newCourses[index] = { ...newCourses[index], type: e.target.value };
                                                handleMarkChange(index, "__type__", e.target.value);
                                            }}
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
                                                const newCourses = [...courses];
                                                newCourses[index] = { ...newCourses[index], credits: v };
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
                                            onKeyDown={(e) => handleKeyDown(e, Array.from(document.querySelectorAll(`#semester-${semesterNumber} input[type='number']`)))}
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
                                            onKeyDown={(e) => handleKeyDown(e, Array.from(document.querySelectorAll(`#semester-${semesterNumber} input[type='number']`)))}
                                        />
                                        <div className="text-[10px] text-gray-400 mt-0.5">/{spec.externalMax}</div>
                                        {filled && needed.map((n, ni) => (
                                            <div
                                                key={ni}
                                                className="absolute right-2 z-10 group"
                                                style={{ top: `${38 + ni * 20}px` }}
                                            >
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
                                        {filled ? (
                                            <div className="flex flex-col">
                                                <span
                                                    className={`font-bold ${
                                                        grade.point === 0 ? "text-red-600" : "text-gray-800"
                                                    }`}
                                                >
                                                    {grade.letter} <span className="text-gray-400 font-normal">({grade.point})</span>
                                                </span>
                                                {!pass.passed && (
                                                    <span className="text-[10px] text-red-600 font-semibold">FAIL</span>
                                                )}
                                                {pass.passed && grade.point > 0 && (
                                                    <span className="text-[10px] text-green-700 font-semibold">Pass</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
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
                        })}
                    </tbody>
                </table>
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
