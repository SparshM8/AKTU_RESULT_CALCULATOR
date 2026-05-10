import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import { BRANCHES_DATA, calculateGrade } from '../constants/data';
import SemesterTable from './SemesterTable';

function YearComponent({ year, branch = 'CSE' }) {
    const branchData = BRANCHES_DATA[branch] || BRANCHES_DATA['CSE'];
    const yearData = branchData[year];

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

    // LocalStorage keys per branch+year
    const storageKey = (field) => `sgpa_${branch}_${year}_${field}`;

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
    const [uploadFile, setUploadFile] = useState(null);
    const [importSemester, setImportSemester] = useState(1);

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

    // --- Marks upload/import helpers ---
    const normalize = (s) => (s || "").toString().toLowerCase().replace(/\s+/g, "");

    const parseCSV = (text) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length === 0) return [];
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        return lines.slice(1).map(line => {
            const parts = line.split(',');
            const obj = {};
            headers.forEach((h, i) => { obj[h] = (parts[i] || '').trim(); });
            return obj;
        });
    };

    const parsePDF = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const lines = [];
            for (let p = 1; p <= pdf.numPages; p++) {
                const page = await pdf.getPage(p);
                const content = await page.getTextContent();
                const strs = content.items.map(i => i.str);
                // join contiguous strings into a single line approximation
                lines.push(strs.join(' '));
            }

            // Build rows by finding subject names and numbers in lines
            const rows = [];
            for (const line of lines) {
                const nums = (line.match(/\d+/g) || []).map(n => n);
                // heuristics: if a line contains letters and numbers, consider it
                if (/[a-zA-Z]/.test(line) && nums.length > 0) {
                    // take first two numbers as internal and external when possible
                    const subjectText = line.replace(/\d+/g, '').trim();
                    rows.push({ subject: subjectText, internal: nums[0] || '', external: nums[1] || nums[0] || '' });
                }
            }

            // Fallback: if no rows detected, return empty
            return rows;
        } catch (err) {
            console.error('PDF parse failed', err);
            return [];
        }
    };

    const handleImport = async () => {
        if (!uploadFile) return alert('Please choose a CSV or JSON marksheet file first.');

        let rows = [];
        try {
            if (uploadFile.name.toLowerCase().endsWith('.pdf')) {
                rows = await parsePDF(uploadFile);
            } else {
                const text = await uploadFile.text();
                if (uploadFile.name.toLowerCase().endsWith('.json') || text.trim().startsWith('[')) {
                    rows = JSON.parse(text);
                } else {
                    rows = parseCSV(text);
                }
            }
        } catch (err) {
            console.error(err);
            return alert('Failed to parse file. Ensure it is valid CSV, JSON, or PDF.');
        }

        // normalize rows keys
        rows = rows.map(r => {
            const obj = {};
            Object.keys(r).forEach(k => { obj[k.trim().toLowerCase()] = r[k]; });
            return obj;
        });

        // Attempt to auto-detect branch and semester from rows
        const detect = () => {
            const branches = Object.keys(BRANCHES_DATA || {});
            const scores = {};

            const rowSubjects = rows.map(r => normalize(r.subject || r.name || r.sub || ''));

            for (const b of branches) {
                const bd = BRANCHES_DATA[b];
                if (!bd) continue;
                const y = bd[year];
                if (!y) continue;
                const s1 = new Set(y.semester1.subjects.map(s => normalize(s)));
                const s2 = new Set(y.semester2.subjects.map(s => normalize(s)));
                let score = 0;
                let s1matches = 0;
                let s2matches = 0;
                for (const rs of rowSubjects) {
                    if (!rs) continue;
                    if (s1.has(rs)) { score++; s1matches++; }
                    if (s2.has(rs)) { score++; s2matches++; }
                }
                scores[b] = { score, s1matches, s2matches };
            }

            // pick best branch
            const bestBranch = Object.keys(scores).reduce((best, cur) => {
                if (!best) return cur;
                return scores[cur].score > scores[best].score ? cur : best;
            }, null);

            let detectedSemester = importSemester;
            if (bestBranch) {
                const bd = BRANCHES_DATA[bestBranch][year];
                if (bd) {
                    detectedSemester = scores[bestBranch].s1matches >= scores[bestBranch].s2matches ? 1 : 2;
                }
            }

            return { detectedBranch: bestBranch, detectedSemester };
        };

        const { detectedBranch, detectedSemester } = detect();

        const targetSemester = detectedSemester === 1 ? (BRANCHES_DATA[branch] || BRANCHES_DATA['CSE'])[year].semester1 : (BRANCHES_DATA[branch] || BRANCHES_DATA['CSE'])[year].semester2;
        const currentMarks = detectedSemester === 1 ? [...marks1] : [...marks2];

        const newMarks = targetSemester.subjects.map((subject, idx) => {
            const normSub = normalize(subject);
            // try to find by exact match or inclusion
            const found = rows.find(r => {
                const possibleNames = ['subject', 'sub', 'name'];
                for (const key of possibleNames) {
                    if (r[key]) {
                        const rn = normalize(r[key]);
                        if (rn === normSub || rn.includes(normSub) || normSub.includes(rn)) return true;
                    }
                }
                return false;
            });

            if (found) {
                const internal = found.internal || found.internals || found.int || found.internal_marks || found['internal marks'] || found['internal_mark'] || found.internal_mark || '';
                const external = found.external || found.ext || found.theory || found.external_marks || found['external marks'] || found['external_mark'] || found.external_mark || '';
                return { internal: internal.toString(), theory: external.toString() };
            }

            // fallback: keep existing value if present
            return currentMarks[idx] || { internal: "", theory: "" };
        });

        if (detectedBranch && detectedBranch !== branch) {
            // inform user but do not change parent's branch state
            alert(`Detected branch: ${detectedBranch}. Current branch: ${branch}. To use detected branch's curriculum, change branch selection in the header.`);
        }

        if (detectedSemester !== importSemester) {
            alert(`Detected semester ${detectedSemester} from uploaded subjects — importing into that semester.`);
        }

        if (detectedSemester === 1) setMarks1(newMarks); else setMarks2(newMarks);
        alert(`Imported ${rows.length} rows into Semester ${targetSemester.number}.`);
        setUploadFile(null);
    };

    // Reset state when year or branch changes
    useEffect(() => {
        setMarks1(getInitial('marks1', yearData.semester1.subjects.map(() => ({ internal: "", theory: "" }))));
        setMarks2(getInitial('marks2', yearData.semester2.subjects.map(() => ({ internal: "", theory: "" }))));
        setSgpa1(getInitial('sgpa1', 0));
        setSgpa2(getInitial('sgpa2', 0));
        setYgpa(getInitial('ygpa', 0));
    }, [year, branch]);

    // Save to localStorage on change
    useEffect(() => { localStorage.setItem(storageKey('marks1'), JSON.stringify(marks1)); }, [marks1]);
    useEffect(() => { localStorage.setItem(storageKey('marks2'), JSON.stringify(marks2)); }, [marks2]);
    useEffect(() => { localStorage.setItem(storageKey('sgpa1'), JSON.stringify(sgpa1)); }, [sgpa1]);
    useEffect(() => { localStorage.setItem(storageKey('sgpa2'), JSON.stringify(sgpa2)); }, [sgpa2]);
    useEffect(() => { localStorage.setItem(storageKey('ygpa'), JSON.stringify(ygpa)); }, [ygpa]);

    const handleInputChange = (index, type, value) => {
        if (index < 0 || index >= marks1.length) return;
        if (value === "") {
            const newMarks = [...marks1];
            newMarks[index] = { ...newMarks[index], [type]: "" };
            setMarks1(newMarks);
            return;
        }

        const subject = yearData.semester1.subjects[index] || "";
        const isLab = String(subject).toLowerCase().includes('lab');

        const parsed = parseInt(value) || 0;
        const sanitized = type === "internal"
            ? Math.max(0, Math.min(isLab ? 50 : 30, parsed))
            : Math.max(0, Math.min(isLab ? 50 : 70, parsed));

        const newMarks = [...marks1];
        newMarks[index] = { ...newMarks[index], [type]: sanitized };
        setMarks1(newMarks);
    };

    const calculateSGPA = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks1.forEach((mark, index) => {
            const total = (parseInt(mark.internal) || 0) + (parseInt(mark.theory) || 0);
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
        if (value2 === "") {
            const newMarks2 = [...marks2];
            newMarks2[index2] = { ...newMarks2[index2], [type2]: "" };
            setMarks2(newMarks2);
            return;
        }

        const subject2 = yearData.semester2.subjects[index2] || "";
        const isLab2 = String(subject2).toLowerCase().includes('lab');

        const parsed = parseInt(value2) || 0;
        const sanitized2 = type2 === "internal"
            ? Math.max(0, Math.min(isLab2 ? 50 : 30, parsed))
            : Math.max(0, Math.min(isLab2 ? 50 : 70, parsed));

        const newMarks2 = [...marks2];
        newMarks2[index2] = {
            ...newMarks2[index2],
            [type2]: sanitized2,
        };
        setMarks2(newMarks2);
    };

    const calculateSGPA2 = () => {
        let totalCreditPoints = 0;
        let totalCredits = 0;

        marks2.forEach((mark2, index) => {
            const total2 = (parseInt(mark2.internal) || 0) + (parseInt(mark2.theory) || 0);
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
                <div className="flex items-center justify-center gap-3 mt-4">
                    <input
                        type="file"
                        accept=".csv,application/json,text/csv"
                        onChange={(e) => setUploadFile(e.target.files && e.target.files[0])}
                        className="text-sm"
                    />
                    <select value={importSemester} onChange={(e) => setImportSemester(parseInt(e.target.value))} className="px-3 py-2 rounded-md border">
                        <option value={1}>Import to Semester {yearData.semester1.number}</option>
                        <option value={2}>Import to Semester {yearData.semester2.number}</option>
                    </select>
                    <button onClick={handleImport} className="btn-primary">Import</button>
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
