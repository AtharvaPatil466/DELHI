// src/utils/chatGuards.js

const FORBIDDEN_PATTERNS = [
    "cure",
    "treat",
    "medicine",
    "medication",
    "asthma",
    "disease",
    "doctor",
    "prescription",
    "therapy",
    "diagnosis",
    "health",
    "symptoms",
    "illness"
];

/**
 * Checks if a query patterns match forbidden medical/health diagnosis keywords.
 * @param {string} question - The user's input text.
 * @returns {boolean} - True if the query is potentially a health diagnosis request.
 */
export function isForbiddenHealthQuery(question) {
    if (!question) return false;
    const q = question.toLowerCase();
    return FORBIDDEN_PATTERNS.some(keyword => q.includes(keyword));
}