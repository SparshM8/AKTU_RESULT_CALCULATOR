# AKTU Result Calculator (Universal)

A comprehensive, ordinance-aligned SGPA, YGPA, and CGPA calculator for every AKTU (Dr. A.P.J. Abdul Kalam Technical University) B.Tech student.

## Features

- **Universal Curriculum**: Add your own subjects, credits, and course types (Theory, Lab, Project).
- **Official Ordinance Grading**: Implements the AKTU 10-point absolute grading scale (O, A+, A, B+, B, C, P, F).
- **Automatic Pass Verification**: Checks both external minimums (21/70 for theory, 25/50 for labs) and total aggregate (40/100) per subject.
- **Yearly & Cumulative Metrics**: Calculates SGPA per semester, YGPA per academic year, and overall CGPA.
- **Batch-Specific Percentage**: Supports both pre-2018 (`CGPA × 10`) and 2018-19+ (`(CGPA − 0.75) × 10`) conversion formulas.
- **Smart Insights**: Shows "marks needed" to reach the next grade or pass boundary.
- **Privacy First**: All data is stored locally in your browser (LocalStorage).

## AKTU Grading Scheme (Built-in)

| Percentage | Grade | Point | Description |
|------------|-------|-------|-------------|
| ≥ 90%      | O     | 10    | Outstanding |
| 80 – 89%   | A+    | 9     | Excellent   |
| 70 – 79%   | A     | 8     | Very Good   |
| 60 – 69%   | B+    | 7     | Good        |
| 50 – 59%   | B     | 6     | Above Avg   |
| 45 – 49%   | C     | 5     | Average     |
| 40 – 44%   | P     | 4     | Pass        |
| < 40%      | F     | 0     | Fail        |

## Technical Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Canvas Confetti
- **Deployment**: Vercel (Analytics enabled)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Disclaimer

This is an unofficial tool based on the AKTU B.Tech Ordinance (2018-19, revised). Final marks and grades are governed by the university's official result declaration.

Built with ❤️ by [SparshM8](https://github.com/SparshM8)
