# AKTU Result Calculator

A comprehensive, ordinance-aligned SGPA, YGPA, and CGPA calculator built for **every** B.Tech student of [AKTU](https://aktu.ac.in/) (Dr. A.P.J. Abdul Kalam Technical University, Lucknow). Pick your branch, paste your marks, and get your semester, yearly, and cumulative GPA — with official pass criteria checked subject by subject.

**Live demo:** [https://myaktucalc.vercel.app](https://myaktucalc.vercel.app)

![AKTU Result Calculator preview](https://img.shields.io/badge/Built%20for-AKTU%20B.Tech-orange)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-6-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)
![License](https://img.shields.io/github/license/SparshM8/AKTU_RESULT_CALCULATOR)

## Why This Tool

AKTU students traditionally calculate GPA by hand using the credit-weighted ordinance formulas — error-prone and slow across eight semesters. This calculator turns that into seconds of work: preloaded branch curricula with correct credits, bulk paste of marks, live grade previews, and per-subject pass verification against the AKTU B.Tech Ordinance (2018-19, revised).

## Features

### Branch Curricula

Select your engineering branch from the **Branch / curriculum** dropdown and the calculator pre-fills all 8 semesters with the representative AKTU subject list — each course carrying its correct name, type (Theory / Lab / Viva / Project), and credit value:

| Branch | Identifier |
|---|---|
| Computer Science & Engg. | `cse` |
| Information Technology | `it` |
| Electronics & Communication Engg. | `ece` |
| Electrical / Electrical & Electronics Engg. | `ee` |
| Mechanical / Automobile Engg. | `me` |
| Civil Engineering | `ce` |
| Other / Custom (start blank) | `custom` |

Every course remains fully editable — rename, re-credit, add, or remove subjects so any college's exact scheme can be represented.

### Fast Data Entry

- **Paste marks** — one textarea fills an entire semester. Accepted formats: `25 65` (internal/external pairs), `25/65` (slash pairs), `25-65` (dash pairs), or plain totals like `90`, which are auto-split by course type (theory 30/70, lab & project 50/50).
- **Copy marks** — copies the semester as lossless `internal/external` pairs for sharing or re-pasting on another device.
- **Enter-key navigation** — pressing Enter jumps to the next marks field.
- All entries are clamped to AKTU mark maxima (theory 30+70, labs 50+50).

### Ordinance-Compliant Calculations

| Metric | Formula |
|---|---|
| Grade point | O=10, A+=9, A=8, B+=7, B=6, C=5, P=4, F=0 (per % band) |
| SGPA | Σ (credits × grade point) / Σ credits, to 2 decimal places |
| YGPA | Credit-weighted average of both semesters of an academic year |
| CGPA | Credit-weighted average across all entered semesters |
| Percentage (2018-19+ batches) | (CGPA − 0.75) × 10 |
| Percentage (up to 2017-18 batches) | CGPA × 10 |

The **admission batch** selector (2015–2026) automatically applies the correct percentage formula for your batch.

### Pass Verification

Each subject is checked against AKTU's actual pass criteria and flagged live:

| Course type | Pass requirement |
|---|---|
| Theory | External ≥ 21/70 **and** total ≥ 40/100 |
| Lab / Viva / Project | External ≥ 25/50 **and** total ≥ 50/100 |

Subjects below the criteria show a **FAIL** badge, and the overall result section warns when backlogs would affect the predicted division.

### Smart Insights

- Live **grade preview** on every course row as you type (grade letter + point).
- **"Marks needed" badges** showing how many more marks (internal or external) are required to reach the next grade boundary, the pass line, or common percentage thresholds.
- **Predicted division** (First / Second / Third) with a backlog warning.

### Year-Long Cumulative View

A dedicated **Yearly GPA (YGPA)** section shows, for each academic year: the year's SGPA, cumulative credits, and the running cumulative SGPA from Year 1 through that year.

### Privacy & Offline-Friendly

All marks are saved automatically in your browser's **LocalStorage** — nothing is uploaded to any server. A single **Reset** button clears everything.

### Responsive Design

- Desktop: full-width course table with inline editing.
- Mobile: stacked course cards with large touch targets, sticky year tabs (Y1–Y5), and a collapsible paste panel — verified at iPhone-class viewports.

## AKTU Grading Scheme (Built-in)

| Percentage | Grade | Point | Description |
|---|---|---|---|
| ≥ 90% | O | 10 | Outstanding |
| 80 – 89% | A+ | 9 | Excellent |
| 70 – 79% | A | 8 | Very Good |
| 60 – 69% | B+ | 7 | Good |
| 50 – 59% | B | 6 | Above Average |
| 45 – 49% | C | 5 | Average |
| 40 – 44% | P | 4 | Pass |
| < 40% | F | 0 | Fail |

## Technical Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom paper-textured theme)
- **Celebration**: Canvas Confetti on SGPA calculation
- **Analytics**: Vercel Web Analytics
- **Deployment**: Vercel (auto-deploys on push to `main`)
- **Quality**: ESLint strict, production build verified, 21-unit AKTU logic test suite + 14-unit paste parser test suite (`test_aktu_logic.mjs`, `test_paste.mjs`)

## Development

```bash
# Install dependencies (pnpm recommended; npm also works)
pnpm install

# Start dev server
pnpm run dev

# Lint
pnpm run lint

# Verify AKTU calculation logic
node test_aktu_logic.mjs
node test_paste.mjs

# Build for production
pnpm run build
```

## Project Structure

```
AKTU_Result-Calculator/
├── src/
│   ├── components/
│   │   ├── Calculator.jsx           # Main app: state, years, YGPA/CGPA sections
│   │   ├── UniversalSemesterTable.jsx # Per-semester table/cards + paste panel
│   │   ├── Header.jsx               # Hero header with animated gradient
│   │   ├── Footer.jsx               # Footer with ordinance citation
│   │   └── CalculatorSection.jsx    # Responsive section wrapper
│   └── constants/
│       ├── aktu.js                  # Grading scale, pass checks, SGPA/YGPA/CGPA
│       ├── branches.js              # Branch curricula (CSE, IT, ECE, EE, ME, CE)
│       ├── paste.js                 # Bulk paste/copy parsing (unit-tested)
│       └── data.js                  # Legacy defaults (backward compatible)
├── index.html                       # SEO meta, Poppins font
├── vite.config.js
├── package.json
└── README.md
```

## Sources

- [AKTU B.Tech Ordinance 2018-19 (Revised)](https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2122/B.%20Tech.%20Ordinance_2018-19%20(Revised).pdf) — grading scale, pass criteria, SGPA/YGPA/CGPA formulas
- AKTU official syllabus pages (`fms.aktu.ac.in`) — branch-wise curriculum structure
- [AKTU grading system — CollegeDekho](https://www.collegedekho.com/articles/aktu-grading-system/) — formula cross-reference

## Disclaimer

This is an unofficial, community-built tool. It follows the AKTU B.Tech Ordinance (2018-19, revised) to the best of our knowledge, but final marks, grades, and divisions are governed solely by the university's official result declaration. Please verify with your college/official result portal.

## Contributing

Pull requests welcome — especially for additional branch curricula or ordinance updates. Please run `pnpm run lint` and the test suites before submitting.

Built with ❤️ by [SparshM8](https://github.com/SparshM8)
