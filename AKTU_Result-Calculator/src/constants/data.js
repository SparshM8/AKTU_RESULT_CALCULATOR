const BASE_YEARS = {
    1: {
        semester1: {
            number: 1,
            subjects: [
                "Physics",
                "Maths-1",
                "Electrical",
                "PPS",
                "EVS",
                "Physics Lab",
                "Electrical Lab",
                "PPS Lab",
                "Graphics",
            ],
            credits: [4, 4, 3, 3, 3, 1, 1, 1, 2],
        },
        semester2: {
            number: 2,
            subjects: [
                "Chemistry",
                "Maths-2",
                "Electronics",
                "Mechanical",
                "Soft Skills",
                "Chemistry Lab",
                "Electronics Lab",
                "English Lab",
                "Workshop",
            ],
            credits: [4, 4, 3, 3, 3, 1, 1, 1, 2],
        }
    },
    2: {
        semester1: {
            number: 3,
            subjects: [
                "OE",
                "Technical Communication",
                "Data Structures",
                "COA",
                "DSTL",
                "Cyber Security",
                "DSA Lab",
                "COA Lab",
                "Web Designing Workshop",
                "Mini Project",
            ],
            credits: [4, 3, 4, 4, 3, 2, 1, 1, 1, 2],
        },
        semester2: {
            number: 4,
            subjects: [
                "Maths-4",
                "UHV",
                "Operating Systems",
                "Theory of Automata",
                "JAVA",
                "Python Programming",
                "Operating System Lab",
                "JAVA Lab",
                "Cyber Security Workshop",
            ],
            credits: [4, 3, 4, 4, 3, 2, 1, 1, 1],
        }
    },
    3: {
        semester1: {
            number: 5,
            subjects: [
                "Database Management System",
                "Web Technology",
                "Design and Analysis of Algorithm",
                "Departmental Elective-I",
                "Departmental Elective-II",
                "Database Management System Lab",
                "Web Technology Lab",
                "Design and Analysis of Algorithm Lab",
                "Mini Project or Internship",
            ],
            credits: [4, 4, 4, 3, 3, 1, 1, 1, 2],
        },
        semester2: {
            number: 6,
            subjects: [
                "Software Engineering",
                "Compiler Design",
                "Computer Networks",
                "Departmental Elective-III",
                "Open Elective-I",
                "Software Engineering Lab",
                "Compiler Design Lab",
                "Computer Networks Lab",
            ],
            credits: [4, 4, 4, 3, 3, 1, 1, 1],
        }
    },
    4: {
        semester1: {
            number: 7,
            subjects: [
                "Artificial Intelligence",
                "Departmental Elective-IV",
                "Open Elective-II",
                "Artificial Intelligence LAB",
                "Mini Project or Internship Assessment",
                "Project-I",
                "Startup and Entrepreneurial Activity Assessment"
            ],
            credits: [3, 3, 3, 1, 2, 5, 2],
        },
        semester2: {
            number: 8,
            subjects: [
                "Open Elective-III",
                "Open Elective-IV",
                "Project-II"
            ],
            credits: [3, 3, 10],
        }
    }
};

// Provide branch-specific mappings. By default use the same structure for other branches;
// maintainers can replace semester subjects/credits per-branch as needed.
export const BRANCHES_DATA = {
    CSE: BASE_YEARS,
    // Mechanical engineering - placeholder curriculum matching subject counts/credits from BASE_YEARS
    ME: {
        1: BASE_YEARS[1],
        2: BASE_YEARS[2],
        3: {
            semester1: {
                number: 5,
                subjects: [
                    "Applied Thermodynamics",
                    "Mechanics of Materials",
                    "Manufacturing Processes",
                    "Engineering Mathematics",
                    "Material Science",
                    "Manufacturing Lab",
                    "Mechanics Lab",
                    "Workshop Practice",
                    "Mini Project",
                ],
                credits: BASE_YEARS[3].semester1.credits,
            },
            semester2: {
                number: 6,
                subjects: [
                    "Machine Design",
                    "Fluid Mechanics",
                    "Kinematics of Machines",
                    "Heat Transfer",
                    "Dynamics of Machines",
                    "Fluid Mechanics Lab",
                    "Machine Design Lab",
                    "CAD Lab",
                ],
                credits: BASE_YEARS[3].semester2.credits,
            }
        },
        4: BASE_YEARS[4]
    },
    // Civil engineering - placeholder curriculum
    CE: {
        1: BASE_YEARS[1],
        2: BASE_YEARS[2],
        3: {
            semester1: {
                number: 5,
                subjects: [
                    "Structural Analysis",
                    "Building Materials",
                    "Surveying",
                    "Concrete Technology",
                    "Soil Mechanics",
                    "Survey Lab",
                    "Materials Lab",
                    "Drawing Lab",
                    "Mini Project",
                ],
                credits: BASE_YEARS[3].semester1.credits,
            },
            semester2: {
                number: 6,
                subjects: [
                    "Design of Steel Structures",
                    "Hydraulics",
                    "Geotechnical Engineering",
                    "Environmental Engineering",
                    "Transportation Engineering",
                    "Hydraulics Lab",
                    "Geotech Lab",
                    "Env Engg Lab",
                ],
                credits: BASE_YEARS[3].semester2.credits,
            }
        },
        4: BASE_YEARS[4]
    },
    // Biotechnology - placeholder curriculum
    BT: {
        1: BASE_YEARS[1],
        2: BASE_YEARS[2],
        3: {
            semester1: {
                number: 5,
                subjects: [
                    "Biochemistry",
                    "Cell Biology",
                    "Genetics",
                    "Molecular Biology",
                    "Process Calculations",
                    "Bio Lab-I",
                    "Cell Lab",
                    "Genetics Lab",
                    "Mini Project",
                ],
                credits: BASE_YEARS[3].semester1.credits,
            },
            semester2: {
                number: 6,
                subjects: [
                    "Bioprocess Engineering",
                    "Microbiology",
                    "Biochemical Engineering",
                    "Downstream Processing",
                    "Instrumentation",
                    "Bio Lab-II",
                    "Microbiology Lab",
                    "Process Lab",
                ],
                credits: BASE_YEARS[3].semester2.credits,
            }
        },
        4: BASE_YEARS[4]
    }
};

export const calculateGrade = (totalMarks) => {
    if (totalMarks >= 90) return 10;
    if (totalMarks >= 80) return 9;
    if (totalMarks >= 70) return 8;
    if (totalMarks >= 60) return 7;
    if (totalMarks >= 50) return 6;
    if (totalMarks >= 45) return 5;
    if (totalMarks >= 40) return 4;
    return 0;
}; 