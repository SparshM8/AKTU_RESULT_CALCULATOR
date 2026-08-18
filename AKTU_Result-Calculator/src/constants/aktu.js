/**
 * AKTU official grading & computation rules.
 *
 * Sources:
 * - AKTU B.Tech Ordinance 2018-19 (Revised), Sections 14.1-14.4
 *   https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2122/B.%20Tech.%20Ordinance_2018-19%20(Revised).pdf
 * - AKTU CGPA-to-percentage official formula, Letter No. AKTU/RO/2019/1421
 *
 * Official 10-point absolute grade scale (total % = (internal + external) / total max):
 *   >=90   -> O  (10)  Outstanding
 *   80-89  -> A+ ( 9)  Excellent
 *   70-79  -> A  ( 8)  Very Good
 *   60-69  -> B+ ( 7)  Good
 *   50-59  -> B  ( 6)  Above Average
 *   45-49  -> C  ( 5)  Average
 *   40-44  -> P  ( 4)  Pass
 *   <40    -> F  ( 0)  Fail  -> subject backlog
 *
 * Marks split:
 *   Theory          : Internal 30 + External 70 = 100
 *   Lab / Viva      : Internal 50 + External 50 = 100
 *   Project / Sem   : Internal 50 + External 50 = 100
 *
 * Pass conditions:
 *   Theory : external >= 21/70  AND  total >= 40/100
 *   Lab    : external >= 25/50  AND  total >= 40/100 (50% of external per ordinance 14.2 for practicals)
 *
 * Formulas:
 *   SGPA = sum(Ci * Gi) / sum(Ci)                      (per semester, 2 decimals)
 *   YGPA = (SGPA1 * C1 + SGPA2 * C2) / (C1 + C2)       (per academic year)
 *   CGPA = sum(Ci * Si) / sum(Ci)                      (across all semesters)
 *   Percentage (2018-19 batch onwards) = (CGPA - 0.75) * 10
 *   Percentage (up to 2017-18 batch) = CGPA * 10
 */

export const COURSE_TYPES = {
    theory: { label: "Theory", internalMax: 30, externalMax: 70 },
    lab: { label: "Lab / Viva", internalMax: 50, externalMax: 50 },
    project: { label: "Project / Seminar", internalMax: 50, externalMax: 50 },
};

export const GRADE_SCALE = [
    { min: 90, point: 10, letter: "O", label: "Outstanding" },
    { min: 80, point: 9, letter: "A+", label: "Excellent" },
    { min: 70, point: 8, letter: "A", label: "Very Good" },
    { min: 60, point: 7, letter: "B+", label: "Good" },
    { min: 50, point: 6, letter: "B", label: "Above Average" },
    { min: 45, point: 5, letter: "C", label: "Average" },
    { min: 40, point: 4, letter: "P", label: "Pass" },
    { min: 0, point: 0, letter: "F", label: "Fail" },
];

export function getGrade(totalMarks) {
    for (const g of GRADE_SCALE) {
        if (totalMarks >= g.min) return g;
    }
    return GRADE_SCALE[GRADE_SCALE.length - 1];
}

/**
 * AKTU pass check. Returns { passed, reasons[] }.
 * Theory: external >= 21/70 and total >= 40/100.
 * Lab/Project: external >= 25/50 and total >= 40/100.
 */
export function checkPass(courseType, internal, external) {
    const spec = COURSE_TYPES[courseType] || COURSE_TYPES.theory;
    const reasons = [];
    const total = (internal || 0) + (external || 0);

    const extPass = courseType === "theory" ? external >= 21 : external >= 25;
    if (!extPass) {
        reasons.push(
            `External below pass minimum (${courseType === "theory" ? 21 : 25}/${spec.externalMax})`
        );
    }
    if (total < 40) {
        reasons.push(`Total ${total}/100 is below 40 (Grade F → backlog)`);
    }
    return { passed: reasons.length === 0, reasons };
}

export function sgpaOf(rows) {
    // rows: [{ credits, gradePoint }]  — credits of non-credit courses (0) are excluded
    let gp = 0;
    let credits = 0;
    for (const r of rows) {
        if (!r.credits || r.credits <= 0) continue;
        gp += r.credits * (r.gradePoint || 0);
        credits += r.credits;
    }
    return credits > 0 ? gp / credits : 0;
}

export function ygpa(semesterResults) {
    // semesterResults: [{ credits, sgpa }]
    let num = 0;
    let denom = 0;
    for (const s of semesterResults) {
        if (!s.credits || s.credits <= 0) continue;
        num += s.credits * (s.sgpa || 0);
        denom += s.credits;
    }
    return denom > 0 ? num / denom : 0;
}

export function cgpa(semesterResults) {
    return ygpa(semesterResults);
}

/**
 * Batch-wise CGPA -> percentage conversion.
 * AKTU Letter No. AKTU/RO/2019/1421: batches admitted 2018-19 onwards use (CGPA - 0.75) * 10.
 * Older batches use CGPA * 10.
 */
export function cgpaToPercentage(cgpaValue, admissionYear) {
    const cg = Number(cgpaValue) || 0;
    return admissionYear >= 2018 ? (cg - 0.75) * 10 : cg * 10;
}

/**
 * Marks the student still needs to reach the next grade / pass boundary.
 * Returns list of { label, needed } (needed <= 0 means already there).
 */
export function marksNeededToThresholds(courseType, internal, external) {
    const total = (internal || 0) + (external || 0);
    const results = [];
    const thresholds = [40, 45, 50, 60, 70, 80, 90];
    for (const t of thresholds) {
        if (total < t) results.push({ total: t, needed: t - total });
        if (results.length >= 3) break;
    }
    // External pass boundary
    const extPass = courseType === "theory" ? 21 : 25;
    if (external < extPass) {
        results.push({ total: extPass, needed: extPass - external, isExternal: true });
    }
    return results.slice(0, 3);
}
