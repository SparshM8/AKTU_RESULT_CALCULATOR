/**
 * Representative AKTU branch curricula (2023-24 revised scheme).
 *
 * These are preloaded starter templates. Every course remains fully editable —
 * students can rename, re-credit, add, or remove any subject, so branches whose
 * exact electives differ can still use the tool accurately.
 *
 * Credits follow the typical AKTU scheme:
 *   Theory        → 3–4 credits (we use the common default: 3 or 4)
 *   Lab / Viva    → 2 credits
 *   Project       → 2 credits (4–6 in final semester projects)
 *
 * Sources:
 *   - AKTU official syllabus pages (fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2324/)
 *   - liet.in/blog/btech-syllabus-subjects.html
 */

export const BRANCHES = [
    {
        id: "cse",
        name: "Computer Science & Engg.",
        short: "CSE",
        color: "bg-primary-100 text-primary-800",
    },
    {
        id: "it",
        name: "Information Technology",
        short: "IT",
        color: "bg-primary-100 text-primary-800",
    },
    {
        id: "ece",
        name: "Electronics & Communication Engg.",
        short: "ECE",
        color: "bg-primary-100 text-primary-800",
    },
    {
        id: "ee",
        name: "Electrical / Electrical & Electronics Engg.",
        short: "EE / EEE",
        color: "bg-primary-100 text-primary-800",
    },
    {
        id: "me",
        name: "Mechanical / Automobile Engg.",
        short: "ME",
        color: "bg-primary-100 text-primary-800",
    },
    {
        id: "ce",
        name: "Civil Engineering",
        short: "CE",
        color: "bg-primary-100 text-primary-800",
    },
    {
        id: "custom",
        name: "Other / Custom (start blank)",
        short: "CUSTOM",
        color: "bg-gray-200 text-gray-700",
    },
];

function t(name, credits) {
    return { name, type: "theory", credits };
}
function l(name, credits = 2) {
    return { name, type: "lab", credits };
}
function p(name, credits = 2) {
    return { name, type: "project", credits };
}

// Common first-year structure shared by all branches.
// AKTU 1st year: two semesters with common subjects.
const FIRST_YEAR = [
    // Semester 1
    [
        t("Engineering Physics (Theory)", 3),
        l("Engineering Physics (Practical)", 2),
        t("Engineering Chemistry (Theory)", 3),
        l("Engineering Chemistry (Practical)", 2),
        t("Engineering Mathematics-I", 4),
        t("Programming for Problem Solving", 3),
        l("Programming for Problem Solving Lab", 2),
    ],
    // Semester 2
    [
        t("Basic Electrical Engineering (Theory)", 3),
        l("Basic Electrical Engineering Lab", 2),
        t("Engineering Mathematics-II", 4),
        t("Professional Communication (Theory)", 3),
        l("Professional Communication Lab", 2),
        t("Universal Human Values & Professional Ethics", 2),
        t("Engineering Graphics & Design", 3),
        l("Engineering Graphics Lab", 2),
    ],
];

