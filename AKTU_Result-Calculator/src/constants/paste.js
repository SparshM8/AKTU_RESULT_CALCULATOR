/**
 * Bulk "Paste marks" helpers.
 *
 * Lets a student fill an entire semester in one step by pasting a row of
 * numbers (e.g. copied from a spreadsheet, the AKTU marks card, or this
 * calculator's own "Copy marks" text) into a single textarea.
 *
 * Input formats accepted:
 *   1. Slash pairs (lossless, from this calculator's Copy / manual entry):
 *        "25/65  50/50  20/20"   → internal/external per course
 *   2. Plain number pairs:
 *        "25 65  22 40"          → pairs (internal, external) per course
 *   3. Single totals (auto-split by course type: theory 30/70, lab 50/50):
 *        "90 100 40"             → one number per course
 *   4. Mixed: "25/65  50/50  90"
 *
 * Values are separated by any whitespace, comma, tab, dash, or slash-pair delimiters.
 * Extra values beyond the semester's course count are ignored.
 */

/** Parse a whitespace-separated token list into paired/single tokens. */
export function tokenize(text) {
    const tokens = [];
    const parts = text.split(/[-\s,]+/).filter(Boolean);
    for (const part of parts) {
        // slash pair: "25/65" or "25/30"
        const pairMatch = part.match(/^(\d+)\/(\d+)$/);
        if (pairMatch) {
            tokens.push({ kind: "pair", internal: parseInt(pairMatch[1], 10), external: parseInt(pairMatch[2], 10) });
            continue;
        }
        const n = parseInt(part, 10);
        if (Number.isFinite(n) && n >= 0) tokens.push({ kind: "single", value: n });
    }
    return tokens;
}

/** Extract a flat ordered list of numbers from raw pasted text. */
export function extractNumbers(text) {
    return tokenize(text)
        .flatMap((tok) => (tok.kind === "pair" ? [tok.internal, tok.external] : [tok.value]))
        .filter((n) => Number.isFinite(n) && n >= 0);
}

export function courseSpec(type) {
    const spec = { theory: { internalMax: 30, externalMax: 70 }, lab: { internalMax: 50, externalMax: 50 }, project: { internalMax: 50, externalMax: 50 } };
    return spec[type] || spec.theory;
}

/**
 * Map pasted tokens to {internal, external} per course.
 *
 *   - pair token   → used directly (clamped to the course's maxima)
 *   - single token → split by course type (theory 30/70, lab/project 50/50),
 *                      capped at the course maxima
 */
export function mapNumbersToMarks(numbers, courses) {
    // Convert flat numbers into tokens: prefer pairs when adjacent numbers both
    // fit the course's internal/external maxima — mirrors plain-number-paste UX.
    const tokens = [];
    let i = 0;
    while (i < numbers.length) {
        const first = numbers[i];
        const second = i + 1 < numbers.length ? numbers[i + 1] : null;
        if (second !== null) {
            // Peek at the current course's maxima to decide pairing.
            const cIdx = tokens.filter((t) => t.kind === "pair").length;
            const spec = courses[cIdx] ? courseSpec(courses[cIdx].type) : courseSpec("theory");
            if (first <= spec.internalMax && second <= spec.externalMax) {
                tokens.push({ kind: "pair", internal: first, external: second });
                i += 2;
                continue;
            }
        }
        tokens.push({ kind: "single", value: first });
        i += 1;
    }
    return applyTokens(tokens, courses);
}

/** Apply an already-tokenized list to the semester's courses. */
export function applyTokens(tokens, courses) {
    const results = courses.map(() => ({ internal: "", external: "" }));
    let t = 0;
    for (let c = 0; c < courses.length && t < tokens.length; c++) {
        const tok = tokens[t];
        const spec = courses[c] ? courseSpec(courses[c].type) : courseSpec("theory");
        if (tok.kind === "pair") {
            results[c] = {
                internal: String(Math.max(0, Math.min(spec.internalMax, tok.internal))),
                external: String(Math.max(0, Math.min(spec.externalMax, tok.external))),
            };
        } else {
            // Single total: split by course type, respecting both maxima.
            const external = Math.min(Math.max(0, tok.value - spec.internalMax), spec.externalMax);
            const adjustedInternal = Math.min(tok.value - external, spec.internalMax);
            results[c] = {
                internal: String(adjustedInternal),
                external: String(external),
            };
        }
        t += 1;
    }
    return results;
}

/** Format semester marks for the clipboard (one internal/external pair per course). */
export function serializeMarks(courses, marks) {
    return courses
        .map((c, idx) => {
            const m = marks?.[idx] || {};
            const internal = parseInt(m.internal) || 0;
            const external = parseInt(m.external) || 0;
            return `${internal}/${external}`;
        })
        .join("  ");
}
