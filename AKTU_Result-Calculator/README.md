# AKTU SGPA Calculator

A modern, beautifully designed SGPA and YGPA calculator for AKTU B.Tech students. Features a premium dark theme with glassmorphism, smooth animations, and gradient accents.

## ✨ Features

- **Instant SGPA/YGPA Calculation** — Real-time semester and yearly GPA computation
- **Dark Mode Premium Design** — Modern glassmorphism with purple-blue gradients
- **Auto-Save** — Data persists in browser local storage
- **Multi-Year Support** — Calculate for 1st, 2nd, 3rd, or 4th year
- **Responsive & Mobile-First** — Perfect on all devices
- **Smooth Animations** — Gradient text, hover effects, and transitions
- **Accessibility** — ARIA labels, keyboard navigation, semantic HTML
- **Celebration Effects** — Confetti animations on high SGPA scores

## 🎨 Modern Dark Theme

### Color System
- **Primary (Purple)**: `#7c3aed` — Main buttons, headers, tables
- **Accent (Blue)**: `#2563eb` — YGPA button, highlights, accents
- **Background**: Deep navy gradient (near-black to dark blue)
- **Typography**: Inter font family with gradient text effects

### Design Elements
- **Glassmorphism Cards** — Frosted glass effect with blur and transparency
- **Gradient Accents** — Purple-to-blue gradients on titles and decorative lines
- **Dark Inputs** — Semi-transparent input fields with glow on focus
- **Smooth Transitions** — All interactive elements have smooth hover effects
- **Premium Shadows** — Soft glowing shadows on cards and buttons

## 🚀 Quick Start

### Requirements
- Node.js (>=18) and npm

### Development
```bash
cd AKTU_Result-Calculator
npm install
npm run dev
```
Open http://localhost:5175 in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── App.jsx                 # Main layout & dark theme styling
├── App.css                 # App-specific styles
├── index.css               # Global dark theme & Tailwind directives
├── main.jsx                # React entry point
└── components/
    ├── Header.jsx          # Glassmorphic navigation header
    ├── Footer.jsx          # Attribution footer with dark styling
    ├── YearComponent.jsx   # Year selector & semester controller
    ├── SemesterTable.jsx   # Dark-themed marks input table
    └── GithubStar.jsx      # GitHub star counter widget

tailwind.config.js          # Theme config (purple/blue colors)
vite.config.js              # Vite bundler configuration
```

## 📝 How to Use

1. **Select Your Year** — Choose 1st, 2nd, 3rd, or 4th year
2. **Enter Your Marks** — Input internal and external marks for each subject
3. **Calculate SGPA** — Click the purple button to compute semester GPA
4. **Calculate YGPA** — After both semesters, click the blue button for yearly average
5. **Auto-Save** — Your data is automatically saved in browser storage

## 🛠️ Technologies

- **React 18** — Modern UI framework
- **Vite 5** — Lightning-fast build tool
- **Tailwind CSS 3** — Utility-first styling with custom theme
- **Canvas Confetti** — Celebration animations
- **@number-flow/react** — Animated number transitions
- **Inter Font** — Beautiful system font from Google Fonts

## 📦 Available Scripts

```bash
npm run dev      # Start dev server (http://localhost:5175)
npm run build    # Optimize for production
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
```

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Purple | #7c3aed | Buttons, headers, table backgrounds |
| Accent Blue | #2563eb | YGPA button, links, accents |
| Dark BG | #0f172a | Main background |
| Glass | rgba(30, 30, 60, 0.6) | Card backgrounds with blur |

### Typography
- **Font**: Inter (wght: 300, 400, 600, 700, 800)
- **Headings**: Bold with gradient text effect
- **Body**: Regular weight for readability

## 🔗 Links

- **GitHub**: [SparshM8/AKTU_RESULT_CALCULATOR](https://github.com/SparshM8/AKTU_RESULT_CALCULATOR)
- **Issues**: [Report bugs](https://github.com/SparshM8/AKTU_RESULT_CALCULATOR/issues)
- **Star**: Show your support ⭐

## 📄 License

MIT — Feel free to use, modify, and share. Created with ❤️ for AKTU B.Tech students.

---

**Made by [@SparshM8](https://github.com/SparshM8) • Premium UI/UX for AKTU Students**