const BRANCH_SEMESTERS = {
    // ---------- CSE ----------
    cse: [
        [t("Data Structures", 4), l("Data Structures Lab", 2), t("Discrete Structures & Theory of Logic", 3), t("Python Programming", 3), l("Python Programming Lab", 2), t("Universal Human Values", 2)],
        [t("Object Oriented Programming using Java", 4), l("OOP with Java Lab", 2), t("Computer Organization & Architecture", 4), t("Environmental Science", 3), t("Economics for Engineers", 3), p("Mini Project", 1)],
        [t("Database Management Systems", 4), l("DBMS Lab", 2), t("Compiler Design", 3), t("Design & Analysis of Algorithms", 3), t("Open Elective-I", 3), t("Professional Elective-I", 3)],
        [t("Operating Systems", 4), l("Operating Systems Lab", 2), t("Theory of Automata & Formal Languages", 3), t("Computer Networks", 4), l("Computer Networks Lab", 2), t("Professional Elective-II", 3)],
        [t("Software Engineering", 3), t("Web Technology", 3), l("Web Technology Lab", 2), t("Computer Security", 3), t("Professional Elective-III", 3), t("Open Elective-II", 3)],
        [t("Artificial Intelligence", 3), t("Distributed Systems", 3), t("Mobile Application Development", 3), l("AI/ML Lab", 2), t("Professional Elective-IV", 3), t("Industrial Training Assessment", 2)],
        [t("Cloud Computing", 3), p("Seminar", 2), p("Project Work-I", 4), t("Professional Elective-V", 3), t("Open Elective-III", 3)],
        [p("Project Work-II", 6), t("Professional Elective-VI", 3), t("Open Elective-IV", 3), p("Viva Voce", 2)],
    ],
    // ---------- IT ----------
    it: [
        [t("Data Structures", 4), l("Data Structures Lab", 2), t("Discrete Structures & Theory of Logic", 3), t("Python Programming", 3), l("Python Programming Lab", 2), t("Universal Human Values", 2)],
        [t("Object Oriented Programming using Java", 4), l("OOP with Java Lab", 2), t("Database Management Systems", 4), l("DBMS Lab", 2), t("Digital Electronics", 3), p("Mini Project", 1)],
        [t("Computer Organization & Architecture", 4), t("Computer Networks", 4), l("Computer Networks Lab", 2), t("Software Engineering", 3), t("Open Elective-I", 3), t("Professional Elective-I", 3)],
        [t("Operating Systems", 4), l("Operating Systems Lab", 2), t("Theory of Automata & Formal Languages", 3), t("Design & Analysis of Algorithms", 3), t("Professional Elective-II", 3), t("Environmental Science", 3)],
        [t("Web Technology", 3), l("Web Technology Lab", 2), t("Compiler Design", 3), t("Information Security", 3), t("Professional Elective-III", 3), t("Open Elective-II", 3)],
        [t("Artificial Intelligence", 3), t("Distributed Systems", 3), l("AI Lab", 2), t("Cloud Computing", 3), t("Professional Elective-IV", 3), t("Industrial Training Assessment", 2)],
        [t("Mobile Application Development", 3), p("Seminar", 2), p("Project Work-I", 4), t("Professional Elective-V", 3), t("Open Elective-III", 3)],
        [p("Project Work-II", 6), t("Professional Elective-VI", 3), t("Open Elective-IV", 3), p("Viva Voce", 2)],
    ],
    // ---------- ECE ----------
    ece: [
        [t("Electronic Devices", 4), l("Electronic Devices Lab", 2), t("Network Analysis & Synthesis", 3), t("Engineering Mathematics-III", 3), t("Linear Integrated Circuits", 3), t("Universal Human Values", 2)],
        [t("Analog Electronics", 4), l("Analog Electronics Lab", 2), t("Digital Electronics", 4), l("Digital Electronics Lab", 2), t("Signals & Systems", 3), t("Economics for Engineers", 3)],
        [t("Electromagnetic Field Theory", 3), t("Control Systems", 3), l("Control Systems Lab", 2), t("Microprocessors & Microcontrollers", 4), l("Microprocessor Lab", 2), t("Professional Elective-I", 3)],
        [t("Digital Signal Processing", 4), l("DSP Lab", 2), t("Communication Systems", 4), l("Communication Systems Lab", 2), t("Transmission Lines & Antennas", 3), t("Open Elective-I", 3)],
        [t("VLSI Design", 3), l("VLSI Lab", 2), t("Embedded Systems", 3), l("Embedded Systems Lab", 2), t("Information Theory & Coding", 3), t("Professional Elective-II", 3)],
        [t("Microwave Engineering", 3), t("Mobile Communication", 3), t("Satellite Communication", 3), l("Microwave Lab", 2), t("Open Elective-II", 3), t("Industrial Training Assessment", 2)],
        [t("Optical Communication", 3), p("Seminar", 2), p("Project Work-I", 4), t("Professional Elective-III", 3), t("Open Elective-III", 3)],
        [p("Project Work-II", 6), t("Professional Elective-IV", 3), t("Open Elective-IV", 3), p("Viva Voce", 2)],
    ],
    // ---------- EE / EEE ----------
    ee: [
        [t("Electro-Mechanical Energy Conversion-I", 4), l("Electrical Machines Lab-I", 2), t("Network Analysis & Synthesis", 3), t("Electrical Measurement & Instrumentation", 3), t("Engineering Mathematics-III", 3), t("Universal Human Values", 2)],
        [t("Electro-Mechanical Energy Conversion-II", 4), l("Electrical Machines Lab-II", 2), t("Analog & Digital Electronics", 4), l("Electronics Lab", 2), t("Electromagnetic Theory", 3), t("Economics for Engineers", 3)],
        [t("Electric Machines", 4), l("Electric Machines Lab", 2), t("Control Systems", 3), t("Power Systems-I", 3), t("Instrumentation & Process Control", 3), t("Open Elective-I", 3)],
        [t("Power Electronics", 4), l("Power Electronics Lab", 2), t("Digital Signal Processing", 3), t("Microprocessors & Applications", 3), t("Professional Elective-I", 3), t("Environmental Science", 3)],
        [t("Power Systems-II", 3), l("Power Systems Lab", 2), t("Electrical Drives", 3), t("High Voltage Engineering", 3), t("Professional Elective-II", 3), t("Open Elective-II", 3)],
        [t("Utilization of Electrical Energy", 3), t("Industrial Automation", 3), l("Automation Lab", 2), t("Renewable Energy Systems", 3), t("Open Elective-III", 3), t("Industrial Training Assessment", 2)],
        [t("Smart Grid Technologies", 3), p("Seminar", 2), p("Project Work-I", 4), t("Professional Elective-III", 3), t("Open Elective-IV", 3)],
        [p("Project Work-II", 6), t("Professional Elective-IV", 3), t("Open Elective-V", 3), p("Viva Voce", 2)],
    ],
    // ---------- ME ----------
    me: [
        [t("Strength of Materials", 4), l("Strength of Materials Lab", 2), t("Engineering Thermodynamics", 4), t("Production Technology-I", 3), t("Engineering Mathematics-III", 3), t("Universal Human Values", 2)],
        [t("Fluid Mechanics", 4), l("Fluid Mechanics Lab", 2), t("Thermal Engineering", 3), t("Mechanics of Machines-I", 3), t("Engineering Metallurgy", 3), t("Economics for Engineers", 3)],
        [t("Heat & Mass Transfer", 4), l("Heat Transfer Lab", 2), t("Mechatronics", 3), t("Numerical Methods", 3), t("Turbo Machines", 3), t("Professional Elective-I", 3)],
        [t("Analysis & Design of Machine Components", 4), l("Machine Design Lab", 2), t("Mechanics of Machines-II", 3), t("Automobile Engineering", 3), t("Open Elective-I", 3), t("Environmental Science", 3)],
        [t("Design of Mechanical Drives", 3), l("CAD Lab", 2), t("Refrigeration & Air Conditioning", 3), t("Computer Aided Design & Drafting", 3), t("Professional Elective-II", 3), t("Open Elective-II", 3)],
        [t("Industrial Economics", 3), t("Power Plant Engineering", 3), t("Metrology & Quality Control", 3), l("Metrology Lab", 2), t("Open Elective-III", 3), t("Industrial Training Assessment", 2)],
        [t("Oil Hydraulics & Pneumatics", 3), p("Seminar", 2), p("Project Work-I", 4), t("Professional Elective-III", 3), t("Open Elective-IV", 3)],
        [p("Project Work-II", 6), t("Professional Elective-IV", 3), t("Open Elective-V", 3), p("Viva Voce", 2)],
    ],
    // ---------- CE ----------
    ce: [
        [t("Linear Programming & Operations Research", 3), t("Mechanics of Solids-I", 4), l("Mechanics of Solids Lab", 2), t("Mechanics of Fluids-I", 4), l("Fluid Mechanics Lab", 2), t("Probability & Statistics", 3), t("Universal Human Values", 2)],
        [t("Mechanics of Solids-II", 4), t("Mechanics of Fluids-II", 3), t("Surveying-I", 3), l("Surveying Lab", 2), t("Concrete Technology", 3), t("Numerical Techniques", 3)],
        [t("Structural Analysis-I", 4), t("Concrete Structures-I", 4), l("Concrete Lab", 2), t("Steel Structures-I", 3), t("Environmental Engineering-I", 3), t("Professional Elective-I", 3)],
        [t("Structural Analysis-II", 4), t("Transportation Engineering-I", 3), t("Concrete Structures-II", 3), t("Steel Structures-II", 3), l("Transportation Lab", 2), t("Open Elective-I", 3)],
        [t("Geotechnical Engineering", 3), l("Geotech Lab", 2), t("Hydraulic Machinery & Irrigation", 3), t("Estimation & Costing", 3), t("Professional Elective-II", 3), t("Open Elective-II", 3)],
        [t("Environmental Engineering-II", 3), t("Computer Aided Design", 3), l("CAD Lab", 2), t("Construction Management", 3), t("Open Elective-III", 3), t("Industrial Training Assessment", 2)],
        [t("Matrix Methods of Structural Analysis", 3), t("Transportation Engineering-II", 3), p("Seminar", 2), p("Project Work-I", 4), t("Professional Elective-III", 3)],
        [p("Project Work-II", 6), t("Professional Elective-IV", 3), t("Open Elective-IV", 3), p("Viva Voce", 2)],
    ],
};

/**
 * Build 8 pre-filled semesters for a branch (or blank semesters for custom).
 * Returns [{ courses, sgpa: 0, calculated: false }] × 8.
 */
export function buildBranchSemesters(branchId) {
    let all = [];
    if (branchId === "custom") {
        all = Array.from({ length: 8 }, () => [null]);
    } else {
        // First year common + branch-specific semesters 3-8
        all = [...FIRST_YEAR, ...(BRANCH_SEMESTERS[branchId] || BRANCH_SEMESTERS.cse)];
    }
    let idCounter = 0;
    const makeId = () => `c${Date.now().toString(36)}${(idCounter++).toString(36)}`;
    return all.map((courses) => ({
        courses: courses
            ? courses.map((c) => ({ id: makeId(), name: c.name, type: c.type, credits: c.credits }))
            : [{ id: makeId(), name: "", type: "theory", credits: 3 }],
        sgpa: 0,
        calculated: false,
    }));
}
