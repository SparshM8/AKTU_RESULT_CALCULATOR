# AKTU SGPA Calculator

A lightweight SGPA and YGPA calculator for AKTU B.Tech students. The interface now uses a clean editorial look with warm paper tones, strong typography, and clear hierarchy.

## Features

- Instant SGPA and YGPA calculation
- Auto-save in browser local storage
- Support for 1st, 2nd, 3rd, and 4th year
- Responsive layout for desktop and mobile
- Accessible form controls and semantic sections
- Confetti celebration for strong results

## Visual Style

- **Typography**: Fraunces for headings, Space Grotesk for UI text
- **Palette**: Warm orange and cyan accents on a neutral paper background
- **Cards**: Clean bordered panels with a subtle shadow
- **Controls**: Simple high-contrast inputs and buttons with minimal decoration

## Quick Start

### Requirements

- Node.js 18 or newer
- npm

### Development

```bash
cd AKTU_Result-Calculator
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
└── components/
    ├── Header.jsx
    ├── Footer.jsx
    ├── YearComponent.jsx
    ├── SemesterTable.jsx
    └── GithubStar.jsx

tailwind.config.js
vite.config.js
```

## How It Works

1. Select the year.
2. Enter internal and external marks for each subject.
3. Calculate SGPA for a semester.
4. Calculate YGPA after both semesters are done.
5. Refresh the page and the saved data remains available.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Links

- GitHub: [SparshM8/AKTU_RESULT_CALCULATOR](https://github.com/SparshM8/AKTU_RESULT_CALCULATOR)
- Issues: [Report bugs](https://github.com/SparshM8/AKTU_RESULT_CALCULATOR/issues)

## License

MIT. Built for AKTU students.
