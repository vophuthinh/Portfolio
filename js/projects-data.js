// Projects data - AI Engineer Portfolio

const projectsData = [
  {
    id: 1,
    title: "HPT D-DAY Chatbot",
    category: "llm",
    summary:
      "Problem: onsite Q&A overload. Solution: event chatbot grounded on internal data. Impact: handled 850+ attendee questions in one day.",
    problem:
      "Event attendees needed quick answers about the program schedule, speakers, breakout sessions, and booth information during HPT D-DAY, but the onsite team couldn't handle all inquiries manually.",
    solution:
      "Built an AI chatbot using n8n workflow connecting GPT-4o with three Google Sheets data sources (About D-DAY, Agenda, Booth Content). Developed a custom JavaScript chat widget embedded into the event microsite with session management, input validation, and XSS protection.",
    stack: ["n8n", "GPT-4o", "JavaScript", "Google Sheets", "REST API"],
    impact: [
      { label: "Volume", value: "850+ questions/day" },
      { label: "Quality", value: "Grounded answers" },
      { label: "Ops", value: "Single chatbot handled peak event Q&A load" },
    ],
    results:
      "Successfully handled over 850 user questions during the event day. Became a key digital experience highlight of HPT D-DAY, meaningfully supporting the onsite team.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/portfolio-1.jpg",
  },
  {
    id: 2,
    title: "AI Agent — Lyly (2nd Prize)",
    category: "llm",
    summary:
      "Problem: fragmented executive insights. Solution: AI agent for decision support. Impact: won 2nd prize in enterprise AI competition.",
    problem:
      "HPT's executive team needed faster, data-driven decision-making and operational optimization across business units.",
    solution:
      'Designed and built Lyly, an AI Agent that assists the executive board with decision support, process optimization, and operational insights. Won 2nd prize in HPT\'s "AI in Business" competition.',
    stack: ["Python", "LangChain", "GPT-4o", "n8n", "Azure"],
    impact: [
      { label: "Award", value: "2nd Prize" },
      { label: "Decision", value: "Executive-focused decision support workflow" },
      { label: "Scope", value: "Executive operations use case" },
    ],
    results:
      "Won 2nd prize in HPT's internal AI competition. Demonstrated practical AI application for executive-level decision support.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/portfolio-2.jpg",
  },
  {
    id: 3,
    title: "H.I.H — HotNews Intelligence Hub (3rd Prize)",
    category: "data",
    summary:
      "Problem: slow manual news processing. Solution: automated intelligence pipeline. Impact: replaced manual aggregation-analysis-distribution flow and won 3rd prize.",
    problem:
      "Manual news processing was slow and error-prone, causing delays in information delivery and increasing the risk of data inaccuracies.",
    solution:
      'Built H.I.H (HotNews Intelligence Hub), an intelligent news processing platform that automates content aggregation, analysis, and distribution. Won 3rd prize in HPT\'s "AI in Business" competition.',
    stack: ["Python", "n8n", "GPT-4o", "Automation", "REST API"],
    impact: [
      { label: "Award", value: "3rd Prize" },
      { label: "Quality", value: "Standardized pipeline reduced manual inconsistency" },
      { label: "Speed", value: "Automation replaced multi-step manual handling" },
    ],
    results:
      "Won 3rd prize in HPT's AI competition. Proved that AI can serve as a reliable tool for accelerating news processing and reducing human errors.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/portfolio-3.jpg",
  },
  {
    id: 4,
    title: "E-Commerce with Sentiment Analysis",
    category: "data",
    summary:
      "Problem: no visibility into customer review sentiment. Solution: multi-vendor e-commerce with AI-powered sentiment analysis using Hugging Face BERTweet. Impact: turned unstructured reviews into positive/negative signals for seller decisions.",
    problem:
      "Sellers and administrators on multi-vendor platforms had no automated way to understand customer sentiment from product reviews, making it difficult to identify issues and improve products or services.",
    solution:
      "Built a full-featured multi-vendor e-commerce platform with integrated AI sentiment analysis. The system uses Hugging Face BERTweet to automatically classify reviews as positive or negative, giving sellers and admins actionable insights. Includes real-time chat (Socket.io), Stripe/PayPal payments, and Cloudinary image storage.",
    stack: [
      "React",
      "Node.js",
      "Express.js",
      "MySQL",
      "Socket.io",
      "Hugging Face",
    ],
    impact: [
      { label: "AI", value: "Auto sentiment classification" },
      { label: "Platform", value: "Multi-vendor marketplace" },
      { label: "Real-time", value: "Live chat & notifications" },
    ],
    results:
      "Delivered a complete multi-vendor e-commerce platform with real-time sentiment analysis of customer reviews, enabling sellers to make data-driven product and service improvements.",
    link: null,
    github:
      "https://github.com/vophuthinh/E-Commerce-Website-With-Sentiment-Analysis-For-Reviews",
    image: "./assets/images/portfolio/E-Commerce with Sentiment Analysis.webp",
  },
];

// Configuration constants
const projectConfig = {
  MAX_TECH_CHIPS_DISPLAY: 4,
  MAX_IMPACT_CHIPS_DISPLAY: 3,
};

// Assign to window for non-module scripts
window.projectsData = projectsData;
window.projectConfig = projectConfig;

export { projectsData, projectConfig };
