import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
    COURSE_TYPES,
    getGrade,
    sgpaOf,
    ygpa,
    cgpa,
    cgpaToPercentage,
    checkPass,
} from "../constants/aktu";
import UniversalSemesterTable from "./UniversalSemesterTable";

const STORAGE_KEY = "aktu_universal_v1";

let idCounter = 0;
const makeId = () => `c${Date.now().toString(36)}${(idCounter++).toString(36)}`;

function emptyCourse() {
    return { id: makeId(), name: "", type: "theory", credits: 3 };
}

function defaultSemester() {
    return { courses: [emptyCourse(), emptyCourse(), emptyCourse()], sgpa: 0, calculated: false };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.semesters)) return parsed;
        }
    } catch (e) {
        console.error("Failed to load saved data", e);
    }
    return { admissionYear: 2020, semesters: [defaultSemester()] };
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save data", e);
    }
}

export default function Calculator() {
    const [state, setState] = useState(loadState);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        saveState(state);
    }, [state]);

    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 3000);
    };

    const updateState = (updater) => setState((prev) => ({ ...prev, ...updater(prev) }));

    const setAdmissionYear = (y) => updateState(() => ({ admissionYear: y }));

    // Semester mutations
    const setSemester = (idx, sem) =>
        updateState(() => ({
            semesters: state.semesters.map((s, i) => (i === idx ? sem : s)),
        }));

    const addSemester = () =>
        updateState(() => ({ semesters: [...state.semesters, defaultSemester()] }));

    const removeSemester = (idx) =>
        updateState(() => ({ semesters: state.semesters.filter((_, i) => i !== idx) }));

    const handleMarkChange = (semIdx, courseIdx, field, value) => {
        const sem = state.semesters[semIdx];
        if (field === "__name__") {
            const courses = sem.courses.map((c, i) => (i === courseIdx ? { ...c, name: value } : c));
            setSemester(semIdx, { ...sem, courses });
        } else if (field === "__type__") {
            const spec = COURSE_TYPES[value] || COURSE_TYPES.theory;
            const courses = sem.courses.map((c, i) => {
                if (i !== courseIdx) return c;
                // Re-clamp existing marks to the new course type's maxes
                const m = sem.marks?.[i] || {};
                const clamped = {
                    internal: Math.max(0, Math.min(spec.internalMax, parseInt(m.internal) || 0)),
                    external: Math.max(0, Math.min(spec.externalMax, parseInt(m.external) || 0)),
                };
                if (sem.marks) {
                    const marks = sem.marks.map((x, j) => (j === i ? clamped : x));
                    setSemester(semIdx, { ...sem, courses: undefined, marks });
                }
                return { ...c, type: value };
            });
            setSemester(semIdx, { ...sem, courses });
        } else if (field === "__credits__") {
            const courses = sem.courses.map((c, i) => (i === courseIdx ? { ...c, credits: value } : c));
            setSemester(semIdx, { ...sem, courses });
        } else {
            const marks = [...(sem.marks || sem.courses.map(() => ({ internal: "", external: "" })))];
            marks[courseIdx] = { ...marks[courseIdx], [field]: value };
            setSemester(semIdx, { ...sem, marks });
        }
    };

    const handleRemoveCourse = (semIdx, courseIdx) =>
        setSemester(semIdx, {
            ...state.semesters[semIdx],
            courses: state.semesters[semIdx].courses.filter((_, i) => i !== courseIdx),
            marks: state.semesters[semIdx].marks
                ? state.semesters[semIdx].marks.filter((_, i) => i !== courseIdx)
                : undefined,
        });

    const addCourse = (semIdx) => {
        const sem = state.semesters[semIdx];
        setSemester(semIdx, {
            ...sem,
            courses: [...sem.courses, emptyCourse()],
        });
    };

    const calculateSGPA = (semIdx) => {
        const sem = state.semesters[semIdx];
        const rows = sem.courses.map((c, i) => {
            const marks = sem.marks?.[i] || {};
            const internal = parseInt(marks.internal) || 0;
            const external = parseInt(marks.external) || 0;
            const spec = COURSE_TYPES[c.type] || COURSE_TYPES.theory;
            const grade = getGrade(
                Math.max(0, Math.min(spec.internalMax, internal)) +
                    Math.max(0, Math.min(spec.externalMax, external))
            );
            return { credits: Number(c.credits) || 0, gradePoint: grade.point };
        });
        const value = sgpaOf(rows);
        const newSemesters = state.semesters.map((s, i) =>
            i === semIdx ? { ...s, sgpa: Number(value.toFixed(2)), calculated: true } : s
        );
        setState((prev) => ({ ...prev, semesters: newSemesters }));

        if (value >= 8.5) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    };

    const resetAll = () => {
        if (!window.confirm("Clear all entered data for every semester? This cannot be undone.")) return;
        const fresh = { admissionYear: state.admissionYear, semesters: [defaultSemester()] };
        setState(fresh);
        notify("All data cleared.");
    };

    // Derived aggregates
    const results = useMemo(() => {
        return state.semesters.map((sem, i) => ({
            number: i + 1,
            credits: sem.courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0),
            sgpa: sem.calculated ? sem.sgpa : 0,
        }));
    }, [state.semesters]);

    const totalCredits = results.reduce((s, r) => s + r.credits, 0);
    const cgpaValue = cgpa(results);
    const cgpaDisplay = totalCredits > 0 ? cgpaValue.toFixed(2) : "0.00";
    const percentage = cgpaToPercentage(cgpaValue, state.admissionYear);

    // YGPA: group semesters in pairs (year = 2 semesters)
    const years = useMemo(() => {
        const out = [];
        for (let i = 0; i < results.length; i += 2) {
            const pair = results.slice(i, i + 2);
            const yearNum = Math.floor(i / 2) + 1;
            out.push({
                number: yearNum,
                semesters: pair,
                ygpa: ygpa(pair),
            });
        }
        return out;
    }, [results]);

    // Class / division prediction based on AKTU degree classification
    const hasFailures = state.semesters.some((sem) =>
        sem.courses.some((c, i) => {
            const marks = sem.marks?.[i] || {};
            const filled = (parseInt(marks.internal) || 0) + (parseInt(marks.external) || 0) > 0;
            return filled && !checkPass(c.type, parseInt(marks.internal) || 0, parseInt(marks.external) || 0).passed;
        })
    );
    const hasCalculated = results.some((r) => r.sgpa > 0);
    const classPrediction = (() => {
        if (!hasCalculated || totalCredits === 0) return null;
        const cg = Number(cgpaDisplay);
        if (cg >= 8.5 && !hasFailures) return { label: "First Division with Honours", color: "text-primary-700" };
        if (cg >= 6.5) return { label: "First Division", color: "text-accent-700" };
        if (cg >= 5.0) return { label: "Second Division", color: "text-gray-700" };
        return { label: "Below Pass Standard (CGPA < 5.0)", color: "text-red-600" };
    })();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Global settings bar */}
            <div className="card px-5 py-4 mb-8 flex flex-wrap items-center gap-4 justify-between">
                <div className="flex flex-wrap items-center gap-4">
                    <label htmlFor="admission-year" className="text-sm font-semibold text-gray-700">
                        Admission batch:
                    </label>
                    <select
                        id="admission-year"
                        value={state.admissionYear}
                        onChange={(e) => setAdmissionYear(parseInt(e.target.value))}
                        className="text-sm"
                    >
                        {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>
                                {y} – {y + 1}-{String((y + 2) % 100).padStart(2, "0")}{" "}
                                {y >= 2018 ? "((CGPA − 0.75) × 10)" : "(CGPA × 10)"}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={resetAll}
                    className="border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-semibold rounded-lg text-sm px-5 py-2 transition-colors"
                    title="Reset all data"
                >
                    ⟲ Reset All Data
                </button>
            </div>

            {/* Semester tables */}
            <div className="flex flex-col gap-8">
                {state.semesters.map((sem, idx) => (
                    <div key={idx} className="relative">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                                Year {Math.floor(idx / 2) + 1} · Semester {idx + 1}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => addCourse(idx)}
                                    className="text-sm font-semibold text-primary-700 hover:text-primary-800 border-2 border-primary-200 rounded-lg px-4 py-1.5 transition-colors"
                                >
                                    + Add Course
                                </button>
                                {state.semesters.length > 1 && (
                                    <button
                                        onClick={() => removeSemester(idx)}
                                        className="text-sm font-semibold text-red-600 hover:text-red-700 border-2 border-red-200 rounded-lg px-4 py-1.5 transition-colors"
                                        title={`Remove semester ${idx + 1}`}
                                    >
                                        ✕ Semester
                                    </button>
                                )}
                            </div>
                        </div>
                        <div id={`semester-${idx + 1}`}>
                            <UniversalSemesterTable
                                semesterNumber={idx + 1}
                                courses={sem.courses}
                                marks={sem.marks || sem.courses.map(() => ({ internal: "", external: "" }))}
                                handleMarkChange={(...args) => handleMarkChange(idx, ...args)}
                                handleRemoveCourse={(courseIdx) => handleRemoveCourse(idx, courseIdx)}
                                calculateSGPA={() => calculateSGPA(idx)}
                                sgpa={sem.sgpa || 0}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={addSemester}
                    className="btn-accent text-base"
                >
                    + Add Semester
                </button>
            </div>

            {/* YGPA section */}
            {years.some((y) => y.semesters.some((s) => s.sgpa > 0)) && (
                <section className="mt-12">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-4 text-center">
                        Yearly GPA (YGPA)
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {years.map((y) => (
                            <div key={y.number} className="card px-8 py-5 text-center min-w-[180px]">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Year {y.number}</p>
                                <p className="text-3xl sm:text-4xl font-bold text-accent-700">{y.ygpa.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-2">{y.credits} credits</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CGPA section */}
            <section className="mt-12">
                <div id="box4" className="flex flex-col justify-center items-center gap-6">
                    <div className="text-4xl sm:text-5xl font-bold text-gray-900 flex items-center gap-4">
                        CGPA:{" "}
                        <div className="card px-8 py-3">
                            <span className="text-primary-700">{cgpaDisplay}</span>
                        </div>
                    </div>
                    {totalCredits > 0 && (
                        <p className="text-sm text-gray-500">
                            across {results.filter((r) => r.credits > 0).length} semester(s) · {totalCredits} total credits
                        </p>
                    )}
                    {hasCalculated && (
                        <div className="card px-8 py-4 mt-2 text-center">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Equivalent percentage</p>
                            <p className="text-2xl sm:text-3xl font-bold text-accent-700">
                                {percentage.toFixed(2)}%
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Using {(state.admissionYear >= 2018 ? "(CGPA − 0.75) × 10" : "CGPA × 10")} —{" "}
                                {state.admissionYear >= 2018 ? "2018-19 batch onwards" : "up to 2017-18 batch"}
                            </p>
                        </div>
                    )}
                    {classPrediction && (
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Predicted division:</p>
                            <p className={`text-xl font-bold ${classPrediction.color}`}>{classPrediction.label}</p>
                            {hasFailures && (
                                <p className="text-xs text-red-600 mt-1">
                                    Some entered subjects are below AKTU pass criteria (backlogs) — clear them for the predicted division to hold.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {notification && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium">
                        {notification}
                    </div>
                </div>
            )}
        </div>
    );
}
