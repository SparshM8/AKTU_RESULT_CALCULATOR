// This file is intentionally a thin shim.
// The app is now universal: students add their own subjects, so no fixed
// curriculum is shipped. All grading/SGPA/YGPA/CGPA logic lives in ./aktu.js.
// Legacy consumers (e.g. SemesterTable v1) fall back on getGrade here.

export { getGrade as calculateGrade } from "./aktu";

export const YEARS_DATA = {};
