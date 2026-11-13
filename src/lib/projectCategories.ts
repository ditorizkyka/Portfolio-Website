export const PROJECT_CATEGORIES = ['Software Development', 'AI Development'] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export function getProjectCategory(category?: string | null): ProjectCategory {
    // Existing AI categories include AI/ML, AI/NLP, and AI Automation Projects.
    return /^ai\b/i.test(category?.trim() ?? '') ? 'AI Development' : 'Software Development';
}
