// Verification tests for AKTU rules using worked examples from official ordinance
// and the gpatoopercentage.com reference worked example.
import {
  getGrade,
  checkPass,
  sgpaOf,
  ygpa,
  cgpa,
  cgpaToPercentage,
} from "./AKTU_Result-Calculator/src/constants/aktu.js";

let pass = 0;
let fail = 0;
function t(name, actual, expected) {
  const ok = Math.abs(Number(actual) - Number(expected)) < 1e-9;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${actual} ${ok ? "" : `!== ${expected}`}`);
  ok ? pass++ : fail++;
}

// --- Grade scale ---
t("grade 95 -> O(10)", getGrade(95).point, 10);
t("grade 85 -> A+(9)", getGrade(85).point, 9);
t("grade 72 -> A(8)", getGrade(72).point, 8);
t("grade 63 -> B+(7)", getGrade(63).point, 7);
t("grade 54 -> B(6)", getGrade(54).point, 6);
t("grade 47 -> C(5)", getGrade(47).point, 5);
t("grade 42 -> P(4)", getGrade(42).point, 4);
t("grade 39 -> F(0)", getGrade(39).point, 0);

// --- Worked example from reference (Sem 1) ---
// Eng Maths 4cr A+ (36/40=90 -> O? Actually 90 -> 10): total % 90 => O(10) -> 40
// Physics 3cr A (8): total 80 => A+? 80 -> 9. Reference used A(8) for 80 exactly? Reference row said A = 24/3*8 = 80% -> A+ per ordinance (>=80). We follow ordinance.
// Reference source used a different letter mapping (90->O, 80->A=8, 70->B+=7,
// 60->B=6, lab O=10). Per the official ordinance table, same score bands map
// one step higher (80% -> A+ = 9, 70% -> A = 8, 60% -> B+ = 7). Our calculator
// follows the ordinance; this test records the ordinance-correct value.
const sem1 = [
  { credits: 4, gradePoint: getGrade(90).point },   // 90% -> O(10) = 40
  { credits: 3, gradePoint: getGrade(80).point },   // 80% -> A+(9) = 27
  { credits: 4, gradePoint: getGrade(70).point },   // 70% -> A(8) = 32
  { credits: 3, gradePoint: getGrade(60).point },   // 60% -> B+(7) = 21
  { credits: 1, gradePoint: getGrade(100).point },  // lab 100% -> O(10) = 10
];
const s1 = sgpaOf(sem1);
t("SGPA sem1 (ordinance-correct: 8.67; ref site's own letters gave 7.73)", s1.toFixed(2), "8.67");

// Failed 4cr course: F(0)
const sem1Fail = [
  { credits: 4, gradePoint: 10 },
  { credits: 3, gradePoint: 9 },
  { credits: 4, gradePoint: 0 },
  { credits: 3, gradePoint: 7 },
  { credits: 1, gradePoint: 10 },
];
t("SGPA with fail (ordinance-correct: 6.53)", sgpaOf(sem1Fail).toFixed(2), "6.53");

// --- YGPA worked example ---
const y = ygpa([
  { credits: 15, sgpa: 7.73 },
  { credits: 17, sgpa: 8.2 },
]);
t("YGPA (reference: 7.98)", y.toFixed(2), "7.98");

// --- CGPA worked example ---
const c = cgpa([
  { credits: 15, sgpa: 7.73 },
  { credits: 17, sgpa: 8.2 },
  { credits: 16, sgpa: 7.5 },
]);
t("CGPA (reference: 7.82)", c.toFixed(2), "7.82");

// --- Percentage conversion ---
t("CGPA 7.8 -> 70.5% (2018+ batch)", cgpaToPercentage(7.8, 2020), 70.5);
t("CGPA 8.0 -> 72.5%", cgpaToPercentage(8.0, 2021), 72.5);
t("CGPA 10.0 -> 92.5%", cgpaToPercentage(10.0, 2022), 92.5);
t("CGPA 8.0 -> 80.0% (pre-2018 batch)", cgpaToPercentage(8.0, 2017), 80.0);

// --- Pass checks ---
t("theory pass 22 ext + 20 int = 42", checkPass("theory", 20, 22).passed, true);
t("theory fail ext 20", checkPass("theory", 25, 20).passed, false);
t("theory fail total 39", checkPass("theory", 18, 21).passed, false);
t("lab pass 30/50 ext + 12 int = 42", checkPass("lab", 12, 30).passed, true);
t("lab fail ext 24", checkPass("lab", 40, 24).passed, false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
