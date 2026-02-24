// Interests Data - AI Engineer Portfolio
// Structure: assets/images/interests/{interest-key}/

const interestData = {
    'ai-research': {
        title: "AI Research",
        images: [
            { src: "./assets/images/portfolio/portfolio-1.jpg", caption: "LLM Fine-tuning Experiments" },
            { src: "./assets/images/portfolio/portfolio-2.jpg", caption: "Transformer Architecture Analysis" }
        ]
    },
    'data-visualization': {
        title: "Data Visualization",
        images: [
            { src: "./assets/images/portfolio/portfolio-4.jpg", caption: "Model Performance Metrics Dashboard" },
            { src: "./assets/images/portfolio/portfolio-5.jpg", caption: "Embedding Cluster Visualization" }
        ]
    },
    'building-tools': {
        title: "Building Tools",
        images: [
            { src: "./assets/images/portfolio/portfolio-3.jpg", caption: "Automated Data Pipeline CLI" },
            { src: "./assets/images/portfolio/portfolio-6.jpg", caption: "Experiment Tracking Suite" }
        ]
    },
    'tech-community': {
        title: "Tech Community",
        images: [
            { src: "./assets/images/interests/traveling.jpg", caption: "Speaking at Local AI Meetup" }
        ]
    },
    // Legacy support
    traveling: {
        title: "My Travels",
        images: [
            { src: "./assets/images/interests/traveling.jpg", caption: "Exploring New Horizons" }
        ]
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { interestData };
}
