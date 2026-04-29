import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import { YEARS_DATA, calculateGrade } from '../constants/data';
import SemesterTable from './SemesterTable';

function YearComponent({ year }) {
    const yearData = YEARS_DATA[year];

    if (!yearData || !yearData.semester1 || !yearData.semester2) {
        return <div>Invalid year selected</div>;
    }

    // Validate data integrity
    if (yearData.semester1.subjects.length !== yearData.semester1.credits.length) {
        console.error(`Semester ${yearData.semester1.number}: subjects/credits length mismatch`,
            yearData.semester1.subjects.length, yearData.semester1.credits.length);
    }
    if (yearData.semester2.subjects.length !== yearData.semester2.credits.length) {
        console.error(`Semester ${yearData.semester2.number}: subjects/credits length mismatch`,
            yearData.semester2.subjects.length, yearData.semester2.credits.length);
    }

    // LocalStorage keys per year
    const storageKey = (field) => `sgpa_${year}_${field}`;

    // Load from localStorage or default
    const getInitial = (field, defaultValue) => {
        try {
            const val = localStorage.getItem(storageKey(field));
            if (val) return JSON.parse(val);
        } catch { }
        return defaultValue;
    };

    const [marks1, setMarks1] = useState(() => getInitial('marks1', yearData.semester1.subjects.map(() => ({ internal: "", theory: "" }))));
    const [marks2, setMarks2] = useState(() => getInitial('marks2', yearData.semester2.subjects.map(() => ({ internal: "", theory: "" }))));
    const [sgpa1, setSgpa1] = useState(() => getInitial('sgpa1', 0));
    const [sgpa2, setSgpa2] = useState(() => getInitial('sgpa2', 0));
    const [ygpa, setYgpa] = useState(() => getInitial('ygpa', 0));

    // Reset handler for this year
    const handleReset = () => {
        localStorage.removeItem(storageKey('marks1'));
        localStorage.removeItem(storageKey('marks2'));
        localStorage.removeItem(storageKey('sgpa1'));
        localStorage.removeItem(storageKey('sgpa2'));
        localStorage.removeItem(storageKey('ygpa'));
        setMarks1(yearData.semester1.subjects.map(() => ({ internal: "", theory: "" })));
        setMarks2(yearData.semester2.subjects.map(() => ({ internal: "", theory: "" })));
        setSgpa1(0);
        setSgpa2(0);
        setYgpa(0);
    };

    // Reset state when year changes
    useEffect(() => {
        setMarks1(getInitial('marks1', yearData.semester1.subjects.map(() => ({ internal: "", theory: "" }))));
        setMarks2(getInitial('marks2', yearData.semester2.subjects.map(() => ({ internal: "", theory: "" }))));
        setSgpa1(getInitial('sgpa1', 0));
        setSgpa2(getInitial('sgpa2', 0));
        setYgpa(getInitial('ygpa', 0));
    }, [year]);

    // Save to localStorage on change
    useEffect(() => { localStorage.setItem(storageKey('marks1'), JSON.stringify(marks1)); }, [marks1]);
    useEffect(() => { localStorage.setItem(storageKey('marks2'), JSON.stringify(marks2)); }, [marks2]);
    useEffect(() => { localStorage.setItem(storageKey('sgpa1'), JSON.stringify(sgpa1)); }, [sgpa1]);
    useEffect(() => { localStorage.setItem(storageKey('sgpa2'), JSON.stringify(sgpa2)); }, [sgpa2]);
    useEffect(() => { localStorage.setItem(storageKey('ygpa'), JSON.stringify(ygpa)); }, [ygpa]);

    const handleInputChange = (index, type, value) => {
        if (index < 0 || index >= marks1.length) return;
        const sanitized = value === "" ? "" : Math.max(0, Math.min(100, parseInt(value) || 0));
        const newMarks = [...marks1];
        newMarks[index] = { ...newMarks[index], [type]: sanitized };
        setMarks1(newMarks);
    };

    const calculateSGPA = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks1.forEach((mark, index) => {
            const total = mark.internal + mark.theory;
            const grade = calculateGrade(total);
            const credit = yearData.semester1.credits[index] || 0;

            // Only include subjects with credits > 0 in SGPA calculation
            if (credit > 0) {
                const creditPoints = grade * credit;
                totalCreditPoints += creditPoints;
                totalCredits += credit;
            }
        });

        // Prevent division by zero
        const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
        console.log(`Semester ${yearData.semester1.number}: totalCreditPoints=${totalCreditPoints}, totalCredits=${totalCredits}, SGPA=${sgpa}`);
        setSgpa1(sgpa.toFixed(2));

        if (sgpa >= 8.5) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const handleInputChange2 = (index2, type2, value2) => {
        if (index2 < 0 || index2 >= marks2.length) return;
        const sanitized = value2 === "" ? "" : Math.max(0, Math.min(100, parseInt(value2) || 0));
        const newMarks2 = [...marks2];
        newMarks2[index2] = {
            ...newMarks2[index2],
            [type2]: sanitized,
        };
        setMarks2(newMarks2);
    };

    const calculateSGPA2 = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks2.forEach((mark2, index) => {
            const total2 = mark2.internal + mark2.theory;
            const grade2 = calculateGrade(total2);
            const credit2 = yearData.semester2.credits[index] || 0;

            // Only include subjects with credits > 0 in SGPA calculation
            if (credit2 > 0) {
                const creditPoints2 = grade2 * credit2;
                totalCreditPoints += creditPoints2;
                totalCredits += credit2;
            }
        });

        // Prevent division by zero
        const sgpa2 = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
        console.log(`Semester ${yearData.semester2.number}: totalCreditPoints=${totalCreditPoints}, totalCredits=${totalCredits}, SGPA=${sgpa2}`);
        setSgpa2(sgpa2.toFixed(2));

        if (sgpa2 >= 8.5) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const calculateYGPA = () => {
        // Calculate total credits for each semester (excluding zero credits)
        const semester1Credits = yearData.semester1.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0);
        const semester2Credits = yearData.semester2.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0);

        const totalCredits = semester1Credits + semester2Credits;

        // Prevent division by zero and ensure valid SGPA values
        if (totalCredits > 0 && !isNaN(parseFloat(sgpa1)) && !isNaN(parseFloat(sgpa2))) {
            const final = (parseFloat(sgpa1) * semester1Credits + parseFloat(sgpa2) * semester2Credits) / totalCredits;
            setYgpa(final.toFixed(2));
        } else {
            setYgpa("0.00");
        }
    };

    return (
        <>
            <div className="flex flex-col max-w-7xl mx-auto gap-8">
                <div className="flex justify-end">
                    <button
                        onClick={handleReset}
                        className="border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 font-semibold rounded-lg text-sm px-6 py-2.5 transition-colors duration-200"
                        title="Reset all data for this year"
                    >
                        ⟲ Reset All Data
                    </button>
                </div>
                <div className="flex flex-wrap gap-6 sm:gap-12 justify-center">
                    <SemesterTable
                        semesterNumber={yearData.semester1.number}
                        subjects={yearData.semester1.subjects}
                        marks={marks1}
                        credits={yearData.semester1.credits}
                        handleInputChange={handleInputChange}
                        totalCredits={yearData.semester1.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0)}
                        sgpa={sgpa1}
                        calculateSGPA={calculateSGPA}
                    />
                    <SemesterTable
                        semesterNumber={yearData.semester2.number}
                        subjects={yearData.semester2.subjects}
                        marks={marks2}
                        credits={yearData.semester2.credits}
                        handleInputChange={handleInputChange2}
                        totalCredits={yearData.semester2.credits.filter(credit => credit > 0).reduce((a, b) => a + b, 0)}
                        sgpa={sgpa2}
                        calculateSGPA={calculateSGPA2}
                    />
                </div>
            </div>

            {(() => {
                const marks1Total = marks1.reduce((acc, curr) => acc + ((parseInt(curr.internal) || 0) + (parseInt(curr.theory) || 0)), 0);
                const marks2Total = marks2.reduce((acc, curr) => acc + ((parseInt(curr.internal) || 0) + (parseInt(curr.theory) || 0)), 0);
                const totalObtained = marks1Total + marks2Total;
                const totalMax = (marks1.length + marks2.length) * 100;
                const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

                return (
                    <div className="card px-8 py-4 mt-6 w-fit mx-auto">
                        <div className="flex gap-6 text-gray-700 font-semibold text-lg">
                            <span>Total: <span className="text-gray-900">{totalObtained}</span>/{totalMax}</span>
                            <span className="w-px bg-gray-300"></span>
                            <span>% Score: <span className="text-accent-700 font-bold">{percentage}%</span></span>
                        </div>
                    </div>
                );
            })()}

            <div id="box4" className="flex flex-col justify-center items-center mt-10 w-full gap-6">
                <button
                    onClick={calculateYGPA}
                    className="btn-accent text-lg"
                    aria-label="Calculate yearly YGPA"
                >
                    Calculate YGPA
                </button>
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 flex items-center gap-4">
                    YGPA: <div className="card px-8 py-3"><span className="text-accent-700">{ygpa}</span></div>
                </div>
            </div>
        </>
    );
}

export default YearComponent;
