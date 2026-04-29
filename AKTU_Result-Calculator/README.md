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

## Deployment

This project is ready for Vercel deployment.

### Vercel

1. Import the repository into Vercel.
2. Keep the repository root as the project root.
3. Vercel will use the root [vercel.json](vercel.json) config.
4. Build command: `npm run build`
5. Output directory: `AKTU_Result-Calculator/dist`

### Notes

- The app is a Vite SPA, so the rewrite rule must stay enabled.
- If Vercel asks for a root directory, use the repository root, not the nested app folder.

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

## Screenshots

Add these after capturing fresh deployment images:

- **Usage view**: Show the guide section and the year selector on the landing page.
- **Calculator view**: Show the semester table with marks entered and SGPA visible.
- **Deployment view**: Show the live deployed site on Vercel.

Suggested file names:

- `screenshots/usage.png`
- `screenshots/calculator.png`
- `screenshots/deployment.png`

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
