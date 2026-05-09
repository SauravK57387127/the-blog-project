/**
 * Design System Constants
 *
 * Centralized values for consistent spacing, sizing, and styling
 * across all pages. Update here to affect entire application.
 */

export const DESIGN_CONSTANTS = {
    // Container Widths
    containers: {
        standard: "max-w-7xl", // 1280px - default for all content
        narrow: "max-w-4xl", // 1024px - for reading content
        wide: "max-w-[1400px]", // 1400px - for special sections
    },

    // Section Spacing
    spacing: {
        section: "py-20", // Vertical padding for sections
        sectionMobile: "py-12", // Mobile section padding
        header: "mb-10", // Section header margin
        cardGap: "gap-6", // Default card grid gap
        cardGapLarge: "gap-8", // Larger card grid gap
    },

    // Grid Layouts
    grids: {
        recentHighlights: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        popularPosts:
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        topics: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    },

    // Typography
    typography: {
        heroTitle:
            "text-4xl md:text-5xl lg:text-6xl font-sans font-bold leading-tight",
        sectionTitle: "text-3xl font-sans font-bold",
        cardTitle: "text-xl font-sans font-bold",
        body: "text-base font-reading leading-relaxed",
    },

    // Transitions
    transitions: {
        smooth: "transition-all duration-300 ease-out",
        fast: "transition-all duration-200 ease-out",
    },
};

// Utility function to combine constants with additional classes
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};
