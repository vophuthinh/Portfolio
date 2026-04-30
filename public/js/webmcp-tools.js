/**
 * WebMCP Tools Registration for Vo Phu Thinh Portfolio
 * Exposes portfolio data to AI assistants via MCP protocol
 */

(function () {
  const mcp = new WebMCP({
    color: "#ec1839",
    position: "bottom-right",
    size: "30px",
    padding: "20px",
  });

  // Tool: Get profile summary
  mcp.registerTool(
    "get_profile",
    "Get Vo Phu Thinh's professional profile summary",
    {},
    function () {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              name: "Vo Phu Thinh",
              vietnamese_name: "Võ Phú Thịnh",
              title: "AI Engineer",
              company: "HPT Vietnam Corporation — AI Center of Excellence",
              location: "Ho Chi Minh City, Vietnam",
              email: "vophuthinhcm@gmail.com",
              phone: "+84 868 639 882",
              website: "https://vophuthinh.com",
              linkedin: "https://www.linkedin.com/in/vophuthinh",
              github: "https://github.com/vophuthinh",
              summary:
                "AI Engineer specializing in LLM, RAG, AI Agents, and Machine Learning. Shipped 3 AI products to production in first year. Won 2 awards in enterprise AI competition at HPT Vietnam.",
              education:
                "Bachelor's degree, Information Technology — HUTECH & Open University Malaysia (2021–2025)",
              languages: ["Vietnamese (native)", "English (professional)"],
            }),
          },
        ],
      };
    },
  );

  // Tool: Get skills
  mcp.registerTool(
    "get_skills",
    "Get Vo Phu Thinh's technical skills and expertise",
    {},
    function () {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              ai_ml: [
                "Large Language Models (LLM)",
                "Retrieval-Augmented Generation (RAG)",
                "AI Agents / Agentic AI",
                "Natural Language Processing",
                "Deep Learning",
                "Prompt Engineering",
                "Vector Databases",
                "Computer Vision",
              ],
              frameworks: [
                "Python",
                "FastAPI",
                "PyTorch",
                "TensorFlow",
                "LangChain",
                "LangGraph",
                "Hugging Face",
                "OpenAI",
                "Google AI (Gemini)",
                "Azure OpenAI",
              ],
              data: [
                "NumPy",
                "Pandas",
                "scikit-learn",
                "SQL",
                "MySQL",
                "SQL Server",
                "Power BI",
              ],
              infrastructure: [
                "Docker",
                "Kubernetes",
                "AWS",
                "Azure",
                "Google Cloud",
                "MLOps",
                "n8n",
              ],
              web: [
                "React",
                "Next.js",
                "Node.js",
                "Express.js",
                "JavaScript",
                "WebSocket",
              ],
            }),
          },
        ],
      };
    },
  );

  // Tool: Get projects
  mcp.registerTool(
    "get_projects",
    "Get Vo Phu Thinh's notable projects with details",
    {},
    function () {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              {
                title: "HPT D-DAY 2025 Chatbot",
                description:
                  "RAG-powered AI chatbot with zero hallucination, handled 850+ questions at HPT D-DAY 2025",
                stack: ["n8n", "OpenAI", "JavaScript", "RAG", "Google Sheets"],
                impact: "850+ questions, zero hallucination",
              },
              {
                title: "Lyly — Enterprise AI Assistant (2nd Prize)",
                description:
                  "Enterprise AI assistant with real-time voice/text, hybrid RAG, multi-step reasoning",
                stack: [
                  "Python",
                  "FastAPI",
                  "Next.js",
                  "Google AI",
                  "Qdrant",
                  "WebSocket",
                ],
                impact: "Won 2nd Prize in HPT AI competition",
              },
              {
                title: "H.I.H — HotNews Intelligence Hub (3rd Prize)",
                description:
                  "AI-powered news intelligence platform automating collection, analysis, and distribution",
                stack: ["Python", "n8n", "OpenAI", "Microsoft Viva Engage"],
                impact: "8,500+ views from ~76% of HPT employees",
              },
              {
                title: "E-Commerce with Sentiment Analysis",
                description:
                  "Multi-vendor e-commerce with AI sentiment analysis using Hugging Face BERTweet",
                stack: [
                  "React",
                  "Node.js",
                  "MySQL",
                  "Socket.io",
                  "Hugging Face",
                ],
                github:
                  "https://github.com/vophuthinh/E-Commerce-Website-With-Sentiment-Analysis-For-Reviews",
              },
            ]),
          },
        ],
      };
    },
  );

  // Tool: Get experience
  mcp.registerTool(
    "get_experience",
    "Get Vo Phu Thinh's work experience history",
    {},
    function () {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              {
                role: "AI Engineer",
                company: "HPT Vietnam Corporation — AI Center of Excellence",
                period: "Oct 2025 – Present",
                highlights: [
                  "Built AI chatbot handling 850+ questions/day",
                  "Won 2nd & 3rd prizes in AI in Business competition",
                  "Developed LLM-powered solutions for executive decision support",
                ],
              },
              {
                role: "Software Solutions Engineer",
                company: "HPT Vietnam Corporation",
                period: "Apr 2025 – Oct 2025",
                highlights: [
                  "Built 10+ automation workflows, cutting manual reporting by ~60%",
                  "Integrated AI into enterprise solutions",
                ],
              },
              {
                role: "Intern",
                company: "HPT Vietnam Corporation",
                period: "Nov 2024 – Apr 2025",
                highlights: [
                  "Prototyped AI chatbot that evolved into D-DAY 2025 product",
                  "Promoted to full-time after 6 months — fastest track in team",
                ],
              },
            ]),
          },
        ],
      };
    },
  );

  // Tool: Navigate to section
  mcp.registerTool(
    "navigate_to_section",
    "Navigate to a specific section of the portfolio website",
    {
      section: {
        type: "string",
        description:
          "Section to navigate to: home, about, skills, project, certifications-awards, contact",
      },
    },
    function (args) {
      var section = args.section || "home";
      var el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return {
          content: [{ type: "text", text: "Navigated to section: " + section }],
        };
      }
      return {
        content: [{ type: "text", text: "Section not found: " + section }],
      };
    },
  );

  // Resource: llms-full.txt
  mcp.registerResource(
    "profile://full",
    "Full AI-readable profile of Vo Phu Thinh",
    { uri: "https://vophuthinh.com/llms-full.txt", mimeType: "text/plain" },
    function () {
      return fetch("/llms-full.txt")
        .then(function (r) {
          return r.text();
        })
        .then(function (text) {
          return {
            contents: [
              {
                uri: "https://vophuthinh.com/llms-full.txt",
                text: text,
                mimeType: "text/plain",
              },
            ],
          };
        });
    },
  );

  // Prompt: Hiring assessment
  mcp.registerPrompt(
    "hiring_assessment",
    "Assess if Vo Phu Thinh is a good fit for a role",
    {
      role: {
        type: "string",
        description: "The job title or role to assess fit for",
      },
    },
    function (args) {
      return {
        content: [
          {
            type: "text",
            text:
              "Based on Vo Phu Thinh's profile, skills, projects, and experience (use get_profile, get_skills, get_projects, get_experience tools to gather data), assess his fit for the role: " +
              (args.role || "AI Engineer") +
              ". Consider: relevant skills match, project experience, growth trajectory, and potential gaps.",
          },
        ],
      };
    },
  );
})();
