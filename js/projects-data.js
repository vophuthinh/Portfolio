// Projects data - AI Engineer Portfolio

const projectsData = [
  {
    id: 7,
    title: "HPT D-DAY 2026 AI Chatbot",
    category: "llm",
    summary:
      "Bilingual (Vietnamese and English) AI chatbot for HPT D-DAY 2026 that answered 141 questions during the one-day event on 15 October 2026 in Ho Chi Minh City. A Google Gemini agent queries live Google Sheets tools, answers only from official event data and suggests follow-up questions. I designed and built it in n8n.",
    problem:
      "Attendees of HPT D-DAY 2026 needed instant, correct answers about the event overview, the agenda, the speakers and the booths, in Vietnamese or English. A wrong answer would damage the event experience, and the organizers needed to change content during the event without touching code. The 2025 chatbot solved this with a vector store; the 2026 version needed to be easier to update, easier to guide and more helpful per answer.",
    solution:
      "I rebuilt the chatbot as a tool-calling agent in n8n. A Google Gemini model reads the event data from Google Sheets as live tools, so organizers edit a sheet and the bot answers with the new data at once. The prompt enforces grounding: the agent answers only from that data and says it has no information when data is missing. It detects the visitor's language, uses only the matching Vietnamese or English columns and never mixes them. It matches queries without diacritics and with Vietnamese and English aliases (agenda, schedule, session; booth, exhibitor, partner), and it receives the current date and time with every request. Each reply is structured JSON with an answer and two to four suggested follow-up questions in the same language. A memory window keeps the last 10 messages for each visitor, an input guard answers empty messages without calling the model, and the webhook accepts requests only from the event website.",
    heroMetric: { value: "141", label: "Questions on Event Day" },
    stack: [
      "n8n",
      "Google Gemini",
      "Google Sheets",
      "AI Agent",
      "Tool Calling",
      "Structured Output",
    ],
    impact: [
      { label: "Volume", value: "141 questions answered on event day" },
      {
        label: "Grounding",
        value: "Answers only from event data, says so when data is missing",
      },
      { label: "Languages", value: "Vietnamese and English, never mixed" },
      { label: "UX", value: "2 to 4 suggested follow-up questions per answer" },
      { label: "Ops", value: "Content updated in Google Sheets, no code" },
    ],
    results:
      "It answered 141 questions during the one-day event on 15 October 2026 in Ho Chi Minh City. For context, the 2025 edition was held in Hanoi and its chatbot handled 850+ questions, so the two numbers come from different events in different cities. The workflow is locked to the D-DAY website origin. Compared with the 2025 chatbot, it removes the vector store, reads live sheet data, replies in a structured format with follow-up suggestions, and remembers the conversation per visitor.",
    link: null,
    github: null,
    image: "./assets/images/portfolio/Chatbot D-Day 2026.webp",
    architecture: {
      description:
        "Visitor → Chat Widget → Input Guard → Gemini Agent (memory + Google Sheets) → Structured Reply (answer + follow-up questions)",
      nodes: [
        "Chat Widget",
        "Input Guard",
        "Gemini Agent",
        "Session Memory",
        "Google Sheets",
        "Structured Reply",
      ],
    },
  },
  {
    id: 6,
    title: "Mệnh Bàn: Tử Vi Đẩu Số",
    category: "web",
    summary:
      "Full-stack Vietnamese website that builds Tử Vi Đẩu Số (Purple Star Astrology) charts online: 12 palaces, 14 main stars, 23+ classical patterns, yearly cycles, a 100-year Life K-Line and a two-chart compatibility score. I designed and built it alone in 6 months, with 247 automated tests.",
    problem:
      "Tử Vi Đẩu Số is a traditional system that places stars across 12 palaces from a person's birth date and hour. Reading a chart by hand takes years of study, and small input mistakes change the whole chart: the Vietnamese lunar calendar differs from the Chinese one on some days, and clock time differs from solar time depending on the longitude of the birthplace. Vietnamese users needed a correct chart explained in plain Vietnamese, and I needed a product that could charge for deeper readings safely.",
    solution:
      "I designed and built menhban.io.vn end to end as a full-stack web app. Star placement builds on an open-source engine; the rest is my own work: a Vietnamese lunar calendar, a true solar time correction for 63 provinces, a rule engine for Tứ Hóa and 23+ classical patterns (cách cục), star synergies, a compatibility engine for two charts, a 100-year Life K-Line, a daily card and image and PDF export. Readings are rule-based and call no AI model, so the same chart always gives the same reading. The product side covers user accounts with saved charts, paid plans with per-chart unlocking, a one-time birth data correction in the first 24 hours, upgrade credits and online bank payments. Access rules are enforced on the server and covered by tests, including attempts to bypass them. For search, the build generates 22 static pages (8 guides and 14 star pages) with FAQ structured data, and a faster first load cut the main bundle by about 76%.",
    stack: [
      "Full-stack web app",
      "Custom rule engine",
      "Vietnamese lunar calendar",
      "Secure payments",
      "SEO",
    ],
    impact: [
      { label: "Engine", value: "12 palaces, 14 main stars, 23+ patterns, Tứ Hóa" },
      { label: "Accuracy", value: "Vietnamese lunar calendar, true solar time for 63 provinces" },
      { label: "Quality", value: "247 tests, 143 commits in 6 months" },
      { label: "Search", value: "22 static pages with FAQPage structured data" },
    ],
    results:
      "Live at menhban.io.vn. One person shipped the chart engine, accounts, paid plans, security checks and SEO in about six months (12 April to 27 October 2026). The main bundle is about 76% smaller.",
    link: "https://menhban.io.vn/",
    github: null,
    image: "./assets/images/portfolio/Menh Ban Tu Vi.webp",
  },
  {
    id: 5,
    title: "HPT D-DAY 2026 Official Event Website",
    category: "web",
    summary:
      "Official bilingual website for HPT D-DAY 2026, the annual technology event of HPT Vietnam Corporation on 15 October 2026 in Ho Chi Minh City. I built it: program, schedule, partners and post-event information in Vietnamese and English.",
    problem:
      "HPT D-DAY 2026 (theme R3: Real Technology, Real Operation, Real Result) is the annual technology event of HPT Vietnam Corporation, held on 15 October 2026 at GEM Center in Ho Chi Minh City. It covers AI, Cloud, Security and digital transformation. Attendees, partners and businesses needed one official place to check the program, the schedule and the venue before the event and to read updates after it, in both Vietnamese and English.",
    solution:
      "I built the official website at d-day.hpt.vn on WordPress. It has a Vietnamese version and an English version, a landing page that carries the R3 key visual with the date and the venue, and separate pages for About, Program, Schedule, Post-event information, Partners and Contact. Page titles, descriptions and Open Graph tags are set so that a shared link shows the event name and key visual, and social links to Facebook, Messenger, LinkedIn and YouTube sit on the page.",
    stack: ["WordPress", "Bilingual VI/EN", "Responsive", "SEO"],
    impact: [
      { label: "Event", value: "15 Oct 2026, GEM Center, Ho Chi Minh City" },
      { label: "Languages", value: "Vietnamese and English" },
      { label: "Role", value: "Built the website" },
    ],
    results:
      "d-day.hpt.vn is the official source of information for HPT D-DAY 2026. Together with the HPT D-DAY 2025 chatbot, it is the second year in a row that I built a digital product for the event.",
    link: "https://d-day.hpt.vn/",
    github: null,
    image: "./assets/images/portfolio/HPT D-DAY 2026 Website.webp",
  },
  {
    id: 1,
    title: "HPT D-DAY 2025 Chatbot",
    category: "llm",
    summary:
      "Problem: onsite Q&A overload at HPT D-DAY 2025. Solution: RAG-powered AI chatbot grounded on official event data. Impact: handled 850+ attendee questions and became a key digital highlight.",
    problem:
      "Attendees and organizers at HPT D-DAY 2025 (Pullman Hanoi) needed instant, accurate answers about the event schedule, speakers, breakout sessions, booth locations, and partner information. The onsite support team couldn't handle the volume manually, and any incorrect information would damage the event experience.",
    solution:
      "Replaced manual Q&A support with a grounded AI chatbot that served 850+ attendees. Architecture: official event data (Excel files) chunked into a vector store, retrieved via semantic search, and answered by GPT-4o with strict grounding - if the data doesn't exist, the bot says so. Frontend: custom JS chat widget on dday.hpt.vn with session management and XSS protection. Backend: n8n workflow connecting GPT-4o with Google Sheets so organizers could update content in real-time without touching code.",
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
        value: "Answers grounded in official event data",
      },
      { label: "Coverage", value: "Event info, agenda, 50+ booths & partners" },
      {
        label: "Ops",
        value: "Significant load reduction for onsite support team",
      },
    ],
    results:
      "Operated stably throughout the event, handling 850+ attendee questions. Significantly reduced workload for the onsite support team and became a standout AI experience highlight of HPT D-DAY 2025.",
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
    title: "Lyly - Enterprise AI Assistant (2nd Prize)",
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
      "Won 2nd prize in HPT's AI competition. Delivered a production-grade AI assistant with real-time voice/text, hybrid RAG, multi-step planning, and intelligent memory - serving as an enterprise decision-support platform.",
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
    title: "H.I.H - HotNews Intelligence Hub (3rd Prize)",
    category: "data",
    summary:
      "Problem: HPT staff spent too much time manually finding and processing business intelligence. Solution: AI-powered news intelligence platform automating collection, analysis, and distribution. Impact: 8,500+ views from ~76% of HPT employees, won 3rd prize.",
    problem:
      "HPT's internal communications, business development, and strategy teams lacked a unified system to collect, analyze, and distribute business intelligence. Staff spent excessive time manually searching news from domestic and international press, government portals, industry reports, and conferences - leading to delays and inconsistent information quality.",
    solution:
      'Automated the entire intelligence pipeline that previously took staff hours of manual searching. The platform collects news from press, government portals, industry reports, and conferences, then uses AI to classify content by strategic domains (Banking, Government, Manufacturing, Cybersecurity, AI & Tech), generate summaries with actionable recommendations, and distribute weekly/monthly newsletters via Microsoft Viva Engage - all without human intervention. Won 3rd prize in HPT\'s "AI in Business" competition.',
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
      "Won 3rd prize in HPT's AI competition. Deployed two channels - HotNews Online (launched Sep 2025, 8,500+ views) and Industry News (launched Jul 2025, ~4,000 views) - reaching over 70% of HPT employees. Elevated internal communications quality and laid the groundwork for an AI-driven strategy support system.",
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
      "Gave sellers visibility into what customers actually think. Built a full multi-vendor e-commerce platform with integrated AI sentiment analysis - Hugging Face BERTweet automatically classifies every review as positive or negative, surfacing trends sellers couldn't see before. Includes real-time chat (Socket.io), Stripe/PayPal payments, and Cloudinary image storage.",
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
