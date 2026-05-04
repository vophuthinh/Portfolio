/**
 * WebMCP Tools Registration for Vo Phu Thinh Portfolio
 * Exposes portfolio data to AI assistants via MCP protocol
 */

(function () {
  // Don't initialize the WebMCP widget on mobile layouts.
  const isMobileLayout =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 767.98px)").matches;

  if (isMobileLayout) {
    return;
  }

  const mcp = new WebMCP({
    color: "#ec1839",
    position: "bottom-right",
    size: "30px",
    padding: "20px",
  });

  const NATIVE_TOOL_REGISTRY_KEY = "__vophuthinh_native_webmcp_tools__";
  const nativeToolRegistry = (() => {
    if (typeof window === "undefined") {
      return new Set();
    }

    const existingRegistry = window[NATIVE_TOOL_REGISTRY_KEY];
    if (existingRegistry instanceof Set) {
      return existingRegistry;
    }

    const registry = new Set(Array.isArray(existingRegistry) ? existingRegistry : []);
    window[NATIVE_TOOL_REGISTRY_KEY] = registry;
    return registry;
  })();

  const DEFAULT_MCP_DATA = {
    profile: {
      name: "Vo Phu Thinh",
      title: "AI Engineer",
      website: "https://vophuthinh.com",
      summary:
        "AI Engineer specializing in LLM, RAG, AI Agents, and Machine Learning.",
    },
    skills: {},
    experience: [],
    projects_fallback: [],
  };

  const cloneData = (value) => JSON.parse(JSON.stringify(value));

  let mcpData = cloneData(DEFAULT_MCP_DATA);

  function safeString(text) {
    return typeof text === "string" ? text : "";
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeProject(project) {
    return {
      id: typeof project.id === "number" ? project.id : null,
      title: safeString(project.title),
      category: safeString(project.category),
      summary: safeString(project.summary),
      problem: safeString(project.problem),
      solution: safeString(project.solution),
      stack: safeArray(project.stack),
      impact: safeArray(project.impact),
      results: safeString(project.results),
      link: project.link || null,
      github: project.github || null,
      image: safeString(project.image),
    };
  }

  function getProjectsForMcp() {
    const windowProjects = safeArray(window.projectsData).map(normalizeProject);
    if (windowProjects.length > 0) {
      return windowProjects;
    }

    return safeArray(mcpData.projects_fallback).map(normalizeProject);
  }

  function loadMcpData() {
    return fetch("/data/mcp-profile.json", { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch MCP profile data: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        mcpData = {
          profile:
            data && typeof data.profile === "object"
              ? data.profile
              : DEFAULT_MCP_DATA.profile,
          skills:
            data && typeof data.skills === "object"
              ? data.skills
              : DEFAULT_MCP_DATA.skills,
          experience: safeArray(data && data.experience),
          projects_fallback: safeArray(data && data.projects_fallback),
        };
      })
      .catch(() => {
        mcpData = cloneData(DEFAULT_MCP_DATA);
      });
  }

  function isNativeModelContextAvailable() {
    return (
      typeof navigator !== "undefined" &&
      !!navigator.modelContext &&
      typeof navigator.modelContext.registerTool === "function"
    );
  }

  function normalizeToolInputSchema(schema) {
    if (!schema || typeof schema !== "object") {
      return { type: "object", properties: {} };
    }

    if (schema.type || schema.properties || schema.oneOf || schema.anyOf) {
      return schema;
    }

    // Backward-compat: existing custom WebMCP code often passes raw property maps.
    const keys = Object.keys(schema);
    const looksLikePropertyMap =
      keys.length > 0 &&
      keys.every((key) => {
        const value = schema[key];
        return (
          value &&
          typeof value === "object" &&
          (value.type ||
            value.description ||
            value.enum ||
            value.default ||
            value.oneOf ||
            value.anyOf)
        );
      });

    if (looksLikePropertyMap) {
      return {
        type: "object",
        properties: schema,
      };
    }

    return schema;
  }

  function registerNativeTool(name, description, schema, executeFn) {
    if (!isNativeModelContextAvailable() || nativeToolRegistry.has(name)) {
      return;
    }

    try {
      navigator.modelContext.registerTool({
        name,
        description,
        inputSchema: normalizeToolInputSchema(schema),
        execute: async function (args) {
          const safeArgs = args && typeof args === "object" ? args : {};
          if (typeof executeFn !== "function") {
            return {
              content: [
                {
                  type: "text",
                  text: `Tool ${name} has no execute function.`,
                },
              ],
            };
          }
          return executeFn(safeArgs);
        },
      });

      nativeToolRegistry.add(name);
      console.log(`[WebMCP] Native tool registered: ${name}`);
    } catch (error) {
      // Chrome throws InvalidStateError when tool name already exists.
      if (error && typeof error === "object" && error.name === "InvalidStateError") {
        nativeToolRegistry.add(name);
        return;
      }
      console.warn(`[WebMCP] Native tool registration failed for "${name}"`, error);
    }
  }

  function registerTool(name, description, schema, executeFn) {
    mcp.registerTool(name, description, schema, executeFn);
    registerNativeTool(name, description, schema, executeFn);
  }

  function registerJsonTool(name, description, resolver) {
    registerTool(name, description, { type: "object", properties: {} }, function () {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resolver()),
          },
        ],
      };
    });
  }

  function registerCoreDataTools() {
    registerJsonTool(
      "get_profile",
      "Get Vo Phu Thinh's professional profile summary",
      function () {
        return mcpData.profile;
      },
    );

    registerJsonTool(
      "get_skills",
      "Get Vo Phu Thinh's technical skills and expertise",
      function () {
        return mcpData.skills;
      },
    );

    registerJsonTool(
      "get_projects",
      "Get Vo Phu Thinh's notable projects with details",
      function () {
        return getProjectsForMcp();
      },
    );

    registerJsonTool(
      "get_experience",
      "Get Vo Phu Thinh's work experience history",
      function () {
        return mcpData.experience;
      },
    );
  }

  loadMcpData().finally(function () {
    registerCoreDataTools();
  });

  // Tool: Navigate to section
  registerTool(
    "navigate_to_section",
    "Navigate to a specific section of the portfolio website",
    {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: [
            "home",
            "about",
            "skills",
            "project",
            "certifications-awards",
            "contact",
          ],
          description:
            "Section to navigate to: home, about, skills, project, certifications-awards, contact",
        },
      },
      additionalProperties: false,
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
          if (!r.ok)
            throw new Error("Failed to fetch llms-full.txt: " + r.status);
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
        })
        .catch(function (err) {
          return {
            contents: [
              {
                uri: "https://vophuthinh.com/llms-full.txt",
                text: "Error loading profile: " + err.message,
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
