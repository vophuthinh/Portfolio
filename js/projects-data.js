// Projects data - AI Engineer Portfolio

const projectsData = [
  {
    id: 1,
    title: "HPT D-DAY 2025 Chatbot",
    category: "llm",
    summary:
      "Problem: onsite Q&A overload at HPT D-DAY 2025. Solution: RAG-powered AI chatbot grounded on official event data with zero hallucination. Impact: handled 850+ attendee questions and became a key digital highlight.",
    problem:
      "Attendees and organizers at HPT D-DAY 2025 (Pullman Hanoi) needed instant, accurate answers about the event schedule, speakers, breakout sessions, booth locations, and partner information. The onsite support team couldn't handle the volume manually, and any incorrect information would damage the event experience.",
    solution:
      "Replaced manual Q&A support with a zero-hallucination AI chatbot that served 850+ attendees. Architecture: official event data (Excel files) chunked into a vector store, retrieved via semantic search, and answered by GPT-4o with strict grounding — if the data doesn't exist, the bot says so. Frontend: custom JS chat widget on dday.hpt.vn with session management and XSS protection. Backend: n8n workflow connecting GPT-4o with Google Sheets so organizers could update content in real-time without touching code.",
    heroMetric: { value: "850+", label: "Q&A Handled" },
    stack: [
      "n8n",
      "OpenAI",
      "JavaScript",
      "RAG",
      "Google Sheets",
      "Vector Store",
    ],
    impact: [
      { label: "Volume", value: "850+ questions handled" },
      {
        label: "Accuracy",
        value: "Zero hallucination — grounded answers only",
      },
      { label: "Coverage", value: "Event info, agenda, 50+ booths & partners" },
      {
        label: "Ops",
        value: "Significant load reduction for onsite support team",
      },
    ],
    results:
      "Operated stably throughout the event, handling 850+ attendee questions with zero hallucination. Significantly reduced workload for the onsite support team and became a standout AI experience highlight of HPT D-DAY 2025.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/Chatbot D-Day 2025.webp",
    architecture: {
      description:
        "User → JS Chat Widget → n8n Workflow → Vector Store (RAG) → GPT-4o → Grounded Answer",
      nodes: [
        "Chat Widget",
        "n8n Orchestrator",
        "Vector Store",
        "GPT-4o",
        "Google Sheets",
      ],
    },
  },
  {
    id: 2,
    title: "Lyly — Enterprise AI Assistant (2nd Prize)",
    category: "llm",
    summary:
      "Problem: fragmented executive insights. Solution: enterprise AI assistant with real-time text & voice, RAG with hybrid search, and multi-step reasoning. Impact: won 2nd prize in enterprise AI competition.",
    problem:
      "HPT's executive team needed faster, data-driven decision-making across business units, but existing tools couldn't unify document retrieval, real-time conversation, and multi-step analysis into one coherent workflow.",
    solution:
      'Delivered a production-grade AI assistant that executives actually use for decision support. Key capabilities: real-time text & voice conversations via WebSocket, RAG with hybrid search (vector + keyword) and self-healing retrieval, multi-step reasoning that breaks complex questions into executable plans, voice pipeline with interrupt handling, and memory that learns user preferences over time. Built with FastAPI backend + Next.js frontend, powered by Gemini and Qdrant vector DB. Won 2nd prize in HPT\'s "AI in Business" competition.',
    heroMetric: { value: "2nd", label: "Prize" },
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "GoogleAI",
      "Qdrant",
      "WebSocket",
      "mem0",
    ],
    impact: [
      { label: "Award", value: "2nd Prize" },
      {
        label: "Realtime",
        value: "Text & voice via unified WebSocket gateway",
      },
      { label: "RAG", value: "Hybrid search + Corrective RAG pipeline" },
      {
        label: "Intelligence",
        value: "Multi-step reasoning + memory personalization",
      },
    ],
    results:
      "Won 2nd prize in HPT's AI competition. Delivered a production-grade AI assistant with real-time voice/text, hybrid RAG, multi-step planning, and intelligent memory — serving as an enterprise decision-support platform.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/Lyly Assistant.webp",
    architecture: {
      description:
        "User (Voice/Text) → WebSocket Gateway → FastAPI → Gemini LLM + Qdrant RAG + mem0 Memory → Multi-step Planner → Response",
      nodes: ["WebSocket", "FastAPI", "Gemini", "Qdrant", "mem0", "Planner"],
    },
  },
  {
    id: 3,
    title: "H.I.H — HotNews Intelligence Hub (3rd Prize)",
    category: "data",
    summary:
      "Problem: HPT staff spent too much time manually finding and processing business intelligence. Solution: AI-powered news intelligence platform automating collection, analysis, and distribution. Impact: 8,500+ views from ~76% of HPT employees, won 3rd prize.",
    problem:
      "HPT's internal communications, business development, and strategy teams lacked a unified system to collect, analyze, and distribute business intelligence. Staff spent excessive time manually searching news from domestic and international press, government portals, industry reports, and conferences — leading to delays and inconsistent information quality.",
    solution:
      'Automated the entire intelligence pipeline that previously took staff hours of manual searching. The platform collects news from press, government portals, industry reports, and conferences, then uses AI to classify content by strategic domains (Banking, Government, Manufacturing, Cybersecurity, AI & Tech), generate summaries with actionable recommendations, and distribute weekly/monthly newsletters via Microsoft Viva Engage — all without human intervention. Won 3rd prize in HPT\'s "AI in Business" competition.',
    heroMetric: { value: "8,500+", label: "Views" },
    stack: ["Python", "n8n", "OpenAI", "Microsoft Viva Engage", "Automation"],
    impact: [
      { label: "Award", value: "3rd Prize" },
      {
        label: "HotNews Online",
        value: "8,500+ views from 269 users (~76% of HPT staff)",
      },
      {
        label: "Industry News",
        value: "~4,000 views from 244 users (~70% of HPT staff)",
      },
      { label: "Strategy", value: "Foundation for AI Strategy Support System" },
    ],
    results:
      "Won 3rd prize in HPT's AI competition. Deployed two channels — HotNews Online (launched Sep 2025, 8,500+ views) and Industry News (launched Jul 2025, ~4,000 views) — reaching over 70% of HPT employees. Elevated internal communications quality and laid the groundwork for an AI-driven strategy support system.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/Soc Do La.webp",
    architecture: {
      description:
        "News Sources → Python Crawler → n8n Pipeline → OpenAI Classification & Summary → Microsoft Viva Engage Distribution",
      nodes: ["News Sources", "Python Crawler", "n8n", "OpenAI", "Viva Engage"],
    },
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
      "Gave sellers visibility into what customers actually think. Built a full multi-vendor e-commerce platform with integrated AI sentiment analysis — Hugging Face BERTweet automatically classifies every review as positive or negative, surfacing trends sellers couldn't see before. Includes real-time chat (Socket.io), Stripe/PayPal payments, and Cloudinary image storage.",
    heroMetric: { value: "AI", label: "Sentiment" },
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
