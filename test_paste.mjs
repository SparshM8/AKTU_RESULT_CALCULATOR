import { extractNumbers, mapNumbersToMarks, serializeMarks } from "./AKTU_Result-Calculator/src/constants/paste.js";

const t = (name, credits) => ({ name, type: "theory", credits });
const l = (name, credits = 2) => ({ name, type: "lab", credits });
const p = (name, credits = 2) => ({ name, type: "project", credits });

const sem1 = [t("Physics", 3), l("Physics Lab", 2), t("Maths-I", 4), t("Python", 3), l("Python Lab", 2)];
const semLab = [l("Physics Lab", 2), l("Chem Lab", 2)];

let pass = 0, fail = 0;
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
    if (!ok) { console.log("  expected:", JSON.stringify(expected)); console.log("  actual  :", JSON.stringify(actual)); fail++; } else pass++;
}

// extractNumbers
check("comma/space/tab extraction", extractNumbers("25, 65\t22 40"), [25, 65, 22, 40]);
check("slash pairs extraction", extractNumbers("25/65 22/40"), [25, 65, 22, 40]);
check("dash/split pair extraction", extractNumbers("25-65, 22-40"), [25, 65, 22, 40]);
check("ignores letters", extractNumbers("Physics 25 ext 65"), [25, 65]);

// pair parsing: first pair (25 <= 30) with next (65 <= 70) → internal/external
check("theory pair parsing", mapNumbersToMarks([25, 65, 22, 40, 20, 20], sem1), [
    { internal: "25", external: "65" },
    { internal: "22", external: "40" },
    { internal: "20", external: "20" },
    { internal: "", external: "" },
    { internal: "", external: "" },
]);

// lab pair: (50,50) both fit → pair
check("lab pair parsing", mapNumbersToMarks([50, 50, 45, 48], semLab), [
    { internal: "50", external: "50" },
    { internal: "45", external: "48" },
]);

// single total for theory: 90 → internal 30, external 60
check("theory single total split", mapNumbersToMarks([90, 62], [t("A", 3)]), [
    { internal: "30", external: "60" },
]);

// single total for lab: 80 → internal 50, external 30
check("lab single total split", mapNumbersToMarks([80], [l("A", 2)]), [
    { internal: "50", external: "30" },
]);

// single total below internal max (lab, 30) → all internal
check("lab total below internal max", mapNumbersToMarks([30], [l("A", 2)]), [
    { internal: "30", external: "0" },
]);

// total over both maxima (theory 120) → capped at 30+70
check("theory total capped at max", mapNumbersToMarks([120], [t("A", 3)]), [
    { internal: "30", external: "70" },
]);

// extra numbers beyond course count are ignored
check("extra numbers ignored", mapNumbersToMarks([25, 65, 9, 9, 9], [t("A", 3)]), [
    { internal: "25", external: "65" },
]);

// serializeMarks (lossless internal/external pairs)
check("serializeMarks output", serializeMarks(sem1, [
    { internal: "25", external: "65" },
    { internal: "50", external: "50" },
    {}, {}, {}
]).trim(), "25/65  50/50  0/0  0/0  0/0");

// round-trip: paste the slash-pair serialized string back via tokenize + applyTokens
const { tokenize, applyTokens } = await import("./AKTU_Result-Calculator/src/constants/paste.js");
const serialized = serializeMarks(sem1, [
    { internal: "25", external: "65" },
    { internal: "50", external: "50" },
    { internal: "20", external: "20" },
    { internal: "21", external: "65" },
    { internal: "40", external: "50" },
]);
const roundTrip = applyTokens(tokenize(serialized), sem1);
check("round-trip paste (slash pairs)", roundTrip, [
    { internal: "25", external: "65" },
    { internal: "50", external: "50" },
    { internal: "20", external: "20" },
    { internal: "21", external: "65" },
    { internal: "40", external: "50" },
]);

// tokenize honors plain number pairs too
check("tokenize plain pairs", tokenize("25 65 22 40").length, 4);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
