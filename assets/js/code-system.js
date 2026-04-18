"use strict";

(function () {
  if (!document.body || document.body.dataset.page !== "work" || document.body.dataset.codeApp !== "shell") return;

  const MODULE_GROUPS = Object.freeze([
    { id: "getting-started", title: "GETTING STARTED", rank: 1 },
    { id: "system-setup", title: "SYSTEM SETUP", rank: 2 },
    { id: "intelligence-layer", title: "INTELLIGENCE LAYER", rank: 3 },
    { id: "integration", title: "INTEGRATION", rank: 4 },
    { id: "operations", title: "OPERATIONS", rank: 5 },
    { id: "system", title: "SYSTEM", rank: 6 }
  ]);

  const MODULE_BLUEPRINT = Object.freeze([
    {
      id: "installation",
      title: "Installation",
      icon: "INST",
      shortDescription: "Set up runtime, dependencies, and local prerequisites.",
      group: "getting-started",
      priority: 10,
      status: "Core"
    },
    {
      id: "quickstart-tutorial",
      title: "Quickstart Tutorial",
      icon: "QST",
      shortDescription: "Run the fastest end-to-end walkthrough.",
      group: "getting-started",
      priority: 20,
      status: "Core"
    },
    {
      id: "learning-path",
      title: "Learning Path",
      icon: "PATH",
      shortDescription: "Progress from onboarding to advanced operation.",
      group: "getting-started",
      priority: 30,
      status: "Core"
    },
    {
      id: "configuration",
      title: "Configuration",
      icon: "CONF",
      shortDescription: "Tune runtime defaults, environment, and behavior.",
      group: "system-setup",
      priority: 40,
      status: "Core"
    },
    {
      id: "messaging-gateway",
      title: "Messaging Gateway",
      icon: "MSG",
      shortDescription: "Understand command flow, events, and delivery edges.",
      group: "system-setup",
      priority: 50,
      status: "Core"
    },
    {
      id: "tools-toolsets",
      title: "Tools & Toolsets",
      icon: "TOOLS",
      shortDescription: "Capabilities exposed by this repository system.",
      group: "system-setup",
      priority: 60,
      status: "Core"
    },
    {
      id: "memory-system",
      title: "Memory System",
      icon: "MEM",
      shortDescription: "Persistent records, cache strategy, and recall rules.",
      group: "intelligence-layer",
      priority: 70,
      status: "Core"
    },
    {
      id: "skills-system",
      title: "Skills System",
      icon: "SKL",
      shortDescription: "Reusable behaviors, playbooks, and capability packs.",
      group: "intelligence-layer",
      priority: 80,
      status: "Core"
    },
    {
      id: "context-files",
      title: "Context Files",
      icon: "CTX",
      shortDescription: "Context contracts and reference surfaces for operations.",
      group: "intelligence-layer",
      priority: 90,
      status: "Core"
    },
    {
      id: "personality-soul",
      title: "Personality / SOUL.md",
      icon: "SOUL",
      shortDescription: "Behavior contract, style, and system intent.",
      group: "intelligence-layer",
      priority: 100,
      status: "Advanced"
    },
    {
      id: "mcp-integration",
      title: "MCP Integration",
      icon: "MCP",
      shortDescription: "Model Context Protocol wiring and runtime handshakes.",
      group: "integration",
      priority: 110,
      status: "Core"
    },
    {
      id: "use-mcp-with-hermes",
      title: "Use MCP with Hermes",
      icon: "HERM",
      shortDescription: "Hermes-specific MCP usage and flow examples.",
      group: "integration",
      priority: 120,
      status: "Advanced"
    },
    {
      id: "voice-mode",
      title: "Voice Mode",
      icon: "VOICE",
      shortDescription: "Voice interface architecture and lifecycle.",
      group: "integration",
      priority: 130,
      status: "Core"
    },
    {
      id: "use-voice-mode",
      title: "Use Voice Mode",
      icon: "SPEAK",
      shortDescription: "Conversation runbook and voice interaction flow.",
      group: "integration",
      priority: 140,
      status: "Advanced"
    },
    {
      id: "security",
      title: "Security",
      icon: "SEC",
      shortDescription: "Security controls, boundaries, and operational safeguards.",
      group: "operations",
      priority: 150,
      status: "Core"
    },
    {
      id: "tips-best-practices",
      title: "Tips & Best Practices",
      icon: "TIPS",
      shortDescription: "Field-tested guidance for safe and efficient operation.",
      group: "operations",
      priority: 160,
      status: "Core"
    },
    {
      id: "architecture",
      title: "Architecture",
      icon: "ARCH",
      shortDescription: "System map, boundary definitions, and component layering.",
      group: "system",
      priority: 170,
      status: "Core"
    },
    {
      id: "faq-troubleshooting",
      title: "FAQ & Troubleshooting",
      icon: "FAQ",
      shortDescription: "Frequent issues, diagnostics, and proven fixes.",
      group: "system",
      priority: 180,
      status: "Core"
    }
  ]);

  const MODULE_IDS = new Set(MODULE_BLUEPRINT.map((module) => module.id));
  const LEGACY_HASH_MODULE_MAP = Object.freeze({
    overview: "installation",
    repositories: "quickstart-tutorial",
    activity: "learning-path",
    sync: "mcp-integration"
  });
  const MODULE_GROUP_RANK = MODULE_GROUPS.reduce((acc, group) => {
    acc[group.id] = group.rank;
    return acc;
  }, {});

  const DEFAULT_CONFIG = Object.freeze({
    githubUsername: "0928Jacksha",
    featuredRepos: ["jacksha-website"],
    includeRepos: [
      "0928Jacksha/jacksha-website",
      "personal-ai-agent-system",
      "0928Jacksha/personal-ai-agent-system",
      "jacksha",
      "0928Jacksha/jacksha",
      "desktop-tutorial",
      "0928Jacksha/desktop-tutorial",
      "Jack-Sha",
      "0928Jacksha/Jack-Sha"
    ],
    excludeRepos: [],
    maxFeatured: 4,
    maxProjects: 120,
    minSignalScore: 14,
    hideForks: true,
    hideArchived: true
  });

  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.CODE_PORTFOLIO_CONFIG || {});
  const CONFIG_USERNAME_KEY = String(CONFIG.githubUsername || "").trim().toLowerCase();
  const REPO_PAGE_SIZE = 12;
  const MAX_ACTIVITY_ENTRIES = 30;
  const CACHE_KEY = "code-system-cache-v1";
  const HISTORY_KEY = "code-system-sync-history-v1";
  const CACHE_TTL_MS = 5 * 60 * 1000;

  function normalizeRepoIdentifier(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const segments = raw.split("/").filter(Boolean);
    const name = segments.length ? segments[segments.length - 1] : raw;
    return String(name).trim().toLowerCase();
  }

  function normalizeModuleId(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return "installation";
    if (MODULE_IDS.has(normalized)) return normalized;
    if (LEGACY_HASH_MODULE_MAP[normalized]) return LEGACY_HASH_MODULE_MAP[normalized];
    return "installation";
  }

  function getInitialModuleId() {
    const hashRaw = String(window.location.hash || "").replace(/^#/, "");
    if (!hashRaw) return "installation";
    const firstSegment = hashRaw.split(/[/?&]/)[0];
    return normalizeModuleId(firstSegment);
  }

  function buildTargetRepositoryList(config) {
    const rawList = []
      .concat(Array.isArray(config.includeRepos) ? config.includeRepos : [])
      .concat(Array.isArray(config.featuredRepos) ? config.featuredRepos : []);

    const seen = new Set();
    const output = [];

    rawList.forEach((value) => {
      const raw = String(value || "").trim();
      if (!raw) return;
      const key = normalizeRepoIdentifier(raw);
      if (!key || seen.has(key)) return;
      seen.add(key);
      output.push({
        key,
        display: raw
      });
    });

    return output;
  }

  const TARGET_REPOSITORIES = buildTargetRepositoryList(CONFIG);

  const DOMAIN_RULES = [
    { key: "ai", pattern: /\b(ai|agent|agents|llm|rag|prompt|inference|model|models)\b/i },
    { key: "automation", pattern: /\b(automation|workflow|orchestration|scheduler|cron|bot|pipeline|job)\b/i },
    { key: "data", pattern: /\b(data|database|sql|postgres|vector|analytics|etl|warehouse)\b/i },
    { key: "web", pattern: /\b(web|website|webapp|frontend|site|portfolio|landing|next|react|ui|interface|app)\b/i },
    { key: "infrastructure", pattern: /\b(api|backend|server|worker|cloud|infra|infrastructure|runtime|deploy|deployment)\b/i },
    { key: "developerTools", pattern: /\b(cli|sdk|tool|tools|library|package|module|developer)\b/i }
  ];

  const SIGNAL_NAME_PATTERNS = [
    /(^|[-_])(test|tests|tmp|temp|scratch|sandbox|playground|practice|tutorial|example)([-_]|$)/i,
    /(^|[-_])(draft|backup|archive|legacy|old|deprecated)([-_]|$)/i,
    /(^|[-_])(learning|notes|note|hello-world)([-_]|$)/i
  ];

  const TOPIC_LABELS = Object.freeze({
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    ai: "AI",
    llm: "LLM",
    rag: "RAG",
    api: "API",
    node: "Node.js",
    nodejs: "Node.js",
    react: "React",
    nextjs: "Next.js",
    next: "Next.js",
    python: "Python",
    golang: "Go",
    cli: "CLI",
    automation: "Automation",
    workflow: "Workflow",
    data: "Data"
  });

  const ROLE_LABELS = {
    en: {
      cliTool: "CLI tool",
      backendSystem: "Backend service",
      aiWorkflow: "AI workflow",
      reusableLibrary: "Library",
      automationSystem: "Automation project",
      webProduct: "Web project",
      softwareProject: "Software project"
    },
    zh: {
      cliTool: "命令行工具",
      backendSystem: "后端服务",
      aiWorkflow: "AI 工作流",
      reusableLibrary: "库",
      automationSystem: "自动化项目",
      webProduct: "Web 项目",
      softwareProject: "软件项目"
    }
  };

  const REPOSITORY_PROFILE_OVERRIDES = Object.freeze({
    "jacksha-website": {
      roleKey: "webProduct",
      domains: ["web"],
      tags: ["Multi-page Website", "Static Frontend", "Code Docs UI", "Bilingual UX", "GitHub Source Sync"],
      stack: "HTML · CSS · JavaScript · Three.js · GitHub REST API",
      en: {
        is: "A production personal website repository with a docs-style code section.",
        does: "Delivers a multi-page static site (Home, Gallery, Travel, Photography, Life, Contact) and a shell-based Code section that syncs repository metadata from GitHub.",
        matters: "It is the public product surface for both content and engineering practice, combining presentation pages with a structured repository documentation interface."
      },
      zh: {
        is: "一个包含文档化 Code Section 的个人网站生产仓库。",
        does: "提供多页面静态站点（Home、Gallery、Travel、Photography、Life、Contact）以及可从 GitHub 同步仓库元数据的壳式 Code 界面。",
        matters: "它不仅是内容展示入口，也是工程实践入口，把对外页面与结构化仓库文档系统结合在同一产品表面。"
      }
    },
    "personal-ai-agent-system": {
      roleKey: "aiWorkflow",
      domains: ["ai", "automation", "infrastructure"],
      tags: ["Agent OS", "Modular Architecture", "MCP", "Memory", "Skill System", "SOUL Contract"],
      stack: "Python · FastAPI · MCP · Modular Agent Runtime",
      en: {
        is: "A modular AI Agent Operating System framework.",
        does: "A repository that decomposes agent capability into setup, control, intelligence, integration, and operations modules such as INST, CONF, MEM, SKL, CTX, SOUL, TOOLS, MCP, and ARCH.",
        matters: "It upgrades AI from a single chat model into an executable system with memory, reusable skills, tool integration, protocol extensibility, and behavior contracts."
      },
      zh: {
        is: "一个模块化 AI Agent 操作系统（Agent OS）框架。",
        does: "该仓库把 Agent 能力拆解为系统搭建、控制、智能、集成与运维模块，包括 INST、CONF、MEM、SKL、CTX、SOUL、TOOLS、MCP、ARCH 等核心单元。",
        matters: "它把 AI 从单一聊天模型升级为具备记忆、可复用技能、工具调用、协议扩展和行为契约的可执行系统。"
      }
    },
    "desktop-tutorial": {
      roleKey: "softwareProject",
      domains: ["developerTools"],
      tags: ["Git Onboarding", "GitHub Desktop", "Commit Workflow", "PR Practice"],
      stack: "Git · GitHub Desktop · Markdown",
      en: {
        is: "A Git onboarding training repository.",
        does: "Provides a controlled environment to practice clone-edit-commit-push-PR loops with GitHub Desktop before moving to larger production repositories.",
        matters: "It lowers collaboration failure risk by validating fundamentals early: clean commits, branch discipline, and review-ready changes."
      },
      zh: {
        is: "一个 Git 协作入门训练仓库。",
        does: "用于在进入更复杂生产仓库前，先练熟 GitHub Desktop 的 clone-edit-commit-push-PR 基本闭环。",
        matters: "它通过低风险训练先固化协作基本功：干净提交、分支纪律与可评审改动。"
      }
    },
    jacksha: {
      roleKey: "softwareProject",
      domains: ["developerTools"],
      tags: ["Namespace Reserve", "Incubation Repo", "Roadmap Placeholder"],
      stack: "Repository Initialization · Markdown",
      en: {
        is: "A namespace reservation and incubation repository.",
        does: "Currently minimal, intended to evolve into a scoped project with clear README contracts, milestones, and first runnable artifact.",
        matters: "Treating placeholders as managed incubation spaces prevents naming drift and creates a deliberate path from empty repo to shippable project."
      },
      zh: {
        is: "一个命名空间保留与孵化仓库。",
        does: "当前内容极简，目标是逐步演化为具备 README 契约、里程碑和首个可运行产物的明确项目。",
        matters: "把占位仓库当作可管理孵化空间，可以避免命名漂移，并形成从空仓库到可交付项目的清晰路径。"
      }
    },
    "jack-sha": {
      roleKey: "softwareProject",
      domains: ["web"],
      tags: ["Identity Anchor", "Public Namespace", "Brand Placeholder"],
      stack: "Repository Initialization · Markdown",
      en: {
        is: "An identity-anchor repository for public-facing artifacts.",
        does: "Currently a lightweight placeholder, positioned to host canonical profile metadata, links, and future brand-facing assets.",
        matters: "Maintaining an explicit identity anchor avoids fragmentation across handles and keeps future public deliverables discoverable."
      },
      zh: {
        is: "一个面向公开资产的身份锚点仓库。",
        does: "目前是轻量占位，后续可承载统一的身份说明、链接索引与品牌化公开资产。",
        matters: "保持显式身份锚点可以减少多平台命名碎片化，并保证后续公开交付物有稳定可发现入口。"
      }
    }
  });

  const COPY = {
    en: {
      navLabels: {
        overview: "Overview",
        repositories: "Repositories",
        activity: "Activity",
        sync: "Sync / Source"
      },
      viewMeta: {
        overview: {
          kicker: "System Overview",
          title: "Overview",
          intro: "Understand what this system tracks, then drill into repositories, activity, and source trust."
        },
        repositories: {
          kicker: "Repository Inventory",
          title: "Repositories",
          intro: "Browse all repositories in a structured list and inspect one selected object at a time."
        },
        activity: {
          kicker: "System Timeline",
          title: "Activity",
          intro: "Read recent timeline events and open linked repositories directly in the detail panel."
        },
        sync: {
          kicker: "Source Credibility",
          title: "Sync / Source",
          intro: "Audit freshness, source mode, sync history, and configured repository coverage."
        }
      },
      sidebarMeta:
        "A sidebar-driven application interface with stable layout, dynamic workspace, and object-focused detail inspection.",
      detailKicker: "Object Interface",
      detailHeading: "Repository Detail",
      detailClear: "Clear Selection",
      detailEmpty: "Select a repository to inspect its full object detail.",
      modeLabel: "Mode",
      modeLabels: {
        live: "Live",
        stale: "Stale",
        partial: "Partial",
        placeholder: "Placeholder",
        syncing: "Syncing"
      },
      modeDescriptions: {
        live: "Live data from GitHub is current and complete for this session.",
        stale: "Showing older cached data because a recent sync failed.",
        partial: "Data loaded, but coverage is incomplete for configured targets.",
        placeholder: "No reliable data loaded yet.",
        syncing: "Sync in progress."
      },
      statusWaiting: "Waiting for source sync.",
      statusSyncing: "Syncing GitHub source...",
      statusLine: (mode, lastSyncText) => `${mode} source status · ${lastSyncText}`,
      lastSyncPrefix: "last sync",
      neverSynced: "no successful sync yet",
      allDomains: "All domains",
      searchPlaceholder: "Search repositories by name, stack, or purpose",
      sortUpdated: "Recently Updated",
      sortStars: "Stars",
      sortName: "Name",
      repoSummary: (shown, total) => `${shown} shown / ${total} total`,
      repoPageLabel: (page, totalPages) => `Page ${page} / ${totalPages}`,
      pagePrev: "Prev",
      pageNext: "Next",
      noRepositoryMatch: "No repositories match the current search and filter.",
      noRepositoriesLoaded: "No repositories are available in the current source state.",
      openDetail: "Open Detail",
      openGitHub: "GitHub",
      openRepo: "Open Repo",
      detailUpdated: (value) => `Last updated ${value}`,
      relatedActivityEmpty: "No related activity has been recorded for this repository yet.",
      activityEmpty: "No activity entries available yet.",
      activityFilterAll: "All",
      activityFilterRepo: "Repo Updates",
      activityFilterSync: "Sync Events",
      syncSourceTemplate: (username) => `GitHub REST API /users/${username}/repos`,
      freshnessNever: "No successful sync yet",
      freshnessNow: "Just now",
      freshnessMinutes: (value) => `${value}m ago`,
      freshnessHours: (value) => `${value}h ago`,
      freshnessDays: (value) => `${value}d ago`,
      errorNone: "None",
      sourceHistoryEmpty: "No sync history has been recorded yet.",
      sourceCoverageEmpty: "No target repositories are configured.",
      sourceCoverageLoaded: "Loaded",
      sourceCoverageMissing: "Missing",
      targetMissingDoes: "This target repository is configured but not visible through the current public GitHub source.",
      targetMissingMatters: "It remains in scope for this interface system and will resolve automatically when the source can read it.",
      targetMissingStack: "Source pending",
      targetTagTargeted: "Targeted",
      targetTagPending: "Awaiting Public Source",
      fallbackDescription: "A practical software project with a clear build and execution surface.",
      defaultStack: "General software",
      unknownRepository: "Unknown repository",
      activityTitleRepoUpdate: (name) => `${name} updated`,
      activityBodyRepoUpdate: "Repository has recent upstream activity.",
      activityTitleSyncSuccess: "Source sync completed",
      activityBodySyncSuccess: (count, mode) => `${count} repositories loaded · ${mode} mode.`,
      activityTitleSyncError: "Source sync failed",
      activityBodySyncError: (message) => message || "Unknown sync error.",
      activityTitleManualSync: "Manual sync requested",
      activityBodyManualSync: "Sync was triggered from the source interface.",
      domainLabels: {
        ai: "AI",
        automation: "Automation",
        data: "Data",
        web: "Web",
        infrastructure: "Infrastructure",
        developerTools: "Developer Tools"
      },
      shellTitle: "Repository Docs",
      sidebarMeta: "A documentation-grade repository surface with clear progression from setup to deeper system capabilities.",
      statusLabel: "Source Status",
      modeLabelText: "Mode",
      repositoriesLabel: "Repositories",
      searchLabel: "Search",
      searchPlaceholderDocs: "Search repositories",
      modulesLabel: "Documentation Modules",
      entryLabels: {
        installation: "Start: Installation",
        "quickstart-tutorial": "Continue: Quickstart",
        "learning-path": "Next: Learning Path"
      },
      workspaceKickerDefault: "Repository Docs",
      workspaceWaitingTitle: "Waiting for repository data",
      workspaceWaitingIntro: "Sync or select a repository, then start from the Installation module.",
      workspaceIntroTemplate: (repo) =>
        `${repo.whatItIs} ${repo.whatItDoes} Start with Installation and Quickstart, then move into integration, operations, and deeper system modules.`,
      workspaceUpdatedPrefix: "Updated",
      openOnGithub: "Open on GitHub",
      selectRepoForModules: "Select a repository to view grouped documentation modules.",
      modulesUnavailable: "Repository modules are unavailable right now. Complete source sync to continue.",
      sourceCoverageLoadedText: "Source coverage loaded",
      sourceCoveragePendingText: "Source coverage pending",
      orientation: {
        title: "Repository Orientation",
        whatIs: "What This Repo Is",
        whatCanDo: "What It Can Do",
        whereStart: "Where To Start",
        depth: "How Deep It Goes",
        startPath: "Installation -> Quickstart Tutorial -> Learning Path",
        depthText: (moduleCount, tierCount) => `${moduleCount} modules across ${tierCount} tiers`
      },
      modulePanel: {
        moduleIdLabel: "Module ID",
        deeperLabel: (count) => `${count} deeper module${count === 1 ? "" : "s"}`,
        footerStartPoint: "Start point: Installation -> Quickstart Tutorial -> Learning Path.",
        openSourceReference: "Open Source Reference"
      },
      moduleGroupTitles: {
        "getting-started": "GETTING STARTED",
        "system-setup": "SYSTEM SETUP",
        "intelligence-layer": "INTELLIGENCE LAYER",
        integration: "INTEGRATION",
        operations: "OPERATIONS",
        system: "SYSTEM"
      },
      moduleTitles: {
        installation: "Installation",
        "quickstart-tutorial": "Quickstart Tutorial",
        "learning-path": "Learning Path",
        configuration: "Configuration",
        "messaging-gateway": "Messaging Gateway",
        "tools-toolsets": "Tools & Toolsets",
        "memory-system": "Memory System",
        "skills-system": "Skills System",
        "context-files": "Context Files",
        "personality-soul": "Personality / SOUL.md",
        "mcp-integration": "MCP Integration",
        "use-mcp-with-hermes": "Use MCP with Hermes",
        "voice-mode": "Voice Mode",
        "use-voice-mode": "Use Voice Mode",
        "security": "Security",
        "tips-best-practices": "Tips & Best Practices",
        "architecture": "Architecture",
        "faq-troubleshooting": "FAQ & Troubleshooting"
      },
      moduleDescriptions: {
        installation: "Set up runtime, dependencies, and local prerequisites.",
        "quickstart-tutorial": "Run the fastest end-to-end walkthrough.",
        "learning-path": "Progress from onboarding to advanced operation.",
        configuration: "Tune runtime defaults, environment, and behavior.",
        "messaging-gateway": "Understand command flow, events, and delivery edges.",
        "tools-toolsets": "Capabilities exposed by this repository system.",
        "memory-system": "Persistent records, cache strategy, and recall rules.",
        "skills-system": "Reusable behaviors, playbooks, and capability packs.",
        "context-files": "Context contracts and reference surfaces for operations.",
        "personality-soul": "Behavior contract, style, and system intent.",
        "mcp-integration": "Model Context Protocol wiring and runtime handshakes.",
        "use-mcp-with-hermes": "Hermes-specific MCP usage and flow examples.",
        "voice-mode": "Voice interface architecture and lifecycle.",
        "use-voice-mode": "Conversation runbook and voice interaction flow.",
        "security": "Security controls, boundaries, and operational safeguards.",
        "tips-best-practices": "Field-tested guidance for safe and efficient operation.",
        "architecture": "System map, boundary definitions, and component layering.",
        "faq-troubleshooting": "Frequent issues, diagnostics, and proven fixes."
      }
    },
    zh: {
      navLabels: {
        overview: "总览",
        repositories: "仓库",
        activity: "活动",
        sync: "同步 / 数据源"
      },
      viewMeta: {
        overview: {
          kicker: "系统总览",
          title: "总览",
          intro: "先理解系统在追踪什么，再进入仓库、活动与数据源可信度视图。"
        },
        repositories: {
          kicker: "仓库目录",
          title: "仓库",
          intro: "在结构化列表中浏览仓库，并在右侧详情面板聚焦查看单个对象。"
        },
        activity: {
          kicker: "系统时间线",
          title: "活动",
          intro: "查看最近时间线事件，并直接在详情面板打开关联仓库。"
        },
        sync: {
          kicker: "数据源可信度",
          title: "同步 / 数据源",
          intro: "审计当前新鲜度、源状态、同步历史与目标仓库覆盖情况。"
        }
      },
      sidebarMeta: "这是一个侧边栏驱动的系统界面：布局稳定、工作区切换快速、对象详情聚焦清晰。",
      detailKicker: "对象界面",
      detailHeading: "仓库详情",
      detailClear: "清除选择",
      detailEmpty: "请选择一个仓库查看完整对象详情。",
      modeLabel: "模式",
      modeLabels: {
        live: "实时",
        stale: "过期",
        partial: "部分",
        placeholder: "占位",
        syncing: "同步中"
      },
      modeDescriptions: {
        live: "当前会话中的 GitHub 数据为最新且完整。",
        stale: "最近同步失败，当前显示的是较旧数据。",
        partial: "数据已加载，但配置目标覆盖不完整。",
        placeholder: "尚未加载可靠数据。",
        syncing: "正在同步中。"
      },
      statusWaiting: "等待数据源同步。",
      statusSyncing: "正在同步 GitHub 数据源...",
      statusLine: (mode, lastSyncText) => `${mode} 数据源状态 · ${lastSyncText}`,
      lastSyncPrefix: "上次同步",
      neverSynced: "暂无成功同步",
      allDomains: "全部领域",
      searchPlaceholder: "按仓库名、技术栈或用途搜索",
      sortUpdated: "最近更新",
      sortStars: "星标数",
      sortName: "名称",
      repoSummary: (shown, total) => `显示 ${shown} / 总计 ${total}`,
      repoPageLabel: (page, totalPages) => `第 ${page} / ${totalPages} 页`,
      pagePrev: "上一页",
      pageNext: "下一页",
      noRepositoryMatch: "当前搜索或筛选条件下没有匹配仓库。",
      noRepositoriesLoaded: "当前数据源状态下暂无可用仓库。",
      openDetail: "查看详情",
      openGitHub: "GitHub",
      openRepo: "打开仓库",
      detailUpdated: (value) => `最近更新 ${value}`,
      relatedActivityEmpty: "该仓库暂时没有相关活动记录。",
      activityEmpty: "暂无活动记录。",
      activityFilterAll: "全部",
      activityFilterRepo: "仓库更新",
      activityFilterSync: "同步事件",
      syncSourceTemplate: (username) => `GitHub REST API /users/${username}/repos`,
      freshnessNever: "暂无成功同步",
      freshnessNow: "刚刚",
      freshnessMinutes: (value) => `${value} 分钟前`,
      freshnessHours: (value) => `${value} 小时前`,
      freshnessDays: (value) => `${value} 天前`,
      errorNone: "无",
      sourceHistoryEmpty: "暂时没有同步历史记录。",
      sourceCoverageEmpty: "暂未配置目标仓库。",
      sourceCoverageLoaded: "已加载",
      sourceCoverageMissing: "缺失",
      targetMissingDoes: "该目标仓库已配置，但当前公开 GitHub 数据源不可见。",
      targetMissingMatters: "它仍在本系统范围内，数据源可读取后会自动恢复为正常仓库。",
      targetMissingStack: "等待数据源",
      targetTagTargeted: "目标仓库",
      targetTagPending: "等待公开数据源",
      fallbackDescription: "一个具有清晰构建与执行面的实用软件项目。",
      defaultStack: "通用软件",
      unknownRepository: "未知仓库",
      activityTitleRepoUpdate: (name) => `${name} 已更新`,
      activityBodyRepoUpdate: "该仓库近期有上游更新。",
      activityTitleSyncSuccess: "数据源同步完成",
      activityBodySyncSuccess: (count, mode) => `已加载 ${count} 个仓库 · 当前模式 ${mode}。`,
      activityTitleSyncError: "数据源同步失败",
      activityBodySyncError: (message) => message || "未知同步错误。",
      activityTitleManualSync: "已触发手动同步",
      activityBodyManualSync: "本次同步由数据源界面手动发起。",
      domainLabels: {
        ai: "AI",
        automation: "自动化",
        data: "数据",
        web: "Web",
        infrastructure: "基础设施",
        developerTools: "开发工具"
      },
      shellTitle: "代码文档系统",
      sidebarMeta: "以文档产品方式组织仓库：从安装、上手到集成与运维深度，路径清晰、可持续扩展。",
      statusLabel: "数据源状态",
      modeLabelText: "模式",
      repositoriesLabel: "仓库",
      searchLabel: "搜索",
      searchPlaceholderDocs: "搜索仓库",
      modulesLabel: "文档模块",
      entryLabels: {
        installation: "起点：安装",
        "quickstart-tutorial": "继续：快速上手",
        "learning-path": "进阶：学习路径"
      },
      workspaceKickerDefault: "仓库文档",
      workspaceWaitingTitle: "等待仓库数据",
      workspaceWaitingIntro: "请先同步或选择仓库，然后从安装模块开始阅读。",
      workspaceIntroTemplate: (repo) =>
        `${repo.whatItIs} ${repo.whatItDoes} 建议先读安装与快速上手，再进入集成、运维与系统深层模块。`,
      workspaceUpdatedPrefix: "更新于",
      openOnGithub: "在 GitHub 打开",
      selectRepoForModules: "请先选择一个仓库，再查看分层模块导航。",
      modulesUnavailable: "当前仓库暂时没有可用模块，请先完成数据同步。",
      sourceCoverageLoadedText: "数据源覆盖已加载",
      sourceCoveragePendingText: "数据源覆盖待补全",
      orientation: {
        title: "仓库定位",
        whatIs: "这个仓库是什么",
        whatCanDo: "它能做什么",
        whereStart: "从哪里开始",
        depth: "可以深入到什么程度",
        startPath: "安装 -> 快速上手 -> 学习路径",
        depthText: (moduleCount, tierCount) => `${moduleCount} 个模块，覆盖 ${tierCount} 个层级`
      },
      modulePanel: {
        moduleIdLabel: "模块 ID",
        deeperLabel: (count) => `后续深度模块 ${count} 个`,
        footerStartPoint: "推荐路径：安装 -> 快速上手 -> 学习路径。",
        openSourceReference: "打开源码参考"
      },
      moduleGroupTitles: {
        "getting-started": "快速开始",
        "system-setup": "系统搭建",
        "intelligence-layer": "智能层",
        integration: "集成",
        operations: "运维",
        system: "系统说明"
      },
      moduleTitles: {
        installation: "安装",
        "quickstart-tutorial": "快速上手教程",
        "learning-path": "学习路径",
        configuration: "配置",
        "messaging-gateway": "消息网关",
        "tools-toolsets": "工具与工具集",
        "memory-system": "记忆系统",
        "skills-system": "技能系统",
        "context-files": "上下文文件",
        "personality-soul": "人格 / SOUL.md",
        "mcp-integration": "MCP 集成",
        "use-mcp-with-hermes": "在 Hermes 中使用 MCP",
        "voice-mode": "语音模式",
        "use-voice-mode": "使用语音模式",
        "security": "安全",
        "tips-best-practices": "技巧与最佳实践",
        "architecture": "架构",
        "faq-troubleshooting": "FAQ 与故障排查"
      },
      moduleDescriptions: {
        installation: "完成运行环境、依赖与本地前置条件。",
        "quickstart-tutorial": "用最短路径跑通一次端到端流程。",
        "learning-path": "从入门走向高级能力的学习路线。",
        configuration: "配置环境、默认参数与运行行为。",
        "messaging-gateway": "理解请求、事件与消息通道。",
        "tools-toolsets": "查看该仓库暴露的能力工具面。",
        "memory-system": "定义状态存储、召回与刷新策略。",
        "skills-system": "组织可复用技能与执行策略。",
        "context-files": "管理上下文文件与引用边界。",
        "personality-soul": "定义行为风格与 SOUL.md 契约。",
        "mcp-integration": "接入 MCP 协议与工具调用。",
        "use-mcp-with-hermes": "面向 Hermes 的 MCP 实操方式。",
        "voice-mode": "语音交互能力与生命周期结构。",
        "use-voice-mode": "语音模式的实际操作流程。",
        "security": "安全边界、控制与防护策略。",
        "tips-best-practices": "沉淀高可用实践与操作经验。",
        "architecture": "系统结构、边界与组件关系。",
        "faq-troubleshooting": "常见问题与故障排查路径。"
      }
    }
  };

  const dom = {
    sidebarMeta: document.querySelector("[data-code-sidebar-meta]"),
    modeBadge: document.querySelector("[data-code-mode-badge]"),
    statusLine: document.querySelector("[data-code-status-line]"),
    repoSearchInput: document.querySelector("[data-code-repo-search]"),
    repoSidebarList: document.querySelector("[data-code-repo-sidebar-list]"),
    moduleGroups: document.querySelector("[data-code-module-groups]"),
    workspaceKicker: document.querySelector("[data-code-workspace-kicker]"),
    workspaceTitle: document.querySelector("[data-code-workspace-title]"),
    workspaceIntro: document.querySelector("[data-code-workspace-intro]"),
    workspaceStack: document.querySelector("[data-code-workspace-stack]"),
    workspaceUpdated: document.querySelector("[data-code-workspace-updated]"),
    workspaceLink: document.querySelector("[data-code-workspace-link]"),
    modulePanel: document.querySelector("[data-code-module-panel]")
  };

  const query = new URLSearchParams(window.location.search);
  const initialRepoKey = normalizeRepoIdentifier(query.get("repo"));
  const initialModuleId = getInitialModuleId();
  const state = {
    isLoading: false,
    rawPublicRepos: [],
    syncMeta: {
      lastSyncAt: null,
      source: "",
      errorMessage: "",
      partialHint: false
    },
    syncHistory: [],
    data: null,
    ui: {
      selectedRepoId: initialRepoKey || null,
      activeModuleId: initialModuleId,
      repoQuery: ""
    }
  };

  function getConnectionInfo() {
    return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  }

  function detectPerformanceProfile() {
    const connection = getConnectionInfo();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
    const hardwareConcurrency = Number(navigator.hardwareConcurrency || 0);
    const deviceMemory = Number(navigator.deviceMemory || 0);
    const saveData = Boolean(connection && connection.saveData);
    const effectiveType = String((connection && connection.effectiveType) || "").toLowerCase();
    const slowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
    const constrained =
      prefersReducedMotion ||
      saveData ||
      slowConnection ||
      (deviceMemory > 0 && deviceMemory <= 4) ||
      (hardwareConcurrency > 0 && hardwareConcurrency <= 4) ||
      (coarsePointer && viewportWidth <= 900);
    const balanced =
      !constrained &&
      ((deviceMemory > 0 && deviceMemory <= 8) ||
        (hardwareConcurrency > 0 && hardwareConcurrency <= 8) ||
        viewportWidth <= 1280 ||
        coarsePointer);
    const tier = constrained ? "constrained" : balanced ? "balanced" : "full";

    return {
      tier,
      allowTelemetry: tier === "full",
      allowIntroLock: tier === "full",
      allowBridgeEffects: tier === "full",
      simplifyStoryEffects: tier !== "full",
      heavyInitDelayMs: tier === "full" ? 120 : 220,
      syncDelayMs: tier === "constrained" ? 180 : 90,
      maxRepoPages: tier === "full" ? 4 : tier === "balanced" ? 3 : 2
    };
  }

  const PERFORMANCE_PROFILE = detectPerformanceProfile();

  function applyPerformanceProfile(profile) {
    if (!document.body) return;
    document.body.dataset.codePerformance = profile.tier;
  }

  function scheduleDeferredTask(task, options) {
    const settings = options || {};
    const delayMs = Math.max(Number(settings.delayMs || 0), 0);
    const timeoutMs = Math.max(Number(settings.timeoutMs || 120), 1);

    const runTask = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          task();
        }, { timeout: timeoutMs });
        return;
      }

      window.setTimeout(task, 0);
    };

    if (delayMs > 0) {
      window.setTimeout(runTask, delayMs);
      return;
    }

    runTask();
  }

  const RAIN_HERO_LINES = Object.freeze([
    "Placeholder Line 1",
    "Placeholder Line 2",
    "Placeholder Line 3",
    "Placeholder Line 4"
  ]);

  const RAIN_HERO_STATES = Object.freeze({
    idleVisible: "idle-visible",
    preTransition: "pre-transition",
    sweepTransition: "sweep-transition",
    settle: "settle"
  });

  // Edit these cue windows directly to align text motion with the recorded wiper.
  const RAIN_HERO_SWEEP_CUES = Object.freeze([
    Object.freeze({ start: 0.42, end: 1.18, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 1.22, end: 2.03, direction: "return", transitionTrigger: 0.62, advanceText: true, advanceTrigger: 0.34 }),
    Object.freeze({ start: 2.31, end: 3.01, direction: "outbound", transitionTrigger: 0.22, advanceText: false }),
    Object.freeze({ start: 3.08, end: 3.86, direction: "return", transitionTrigger: 0.64, advanceText: true, advanceTrigger: 0.36 }),
    Object.freeze({ start: 4.24, end: 4.92, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 5.01, end: 5.81, direction: "return", transitionTrigger: 0.62, advanceText: true, advanceTrigger: 0.34 }),
    Object.freeze({ start: 6.14, end: 6.87, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 6.95, end: 7.74, direction: "return", transitionTrigger: 0.64, advanceText: true, advanceTrigger: 0.36 }),
    Object.freeze({ start: 8.12, end: 8.83, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 8.92, end: 9.71, direction: "return", transitionTrigger: 0.64, advanceText: true, advanceTrigger: 0.36 }),
    Object.freeze({ start: 10.06, end: 10.78, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 10.86, end: 11.67, direction: "return", transitionTrigger: 0.62, advanceText: true, advanceTrigger: 0.34 }),
    Object.freeze({ start: 12.01, end: 12.73, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 12.82, end: 13.63, direction: "return", transitionTrigger: 0.62, advanceText: true, advanceTrigger: 0.34 }),
    Object.freeze({ start: 13.98, end: 14.71, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 14.79, end: 15.58, direction: "return", transitionTrigger: 0.64, advanceText: true, advanceTrigger: 0.36 }),
    Object.freeze({ start: 15.91, end: 16.62, direction: "outbound", transitionTrigger: 0.24, advanceText: false }),
    Object.freeze({ start: 16.71, end: 17.49, direction: "return", transitionTrigger: 0.62, advanceText: true, advanceTrigger: 0.34 })
  ]);

  const BREATH_STORY_PHASES = Object.freeze({
    codeWallHoldEnd: 0.24,
    imageIntroStart: 0.1,
    imageIntroEnd: 0.36,
    imageDeblurStart: 0.18,
    imageDeblurEnd: 0.46,
    monoHoldStart: 0.46,
    monoHoldEnd: 0.66,
    telemetryFadeStart: 0.52,
    telemetryFadeEnd: 0.86,
    colorReturnStart: 0.64,
    colorReturnEnd: 0.86,
    copyRevealStart: 0.64,
    copyRevealEnd: 0.78,
    copyHoldEnd: 0.88,
    copyDissolveStart: 0.88,
    copyDissolveEnd: 1
  });

  const CODE_WALL_INTRO_STATES = Object.freeze({
    idle: "IDLE",
    enteredBlackStage: "ENTERED_BLACK_STAGE",
    autoGenerating: "AUTO_GENERATING",
    generated: "GENERATED",
    normalScrollStory: "NORMAL_SCROLL_STORY"
  });

  const CODE_WALL_INTRO_CONFIG = Object.freeze({
    triggerViewportRatio: 0,
    enterHoldMs: 420,
    reducedEnterHoldMs: 120,
    autoGenerationDurationMs: 9600,
    reducedAutoGenerationDurationMs: 900,
    generatedHoldMs: 780,
    reducedGeneratedHoldMs: 150,
    completionThreshold: 0.96,
    completionMinStartedRatio: 0.94,
    maxAutoGenerationOverrunRatio: 1.12,
    rowStartThreshold: 0.34,
    startWaveStart: 0.06,
    startWaveEnd: 0.84,
    maxConcurrentRowsDesktop: 8,
    maxConcurrentRowsMobile: 5,
    maxConcurrentRowsPeakDesktop: 28,
    maxConcurrentRowsPeakMobile: 18,
    caretVisible: false,
    tokenBurstChars: Object.freeze({ min: 1, max: 5 }),
    numericBurstChars: Object.freeze({ min: 1, max: 4 }),
    machineBurstChars: Object.freeze({ min: 6, max: 12 }),
    midTokenPauseMs: Object.freeze({ min: 12, max: 28 }),
    wordPauseMs: Object.freeze({ min: 24, max: 66 }),
    fieldPauseMs: Object.freeze({ min: 42, max: 108 }),
    separatorPauseMs: Object.freeze({ min: 82, max: 176 }),
    lineFinishBoostStart: 0.7,
    lineFinishBoostMax: 1.55,
    machineBurstChance: 0.08
  });

  // Tunable: density (fontSize*, lineHeight*, rowOverscan, widthOverscanChars), motion (upwardScrollSpeed*),
  // liveness (mutationFrequency*, highlightFrequency), atmosphere (scanlineIntensity, noiseIntensity, overallOpacity),
  // quality cap (maxDevicePixelRatio), throttle (targetFps, reducedMotionFps, reducedMotion* variants),
  // and post-intro motion (upwardScrollSpeed*, mutationFrequency*).
  const TELEMETRY_WALL_CONFIG = Object.freeze({
    fontSizeDesktop: 11.6,
    fontSizeMobile: 9.9,
    lineHeightDesktop: 1.3,
    lineHeightMobile: 1.28,
    rowOverscan: 8,
    widthOverscanChars: 44,
    upwardScrollSpeedDesktop: 6.8,
    upwardScrollSpeedMobile: 5.4,
    reducedMotionScrollSpeed: 0.45,
    mutationFrequencyDesktop: 105,
    mutationFrequencyMobile: 145,
    reducedMotionMutationFrequency: 920,
    highlightFrequency: 0.16,
    numericPatchFrequency: 1.35,
    scanlineIntensity: 0,
    noiseIntensity: 0,
    overallOpacity: 1,
    maxDevicePixelRatio: 2,
    targetFps: 24,
    reducedMotionFps: 8
  });

  const TELEMETRY_FONT_STACK = '"JetBrains Mono", "SFMono-Regular", "SF Mono", "IBM Plex Mono", "Menlo", "Consolas", monospace';
  const TELEMETRY_GROUP_NAMES = Object.freeze([
    "IO80211Controller",
    "IO80211Infrastructure",
    "IOPowerTelemetry",
    "IODiagnostics",
    "IOTransportSupervisor",
    "IOStackReport",
    "IOChannelArbitration",
    "IORadioSlice"
  ]);
  const TELEMETRY_INTERFACES = Object.freeze(["wlan0", "en0", "peer0", "mesh0", "uplink0", "diag0"]);
  const TELEMETRY_SCAN_STATES = Object.freeze(["idle", "passive", "active", "handoff", "survey", "sync"]);
  const TELEMETRY_BUFFER_STATES = Object.freeze(["steady", "prefill", "drain", "armed", "trim", "latched"]);
  const TELEMETRY_PATH_STATES = Object.freeze(["Path On", "Path Off"]);
  const TELEMETRY_STREAMS = Object.freeze([
    "io.report",
    "transport.link",
    "phy.watch",
    "resource.scheduler",
    "channel.audit",
    "diag.surface",
    "buffer.window"
  ]);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function easeInOutSine(value) {
    return -(Math.cos(Math.PI * value) - 1) / 2;
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function progressBetween(value, start, end) {
    if (end <= start) return value >= end ? 1 : 0;
    return clamp((value - start) / (end - start), 0, 1);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
  }

  function pickRandom(values) {
    if (!Array.isArray(values) || values.length === 0) return "";
    return values[randomInt(0, values.length - 1)];
  }

  function padDigits(value, size) {
    return String(Math.max(0, Math.floor(Number(value) || 0))).padStart(size, "0");
  }

  function formatTelemetryCounter(min, max) {
    return String(randomInt(min, max));
  }

  function formatTelemetryFloat(min, max, precision) {
    return randomBetween(min, max).toFixed(precision);
  }

  function formatTelemetryHex(length) {
    const chars = "0123456789ABCDEF";
    let token = "0x";
    for (let index = 0; index < length; index += 1) {
      token += chars[randomInt(0, chars.length - 1)];
    }
    return token;
  }

  function formatTelemetryStamp() {
    return `[${padDigits(randomInt(0, 23), 2)}:${padDigits(randomInt(0, 59), 2)}:${padDigits(randomInt(0, 59), 2)}.${padDigits(randomInt(0, 999), 3)}]`;
  }

  function formatTelemetryTuple(parts) {
    return `(${parts.join(", ")})`;
  }

  function formatTelemetryNodeId() {
    return `node/${padDigits(randomInt(0, 999), 3)}:${padDigits(randomInt(0, 63), 2)}`;
  }

  function formatTelemetryLongId() {
    return `${randomInt(120, 999)}-${randomInt(1000, 9999)}-${randomInt(100000, 999999)}`;
  }

  function createTelemetryReportRowFactories() {
    return [
      () => formatTelemetryStamp(),
      () => `stream="${pickRandom(TELEMETRY_STREAMS)}"`,
      () => `IOReportGroupName="${pickRandom(TELEMETRY_GROUP_NAMES)}"`,
      () => `IOReportChannelInfo=${formatTelemetryTuple([
        `channel:${randomInt(1, 184)}`,
        `slice:${randomInt(0, 7)}`,
        `chain:${randomInt(0, 3)}`,
        `peer:${randomInt(0, 15)}`
      ])}`,
      () => `interface="${pickRandom(TELEMETRY_INTERFACES)}"`,
      () => `Rx Bytes=${formatTelemetryCounter(18000, 980000000)}`,
      () => `Tx Bytes=${formatTelemetryCounter(14000, 860000000)}`,
      () => `Assoc Success=${formatTelemetryCounter(12, 9800)}`,
      () => `Duplicate Sequence Control Rx=${formatTelemetryCounter(0, 192)}`,
      () => `Active Chains=${randomInt(1, 4)}`
    ];
  }

  function createTelemetryTransportRowFactories() {
    return [
      () => formatTelemetryStamp(),
      () => `stream="transport.link"`,
      () => `transport_id=${formatTelemetryLongId()}`,
      () => `Resource Request=${formatTelemetryCounter(0, 240)}`,
      () => `Block Ack=${formatTelemetryCounter(0, 112)}`,
      () => `CTS Rxd in response to RTS=${formatTelemetryCounter(0, 96)}`,
      () => `No ACK Failure=${formatTelemetryCounter(0, 18)}`,
      () => `retry_depth=${formatTelemetryCounter(0, 6)}`,
      () => `rx_window=${formatTelemetryCounter(32, 1024)}`,
      () => `frame_hint=${formatTelemetryHex(10)}`
    ];
  }

  function createTelemetryWatchdogRowFactories() {
    return [
      () => formatTelemetryStamp(),
      () => `stream="phy.watch"`,
      () => `PHY Watchdogs=${formatTelemetryCounter(0, 42)}`,
      () => `PM Watchdogs=${formatTelemetryCounter(0, 22)}`,
      () => `TVM Updates=${formatTelemetryCounter(18, 4200)}`,
      () => `Slice Frames=${formatTelemetryCounter(1200, 960000)}`,
      () => `scan_state="${pickRandom(TELEMETRY_SCAN_STATES)}"`,
      () => `Temperature=${formatTelemetryFloat(31, 82, 1)}C`,
      () => `Battery Voltage=${formatTelemetryFloat(3.71, 4.23, 3)}V`,
      () => `${pickRandom(TELEMETRY_PATH_STATES)}=${formatTelemetryCounter(0, 72)}`
    ];
  }

  function createTelemetryDiagnosticRowFactories() {
    return [
      () => formatTelemetryStamp(),
      () => `stream="diag.surface"`,
      () => `node=${formatTelemetryNodeId()}`,
      () => `buffer=${formatTelemetryTuple([
        `depth:${formatTelemetryCounter(8, 2048)}`,
        `watermark:${formatTelemetryCounter(4, 1024)}`,
        `state:${pickRandom(TELEMETRY_BUFFER_STATES)}`
      ])}`,
      () => `rx_rate_mbps=${formatTelemetryFloat(18, 866, 1)}`,
      () => `tx_rate_mbps=${formatTelemetryFloat(18, 866, 1)}`,
      () => `latency_ms=${formatTelemetryFloat(0.16, 12.4, 2)}`,
      () => `queue_depth=${formatTelemetryCounter(0, 512)}`,
      () => `hex=${formatTelemetryHex(8)}`,
      () => `session="${formatTelemetryLongId()}"`
    ];
  }

  function createTelemetryDenseCommaRowFactories() {
    return [
      () => formatTelemetryStamp(),
      () => `IOReportGroupName="${pickRandom(TELEMETRY_GROUP_NAMES)}"`,
      () => `IOReportChannelInfo=(${`ch:${randomInt(0, 11)}`}, ${`slice:${randomInt(0, 7)}`}, ${`peer:${randomInt(0, 24)}`})`,
      () => `Assoc Success=${formatTelemetryCounter(8, 8800)}`,
      () => `Duplicate Sequence Control Rx=${formatTelemetryCounter(0, 240)}`,
      () => `Rx Bytes=${formatTelemetryCounter(22000, 920000000)}`,
      () => `Tx Bytes=${formatTelemetryCounter(18000, 880000000)}`,
      () => `CTS Rxd in response to RTS=${formatTelemetryCounter(0, 120)}`,
      () => `No ACK Failure=${formatTelemetryCounter(0, 22)}`,
      () => `TVM Updates=${formatTelemetryCounter(24, 5200)}`,
      () => `PM Watchdogs=${formatTelemetryCounter(0, 28)}`,
      () => `PHY Watchdogs=${formatTelemetryCounter(0, 36)}`,
      () => `Slice Frames=${formatTelemetryCounter(1400, 980000)}`,
      () => `Active Chains=${randomInt(1, 4)}`,
      () => `Temperature=${formatTelemetryFloat(29, 86, 1)}C`,
      () => `Battery Voltage=${formatTelemetryFloat(3.66, 4.24, 3)}V`,
      () => `scan_state="${pickRandom(TELEMETRY_SCAN_STATES)}"`,
      () => `transport="${pickRandom(["mplane", "uplane", "ctrl", "mgmt", "diag"])}"`
    ];
  }

  function createTelemetryPipeRowFactories() {
    return [
      () => formatTelemetryStamp(),
      () =>
        [
          `grp="${pickRandom(TELEMETRY_GROUP_NAMES)}"`,
          `iface=${pickRandom(TELEMETRY_INTERFACES)}`,
          `seq=${formatTelemetryCounter(0, 8192)}`,
          `delta_us=${formatTelemetryCounter(16, 8800)}`,
          `Block Ack=${formatTelemetryCounter(0, 140)}`,
          `Resource Request=${formatTelemetryCounter(0, 260)}`,
          `Path=${pickRandom(["on", "off", "pending"])}`,
          `hex=${formatTelemetryHex(6)}`
        ].join(" | "),
      () =>
        [
          `rx=${formatTelemetryCounter(0, 999999)}`,
          `tx=${formatTelemetryCounter(0, 999999)}`,
          `buffer=${pickRandom(TELEMETRY_BUFFER_STATES)}`,
          `latency_ms=${formatTelemetryFloat(0.12, 14.2, 2)}`,
          `TVM=${formatTelemetryCounter(12, 4800)}`
        ].join(", ")
    ];
  }

  const TELEMETRY_ROW_FACTORIES = Object.freeze([
    createTelemetryReportRowFactories,
    createTelemetryTransportRowFactories,
    createTelemetryWatchdogRowFactories,
    createTelemetryDiagnosticRowFactories,
    createTelemetryDenseCommaRowFactories,
    createTelemetryPipeRowFactories
  ]);

  const TELEMETRY_TRAILING_FACTORIES = Object.freeze([
    () => `scan_state="${pickRandom(TELEMETRY_SCAN_STATES)}"`,
    () => `buffer_state="${pickRandom(TELEMETRY_BUFFER_STATES)}"`,
    () => `delta_us=${formatTelemetryCounter(12, 6400)}`,
    () => `latency_ms=${formatTelemetryFloat(0.18, 9.6, 2)}`,
    () => `resource_request=${formatTelemetryCounter(0, 128)}`,
    () => `Slice Frames=${formatTelemetryCounter(1800, 980000)}`,
    () => `TVM Updates=${formatTelemetryCounter(12, 4200)}`,
    () => `Temperature=${formatTelemetryFloat(28, 84, 1)}C`,
    () => `Battery Voltage=${formatTelemetryFloat(3.68, 4.24, 3)}V`,
    () => `node=${formatTelemetryNodeId()}`,
    () => `hex=${formatTelemetryHex(8)}`,
    () => `seq=${formatTelemetryCounter(0, 4096)}`,
    () => `rx=${formatTelemetryCounter(0, 999999)}`,
    () => `tx=${formatTelemetryCounter(0, 999999)}`,
    () => `${pickRandom(TELEMETRY_PATH_STATES)}=${formatTelemetryCounter(0, 64)}`
  ]);

  function randomFromRange(range, divisor) {
    if (!range || typeof range.min !== "number" || typeof range.max !== "number") return 0;
    const speedDivisor = typeof divisor === "number" && divisor > 0 ? divisor : 1;
    return randomBetween(range.min, range.max) / speedDivisor;
  }

  function getCodeWallIntroTimings(reducedMotion) {
    return {
      enterHoldMs: reducedMotion ? CODE_WALL_INTRO_CONFIG.reducedEnterHoldMs : CODE_WALL_INTRO_CONFIG.enterHoldMs,
      autoGenerationDurationMs: reducedMotion
        ? CODE_WALL_INTRO_CONFIG.reducedAutoGenerationDurationMs
        : CODE_WALL_INTRO_CONFIG.autoGenerationDurationMs,
      generatedHoldMs: reducedMotion ? CODE_WALL_INTRO_CONFIG.reducedGeneratedHoldMs : CODE_WALL_INTRO_CONFIG.generatedHoldMs
    };
  }

  function createCodeWallIntroStore() {
    const state = {
      status: CODE_WALL_INTRO_STATES.idle,
      reducedMotion: false,
      enteredAtMs: 0,
      generationStartedAtMs: 0,
      generatedAtMs: 0,
      generationProgress: 0,
      storyStartScrollPx: 0
    };

    function setReducedMotion(nextValue) {
      state.reducedMotion = Boolean(nextValue);
    }

    function maybeEnter(triggerReached, storyStartScrollPx, nowMs) {
      if (!triggerReached || state.status !== CODE_WALL_INTRO_STATES.idle) return;

      state.status = CODE_WALL_INTRO_STATES.enteredBlackStage;
      state.enteredAtMs = nowMs;
      state.generationStartedAtMs = 0;
      state.generatedAtMs = 0;
      state.generationProgress = 0;
      state.storyStartScrollPx = Math.max(Number(storyStartScrollPx) || 0, 0);
    }

    function setStoryStartScrollPx(storyStartScrollPx) {
      state.storyStartScrollPx = Math.max(Number(storyStartScrollPx) || 0, 0);
    }

    function setGenerationProgress(progress, nowMs) {
      if (state.status !== CODE_WALL_INTRO_STATES.autoGenerating) return;

      state.generationProgress = clamp(progress, 0, 1);
      if (state.generationProgress >= 1) {
        state.status = CODE_WALL_INTRO_STATES.generated;
        state.generatedAtMs = nowMs;
        state.generationProgress = 1;
      }
    }

    function tick(nowMs) {
      const timings = getCodeWallIntroTimings(state.reducedMotion);

      if (
        state.status === CODE_WALL_INTRO_STATES.enteredBlackStage &&
        nowMs - state.enteredAtMs >= timings.enterHoldMs
      ) {
        state.status = CODE_WALL_INTRO_STATES.autoGenerating;
        state.generationStartedAtMs = nowMs;
      }

      if (
        state.status === CODE_WALL_INTRO_STATES.generated &&
        nowMs - state.generatedAtMs >= timings.generatedHoldMs
      ) {
        state.status = CODE_WALL_INTRO_STATES.normalScrollStory;
      }
    }

    function isLocked() {
      return (
        state.status === CODE_WALL_INTRO_STATES.enteredBlackStage ||
        state.status === CODE_WALL_INTRO_STATES.autoGenerating ||
        state.status === CODE_WALL_INTRO_STATES.generated
      );
    }

    function needsAnimationFrame() {
      return isLocked();
    }

    function getSnapshot() {
      return {
        status: state.status,
        reducedMotion: state.reducedMotion,
        enteredAtMs: state.enteredAtMs,
        generationStartedAtMs: state.generationStartedAtMs,
        generatedAtMs: state.generatedAtMs,
        generationProgress: state.generationProgress,
        storyStartScrollPx: state.storyStartScrollPx
      };
    }

    return {
      setReducedMotion,
      maybeEnter,
      setStoryStartScrollPx,
      setGenerationProgress,
      tick,
      isLocked,
      needsAnimationFrame,
      getSnapshot
    };
  }

  function normalizeCueTrigger(value, cue, fallbackRatio) {
    if (value === null || value === undefined || value === "") {
      return clamp(fallbackRatio, 0.001, 0.999);
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return clamp(fallbackRatio, 0.001, 0.999);

    if (numeric >= cue.start && numeric <= cue.end) {
      return clamp((numeric - cue.start) / cue.duration, 0.001, 0.999);
    }

    if (numeric >= 0 && numeric <= 1) {
      return clamp(numeric, 0.001, 0.999);
    }

    return clamp(numeric / cue.duration, 0.001, 0.999);
  }

  function normalizeSweepCueMap(cues) {
    return cues
      .map((cue, index) => {
        const start = Math.max(Number(cue && cue.start) || 0, 0);
        const end = Math.max(Number(cue && cue.end) || 0, start + 0.01);
        const duration = Math.max(end - start, 0.01);
        const direction = cue && cue.direction === "return" ? "return" : "outbound";
        const cueShape = { start, end, duration };
        const transitionTriggerRatio = normalizeCueTrigger(
          cue && (cue.transitionTrigger ?? cue.transitionAt),
          cueShape,
          direction === "outbound" ? 0.28 : 0.66
        );
        const advanceText = Boolean(cue && cue.advanceText);
        const advanceTriggerRatio = advanceText
          ? normalizeCueTrigger(cue && (cue.advanceTrigger ?? cue.advanceTextAt ?? cue.advanceAt), cueShape, direction === "return" ? 0.34 : 0.76)
          : 1;

        return Object.freeze({
          index,
          start,
          end,
          duration,
          direction,
          advanceText,
          transitionTriggerRatio,
          advanceTriggerRatio
        });
      })
      .sort((left, right) => left.start - right.start);
  }

  function formatRainHeroTime(value) {
    return `${Number(value || 0).toFixed(2)}s`;
  }

  function buildSmoothPath(points) {
    if (!Array.isArray(points) || points.length < 2) return "";
    let pathData = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let index = 1; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      const midpointX = (current.x + next.x) / 2;
      const midpointY = (current.y + next.y) / 2;
      pathData += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${midpointX.toFixed(2)} ${midpointY.toFixed(2)}`;
    }

    const penultimate = points[points.length - 2];
    const last = points[points.length - 1];
    pathData += ` Q ${penultimate.x.toFixed(2)} ${penultimate.y.toFixed(2)} ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    return pathData;
  }

  function createRainHeroController() {
    const root = document.querySelector("[data-code-rain-hero]");
    if (!root) return null;

    const video = root.querySelector("[data-code-rain-video]");
    const svg = root.querySelector("[data-code-rain-svg]");
    const path = root.querySelector("[data-code-rain-path]");
    const liveRegion = root.querySelector("[data-code-rain-live]");
    const outgoingText = root.querySelector('[data-code-rain-text="outgoing"]');
    const incomingText = root.querySelector('[data-code-rain-text="incoming"]');
    const outgoingTextPath = root.querySelector('[data-code-rain-textpath="outgoing"]');
    const incomingTextPath = root.querySelector('[data-code-rain-textpath="incoming"]');
    const debugPanel = root.querySelector("[data-code-rain-debug]");
    const scrollRoot = document.querySelector(".code-app-page");

    if (!svg || !path || !outgoingText || !incomingText || !outgoingTextPath || !incomingTextPath) return null;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const queryParams = new URLSearchParams(window.location.search);
    const cueMap = normalizeSweepCueMap(RAIN_HERO_SWEEP_CUES);
    const lastCue = cueMap[cueMap.length - 1] || { end: 0.01 };
    const debugNodes = {
      time: root.querySelector("[data-code-rain-debug-time]"),
      cue: root.querySelector("[data-code-rain-debug-cue]"),
      progress: root.querySelector("[data-code-rain-debug-progress]"),
      direction: root.querySelector("[data-code-rain-debug-direction]"),
      state: root.querySelector("[data-code-rain-debug-state]"),
      rate: root.querySelector("[data-code-rain-debug-rate]")
    };
    const controllerState = {
      cueMap,
      timelineDurationSec: Math.max(lastCue.end || 0, 0.01),
      reducedMotion: motionQuery.matches,
      playbackRate: clamp(
        Number(queryParams.get("heroRate")) || Number(root.dataset.codeHeroPlaybackRate) || 1,
        0.35,
        1.15
      ),
      debugEnabled:
        queryParams.get("heroDebug") === "1" ||
        String(root.dataset.codeHeroDebug || "").toLowerCase() === "true",
      fallbackStartMs: performance.now(),
      frameId: 0,
      resizeObserver: null,
      visibilityObserver: null,
      geometry: null,
      preparedLineIndex: -1,
      lineIndex: 0,
      pendingAdvanceSignature: "",
      currentCueSignature: "",
      announcedLine: "",
      videoDurationSec: 0,
      videoLoopCount: 0,
      lastVideoTimeSec: 0,
      isVisible: true,
      lastSnapshot: null
    };

    function setTextContent(node, value) {
      if (!node || node.textContent === value) return;
      node.textContent = value;
    }

    function updateLiveRegion(value) {
      if (!liveRegion || controllerState.announcedLine === value) return;
      liveRegion.textContent = value;
      controllerState.announcedLine = value;
    }

    function setVideoFallback(isFallback) {
      root.classList.toggle("is-video-fallback", isFallback);
    }

    function setDebugMode(enabled) {
      controllerState.debugEnabled = Boolean(enabled);
      root.classList.toggle("is-debug", controllerState.debugEnabled);

      if (debugPanel) {
        debugPanel.hidden = !controllerState.debugEnabled;
        debugPanel.setAttribute("aria-hidden", String(!controllerState.debugEnabled));
      }

      updateDebugReadout(controllerState.lastSnapshot);
    }

    function applyPlaybackRate() {
      if (!video) return;
      video.defaultPlaybackRate = controllerState.playbackRate;
      video.playbackRate = controllerState.playbackRate;
    }

    function syncTextPair() {
      if (controllerState.preparedLineIndex === controllerState.lineIndex) return;

      const currentLine = RAIN_HERO_LINES[controllerState.lineIndex % RAIN_HERO_LINES.length];
      const nextLine = RAIN_HERO_LINES[(controllerState.lineIndex + 1) % RAIN_HERO_LINES.length];
      setTextContent(outgoingTextPath, currentLine);
      setTextContent(incomingTextPath, nextLine);
      controllerState.preparedLineIndex = controllerState.lineIndex;
    }

    function getCurrentLine() {
      return RAIN_HERO_LINES[controllerState.lineIndex % RAIN_HERO_LINES.length];
    }

    function getNextLine() {
      return RAIN_HERO_LINES[(controllerState.lineIndex + 1) % RAIN_HERO_LINES.length];
    }

    function commitPendingAdvance(nextSignature) {
      if (!controllerState.pendingAdvanceSignature) return;
      if (controllerState.pendingAdvanceSignature === nextSignature) return;

      controllerState.lineIndex = (controllerState.lineIndex + 1) % RAIN_HERO_LINES.length;
      controllerState.pendingAdvanceSignature = "";
      controllerState.preparedLineIndex = -1;
      syncTextPair();
      updateLiveRegion(getCurrentLine());
    }

    function getClock(now) {
      if (
        !video ||
        !controllerState.videoDurationSec ||
        video.readyState < 2 ||
        video.paused ||
        video.ended
      ) {
        const elapsedSec = ((now - controllerState.fallbackStartMs) / 1000) * controllerState.playbackRate;
        const safeDuration = Math.max(controllerState.timelineDurationSec, 0.01);
        const loopIndex = Math.floor(elapsedSec / safeDuration);

        return {
          timeSec: ((elapsedSec % safeDuration) + safeDuration) % safeDuration,
          loopIndex,
          source: "fallback"
        };
      }

      const currentTimeSec = video.currentTime;
      if (currentTimeSec + 0.18 < controllerState.lastVideoTimeSec) {
        controllerState.videoLoopCount += 1;
      }
      controllerState.lastVideoTimeSec = currentTimeSec;

      return {
        timeSec: currentTimeSec,
        loopIndex: controllerState.videoLoopCount,
        source: "video"
      };
    }

    function getGapBoundarySweepProgress(timeSec) {
      if (!controllerState.cueMap.length) return 0;

      let previousCue = controllerState.cueMap[controllerState.cueMap.length - 1];
      for (let index = 0; index < controllerState.cueMap.length; index += 1) {
        const cue = controllerState.cueMap[index];
        if (timeSec < cue.start) break;
        previousCue = cue;
      }

      return previousCue.direction === "outbound" ? 1 : 0;
    }

    function getCueTransition(cue, cueProgress, advanceTriggered) {
      if (!cue) {
        return {
          name: RAIN_HERO_STATES.idleVisible,
          progress: 1,
          visibleLine: "current"
        };
      }

      if (cue.direction === "outbound") {
        if (cueProgress < cue.transitionTriggerRatio) {
          return {
            name: RAIN_HERO_STATES.preTransition,
            progress: cueProgress / cue.transitionTriggerRatio,
            visibleLine: "current"
          };
        }

        return {
          name: RAIN_HERO_STATES.sweepTransition,
          progress: (cueProgress - cue.transitionTriggerRatio) / (1 - cue.transitionTriggerRatio),
          visibleLine: "current"
        };
      }

      if (cueProgress < cue.transitionTriggerRatio) {
        return {
          name: RAIN_HERO_STATES.settle,
          progress: cueProgress / cue.transitionTriggerRatio,
          visibleLine: advanceTriggered ? "next" : "transitioning"
        };
      }

      return {
        name: RAIN_HERO_STATES.idleVisible,
        progress: (cueProgress - cue.transitionTriggerRatio) / (1 - cue.transitionTriggerRatio),
        visibleLine: cue.advanceText ? "next" : "current"
      };
    }

    function getBaseOffsetRatio(width) {
      if (width < 560) return 0.52;
      if (width < 860) return 0.5;
      return 0.49;
    }

    function getReducedMotionMetrics(snapshot) {
      const baseOffset = controllerState.geometry.pathLength * controllerState.geometry.baseOffsetRatio;

      if (snapshot.transition.visibleLine === "next") {
        const eased = easeOutCubic(snapshot.transition.progress);
        return {
          outgoing: {
            offset: baseOffset,
            opacity: lerp(1, 0, eased),
            blur: 0,
            dy: 0
          },
          incoming: {
            offset: baseOffset,
            opacity: lerp(0, 1, eased),
            blur: 0,
            dy: 0
          }
        };
      }

      return {
        outgoing: {
          offset: baseOffset,
          opacity: 1,
          blur: 0,
          dy: 0
        },
        incoming: {
          offset: baseOffset,
          opacity: 0,
          blur: 0,
          dy: 0
        }
      };
    }

    function applyTextLayer(node, textPathNode, metrics) {
      if (!node || !textPathNode || !metrics) return;
      textPathNode.setAttribute("startOffset", `${metrics.offset.toFixed(2)}`);
      node.style.opacity = metrics.opacity.toFixed(3);
      node.style.filter = `blur(${metrics.blur.toFixed(2)}px) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18))`;
      node.setAttribute("dy", `${metrics.dy.toFixed(2)}`);
    }

    function getFrameMetrics(transition) {
      const baseOffset = controllerState.geometry.pathLength * controllerState.geometry.baseOffsetRatio;
      const outboundShift = controllerState.geometry.pathLength * (controllerState.geometry.compact ? 0.092 : 0.092);
      const returnShift = controllerState.geometry.pathLength * (controllerState.geometry.compact ? 0.078 : 0.084);

      if (transition.name === RAIN_HERO_STATES.idleVisible && transition.visibleLine === "current") {
        return {
          outgoing: {
            offset: baseOffset,
            opacity: 1,
            blur: 0.08,
            dy: 0
          },
          incoming: {
            offset: baseOffset - returnShift,
            opacity: 0,
            blur: 2,
            dy: 4
          }
        };
      }

      if (transition.name === RAIN_HERO_STATES.preTransition) {
        const eased = easeInOutSine(transition.progress);
        return {
          outgoing: {
            offset: lerp(baseOffset, baseOffset + outboundShift * 0.36, eased),
            opacity: lerp(1, 0.82, eased),
            blur: lerp(0.08, 0.8, eased),
            dy: lerp(0, -3, eased)
          },
          incoming: {
            offset: baseOffset - returnShift,
            opacity: 0,
            blur: 2,
            dy: 4
          }
        };
      }

      if (transition.name === RAIN_HERO_STATES.sweepTransition) {
        const eased = easeInOutSine(transition.progress);
        return {
          outgoing: {
            offset: lerp(baseOffset + outboundShift * 0.36, baseOffset + outboundShift, eased),
            opacity: lerp(0.82, 0.16, eased),
            blur: lerp(0.8, 2.8, eased),
            dy: lerp(-3, -6, eased)
          },
          incoming: {
            offset: baseOffset - returnShift * 1.08,
            opacity: 0,
            blur: 2,
            dy: 4
          }
        };
      }

      if (transition.name === RAIN_HERO_STATES.settle) {
        const eased = easeOutCubic(transition.progress);
        return {
          outgoing: {
            offset: lerp(baseOffset + outboundShift, baseOffset + outboundShift * 0.72, eased),
            opacity: lerp(0.16, 0, eased),
            blur: lerp(2.8, 3.4, eased),
            dy: lerp(-6, -4, eased)
          },
          incoming: {
            offset: lerp(baseOffset - returnShift, baseOffset, eased),
            opacity: lerp(0.34, 1, eased),
            blur: lerp(1.6, 0.08, eased),
            dy: lerp(4, 0, eased)
          }
        };
      }

      return {
        outgoing: {
          offset: baseOffset + outboundShift * 0.72,
          opacity: 0,
          blur: 3.4,
          dy: -4
        },
        incoming: {
          offset: baseOffset,
          opacity: 1,
          blur: 0.08,
          dy: 0
        }
      };
    }

    function resolveTimingSnapshot(now) {
      const clock = getClock(now);
      let cue = null;
      let cueIndex = -1;
      let cueProgress = 0;

      for (let index = 0; index < controllerState.cueMap.length; index += 1) {
        const currentCue = controllerState.cueMap[index];
        if (clock.timeSec >= currentCue.start && clock.timeSec <= currentCue.end) {
          cue = currentCue;
          cueIndex = index;
          cueProgress = clamp((clock.timeSec - currentCue.start) / currentCue.duration, 0, 1);
          break;
        }
      }

      const cueSignature = cue ? `${clock.loopIndex}:${cueIndex}` : `gap:${clock.loopIndex}:${clock.timeSec.toFixed(2)}`;
      commitPendingAdvance(cueSignature);

      if (cueSignature !== controllerState.currentCueSignature) {
        controllerState.currentCueSignature = cueSignature;
        syncTextPair();
      }

      const currentLine = getCurrentLine();
      const nextLine = getNextLine();
      const advanceTriggered = Boolean(cue && cue.advanceText && cueProgress >= cue.advanceTriggerRatio);
      const transition = getCueTransition(cue, cueProgress, advanceTriggered);

      if (cue && cue.advanceText && advanceTriggered && controllerState.pendingAdvanceSignature !== cueSignature) {
        controllerState.pendingAdvanceSignature = cueSignature;
      }

      const cueEase = cue ? easeInOutSine(cueProgress) : 0;
      const sweepProgress = cue
        ? cue.direction === "outbound"
          ? cueEase
          : 1 - cueEase
        : getGapBoundarySweepProgress(clock.timeSec);

      return {
        clock,
        cue,
        cueIndex,
        cueProgress,
        transition,
        currentLine,
        nextLine,
        advanceTriggered,
        direction: cue ? cue.direction : "idle",
        sweepProgress,
        sweepEnergy: cue ? Math.sin(Math.PI * cueProgress) : 0
      };
    }

    function updateDebugReadout(snapshot) {
      if (!controllerState.debugEnabled || !snapshot) return;

      if (debugNodes.time) debugNodes.time.textContent = formatRainHeroTime(snapshot.clock.timeSec);
      if (debugNodes.cue) debugNodes.cue.textContent = snapshot.cue ? String(snapshot.cueIndex) : "--";
      if (debugNodes.progress) {
        debugNodes.progress.textContent = snapshot.cue ? `${(snapshot.cueProgress * 100).toFixed(1)}%` : "--";
      }
      if (debugNodes.direction) debugNodes.direction.textContent = snapshot.direction;
      if (debugNodes.state) debugNodes.state.textContent = snapshot.transition.name;
      if (debugNodes.rate) debugNodes.rate.textContent = `${controllerState.playbackRate.toFixed(2)}x`;
    }

    function applySnapshot(snapshot) {
      if (!controllerState.geometry) return;

      controllerState.lastSnapshot = snapshot;
      syncTextPair();

      const metrics = controllerState.reducedMotion ? getReducedMotionMetrics(snapshot) : getFrameMetrics(snapshot.transition);
      const sweepAngle = lerp(controllerState.geometry.startAngleDeg, controllerState.geometry.endAngleDeg, snapshot.sweepProgress);
      const sweepOpacity = controllerState.reducedMotion ? 0.04 : 0.08 + snapshot.sweepEnergy * 0.22;

      root.dataset.codeHeroState = snapshot.transition.name;
      root.dataset.codeHeroDirection = snapshot.direction;
      root.classList.toggle("is-reduced-motion", controllerState.reducedMotion);
      root.style.setProperty("--code-hero-sweep-angle", `${sweepAngle.toFixed(3)}deg`);
      root.style.setProperty("--code-hero-sweep-opacity", `${sweepOpacity.toFixed(3)}`);

      applyTextLayer(outgoingText, outgoingTextPath, metrics.outgoing);
      applyTextLayer(incomingText, incomingTextPath, metrics.incoming);

      if (snapshot.transition.visibleLine === "next" && snapshot.advanceTriggered) {
        updateLiveRegion(snapshot.nextLine);
      } else if (snapshot.transition.name === RAIN_HERO_STATES.idleVisible && snapshot.transition.visibleLine === "current") {
        updateLiveRegion(snapshot.currentLine);
      }

      updateDebugReadout(snapshot);
    }

    function renderFrame(now) {
      controllerState.frameId = 0;
      if (!controllerState.geometry) return;

      applySnapshot(resolveTimingSnapshot(now));

      if (controllerState.isVisible && !document.hidden) {
        controllerState.frameId = requestAnimationFrame(renderFrame);
      }
    }

    function syncAnimationLoop() {
      if (controllerState.frameId || !controllerState.isVisible || document.hidden) return;
      controllerState.frameId = requestAnimationFrame(renderFrame);
    }

    function updateGeometry() {
      const width = Math.max(root.clientWidth, 320);
      const height = Math.max(root.clientHeight, 420);
      const compact = width < 760;
      const pivotX = width * (compact ? -0.06 : -0.12);
      const pivotY = height * (compact ? 1.12 : 1.08);
      const radiusX = width * (compact ? 1.02 : 1.06);
      const radiusY = height * (compact ? 0.74 : 0.88);
      const startAngle = compact ? -1.72 : -1.72;
      const endAngle = compact ? -0.62 : -0.44;
      const points = [];

      for (let index = 0; index < 7; index += 1) {
        const progress = index / 6;
        const weightedProgress = Math.pow(progress, 0.92);
        const angle = lerp(startAngle, endAngle, weightedProgress);
        const lift = Math.sin(progress * Math.PI) * height * (compact ? 0.018 : 0.032);
        const drag = progress * height * (compact ? 0.06 : 0.02);
        points.push({
          x: pivotX + Math.cos(angle) * radiusX,
          y: pivotY + Math.sin(angle) * radiusY - lift + drag
        });
      }

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      path.setAttribute("d", buildSmoothPath(points));

      controllerState.geometry = {
        compact,
        pathLength: path.getTotalLength(),
        baseOffsetRatio: getBaseOffsetRatio(width),
        startAngleDeg: compact ? -99 : -98,
        endAngleDeg: compact ? -36 : -25
      };

      root.style.setProperty("--code-hero-pivot-x", `${pivotX.toFixed(2)}px`);
      root.style.setProperty("--code-hero-pivot-y", `${pivotY.toFixed(2)}px`);
      root.style.setProperty("--code-hero-sweep-length", `${Math.max(width * 1.16, height * 1.34).toFixed(2)}px`);
      applySnapshot(resolveTimingSnapshot(performance.now()));
    }

    function bindMotionPreference() {
      const handleMotionChange = (event) => {
        controllerState.reducedMotion = Boolean(event.matches);
        controllerState.fallbackStartMs = performance.now();
        controllerState.lastVideoTimeSec = 0;
        syncAnimationLoop();
      };

      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleMotionChange);
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(handleMotionChange);
      }
    }

    function bindDebugHandling() {
      setDebugMode(controllerState.debugEnabled);

      window.addEventListener("keydown", (event) => {
        const target = event.target;
        if (
          target &&
          ((target.tagName && /^(INPUT|TEXTAREA|SELECT)$/i.test(target.tagName)) || target.isContentEditable)
        ) {
          return;
        }

        if (event.shiftKey && event.code === "KeyD") {
          event.preventDefault();
          setDebugMode(!controllerState.debugEnabled);
        }
      });
    }

    function bindVisibilityHandling() {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(controllerState.frameId);
          controllerState.frameId = 0;
          return;
        }
        syncAnimationLoop();
      });

      if (!("IntersectionObserver" in window) || !scrollRoot) return;
      controllerState.visibilityObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          controllerState.isVisible = Boolean(entry && entry.isIntersecting);
          if (!controllerState.isVisible) {
            cancelAnimationFrame(controllerState.frameId);
            controllerState.frameId = 0;
            return;
          }
          syncAnimationLoop();
        },
        {
          root: scrollRoot,
          threshold: 0.18
        }
      );
      controllerState.visibilityObserver.observe(root);
    }

    function bindResizeHandling() {
      if ("ResizeObserver" in window) {
        controllerState.resizeObserver = new ResizeObserver(() => {
          updateGeometry();
        });
        controllerState.resizeObserver.observe(root);
        return;
      }

      window.addEventListener("resize", updateGeometry);
    }

    function bindVideoHandling() {
      if (!video) {
        setVideoFallback(true);
        return;
      }

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      applyPlaybackRate();

      video.addEventListener("loadedmetadata", () => {
        controllerState.videoDurationSec = Number.isFinite(video.duration) ? video.duration : 0;
        controllerState.timelineDurationSec = Math.max(controllerState.timelineDurationSec, controllerState.videoDurationSec || 0);
        controllerState.lastVideoTimeSec = 0;
        applyPlaybackRate();
        applySnapshot(resolveTimingSnapshot(performance.now()));
      });

      video.addEventListener("playing", () => {
        setVideoFallback(false);
        applyPlaybackRate();
      });

      video.addEventListener("error", () => {
        setVideoFallback(true);
      });

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setVideoFallback(true);
        });
      }
    }

    function init() {
      syncTextPair();
      bindResizeHandling();
      bindVisibilityHandling();
      bindMotionPreference();
      bindDebugHandling();
      bindVideoHandling();
      updateGeometry();
      syncAnimationLoop();
    }

    return { init };
  }

  function createBreathStoryController(introStore) {
    const root = document.querySelector("[data-code-breath-story]");
    if (!root) return null;

    const scrollRoot = document.querySelector(".code-app-page");
    const rainHero = document.querySelector("[data-code-rain-hero]");
    const copyLine = root.querySelector(".code-breath-story__line");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      reducedMotion: motionQuery.matches,
      simplifiedEffects: PERFORMANCE_PROFILE.simplifyStoryEffects,
      frameId: 0,
      resizeObserver: null,
      lockedScrollTop: null,
      wasLocked: false,
      copyGlyphs: [],
      copySourceText: ""
    };

    function setVariable(name, value) {
      root.style.setProperty(name, value);
    }

    function getViewportHeight() {
      if (!scrollRoot) return window.innerHeight;

      const computedStyle = window.getComputedStyle(scrollRoot);
      const usesInnerScroll = /(auto|scroll)/.test(computedStyle.overflowY) && scrollRoot.clientHeight > 0;
      return usesInnerScroll ? scrollRoot.clientHeight : window.innerHeight;
    }

    function syncCopyGlyphs() {
      if (!copyLine) return;

      const nextSource = (copyLine.textContent || "").replace(/\s+/g, " ").trim();
      if (!nextSource) {
        state.copyGlyphs = [];
        state.copySourceText = "";
        return;
      }

      if (state.copySourceText === nextSource && state.copyGlyphs.length) return;

      state.copySourceText = nextSource;
      copyLine.textContent = "";
      copyLine.dataset.copySource = nextSource;
      copyLine.setAttribute("aria-label", nextSource);

      const fragment = document.createDocumentFragment();
      state.copyGlyphs = Array.from(nextSource).map((character, index) => {
        const glyph = document.createElement("span");
        glyph.className = "code-breath-story__glyph";
        glyph.textContent = character === " " ? "\u00A0" : character;
        glyph.style.setProperty("--code-breath-glyph-index", String(index));
        fragment.appendChild(glyph);
        return glyph;
      });

      copyLine.appendChild(fragment);
    }

    function updateCopyGlyphs(revealProgress, dissolveProgress) {
      if (!copyLine) return;
      syncCopyGlyphs();

      if (!state.copyGlyphs.length) return;

      if (state.reducedMotion || state.simplifiedEffects) {
        state.copyGlyphs.forEach((glyph) => {
          glyph.style.opacity = "";
          glyph.style.transform = "";
          glyph.style.filter = "";
        });
        return;
      }

      const totalGlyphs = Math.max(state.copyGlyphs.length - 1, 1);
      state.copyGlyphs.forEach((glyph, index) => {
        const order = index / totalGlyphs;
        const revealLocal = clamp((revealProgress - order * 0.05) / 0.8, 0, 1);
        const dissolveLead = Math.sin(order * Math.PI * 1.35 + dissolveProgress * Math.PI * 2.2) * 0.08;
        const dissolveLocal = clamp((dissolveProgress - order * 0.04 + dissolveLead) / 0.78, 0, 1);
        const revealEased = easeOutCubic(revealLocal);
        const dissolveEased = easeInOutSine(dissolveLocal);
        const travelX = Math.sin(index * 0.44 + dissolveProgress * 13.6) * (2 + dissolveEased * 16);
        const travelY = lerp(14, 0, revealEased) + dissolveEased * (6 + 30 * Math.pow(order, 1.12));
        const blur = (1 - revealEased) * 5.4 + dissolveEased * (2.4 + 8 * dissolveProgress);
        const opacity = clamp(revealEased * (1 - Math.pow(dissolveEased, 0.84)), 0, 1);
        const skewX = Math.sin(index * 0.26 + dissolveProgress * 9.6) * dissolveEased * 2.8;

        glyph.style.opacity = opacity.toFixed(3);
        glyph.style.transform = `translate3d(${travelX.toFixed(2)}px, ${travelY.toFixed(2)}px, 0) skewX(${skewX.toFixed(2)}deg)`;
        glyph.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    }

    function applyProgress(rawProgress) {
      const progress = clamp(rawProgress, 0, 1);
      const imageIntro = progressBetween(progress, BREATH_STORY_PHASES.imageIntroStart, BREATH_STORY_PHASES.imageIntroEnd);
      const imageDeblur = progressBetween(progress, BREATH_STORY_PHASES.imageDeblurStart, BREATH_STORY_PHASES.imageDeblurEnd);
      const monoHold = progressBetween(progress, BREATH_STORY_PHASES.imageIntroStart, BREATH_STORY_PHASES.monoHoldEnd);
      const telemetryFade = progressBetween(progress, BREATH_STORY_PHASES.telemetryFadeStart, BREATH_STORY_PHASES.telemetryFadeEnd);
      const colorReturn = progressBetween(progress, BREATH_STORY_PHASES.colorReturnStart, BREATH_STORY_PHASES.colorReturnEnd);
      const copyReveal = progressBetween(progress, BREATH_STORY_PHASES.copyRevealStart, BREATH_STORY_PHASES.copyRevealEnd);
      const copyHold = progressBetween(progress, BREATH_STORY_PHASES.copyRevealEnd, BREATH_STORY_PHASES.copyHoldEnd);
      const copyDissolve = progressBetween(progress, BREATH_STORY_PHASES.copyDissolveStart, BREATH_STORY_PHASES.copyDissolveEnd);
      const copyRevealEased = easeOutCubic(copyReveal);
      const copyDissolveEased = easeInOutSine(copyDissolve);
      const copyPresence = clamp(copyRevealEased * (1 - Math.pow(copyDissolveEased, 0.9)), 0, 1);
      const blackoutOpacity = clamp(lerp(0.2, 0.07, Math.max(imageIntro, colorReturn)) - copyReveal * 0.02, 0.03, 0.24);
      const veilOpacity = clamp(
        lerp(0.9, 0.14, Math.max(imageDeblur, colorReturn)) + copyDissolveEased * 0.1 - copyHold * 0.03,
        0.06,
        0.92
      );
      const pulseStrength = state.reducedMotion ? 0.03 : lerp(0.03, state.simplifiedEffects ? 0.06 : 0.1, Math.max(colorReturn, copyReveal));
      const imageOpacity = clamp(lerp(0, 1, easeOutCubic(imageIntro)), 0, 1);
      const imageScale = state.reducedMotion ? 1 : lerp(1.08, 1, Math.max(imageDeblur, colorReturn));
      const imageBlur = state.reducedMotion ? 0 : lerp(state.simplifiedEffects ? 8 : 18, 0, imageDeblur);
      const monoBrightness = lerp(0.24, 0.76, monoHold);
      const monoSaturate = lerp(0.06, 0.16, monoHold);
      const imageBrightness = lerp(monoBrightness, 1, colorReturn);
      const imageSaturate = lerp(monoSaturate, 1, colorReturn);
      const imageMonochrome = lerp(0.98, 0, colorReturn);
      const telemetryOpacity = state.reducedMotion || !PERFORMANCE_PROFILE.allowTelemetry
        ? 0
        : state.reducedMotion
          ? clamp(1 - telemetryFade * 0.72, 0.22, 1)
          : clamp(1 - telemetryFade * 0.94, 0.06, 1);
      const copyOpacity = copyPresence;
      const copyY = state.reducedMotion ? 0 : lerp(20, 0, copyRevealEased) + copyDissolveEased * (state.simplifiedEffects ? 8 : 16);
      const copyBlur = state.reducedMotion ? 0 : (1 - copyRevealEased) * (state.simplifiedEffects ? 1.8 : 4.2) + copyDissolveEased * (state.simplifiedEffects ? 3.6 : 9.5);
      const copySheen = state.simplifiedEffects ? 0 : clamp(copyRevealEased * (1 - copyDissolveEased * 0.65), 0, 1);
      const waterOpacity = state.reducedMotion || state.simplifiedEffects
        ? 0
        : clamp(copyRevealEased * 0.42 + copyDissolveEased * 0.92, 0, 1);
      const waterFlowX = state.reducedMotion || state.simplifiedEffects
        ? 0
        : Math.sin(progress * Math.PI * 8.4 + copyDissolveEased * 2.2) * (2 + 18 * copyDissolveEased);
      const waterFlowY = state.reducedMotion || state.simplifiedEffects
        ? 0
        : copyDissolveEased * 24 + Math.sin(progress * Math.PI * 6.2 + 0.8) * (1.4 + 4.2 * copyDissolveEased);
      const waterWave = state.reducedMotion || state.simplifiedEffects
        ? 0
        : clamp(copyDissolveEased * 1.08 + copyHold * 0.16, 0, 1);

      let phase = "blackout";
      if (copyPresence > 0.01 || copyDissolve > 0.01) {
        phase = "copy";
      } else if (colorReturn > 0.01 || imageIntro > 0.01) {
        phase = "reveal";
      }

      root.dataset.codeBreathPhase = phase;
      root.classList.toggle("is-reduced-motion", state.reducedMotion);

      setVariable("--code-breath-progress", progress.toFixed(3));
      setVariable("--code-breath-telemetry-opacity", telemetryOpacity.toFixed(3));
      setVariable("--code-breath-blackout-opacity", blackoutOpacity.toFixed(3));
      setVariable("--code-breath-veil-opacity", veilOpacity.toFixed(3));
      setVariable("--code-breath-image-opacity", imageOpacity.toFixed(3));
      setVariable("--code-breath-image-scale", imageScale.toFixed(4));
      setVariable("--code-breath-image-blur", `${imageBlur.toFixed(2)}px`);
      setVariable("--code-breath-image-brightness", imageBrightness.toFixed(3));
      setVariable("--code-breath-image-saturate", imageSaturate.toFixed(3));
      setVariable("--code-breath-image-monochrome", imageMonochrome.toFixed(3));
      setVariable("--code-breath-copy-opacity", copyOpacity.toFixed(3));
      setVariable("--code-breath-copy-y", `${copyY.toFixed(2)}px`);
      setVariable("--code-breath-copy-blur", `${copyBlur.toFixed(2)}px`);
      setVariable("--code-breath-copy-dissolve", copyDissolve.toFixed(3));
      setVariable("--code-breath-copy-sheen", copySheen.toFixed(3));
      setVariable("--code-breath-water-opacity", waterOpacity.toFixed(3));
      setVariable("--code-breath-water-flow-x", `${waterFlowX.toFixed(2)}px`);
      setVariable("--code-breath-water-flow-y", `${waterFlowY.toFixed(2)}px`);
      setVariable("--code-breath-water-wave", waterWave.toFixed(3));
      setVariable("--code-breath-pulse-strength", pulseStrength.toFixed(3));
      updateCopyGlyphs(copyReveal, copyDissolve);
    }

    function applyVideoBridge(rect, viewportHeight) {
      if (!rainHero) return;

      const entryBlend = easeInOutSine(
        progressBetween(viewportHeight - rect.top, viewportHeight * 0.1, viewportHeight * 0.82)
      );

      if (!PERFORMANCE_PROFILE.allowBridgeEffects) {
        rainHero.style.setProperty("--code-rain-bridge-opacity", (entryBlend * 0.4).toFixed(3));
        rainHero.style.setProperty("--code-rain-video-dim", lerp(0, 0.16, entryBlend).toFixed(3));
        rainHero.style.setProperty("--code-rain-video-blur", "0px");
        rainHero.style.setProperty("--code-rain-video-scale", "1.01");
        return;
      }

      rainHero.style.setProperty("--code-rain-bridge-opacity", entryBlend.toFixed(3));
      rainHero.style.setProperty("--code-rain-video-dim", lerp(0, 0.58, entryBlend).toFixed(3));
      rainHero.style.setProperty("--code-rain-video-blur", `${lerp(0, state.reducedMotion ? 0 : 2.2, entryBlend).toFixed(2)}px`);
      rainHero.style.setProperty("--code-rain-video-scale", lerp(1.02, 1.038, entryBlend).toFixed(4));
    }

    function render(now) {
      state.frameId = 0;
      const timestamp = typeof now === "number" ? now : performance.now();
      const viewportHeight = Math.max(getViewportHeight(), 1);
      const totalTravel = Math.max(root.offsetHeight - viewportHeight, 1);
      const rect = root.getBoundingClientRect();
      const scrolledIntoBreath = clamp(-rect.top, 0, totalTravel);

      if (introStore) {
        introStore.setReducedMotion(state.reducedMotion);
        const heroBottom = rainHero ? rainHero.getBoundingClientRect().bottom : Number.NEGATIVE_INFINITY;
        const headerHeight = Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--code-header-height")) || 0;
        introStore.maybeEnter(
          rect.top <= Math.max(viewportHeight * CODE_WALL_INTRO_CONFIG.triggerViewportRatio, headerHeight * 0.25) &&
            rect.bottom > viewportHeight * 0.24 &&
            heroBottom <= headerHeight + 8,
          scrolledIntoBreath,
          timestamp
        );
        introStore.tick(timestamp);

        const intro = introStore.getSnapshot();
        const locked = introStore.isLocked();
        if (scrollRoot) {
          if (locked) {
            if (state.lockedScrollTop === null) {
              state.lockedScrollTop = scrollRoot.scrollTop;
            } else if (Math.abs(scrollRoot.scrollTop - state.lockedScrollTop) > 1) {
              scrollRoot.scrollTop = state.lockedScrollTop;
            }
          } else if (state.wasLocked) {
            const releaseScrollTop = state.lockedScrollTop === null ? scrollRoot.scrollTop : state.lockedScrollTop;
            scrollRoot.scrollTop = releaseScrollTop;
            introStore.setStoryStartScrollPx(clamp(-root.getBoundingClientRect().top, 0, totalTravel));
            state.lockedScrollTop = null;
          }
        }

        const storyStartScrollPx = clamp(intro.storyStartScrollPx, 0, totalTravel);
        const storyRange = Math.max(totalTravel - storyStartScrollPx, 1);
        const storyProgress = clamp((scrolledIntoBreath - storyStartScrollPx) / storyRange, 0, 1);

        root.dataset.codeWallState = intro.status;
        document.body.classList.toggle("is-code-wall-intro", locked);
        state.wasLocked = locked;
        applyVideoBridge(rect, viewportHeight);

        if (intro.status === CODE_WALL_INTRO_STATES.normalScrollStory) {
          applyProgress(storyProgress);
        } else {
          applyProgress(0);
        }

        if (introStore.needsAnimationFrame()) {
          queueRender();
        }
        return;
      }

      applyVideoBridge(rect, viewportHeight);
      applyProgress((-rect.top) / totalTravel);
    }

    function queueRender() {
      if (state.frameId) return;
      state.frameId = requestAnimationFrame(render);
    }

    function bindMotionPreference() {
      const handleMotionChange = (event) => {
        state.reducedMotion = Boolean(event.matches);
        if (introStore) introStore.setReducedMotion(state.reducedMotion);
        queueRender();
      };

      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleMotionChange);
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(handleMotionChange);
      }
    }

    function bindScrollHandling() {
      window.addEventListener("scroll", queueRender, { passive: true });
      window.addEventListener("resize", queueRender, { passive: true });

      if (scrollRoot) {
        scrollRoot.addEventListener("scroll", queueRender, { passive: true });
      }

      if ("ResizeObserver" in window) {
        state.resizeObserver = new ResizeObserver(() => {
          queueRender();
        });
        state.resizeObserver.observe(root);
      }
    }

    function init() {
      if (introStore) {
        introStore.setReducedMotion(state.reducedMotion);
        root.dataset.codeWallState = CODE_WALL_INTRO_STATES.idle;
      }
      bindMotionPreference();
      bindScrollHandling();
      queueRender();
    }

    return { init };
  }

  function createTelemetryWallController(introStore) {
    if (!PERFORMANCE_PROFILE.allowTelemetry) return null;
    const root = document.querySelector("[data-code-breath-story]");
    const canvas = root ? root.querySelector("[data-code-breath-telemetry]") : null;
    if (!root || !canvas || typeof canvas.getContext !== "function") return null;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return null;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      reducedMotion: motionQuery.matches,
      width: 0,
      height: 0,
      dpr: 1,
      charWidth: 7.4,
      rowHeight: 18,
      topInset: 96,
      visibleBottom: 0,
      rows: [],
      runtime: null,
      noisePattern: null,
      scanPattern: null,
      frameId: 0,
      running: false,
      inView: true,
      pageVisible: document.visibilityState !== "hidden",
      lastFrameTime: 0,
      mutationAccumulator: 0,
      numericPatchAccumulator: 0,
      resizeObserver: null,
      intersectionObserver: null,
      introStatus: CODE_WALL_INTRO_STATES.idle,
      introOrderedRows: [],
      introNextRowIndex: 0
    };

    function updateViewportInsets() {
      const headerHeightRaw = getComputedStyle(document.body).getPropertyValue("--code-header-height").trim();
      const headerHeight = Number.parseFloat(headerHeightRaw);
      state.topInset = Math.max(Number.isFinite(headerHeight) ? headerHeight + 40 : 112, state.rowHeight * 3.1);
      state.visibleBottom = Math.max(state.height - state.rowHeight * 0.45, state.topInset + state.rowHeight * 6);
    }

    function getRuntimeConfig() {
      const compact = window.innerWidth <= 860;
      return {
        compact,
        fontSize: compact ? TELEMETRY_WALL_CONFIG.fontSizeMobile : TELEMETRY_WALL_CONFIG.fontSizeDesktop,
        lineHeight: compact ? TELEMETRY_WALL_CONFIG.lineHeightMobile : TELEMETRY_WALL_CONFIG.lineHeightDesktop,
        rowOverscan: TELEMETRY_WALL_CONFIG.rowOverscan,
        widthOverscanChars: compact
          ? Math.max(12, TELEMETRY_WALL_CONFIG.widthOverscanChars - 4)
          : TELEMETRY_WALL_CONFIG.widthOverscanChars,
        upwardScrollSpeed: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.reducedMotionScrollSpeed
          : compact
            ? TELEMETRY_WALL_CONFIG.upwardScrollSpeedMobile
            : TELEMETRY_WALL_CONFIG.upwardScrollSpeedDesktop,
        mutationFrequency: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.reducedMotionMutationFrequency
          : compact
            ? TELEMETRY_WALL_CONFIG.mutationFrequencyMobile
            : TELEMETRY_WALL_CONFIG.mutationFrequencyDesktop,
        highlightFrequency: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.highlightFrequency * 0.42
          : TELEMETRY_WALL_CONFIG.highlightFrequency,
        scanlineIntensity: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.scanlineIntensity * 0.55
          : TELEMETRY_WALL_CONFIG.scanlineIntensity,
        noiseIntensity: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.noiseIntensity * 0.42
          : TELEMETRY_WALL_CONFIG.noiseIntensity,
        overallOpacity: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.overallOpacity * 0.76
          : TELEMETRY_WALL_CONFIG.overallOpacity,
        numericPatchFrequency: state.reducedMotion
          ? TELEMETRY_WALL_CONFIG.numericPatchFrequency * 0.35
          : TELEMETRY_WALL_CONFIG.numericPatchFrequency,
        maxConcurrentIntroRows: compact
          ? CODE_WALL_INTRO_CONFIG.maxConcurrentRowsMobile
          : CODE_WALL_INTRO_CONFIG.maxConcurrentRowsDesktop,
        maxConcurrentIntroRowsPeak: compact
          ? CODE_WALL_INTRO_CONFIG.maxConcurrentRowsPeakMobile
          : CODE_WALL_INTRO_CONFIG.maxConcurrentRowsPeakDesktop,
        targetFps: state.reducedMotion ? TELEMETRY_WALL_CONFIG.reducedMotionFps : TELEMETRY_WALL_CONFIG.targetFps
      };
    }

    function composeTelemetryText(fragments) {
      return fragments.join(", ");
    }

    function tokenizeTelemetryFragments(fragments) {
      const tokens = [];
      const tokenPattern = /"[^"]*"|\[[^\]]+\]|0x[0-9A-F]+|\d+(?:\.\d+)?|\s*\|\s*|,\s*|[=:()]|[^=,:()|]+/g;

      fragments.forEach((fragment, index) => {
        const matches = String(fragment || "").match(tokenPattern) || [];

        matches.forEach((match) => {
          if (!match) return;

          let type = "word";
          if (/^\s*\|\s*$/.test(match) || /^,\s*$/.test(match)) {
            type = "separator";
          } else if (/^[=:()]$/.test(match)) {
            type = "punct";
          } else if (/^0x[0-9A-F]+$/.test(match) || /^\d/.test(match)) {
            type = "numeric";
          } else if (/^"/.test(match) || /^\[/.test(match)) {
            type = "block";
          }

          tokens.push({ text: match, type });
        });

        if (index < fragments.length - 1) {
          tokens.push({ text: ", ", type: "separator" });
        }
      });

      return tokens;
    }

    function rebuildRowContent(row) {
      row.text = composeTelemetryText(row.fragments);
      row.tokens = tokenizeTelemetryFragments(row.fragments);
      if (row.introComplete || state.introStatus === CODE_WALL_INTRO_STATES.normalScrollStory) {
        row.introVisibleText = row.text;
      }
    }

    function createRowModel() {
      const targetChars = Math.max(88, Math.ceil(state.width / Math.max(state.charWidth, 1)) + state.runtime.widthOverscanChars);
      const fragmentFactories = pickRandom(TELEMETRY_ROW_FACTORIES)().slice();
      const fragments = fragmentFactories.map((factory) => factory());

      while (composeTelemetryText(fragments).length < targetChars) {
        const filler = pickRandom(TELEMETRY_TRAILING_FACTORIES);
        fragmentFactories.push(filler);
        fragments.push(filler());
      }

      const row = {
        fragmentFactories,
        fragments,
        tokens: [],
        text: "",
        x: -randomBetween(0, state.charWidth * 5.6),
        y: 0,
        flash: Math.random() < 0.12 ? randomBetween(0.1, 0.24) : 0,
        tone: randomBetween(0.84, 1.02),
        caretSeed: Math.random(),
        introStarted: false,
        introComplete: false,
        introVisibleText: "",
        introTokenIndex: 0,
        introTokenOffset: 0,
        introWaitMs: 0
      };

      rebuildRowContent(row);
      return row;
    }

    function resetIntroWriter(row) {
      row.introStarted = false;
      row.introComplete = false;
      row.introVisibleText = "";
      row.introTokenIndex = 0;
      row.introTokenOffset = 0;
      row.introWaitMs = 0;
      row.caretSeed = Math.random();
    }

    function markIntroRowComplete(row) {
      row.introStarted = false;
      row.introComplete = true;
      row.introVisibleText = row.text;
      row.introTokenIndex = row.tokens.length;
      row.introTokenOffset = 0;
      row.introWaitMs = 0;
      row.flash = Math.max(row.flash, randomBetween(0.16, 0.32));
    }

    function startIntroRow(row) {
      if (!row || row.introStarted || row.introComplete) return;
      row.introStarted = true;
      row.introWaitMs = randomBetween(16, 54);
      row.flash = Math.max(row.flash, randomBetween(0.08, 0.18));
    }

    function getRowIntroCompletion(row) {
      if (!row || !row.text) return 1;
      return clamp((row.introVisibleText || "").length / row.text.length, 0, 1);
    }

    function getIntroSnapshot() {
      if (!introStore) {
        return {
          status: CODE_WALL_INTRO_STATES.normalScrollStory,
          generationStartedAtMs: 0,
          generationProgress: 1
        };
      }

      return introStore.getSnapshot();
    }

    function resetIntroSequence() {
      state.introOrderedRows = state.rows
        .filter((row) => row.y >= state.topInset - state.rowHeight * 0.2 && row.y <= state.visibleBottom)
        .sort((left, right) => left.y - right.y);
      state.introNextRowIndex = 0;
      state.rows.forEach((row) => {
        resetIntroWriter(row);
      });
    }

    function finalizeIntroSequence() {
      state.introOrderedRows.forEach((row) => {
        markIntroRowComplete(row);
      });
      state.introNextRowIndex = state.introOrderedRows.length;
    }

    function activeIntroRowsCount() {
      return state.rows.reduce((count, row) => count + (row.introStarted && !row.introComplete ? 1 : 0), 0);
    }

    function getIntroConcurrentLimit(introTimeProgress) {
      const ramp = easeInOutSine(progressBetween(introTimeProgress, 0.14, 0.92));
      return Math.max(
        state.runtime.maxConcurrentIntroRows,
        Math.round(lerp(state.runtime.maxConcurrentIntroRows, state.runtime.maxConcurrentIntroRowsPeak, ramp))
      );
    }

    function getIntroTargetStartedRows(introTimeProgress) {
      if (!state.introOrderedRows.length) return 0;

      const waveProgress = easeOutCubic(
        progressBetween(introTimeProgress, CODE_WALL_INTRO_CONFIG.startWaveStart, CODE_WALL_INTRO_CONFIG.startWaveEnd)
      );

      return clamp(
        Math.ceil(lerp(1, state.introOrderedRows.length, waveProgress)),
        1,
        state.introOrderedRows.length
      );
    }

    function getIntroStartedRatio() {
      if (!state.introOrderedRows.length) return 1;
      return (
        state.introOrderedRows.filter((row) => row.introStarted || row.introComplete).length / state.introOrderedRows.length
      );
    }

    function getIntroVisibleCharRatio() {
      if (!state.introOrderedRows.length) return 1;

      let visibleChars = 0;
      let totalChars = 0;
      state.introOrderedRows.forEach((row) => {
        totalChars += row.text.length;
        visibleChars += (row.introVisibleText || "").length;
      });

      if (!totalChars) return 1;
      return clamp(visibleChars / totalChars, 0, 1);
    }

    function buildSurfacePatterns() {
      const noiseCanvas = document.createElement("canvas");
      const noiseContext = noiseCanvas.getContext("2d");
      if (noiseContext) {
        noiseCanvas.width = 128;
        noiseCanvas.height = 128;
        const imageData = noiseContext.createImageData(noiseCanvas.width, noiseCanvas.height);

        for (let offset = 0; offset < imageData.data.length; offset += 4) {
          const intensity = Math.random() < 0.12 ? randomInt(18, 52) : randomInt(0, 14);
          imageData.data[offset] = 86;
          imageData.data[offset + 1] = 186;
          imageData.data[offset + 2] = 122;
          imageData.data[offset + 3] = intensity;
        }

        noiseContext.putImageData(imageData, 0, 0);
        state.noisePattern = context.createPattern(noiseCanvas, "repeat");
      }

      const scanCanvas = document.createElement("canvas");
      const scanContext = scanCanvas.getContext("2d");
      if (scanContext) {
        scanCanvas.width = 4;
        scanCanvas.height = 8;
        scanContext.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
        scanContext.fillStyle = "rgba(120, 220, 160, 0.18)";
        scanContext.fillRect(0, 1, scanCanvas.width, 1);
        scanContext.fillStyle = "rgba(0, 0, 0, 0.2)";
        scanContext.fillRect(0, 5, scanCanvas.width, 1);
        state.scanPattern = context.createPattern(scanCanvas, "repeat");
      }
    }

    function rebuildRows() {
      updateViewportInsets();
      const totalRows = Math.ceil((state.visibleBottom - state.topInset) / state.rowHeight) + state.runtime.rowOverscan * 2;
      const startY = state.topInset;
      state.rows = Array.from({ length: totalRows }, (_, index) => {
        const row = createRowModel();
        row.y = startY + index * state.rowHeight;
        return row;
      });
      state.mutationAccumulator = 0;
      state.numericPatchAccumulator = 0;
      resetIntroSequence();

      if (state.introStatus === CODE_WALL_INTRO_STATES.generated || state.introStatus === CODE_WALL_INTRO_STATES.normalScrollStory) {
        finalizeIntroSequence();
      }
    }

    function recycleRow(row, y) {
      const next = createRowModel();
      row.fragmentFactories = next.fragmentFactories;
      row.fragments = next.fragments;
      row.tokens = next.tokens;
      row.text = next.text;
      row.x = next.x;
      row.y = y;
      row.flash = next.flash;
      row.tone = next.tone;
      row.caretSeed = next.caretSeed;
      resetIntroWriter(row);

      if (state.introStatus === CODE_WALL_INTRO_STATES.normalScrollStory) {
        markIntroRowComplete(row);
      }
    }

    function mutateRow(row) {
      if (!row || !Array.isArray(row.fragments) || row.fragments.length === 0) return;

      const updates = Math.random() < 0.22 ? 2 : 1;
      for (let count = 0; count < updates; count += 1) {
        const index = randomInt(0, row.fragments.length - 1);
        const factory = row.fragmentFactories[index];
        if (typeof factory === "function") {
          row.fragments[index] = factory();
        }
      }

      rebuildRowContent(row);
      row.flash = Math.max(row.flash, randomBetween(0.12, 0.3));
      row.tone = clamp(row.tone + randomBetween(-0.03, 0.05), 0.68, 1.02);
    }

    function patchNumericTokensInRow(row) {
      if (!row || !Array.isArray(row.fragments) || row.fragments.length === 0) return;

      row.fragments = row.fragments.map((fragment) =>
        String(fragment).replace(/\d{2,9}/g, (match, offset, full) => {
          if (offset > 0 && full[offset - 1].toLowerCase() === "x") return match;
          if (Math.random() > 0.32) return match;
          let out = "";
          for (let index = 0; index < match.length; index += 1) {
            out += String(randomInt(0, 9));
          }
          return out;
        })
      );

      rebuildRowContent(row);
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const nextDpr = Math.min(window.devicePixelRatio || 1, TELEMETRY_WALL_CONFIG.maxDevicePixelRatio);

      state.runtime = getRuntimeConfig();
      state.width = nextWidth;
      state.height = nextHeight;
      state.dpr = nextDpr;
      state.rowHeight = Math.max(14, Math.round(state.runtime.fontSize * state.runtime.lineHeight));
      updateViewportInsets();

      canvas.width = Math.round(nextWidth * nextDpr);
      canvas.height = Math.round(nextHeight * nextDpr);
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;

      context.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);
      context.font = `400 ${state.runtime.fontSize}px ${TELEMETRY_FONT_STACK}`;
      context.textBaseline = "top";
      context.textAlign = "left";
      state.charWidth = Math.max(context.measureText("0").width, state.runtime.fontSize * 0.54);

      buildSurfacePatterns();
      rebuildRows();
      render(performance.now());
    }

    function syncIntroState() {
      const intro = getIntroSnapshot();

      if (intro.status !== state.introStatus) {
        if (intro.status === CODE_WALL_INTRO_STATES.enteredBlackStage) {
          resetIntroSequence();
        } else if (intro.status === CODE_WALL_INTRO_STATES.generated || intro.status === CODE_WALL_INTRO_STATES.normalScrollStory) {
          finalizeIntroSequence();
        }
      }

      state.introStatus = intro.status;
      return intro;
    }

    function drawBackground() {
      context.clearRect(0, 0, state.width, state.height);
      context.fillStyle = "#000000";
      context.fillRect(0, 0, state.width, state.height);
    }

    function getIntroSpeedDivisor(introTimeProgress, rowProgress) {
      const lateLineBoost = progressBetween(rowProgress, CODE_WALL_INTRO_CONFIG.lineFinishBoostStart, 1) * CODE_WALL_INTRO_CONFIG.lineFinishBoostMax;
      return 1 + introTimeProgress * 0.55 + lateLineBoost;
    }

    function getIntroBurstLength(token, remainingLength, introTimeProgress, rowProgress) {
      if (token.type === "separator" || token.type === "punct") return remainingLength;

      const speedDivisor = getIntroSpeedDivisor(introTimeProgress, rowProgress);

      if (!state.reducedMotion && remainingLength > CODE_WALL_INTRO_CONFIG.machineBurstChars.min) {
        const machineChance = CODE_WALL_INTRO_CONFIG.machineBurstChance + introTimeProgress * 0.08;
        if (Math.random() < machineChance) {
          return Math.min(
            remainingLength,
            Math.max(2, Math.round(randomFromRange(CODE_WALL_INTRO_CONFIG.machineBurstChars) * Math.min(speedDivisor, 1.8)))
          );
        }
      }

      const sourceRange = token.type === "numeric" ? CODE_WALL_INTRO_CONFIG.numericBurstChars : CODE_WALL_INTRO_CONFIG.tokenBurstChars;
      let burst = Math.max(1, Math.round(randomFromRange(sourceRange) * Math.min(speedDivisor, 1.65)));

      if (token.type === "block") {
        burst = Math.max(burst, Math.round(4 * Math.min(speedDivisor, 1.8)));
      }

      if (remainingLength <= burst + 1 && Math.random() < 0.34 + introTimeProgress * 0.18) {
        return remainingLength;
      }

      return Math.min(remainingLength, burst);
    }

    function getIntroPauseMs(token, tokenFinished, introTimeProgress, rowProgress) {
      const speedDivisor = getIntroSpeedDivisor(introTimeProgress, rowProgress);

      if (!tokenFinished) {
        return randomFromRange(CODE_WALL_INTRO_CONFIG.midTokenPauseMs, speedDivisor);
      }

      if (token.type === "separator") {
        return randomFromRange(CODE_WALL_INTRO_CONFIG.separatorPauseMs, speedDivisor);
      }

      if (token.type === "punct") {
        return randomFromRange(CODE_WALL_INTRO_CONFIG.fieldPauseMs, speedDivisor);
      }

      return randomFromRange(CODE_WALL_INTRO_CONFIG.wordPauseMs, speedDivisor);
    }

    function maybeStartIntroRows(introTimeProgress) {
      const targetStartedRows = getIntroTargetStartedRows(introTimeProgress);

      while (state.introNextRowIndex < state.introOrderedRows.length) {
        if (state.introNextRowIndex >= targetStartedRows) return;

        const previousRow = state.introOrderedRows[state.introNextRowIndex - 1];
        const previousReady =
          !previousRow ||
          state.introNextRowIndex >= 2 ||
          getRowIntroCompletion(previousRow) >= CODE_WALL_INTRO_CONFIG.rowStartThreshold ||
          introTimeProgress >= 0.68;

        if (!previousReady) return;

        startIntroRow(state.introOrderedRows[state.introNextRowIndex]);
        state.introNextRowIndex += 1;
      }
    }

    function advanceIntroRow(row, deltaMs, introTimeProgress) {
      if (!row || !row.introStarted || row.introComplete) return;

      row.introWaitMs -= deltaMs;
      let guard = 0;

      while (row.introWaitMs <= 0 && !row.introComplete && guard < 8) {
        guard += 1;

        const token = row.tokens[row.introTokenIndex];
        if (!token) {
          markIntroRowComplete(row);
          break;
        }

        const remaining = token.text.slice(row.introTokenOffset);
        if (!remaining) {
          row.introTokenIndex += 1;
          row.introTokenOffset = 0;
          continue;
        }

        const rowProgress = getRowIntroCompletion(row);
        const burstLength = getIntroBurstLength(token, remaining.length, introTimeProgress, rowProgress);
        const chunk = remaining.slice(0, burstLength);
        row.introVisibleText += chunk;
        row.introTokenOffset += chunk.length;

        const tokenFinished = row.introTokenOffset >= token.text.length;
        if (tokenFinished) {
          row.introTokenIndex += 1;
          row.introTokenOffset = 0;
        }

        row.flash = Math.max(row.flash, tokenFinished ? randomBetween(0.08, 0.16) : randomBetween(0.03, 0.08));

        if (row.introTokenIndex >= row.tokens.length) {
          markIntroRowComplete(row);
          break;
        }

        row.introWaitMs += getIntroPauseMs(token, tokenFinished, introTimeProgress, getRowIntroCompletion(row));
      }
    }

    function updateIntroSequence(deltaMs, nowMs, intro) {
      if (state.reducedMotion) {
        const timings = getCodeWallIntroTimings(true);
        const introTimeProgress = clamp(
          (nowMs - intro.generationStartedAtMs) / Math.max(timings.autoGenerationDurationMs, 1),
          0,
          1
        );

        if (introTimeProgress >= 0.28) {
          finalizeIntroSequence();
        }

        introStore.setGenerationProgress(introTimeProgress >= 0.7 ? 1 : introTimeProgress, nowMs);
        return;
      }

      const timings = getCodeWallIntroTimings(false);
      const rawTimeProgress = (nowMs - intro.generationStartedAtMs) / Math.max(timings.autoGenerationDurationMs, 1);
      const introTimeProgress = clamp(rawTimeProgress, 0, CODE_WALL_INTRO_CONFIG.maxAutoGenerationOverrunRatio);
      const catchupBoost = rawTimeProgress > 1 ? lerp(1, 2.8, clamp(rawTimeProgress - 1, 0, 0.4) / 0.4) : 1;
      const effectiveDeltaMs = deltaMs * catchupBoost;

      maybeStartIntroRows(introTimeProgress);
      state.introOrderedRows.forEach((row) => {
        advanceIntroRow(row, effectiveDeltaMs, introTimeProgress);
      });

      const completedRatio = state.introOrderedRows.length
        ? state.introOrderedRows.filter((row) => row.introComplete).length / state.introOrderedRows.length
        : 1;
      const startedRatio = getIntroStartedRatio();
      const visibleCharRatio = getIntroVisibleCharRatio();

      const blendedProgress = clamp(
        Math.max(
          visibleCharRatio * 0.94,
          Math.min(rawTimeProgress, 1) * 0.82,
          completedRatio * 0.96
        ),
        0,
        0.992
      );
      if (
        (visibleCharRatio >= CODE_WALL_INTRO_CONFIG.completionThreshold &&
          startedRatio >= CODE_WALL_INTRO_CONFIG.completionMinStartedRatio &&
          rawTimeProgress >= 0.92) ||
        rawTimeProgress >= CODE_WALL_INTRO_CONFIG.maxAutoGenerationOverrunRatio
      ) {
        finalizeIntroSequence();
        introStore.setGenerationProgress(1, nowMs);
        return;
      }

      introStore.setGenerationProgress(blendedProgress, nowMs);
    }

    function updateAmbient(deltaMs) {
      const intro = getIntroSnapshot();
      const introMultiplier = intro.status === CODE_WALL_INTRO_STATES.autoGenerating
        ? lerp(0.085, 0.18, clamp(intro.generationProgress, 0, 1))
        : intro.status === CODE_WALL_INTRO_STATES.generated
          ? 0.21
          : intro.status === CODE_WALL_INTRO_STATES.normalScrollStory
            ? 0.28
            : 0;

      const drift = state.runtime.upwardScrollSpeed * introMultiplier * (deltaMs / 1000);
      let maxY = state.visibleBottom;

      state.rows.forEach((row) => {
        row.y -= drift;
        row.flash = Math.max(0, row.flash - deltaMs * 0.00032);
        maxY = Math.max(maxY, row.y);
      });

      state.rows.forEach((row) => {
        if (row.y <= state.topInset - state.rowHeight * 1.3) {
          maxY += state.rowHeight;
          recycleRow(row, maxY);
        }
      });

      state.mutationAccumulator += deltaMs;
      while (state.mutationAccumulator >= state.runtime.mutationFrequency) {
        state.mutationAccumulator -= state.runtime.mutationFrequency;
        mutateRow(pickRandom(state.rows));
        if (Math.random() < state.runtime.highlightFrequency) {
          mutateRow(pickRandom(state.rows));
        }
      }

      state.numericPatchAccumulator += (deltaMs / 1000) * state.runtime.numericPatchFrequency;
      while (state.numericPatchAccumulator >= 1) {
        state.numericPatchAccumulator -= 1;
        patchNumericTokensInRow(pickRandom(state.rows));
      }
    }

    function update(deltaMs, nowMs) {
      const intro = syncIntroState();

      state.rows.forEach((row) => {
        row.flash = Math.max(0, row.flash - deltaMs * 0.00024);
      });

      if (intro.status === CODE_WALL_INTRO_STATES.enteredBlackStage) {
        return;
      }

      if (intro.status === CODE_WALL_INTRO_STATES.autoGenerating) {
        updateIntroSequence(deltaMs, nowMs, intro);
        updateAmbient(deltaMs);
        return;
      }

      updateAmbient(deltaMs);
    }

    function drawRows(timestamp) {
      context.save();
      context.font = `400 ${state.runtime.fontSize}px ${TELEMETRY_FONT_STACK}`;
      context.textBaseline = "top";

      const pulse = 0.985 + Math.sin(timestamp * 0.0001) * 0.015;
      const intro = getIntroSnapshot();

      if (intro.status === CODE_WALL_INTRO_STATES.idle || intro.status === CODE_WALL_INTRO_STATES.enteredBlackStage) {
        context.restore();
        return;
      }

      context.beginPath();
      context.rect(0, state.topInset, state.width, Math.max(state.visibleBottom - state.topInset, 0));
      context.clip();

      state.rows.forEach((row) => {
        const visibleText =
          intro.status === CODE_WALL_INTRO_STATES.autoGenerating
            ? row.introVisibleText
            : row.introComplete
              ? row.text
              : row.introVisibleText || row.text;

        if (!visibleText) return;

        const rowCompletion = intro.status === CODE_WALL_INTRO_STATES.autoGenerating ? getRowIntroCompletion(row) : 1;
        const alpha = clamp(0.84 + state.runtime.overallOpacity * row.tone * pulse * 0.1 + rowCompletion * 0.06, 0.76, 1);
        context.fillStyle = `rgba(0, 155, 119, ${(alpha * 0.88).toFixed(3)})`;
        context.fillText(visibleText, row.x, row.y);

        if (row.flash > 0.01) {
          context.fillStyle = `rgba(86, 184, 152, ${(row.flash * 0.72).toFixed(3)})`;
          context.fillText(visibleText, row.x, row.y);
        }

        if (
          CODE_WALL_INTRO_CONFIG.caretVisible &&
          intro.status === CODE_WALL_INTRO_STATES.autoGenerating &&
          row.introStarted &&
          !row.introComplete
        ) {
          const blink = (Math.sin(timestamp * 0.012 + row.caretSeed * 10) + 1) * 0.5;
          const caretAlpha = (0.55 + blink * 0.4) * alpha;
          const caretX = row.x + visibleText.length * state.charWidth;
          context.fillStyle = `rgba(126, 214, 185, ${caretAlpha.toFixed(3)})`;
          context.fillText("▍", caretX, row.y);
        }
      });

      context.restore();
    }

    function drawAtmosphere() {
      if (state.scanPattern && state.runtime.scanlineIntensity > 0.001) {
        context.save();
        context.globalAlpha = state.runtime.scanlineIntensity;
        context.fillStyle = state.scanPattern;
        context.fillRect(0, 0, state.width, state.height);
        context.restore();
      }

      if (state.noisePattern && state.runtime.noiseIntensity > 0.001) {
        context.save();
        context.globalAlpha = state.runtime.noiseIntensity;
        context.fillStyle = state.noisePattern;
        context.fillRect(0, 0, state.width, state.height);
        context.restore();
      }
    }

    function render(timestamp) {
      if (!state.width || !state.height || !state.runtime) return;
      syncIntroState();
      drawBackground();
      drawRows(timestamp);
      drawAtmosphere();
    }

    function tick(timestamp) {
      if (!state.running) return;
      state.frameId = requestAnimationFrame(tick);

      const frameBudget = 1000 / state.runtime.targetFps;
      if (state.lastFrameTime && timestamp - state.lastFrameTime < frameBudget) return;

      const deltaMs = state.lastFrameTime ? Math.min(timestamp - state.lastFrameTime, 96) : frameBudget;
      state.lastFrameTime = timestamp;

      update(deltaMs, timestamp);
      render(timestamp);
    }

    function stopLoop() {
      state.running = false;
      if (state.frameId) {
        cancelAnimationFrame(state.frameId);
        state.frameId = 0;
      }
      state.lastFrameTime = 0;
    }

    function syncLoopState() {
      const shouldRun = state.inView && state.pageVisible;
      if (shouldRun) {
        if (!state.running) {
          state.running = true;
          state.lastFrameTime = 0;
          state.frameId = requestAnimationFrame(tick);
        }
        return;
      }

      stopLoop();
    }

    function bindMotionPreference() {
      const handleMotionChange = (event) => {
        state.reducedMotion = Boolean(event.matches);
        if (introStore) introStore.setReducedMotion(state.reducedMotion);
        resizeCanvas();
        syncLoopState();
      };

      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleMotionChange);
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(handleMotionChange);
      }
    }

    function bindVisibilityHandling() {
      document.addEventListener("visibilitychange", () => {
        state.pageVisible = document.visibilityState !== "hidden";
        syncLoopState();
      });

      if ("IntersectionObserver" in window) {
        state.intersectionObserver = new IntersectionObserver(
          (entries) => {
            const nextEntry = entries[0];
            state.inView = Boolean(nextEntry && nextEntry.isIntersecting);
            syncLoopState();
          },
          {
            threshold: 0,
            rootMargin: "240px 0px"
          }
        );
        state.intersectionObserver.observe(root);
      }
    }

    function bindResizeHandling() {
      if ("ResizeObserver" in window) {
        state.resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
        });
        state.resizeObserver.observe(root);
        return;
      }

      window.addEventListener("resize", resizeCanvas, { passive: true });
    }

    function init() {
      if (introStore) introStore.setReducedMotion(state.reducedMotion);
      bindMotionPreference();
      bindVisibilityHandling();
      bindResizeHandling();
      resizeCanvas();
      syncLoopState();
    }

    return { init };
  }

  function createCodeHeaderController() {
    const header = document.querySelector(".site-header");
    const scrollRoot = document.querySelector(".code-app-page");
    const shell = document.querySelector(".code-app-shell");
    if (!header || !scrollRoot || !shell) return null;

    let frameId = 0;

    function update() {
      frameId = 0;
      const headerHeight = Math.max(Math.round(header.getBoundingClientRect().height), 64);
      document.body.style.setProperty("--code-header-height", `${headerHeight}px`);

      const shellTop = shell.getBoundingClientRect().top;
      header.classList.toggle("is-scrolled", shellTop <= headerHeight + 28);
    }

    function queueUpdate() {
      if (frameId) return;
      frameId = requestAnimationFrame(update);
    }

    function init() {
      scrollRoot.addEventListener("scroll", queueUpdate, { passive: true });
      window.addEventListener("resize", queueUpdate);
      queueUpdate();
    }

    return { init };
  }

  function createNestedScrollHandoffController() {
    const scrollRoot = document.querySelector(".code-app-page");
    if (!scrollRoot) return null;

    const innerScrollAreas = Array.from(document.querySelectorAll(".code-sidebar, .code-workspace"));
    if (!innerScrollAreas.length) return null;

    const touchStartY = new WeakMap();

    function isIntroLocked() {
      return document.body.classList.contains("is-code-wall-intro");
    }

    function canInnerAreaScroll(element, deltaY) {
      if (!element || !Number.isFinite(deltaY) || Math.abs(deltaY) < 0.01) return false;

      const maxScrollTop = Math.max(element.scrollHeight - element.clientHeight, 0);
      if (maxScrollTop <= 1) return false;

      if (deltaY > 0) {
        return element.scrollTop < maxScrollTop - 1;
      }

      return element.scrollTop > 1;
    }

    function normalizeWheelDelta(event) {
      let deltaY = Number(event.deltaY) || 0;
      if (event.deltaMode === 1) {
        deltaY *= 16;
      } else if (event.deltaMode === 2) {
        deltaY *= window.innerHeight;
      }
      return deltaY;
    }

    function applyScrollDelta(element, deltaY) {
      if (!element || !Number.isFinite(deltaY) || Math.abs(deltaY) < 0.01) return;
      const maxScrollTop = Math.max(element.scrollHeight - element.clientHeight, 0);
      const nextScrollTop = clamp(element.scrollTop + deltaY, 0, maxScrollTop);
      element.scrollTop = nextScrollTop;
    }

    function handoffToPage(deltaY) {
      if (!Number.isFinite(deltaY) || Math.abs(deltaY) < 0.01) return;
      scrollRoot.scrollTop += deltaY;
    }

    function handleWheel(event) {
      if (isIntroLocked() || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const element = event.currentTarget;
      if (!element) return;
      const deltaY = normalizeWheelDelta(event);
      if (Math.abs(deltaY) < 0.01) return;

      event.preventDefault();
      if (canInnerAreaScroll(element, deltaY)) {
        applyScrollDelta(element, deltaY);
        return;
      }

      handoffToPage(deltaY);
    }

    function handleTouchStart(event) {
      if (!event.touches || event.touches.length !== 1) return;
      touchStartY.set(event.currentTarget, event.touches[0].clientY);
    }

    function handleTouchMove(event) {
      if (isIntroLocked()) return;
      if (!event.touches || event.touches.length !== 1) return;

      const element = event.currentTarget;
      if (!element) return;

      const previousY = touchStartY.get(element);
      const currentY = event.touches[0].clientY;
      touchStartY.set(element, currentY);

      if (!Number.isFinite(previousY)) return;

      const deltaY = previousY - currentY;
      event.preventDefault();
      if (canInnerAreaScroll(element, deltaY)) {
        applyScrollDelta(element, deltaY);
        return;
      }

      handoffToPage(deltaY);
    }

    function handleTouchEnd(event) {
      touchStartY.delete(event.currentTarget);
    }

    function init() {
      innerScrollAreas.forEach((element) => {
        element.addEventListener("wheel", handleWheel, { passive: false });
        element.addEventListener("touchstart", handleTouchStart, { passive: true });
        element.addEventListener("touchmove", handleTouchMove, { passive: false });
        element.addEventListener("touchend", handleTouchEnd, { passive: true });
        element.addEventListener("touchcancel", handleTouchEnd, { passive: true });
      });
    }

    return { init };
  }

  function getLang() {
    return document.documentElement.lang === "zh-CN" ? "zh" : "en";
  }

  function getCopy() {
    return COPY[getLang()] || COPY.en;
  }

  function getLocalizedModuleTitle(moduleId, fallbackTitle) {
    const copy = getCopy();
    return (copy.moduleTitles && copy.moduleTitles[moduleId]) || fallbackTitle || moduleId;
  }

  function getLocalizedModuleDescription(moduleId, fallbackText) {
    const copy = getCopy();
    return (copy.moduleDescriptions && copy.moduleDescriptions[moduleId]) || fallbackText || "";
  }

  function getLocalizedModuleGroupTitle(groupId, fallbackTitle) {
    const copy = getCopy();
    return (copy.moduleGroupTitles && copy.moduleGroupTitles[groupId]) || fallbackTitle || groupId;
  }

  function getRoleLabels() {
    return ROLE_LABELS[getLang()] || ROLE_LABELS.en;
  }

  function cleanSentence(value) {
    if (!value) return "";
    const trimmed = String(value).replace(/\s+/g, " ").trim();
    if (!trimmed) return "";
    return /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(value) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(getLang() === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function formatDateTime(value) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(getLang() === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function formatCount(value) {
    return String(Math.max(Number(value) || 0, 0)).padStart(2, "0");
  }

  function dedupe(values) {
    const seen = new Set();
    const out = [];
    values.forEach((value) => {
      const asString = String(value || "");
      const normalized = asString.toLowerCase();
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      out.push(asString);
    });
    return out;
  }

  function normalizeTopic(value) {
    const key = String(value || "").trim().toLowerCase();
    if (!key) return "";
    if (key in TOPIC_LABELS) return TOPIC_LABELS[key];
    return key
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function daysSince(dateValue) {
    if (!dateValue) return Number.POSITIVE_INFINITY;
    const stamp = new Date(dateValue).getTime();
    if (Number.isNaN(stamp)) return Number.POSITIVE_INFINITY;
    return (Date.now() - stamp) / 86400000;
  }

  function isLowSignalName(name) {
    return SIGNAL_NAME_PATTERNS.some((pattern) => pattern.test(String(name || "")));
  }

  function computeSignal(repo) {
    let score = 0;
    const recentDays = daysSince(repo.pushed_at);
    const hasDescription = Boolean((repo.description || "").trim());
    const topics = Array.isArray(repo.topics) ? repo.topics : [];

    score += hasDescription ? 16 : 0;
    score += Math.min(topics.length * 2, 10);
    score += repo.language ? 6 : 0;
    score += Math.min((repo.stargazers_count || 0) * 2, 24);
    score += Math.min((repo.forks_count || 0) * 1.5, 14);
    score += Math.min((repo.size || 0) / 48, 16);
    score += repo.homepage ? 6 : 0;

    if (recentDays <= 45) score += 16;
    else if (recentDays <= 120) score += 11;
    else if (recentDays <= 365) score += 6;
    else if (recentDays > 900) score -= 6;

    if (repo.fork) score -= 16;
    if (repo.archived) score -= 20;
    if (isLowSignalName(repo.name)) score -= 18;
    if ((repo.size || 0) <= 2) score -= 14;
    if (!hasDescription && !repo.language && topics.length === 0) score -= 12;
    return score;
  }

  function detectProjectType(repo) {
    const haystack = [repo.name, repo.description]
      .concat(Array.isArray(repo.topics) ? repo.topics : [])
      .join(" ")
      .toLowerCase();

    if (/\b(cli|command|terminal)\b/.test(haystack)) return "cliTool";
    if (/\b(api|backend|server|worker)\b/.test(haystack)) return "backendSystem";
    if (/\b(agent|ai|llm|rag|prompt)\b/.test(haystack)) return "aiWorkflow";
    if (/\b(library|sdk|package|module)\b/.test(haystack)) return "reusableLibrary";
    if (/\b(automation|workflow|bot|pipeline)\b/.test(haystack)) return "automationSystem";
    if (/\b(web|website|webapp|frontend|site|portfolio|next|react|app)\b/.test(haystack)) return "webProduct";
    return "softwareProject";
  }

  function deriveDomains(repo, projectType) {
    const haystack = [repo.name, repo.description, repo.language]
      .concat(Array.isArray(repo.topics) ? repo.topics : [])
      .join(" ");

    const domains = DOMAIN_RULES.filter((rule) => rule.pattern.test(haystack)).map((rule) => rule.key);

    if (projectType === "aiWorkflow") domains.push("ai");
    if (projectType === "automationSystem") domains.push("automation");
    if (projectType === "backendSystem") domains.push("infrastructure");
    if (projectType === "webProduct") domains.push("web");
    if (projectType === "cliTool" || projectType === "reusableLibrary") domains.push("developerTools");

    return dedupe(domains).slice(0, 3);
  }

  function buildRole(projectType) {
    const labels = getRoleLabels();
    return labels[projectType] || labels.softwareProject;
  }

  function buildDescription(repo) {
    return cleanSentence(repo.description || "") || getCopy().fallbackDescription;
  }

  function buildStack(repo) {
    const primary = repo.language ? [repo.language] : [];
    const topics = (Array.isArray(repo.topics) ? repo.topics : [])
      .map(normalizeTopic)
      .filter(Boolean)
      .slice(0, 2);
    const combined = dedupe(primary.concat(topics)).slice(0, 3);
    return combined.length ? combined.join(" · ") : getCopy().defaultStack;
  }

  function deriveImportance(repo, projectType) {
    const lang = getLang();
    const recentDays = daysSince(repo.pushed_at);
    const topicSet = new Set((repo.topics || []).map((topic) => String(topic).toLowerCase()));

    if (lang === "zh") {
      if (topicSet.has("ai") || topicSet.has("llm") || topicSet.has("agents")) {
        return "它把模型相关能力放进真实工作流，而不是停留在演示层。";
      }
      if ((repo.stargazers_count || 0) >= 8 || (repo.forks_count || 0) >= 3) {
        return "公开使用与分叉说明这个项目已经超出私人实验阶段。";
      }
      if (recentDays <= 150) return "最近的提交说明这个项目仍在公开维护中。";
      if (projectType === "backendSystem") return "它在底层支撑更可见的产品或界面工作。";
      return "它把一个想法变成了具体、可用、公开的项目。";
    }

    if (topicSet.has("ai") || topicSet.has("llm") || topicSet.has("agents")) {
      return "It puts model-based work into a real workflow instead of leaving it as a demo.";
    }
    if ((repo.stargazers_count || 0) >= 8 || (repo.forks_count || 0) >= 3) {
      return "Public usage and forks suggest the work is useful beyond a private experiment.";
    }
    if (recentDays <= 150) return "Recent commits show the project is still being maintained in public.";
    if (projectType === "backendSystem") return "It supports visible products by handling the service layer underneath.";
    return "It turns an idea into something concrete, usable, and public.";
  }

  function getRepositoryProfile(identifier) {
    const key = normalizeRepoIdentifier(identifier);
    if (!key || !(key in REPOSITORY_PROFILE_OVERRIDES)) return null;

    const profile = REPOSITORY_PROFILE_OVERRIDES[key];
    const langKey = getLang() === "zh" ? "zh" : "en";
    const localized = profile[langKey] || profile.en || {};

    return {
      key,
      roleKey: profile.roleKey || "",
      domains: Array.isArray(profile.domains) ? profile.domains.slice() : [],
      tags: Array.isArray(profile.tags) ? profile.tags.slice() : [],
      stack: String(profile.stack || ""),
      whatItIs: cleanSentence(localized.is || ""),
      does: cleanSentence(localized.does || ""),
      matters: cleanSentence(localized.matters || "")
    };
  }

  function shouldKeepRepo(repo, score, includeSet, excludeSet) {
    const nameKey = normalizeRepoIdentifier(repo.name || "");
    if (excludeSet.has(nameKey)) return false;
    if (includeSet.has(nameKey)) return true;
    if (CONFIG.hideArchived && repo.archived) return false;
    if (CONFIG.hideForks && repo.fork) return false;
    if ((repo.size || 0) <= 1 && !(repo.description || "").trim()) return false;
    return score >= CONFIG.minSignalScore;
  }

  function inferRuntimeRequirements(repo) {
    const isZh = getLang() === "zh";
    const requirements = [isZh ? "Git 版本管理工具" : "Git"];
    const stackText = [repo.stack, repo.whatItDoes, (repo.tags || []).join(" ")].join(" ").toLowerCase();

    if (/\b(python|fastapi)\b/.test(stackText)) requirements.push(isZh ? "Python 3.11+" : "Python 3.11+");
    if (/\b(node|javascript|typescript|react|next\.?js)\b/.test(stackText)) requirements.push(isZh ? "Node.js 20+" : "Node.js 20+");
    if (/\bsqlite\b/.test(stackText)) requirements.push("SQLite");
    if (/\bwebsocket\b/.test(stackText)) requirements.push(isZh ? "支持 WebSocket 的运行环境" : "WebSocket capable runtime");
    if (/\bmdns\b/.test(stackText)) requirements.push(isZh ? "开启本地网络发现（mDNS）" : "Local network discovery enabled");
    if (!requirements.includes(isZh ? "包管理器（npm、pip 等）" : "Package manager")) {
      requirements.push(isZh ? "包管理器（npm、pip 等）" : "Package manager (npm, pip, or equivalent)");
    }

    return dedupe(requirements).slice(0, 6);
  }

  function buildPersonalAgentSystemUpgradeModuleContent(moduleId, options) {
    const { t, repoModel, requirements, quickstartCommand, syncSentence } = options;
    const architectureLayers = [
      t("Interface Layer: MSG · VOICE · SPEAK", "接口层：MSG · VOICE · SPEAK"),
      t("Control Layer: CONF", "控制层：CONF"),
      t("Intelligence Layer: MEM · SKL · CTX · SOUL", "智能层：MEM · SKL · CTX · SOUL"),
      t("Execution & Integration Layer: TOOLS · MCP · HERM", "执行与集成层：TOOLS · MCP · HERM")
    ];
    const abstractionMap = [
      t("How to run: INST / CONF", "如何运行：INST / CONF"),
      t("How to enter system: MSG / VOICE", "如何进入系统：MSG / VOICE"),
      t("How to act: TOOLS / MCP", "如何行动：TOOLS / MCP"),
      t("How to remember: MEM", "如何记住：MEM"),
      t("How to reuse capability: SKL", "如何复用能力：SKL"),
      t("How to control context: CTX", "如何控制输入信息：CTX"),
      t("How to keep style and principles: SOUL", "如何保持风格与原则：SOUL"),
      t("How to explain system structure: ARCH", "如何解释整体结构：ARCH"),
      t("How to operate and maintain: FAQ / SEC / TIPS", "如何稳定使用和维护：FAQ / SEC / TIPS")
    ];

    const templates = {
      installation: {
        summary: t(
          "INST moves this project from non-runnable to bootable by standardizing environment setup.",
          "INST 通过标准化环境准备，把项目从“不能运行”推进到“可以启动”。"
        ),
        sections: [
          { title: t("Positioning", "定位"), body: t("Environment initialization layer.", "环境初始化层。") },
          { title: t("Prerequisites", "前置条件"), list: requirements },
          {
            title: t("What It Solves", "解决问题"),
            list: [
              t("Runtime preparation and dependency installation.", "运行环境准备与依赖安装。"),
              t("Local development preflight checks.", "本地开发前置条件检查。"),
              t("Model/API/base component availability checks.", "模型 / API / 基础组件可用性准备。")
            ]
          },
          { title: t("Execution Note", "执行提示"), body: t(`Suggested startup command: ${quickstartCommand}`, `推荐启动命令：${quickstartCommand}`) }
        ]
      },
      "quickstart-tutorial": {
        summary: t(
          "QST is the Happy Path that gets one full Agent loop running with minimal cost.",
          "QST 是系统 Happy Path，用最低成本跑通一次完整 Agent 闭环。"
        ),
        sections: [
          {
            title: t("Typical Loop", "典型流程"),
            list: [
              t("Input request", "输入请求"),
              t("System parses intent", "系统解析"),
              t("Invoke tool or logic", "调用工具或逻辑"),
              t("Return result", "返回结果")
            ]
          },
          {
            title: t("What It Solves", "解决问题"),
            list: [
              t("Help new users validate the system quickly.", "帮助新用户快速验证系统是否可用。"),
              t("Show complete workflow before deep details.", "先看到完整闭环，再深入细节。"),
              t("Reduce onboarding friction.", "降低上手门槛。")
            ]
          },
          { title: t("Current Source", "当前源状态"), body: syncSentence }
        ]
      },
      "learning-path": {
        summary: t(
          "PATH defines the growth route from operator to developer to system designer.",
          "PATH 定义从使用者到开发者再到系统设计者的成长路线。"
        ),
        sections: [
          {
            title: t("Learning Route", "学习路线"),
            list: [
              t("Can run the system", "会运行系统"),
              t("Can modify modules", "会修改模块"),
              t("Can design architecture", "会设计架构")
            ]
          },
          {
            title: t("Recommended Progression", "推荐顺序"),
            list: [
              t("INST -> QST -> PATH", "INST -> QST -> PATH"),
              t("CONF / MSG / TOOLS", "CONF / MSG / TOOLS"),
              t("MEM / SKL / CTX / SOUL", "MEM / SKL / CTX / SOUL"),
              t("MCP / HERM / VOICE / SPEAK", "MCP / HERM / VOICE / SPEAK"),
              t("SEC / TIPS / ARCH / FAQ", "SEC / TIPS / ARCH / FAQ")
            ]
          },
          { title: t("Core Value", "核心价值"), body: t("The value is learning efficiency, not just feature count.", "价值在于学习效率，而不只是功能数量。") }
        ]
      },
      configuration: {
        summary: t(
          "CONF is the system control plane for defaults, runtime parameters, and environment behavior.",
          "CONF 是系统控制面，管理默认参数、运行行为与环境设置。"
        ),
        sections: [
          { title: t("Configuration Surface", "配置范围"), list: [t("Default models", "默认模型"), t("Runtime parameters", "运行参数"), t("Run modes", "运行模式"), t("Behavior switches", "行为开关"), t("Environment variables", "环境变量"), t("Environment-specific profiles", "多环境差异化配置")] },
          { title: t("Why It Matters", "为什么重要"), body: t("Avoid hard-coding and keep the system controllable and reproducible.", "避免硬编码，提升系统可控性与可复现性。") },
          { title: t("Repository Context", "仓库上下文"), body: repoModel.whatItDoes }
        ]
      },
      "messaging-gateway": {
        summary: t(
          "MSG is the request entry and message channel that standardizes all inbound and outbound flow.",
          "MSG 是请求入口与消息通道，负责统一输入输出流。"
        ),
        sections: [
          { title: t("Gateway Responsibilities", "网关职责"), list: [t("Input ingestion", "输入接入"), t("Request dispatch", "请求分发"), t("Message normalization", "消息标准化"), t("Event routing", "事件流转"), t("Response assembly", "响应出口组织")] },
          { title: t("Core Problem Solved", "核心解决点"), body: t("Different sources use different formats; the gateway unifies them into one internal contract.", "不同来源格式不一致，网关把它们统一成系统内部契约。") },
          { title: t("Current Source", "当前源状态"), body: syncSentence }
        ]
      },
      "tools-toolsets": {
        summary: t(
          "TOOLS defines the real execution surface that turns reasoning into action.",
          "TOOLS 定义系统真实可执行能力面，把“理解”转成“执行”。"
        ),
        sections: [
          {
            title: t("Tool Examples", "工具示例"),
            list: [
              t("File operations", "文件操作"),
              t("External API calls", "外部 API 调用"),
              t("Search and retrieval", "搜索与检索"),
              t("Computation and data processing", "计算与数据处理"),
              t("System command execution", "系统命令执行")
            ]
          },
          { title: t("Essence", "本质"), body: t("Without tools, the Agent only chats; with tools, it can operate systems and workflows.", "没有工具，Agent 只是聊天；有了工具，才具备操作系统与流程的能力。") },
          { title: t("Current Tool Surface", "当前工具面"), body: (repoModel.tags || []).join(" · ") || repoModel.role }
        ]
      },
      "memory-system": {
        summary: t(
          "MEM provides cross-turn and cross-task continuity through persistent state and recall.",
          "MEM 通过持久状态与召回能力实现跨轮次、跨任务连续性。"
        ),
        sections: [
          { title: t("Memory Scope", "记忆范围"), list: [t("User preferences", "用户偏好"), t("Conversation history", "历史对话"), t("Task context", "任务上下文"), t("Execution status", "执行状态"), t("Persistent knowledge", "可持久化信息")] },
          { title: t("What It Solves", "解决问题"), body: t("Avoid restarting from zero in every round and enable long-term personalization.", "避免每轮都从零开始，支持长期连续理解与个性化。") },
          { title: t("Why It Matters", "为什么重要"), body: repoModel.whyItMatters }
        ]
      },
      "skills-system": {
        summary: t(
          "SKL packages repeatable behaviors into reusable and composable capability modules.",
          "SKL 将可重复行为封装为可复用、可组合的能力模块。"
        ),
        sections: [
          { title: t("Skill Composition", "技能构成"), list: [t("Prompt structure", "Prompt 结构"), t("Tool invocation logic", "工具调用逻辑"), t("Execution flow", "执行流程"), t("Output schema", "输出规范")] },
          { title: t("Engineering Value", "工程价值"), list: [t("Reusable", "可复用"), t("Composable", "可组合"), t("Extensible", "可扩展"), t("Maintainable", "可维护")] },
          { title: t("Current Tags", "当前标签"), body: (repoModel.tags || []).join(" · ") || t("No explicit tags yet.", "暂无明确标签。") }
        ]
      },
      "context-files": {
        summary: t(
          "CTX controls what the Agent can see, reference, and retain inside a task window.",
          "CTX 控制 Agent 在任务窗口内能看到、引用和保留的信息。"
        ),
        sections: [
          { title: t("What It Solves", "解决问题"), list: [t("Context pollution from long history", "上下文过长导致污染"), t("Irrelevant information consuming token budget", "无关信息挤占 token"), t("Unclear citation boundaries", "引用边界不清晰"), t("Unstable information selection", "信息选择混乱")] },
          { title: t("Essence", "本质"), body: t("A strong Agent does not carry all information; it carries the right information for the current task.", "强 Agent 不是“信息很多”，而是“知道当前任务该带什么信息”。") },
          { title: t("Policy", "策略"), body: t("Refresh context when architecture or contracts change.", "当架构或执行契约变化时及时刷新上下文。") }
        ]
      },
      "personality-soul": {
        summary: t(
          "SOUL.md is a behavior contract that stabilizes style, principles, and role consistency.",
          "SOUL.md 是行为契约层，用于稳定风格、原则与角色一致性。"
        ),
        sections: [
          { title: t("Contract Scope", "契约范围"), list: [t("Tone and speaking style", "说话风格"), t("Role positioning", "角色定位"), t("Decision priorities", "决策优先级"), t("Output preferences", "输出偏好"), t("Safety boundaries", "安全边界"), t("Persona consistency", "人格一致性")] },
          { title: t("What It Solves", "解决问题"), body: t("Prevent style drift and unstable behavior across runs.", "解决同一 Agent 风格飘忽与输出不一致问题。") },
          { title: t("Repository Role", "仓库角色"), body: repoModel.role }
        ]
      },
      "mcp-integration": {
        summary: t(
          "MCP is the standardized protocol layer for connecting external tools and services.",
          "MCP 是标准化外部能力接入层，用于连接工具与服务生态。"
        ),
        sections: [
          { title: t("Integration Actions", "集成动作"), list: [t("Register MCP servers", "注册 MCP 服务"), t("Declare tool schemas", "声明工具 Schema"), t("Validate invocation contracts", "验证调用契约")] },
          { title: t("Core Value", "核心价值"), body: t("Standardization improves scalability: one protocol, many integrations.", "标准化带来扩展性：一套协议，接入多种能力。") },
          { title: t("Current Source", "当前源状态"), body: syncSentence }
        ]
      },
      "use-mcp-with-hermes": {
        summary: t(
          "HERM explains practical MCP implementation inside Hermes runtime.",
          "HERM 说明 MCP 在 Hermes 运行时中的实际落地方式。"
        ),
        sections: [
          { title: t("Hermes Run Path", "Hermes 实操路径"), list: [t("Configure transport in Hermes", "在 Hermes 中配置传输层"), t("Bind MCP endpoints", "绑定 MCP 端点"), t("Run test invocation and trace", "执行测试调用并核对调用轨迹")] },
          { title: t("Problem Solved", "解决问题"), body: t("Bridge the gap between protocol theory and runtime execution details.", "弥合“有协议理论”与“能在真实运行时落地”之间的差距。") },
          { title: t("Escalation", "升级处理"), body: t("If behavior drifts, inspect schema compatibility and runtime binding first.", "若行为漂移，优先排查 Schema 兼容性与运行时绑定。") }
        ]
      },
      "voice-mode": {
        summary: t(
          "VOICE adds audio input/output and expands the system toward multimodal interaction.",
          "VOICE 为系统增加语音输入输出能力，使其向多模态交互扩展。"
        ),
        sections: [
          { title: t("Voice Pipeline", "语音链路"), list: [t("Speech input", "语音输入"), t("Audio processing", "音频处理"), t("Speech-to-text", "语音转文本"), t("Text-to-speech", "文本转语音"), t("Session lifecycle control", "语音会话生命周期")] },
          { title: t("What It Solves", "解决问题"), body: t("Move beyond typing-only interaction and unlock real-time voice scenarios.", "从纯文本交互扩展到实时语音场景。") },
          { title: t("Compatibility", "兼容性"), body: t("Voice mode should share context and memory contracts with text mode.", "语音模式需与文本模式共享同一上下文和记忆契约。") }
        ]
      },
      "use-voice-mode": {
        summary: t(
          "SPEAK is the practical runbook for operating voice mode in real workflows.",
          "SPEAK 是语音模式的实操手册，用于真实流程落地。"
        ),
        sections: [
          { title: t("Typical Flow", "典型流程"), list: [t("Voice input", "语音输入"), t("Transcription", "转文字"), t("Agent processing", "Agent 处理"), t("Text output", "输出文字"), t("Voice playback", "转语音播报")] },
          { title: t("Operator Guidance", "操作建议"), body: t("Use short intents and explicit confirmations for state-changing actions.", "状态变更类操作应使用短意图并要求显式确认。") },
          { title: t("Fallback", "回退"), body: t("Switch to text mode when voice confidence is low.", "语音识别置信度低时切换文本模式。") }
        ]
      },
      security: {
        summary: t(
          "SEC defines permission boundaries, risk controls, and guardrails for production use.",
          "SEC 定义权限边界、风险控制与防护护栏，是系统进入真实环境的前提。"
        ),
        sections: [
          { title: t("Security Controls", "安全控制"), list: [t("Prompt injection defense", "Prompt injection 防护"), t("Tool permission boundaries", "工具调用权限"), t("Data access boundaries", "数据访问边界"), t("Dangerous action limits", "危险操作限制"), t("External input validation", "外部输入校验"), t("Sensitive data protection", "敏感信息保护")] },
          { title: t("Threats Addressed", "应对风险"), body: t("Prevent abuse, mis-invocation, over-privilege, and out-of-control behavior.", "防止权限滥用、误调用、越权与系统失控。") },
          { title: t("Security Principle", "安全原则"), body: t("The stronger the capability, the stronger the required safety controls.", "能力越强，安全越重要。") }
        ]
      },
      "tips-best-practices": {
        summary: t(
          "TIPS captures operational know-how so the system evolves from runnable to reliably usable.",
          "TIPS 沉淀实战经验，让系统从“能运行”升级为“好使用”。"
        ),
        sections: [
          { title: t("Focus Areas", "聚焦方向"), list: [t("Usage patterns", "使用方法"), t("Development practices", "开发实践"), t("Debugging routines", "调试流程"), t("Extension patterns", "扩展模式")] },
          { title: t("What It Solves", "解决问题"), body: t("Reduce common pitfalls, improve runtime efficiency, and clarify design choices.", "减少新手踩坑，提升运行效率，澄清设计思路。") },
          { title: t("Stable Pattern", "稳定模式"), body: t("Treat Installation and Quickstart as mandatory entry points.", "安装与快速上手应始终作为默认入口。") }
        ]
      },
      architecture: {
        summary: t(
          "ARCH is the system map: components, boundaries, control flow, and data flow.",
          "ARCH 是系统蓝图：解释组件关系、边界、控制流与数据流。"
        ),
        sections: [
          { title: t("One-line Definition", "一句话定义"), body: t("A modular Agent OS that upgrades AI from answering to executing, remembering, tool-calling, and behavior consistency.", "这是一个模块化 Agent OS，把 AI 从“会回答”升级为“能执行、能记忆、能调用工具、能维持行为风格”。") },
          { title: t("Four-layer Model", "四层抽象"), list: architectureLayers },
          { title: t("Core Goals", "核心目标"), list: [t("Configurable", "可配置"), t("Extensible", "可扩展"), t("Integrable", "可集成"), t("Reusable", "可复用"), t("Controllable", "可控制"), t("Maintainable", "可维护")] },
          { title: t("System Abstraction Map", "系统抽象映射"), list: abstractionMap }
        ]
      },
      "faq-troubleshooting": {
        summary: t(
          "FAQ provides repeatable diagnostics so users can self-recover and reduce maintenance cost.",
          "FAQ 提供可复现排查路径，帮助用户自救并降低维护成本。"
        ),
        sections: [
          {
            title: t("Common Failures", "常见故障"),
            list: [
              t("Installation failure", "安装失败"),
              t("Configuration errors", "配置错误"),
              t("Tool unavailable", "工具不可用"),
              t("Model/API connection issues", "模型连接异常"),
              t("Behavior not as expected", "行为不符合预期")
            ]
          },
          {
            title: t("Troubleshooting Order", "排查顺序"),
            list: [
              t("Check environment prerequisites", "先查环境前置条件"),
              t("Check configuration values", "再查配置值"),
              t("Check tool and integration status", "再查工具与集成状态"),
              t("Check logs and runtime traces", "最后查日志与运行轨迹")
            ]
          },
          { title: t("Escalation Rule", "升级规则"), body: t("If root cause remains unclear, capture a minimal reproducible case with logs and open a focused issue.", "若根因仍不清晰，整理最小复现案例与日志后提交聚焦问题。") }
        ]
      }
    };

    return templates[moduleId] || null;
  }

  function pickBilingualValue(value, isZh, fallback) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const preferred = isZh ? value.zh : value.en;
      const alternate = isZh ? value.en : value.zh;
      if (typeof preferred === "string" && preferred.trim()) return preferred;
      if (typeof alternate === "string" && alternate.trim()) return alternate;
    }
    return fallback || "";
  }

  function pickBilingualList(value, isZh, fallback) {
    if (Array.isArray(value)) return value.slice();
    if (value && typeof value === "object") {
      const preferred = isZh ? value.zh : value.en;
      const alternate = isZh ? value.en : value.zh;
      if (Array.isArray(preferred) && preferred.length) return preferred.slice();
      if (Array.isArray(alternate) && alternate.length) return alternate.slice();
    }
    return Array.isArray(fallback) ? fallback.slice() : [];
  }

  function buildGuideDrivenRepositoryModuleContent(moduleId, options, guide) {
    const { t, repoModel, requirements, quickstartCommand, syncSentence } = options;
    const isZh = getLang() === "zh";
    const text = (value, fallback) => pickBilingualValue(value, isZh, fallback);
    const list = (value, fallback) => pickBilingualList(value, isZh, fallback);

    const defaultInstallFlow = [
      t(`Clone repository: ${repoModel.htmlUrl || "repository URL"}`, `克隆仓库：${repoModel.htmlUrl || "仓库地址"}`),
      t("Install dependencies from the project manifest.", "根据项目清单安装依赖。"),
      t("Initialize local configuration files.", "初始化本地配置文件。"),
      t("Run a smoke check before deeper modules.", "进入深层模块前先做冒烟检查。")
    ];
    const defaultQuickstartFlow = [
      t("Complete installation prerequisites.", "先完成安装前置条件。"),
      t(`Start with: ${quickstartCommand}`, `先执行：${quickstartCommand}`),
      t("Run one representative workflow.", "跑通一个代表性流程。"),
      t("Verify output, logs, and expected state.", "核对输出、日志与状态。")
    ];
    const defaultQuickstartDone = [
      t("No hidden manual patching required.", "无需隐藏手动补丁。"),
      t("A first run completes end-to-end.", "首次运行能端到端完成。"),
      t("Result is reproducible on a clean machine.", "在干净环境可复现。")
    ];
    const defaultPathStages = [
      t("Stage 1: Install and run baseline flow.", "阶段 1：安装并跑通基础流程。"),
      t("Stage 2: Configure runtime and environment.", "阶段 2：配置运行参数与环境。"),
      t("Stage 3: Integrate intelligence and context layers.", "阶段 3：接入智能层与上下文层。"),
      t("Stage 4: Harden operations, security, and maintenance.", "阶段 4：强化运维、安全与维护。")
    ];

    const templates = {
      installation: {
        summary: text(
          guide.installSummary,
          t(`Install ${repoModel.name} with a predictable and repeatable setup path.`, `为 ${repoModel.name} 建立稳定可复现的安装路径。`)
        ),
        sections: [
          { title: t("Project Reality", "项目现状"), body: text(guide.reality, repoModel.whatItIs) },
          { title: t("Prerequisites", "前置条件"), list: list(guide.prerequisites, requirements) },
          { title: t("Install Flow", "安装流程"), list: list(guide.installFlow, defaultInstallFlow) },
          { title: t("Definition Of Done", "完成标准"), list: list(guide.installDone, defaultQuickstartDone) }
        ]
      },
      "quickstart-tutorial": {
        summary: text(
          guide.quickstartSummary,
          t(`Run a first successful workflow in ${repoModel.name} in minutes.`, `在几分钟内跑通 ${repoModel.name} 的首个成功流程。`)
        ),
        sections: [
          { title: t("Fast Path", "快速路径"), list: list(guide.quickstartFlow, defaultQuickstartFlow) },
          { title: t("Success Criteria", "成功标准"), list: list(guide.quickstartDone, defaultQuickstartDone) },
          { title: t("Artifacts To Verify", "需核对产物"), list: list(guide.quickstartArtifacts, [syncSentence]) }
        ]
      },
      "learning-path": {
        summary: text(guide.pathSummary, t("Follow a staged path from onboarding to advanced operation.", "按照分阶段路径从入门走向高级运行。")),
        sections: [
          { title: t("Stages", "阶段路线"), list: list(guide.pathStages, defaultPathStages) },
          { title: t("Key Files", "关键文件"), list: list(guide.keyFiles, [t("README.md", "README.md"), t("Primary runtime/config files", "主运行/配置文件")]) },
          { title: t("Milestone", "里程碑"), body: text(guide.milestone, repoModel.whyItMatters) }
        ]
      },
      configuration: {
        summary: text(guide.configSummary, t("Configure runtime defaults and environment behavior.", "配置运行默认值与环境行为。")),
        sections: [
          { title: t("Configuration Scope", "配置范围"), list: list(guide.configScope, [t("Environment values", "环境变量"), t("Runtime switches", "运行开关"), t("Source mapping", "数据源映射")]) },
          { title: t("Config Files", "配置文件"), list: list(guide.configFiles, [t("README and local config templates", "README 与本地配置模板")]) },
          { title: t("Recommended Order", "推荐顺序"), list: list(guide.configOrder, [t("Baseline setup", "基础配置"), t("Integration credentials", "集成凭证"), t("Operational safeguards", "运行防护")]) }
        ]
      },
      "messaging-gateway": {
        summary: text(guide.msgSummary, t("Map input, events, and response flow.", "梳理输入、事件与响应流程。")),
        sections: [
          { title: t("Flow Map", "流程图谱"), list: list(guide.msgFlow, [t("Input -> normalize -> dispatch -> output", "输入 -> 标准化 -> 分发 -> 输出")]) },
          { title: t("Checks", "检查项"), list: list(guide.msgChecks, [t("Validation", "校验"), t("Error path", "错误路径"), t("Retry policy", "重试策略")]) },
          { title: t("Current State", "当前状态"), body: syncSentence }
        ]
      },
      "tools-toolsets": {
        summary: text(guide.toolsSummary, t("Document executable tool surface and boundaries.", "明确可执行工具能力面与边界。")),
        sections: [
          { title: t("Core Toolsets", "核心工具集"), list: list(guide.toolsCore, dedupe([repoModel.role].concat(repoModel.tags || []).slice(0, 6))) },
          { title: t("Boundary", "能力边界"), body: text(guide.toolsBoundary, repoModel.whatItDoes) },
          { title: t("Practice Rule", "实践规则"), body: text(guide.toolsPractice, t("Prefer deterministic workflows and observable outputs.", "优先确定性流程与可观测输出。")) }
        ]
      },
      "memory-system": {
        summary: text(guide.memorySummary, t("Define how state is stored, recalled, and refreshed.", "定义状态存储、召回与刷新规则。")),
        sections: [
          { title: t("Memory Layers", "记忆层级"), list: list(guide.memoryLayers, [t("Session state", "会话状态"), t("Persistent records", "持久记录"), t("Recovery checkpoints", "恢复检查点")]) },
          { title: t("Policy", "策略"), body: text(guide.memoryPolicy, t("Keep only context that improves repeatability.", "只保留能提升可复现性的上下文。")) },
          { title: t("Validation", "验证"), body: text(guide.memoryValidation, repoModel.whyItMatters) }
        ]
      },
      "skills-system": {
        summary: text(guide.skillsSummary, t("Package repeatable behaviors as reusable skills.", "把可重复行为封装为可复用技能。")),
        sections: [
          { title: t("Skill Blueprint", "技能蓝图"), list: list(guide.skillsBlueprint, [t("Input contract", "输入契约"), t("Execution steps", "执行步骤"), t("Output schema", "输出规范")]) },
          { title: t("Adoption Path", "采用路径"), list: list(guide.skillsAdoption, [t("Build core skills first", "先建核心技能"), t("Promote reusable patterns", "沉淀可复用模式"), t("Version and review changes", "版本化与评审变更")]) },
          { title: t("Quality Bar", "质量门槛"), body: text(guide.skillsQuality, t("Each skill should produce a measurable, deterministic outcome.", "每个技能都应输出可度量、可复现结果。")) }
        ]
      },
      "context-files": {
        summary: text(guide.contextSummary, t("Control context quality and token budget.", "控制上下文质量与 token 预算。")),
        sections: [
          { title: t("Context Sources", "上下文来源"), list: list(guide.contextSources, [t("Repository docs", "仓库文档"), t("Runtime metadata", "运行元数据"), t("Historical events", "历史事件")]) },
          { title: t("Selection Policy", "选择策略"), body: text(guide.contextPolicy, t("Include only task-relevant evidence and constraints.", "只带入任务相关证据与约束。")) },
          { title: t("Fallback Policy", "回退策略"), body: text(guide.contextFallback, t("When context is incomplete, use documented defaults before custom assumptions.", "上下文不完整时先使用文档默认预案，再做自定义假设。")) }
        ]
      },
      "personality-soul": {
        summary: text(guide.soulSummary, t("Define stable behavior contracts and style boundaries.", "定义稳定行为契约与风格边界。")),
        sections: [
          { title: t("Contract", "契约"), list: list(guide.soulContract, [t("Tone", "语气"), t("Decision priorities", "决策优先级"), t("Escalation rules", "升级规则")]) },
          { title: t("Guardrails", "护栏"), list: list(guide.soulRules, [t("No hidden assumptions", "避免隐藏假设"), t("No unsafe actions without checks", "高风险动作先校验"), t("Keep output consistent", "保持输出一致性")]) },
          { title: t("Repository Role", "仓库角色"), body: repoModel.role }
        ]
      },
      "mcp-integration": {
        summary: text(guide.mcpSummary, t("Integrate external capabilities through protocol contracts.", "通过协议契约接入外部能力。")),
        sections: [
          { title: t("Plan", "计划"), list: list(guide.mcpPlan, [t("Register endpoints", "注册端点"), t("Define schemas", "定义 Schema"), t("Validate calls", "验证调用链路")]) },
          { title: t("Observability", "可观测性"), body: text(guide.mcpObs, t("Track success rate, latency, and failure classes.", "跟踪成功率、时延与失败类型。")) },
          { title: t("Source Context", "源上下文"), body: syncSentence }
        ]
      },
      "use-mcp-with-hermes": {
        summary: text(guide.hermSummary, t("Operationalize MCP flows in Hermes runtime.", "在 Hermes 运行时落地 MCP 流程。")),
        sections: [
          { title: t("Runtime Steps", "运行步骤"), list: list(guide.hermPath, [t("Configure transport", "配置传输层"), t("Bind endpoints", "绑定端点"), t("Run test invocation", "执行测试调用")]) },
          { title: t("Validation", "验证"), body: text(guide.hermValidation, t("Confirm structured responses and traceability.", "确认结构化响应与可追踪性。")) },
          { title: t("Escalation", "升级处理"), body: text(guide.hermEscalation, t("If behavior drifts, inspect schema and runtime bindings first.", "若行为漂移，先排查 Schema 与运行时绑定。")) }
        ]
      },
      "voice-mode": {
        summary: text(guide.voiceSummary, t("Design voice interface contracts and lifecycle.", "设计语音接口契约与生命周期。")),
        sections: [
          { title: t("Pipeline", "链路"), list: list(guide.voicePipeline, [t("Audio input", "语音输入"), t("Transcription", "转写"), t("Dispatch", "分发"), t("Synthesis", "语音合成")]) },
          { title: t("Checks", "检查"), list: list(guide.voiceChecks, [t("Latency budget", "时延预算"), t("Fallback behavior", "回退行为"), t("Session integrity", "会话完整性")]) },
          { title: t("Compatibility", "兼容性"), body: text(guide.voiceCompat, t("Voice mode should reuse context and memory contracts from text mode.", "语音模式应复用文本模式的上下文与记忆契约。")) }
        ]
      },
      "use-voice-mode": {
        summary: text(guide.speakSummary, t("Operate voice workflows safely in production paths.", "在生产路径中安全运行语音流程。")),
        sections: [
          { title: t("Runbook", "操作手册"), list: list(guide.speakRunbook, [t("Start session", "启动会话"), t("Confirm intent", "确认意图"), t("Execute", "执行"), t("Verify", "核验")]) },
          { title: t("Interaction Tips", "交互建议"), body: text(guide.speakTips, t("Use short intents and explicit confirmations for state-changing actions.", "状态变更类动作使用短意图并要求显式确认。")) },
          { title: t("Fallback", "回退"), body: text(guide.speakFallback, t("Switch to text mode when confidence is low.", "置信度偏低时切换文本模式。")) }
        ]
      },
      security: {
        summary: text(guide.securitySummary, t("Apply layered controls to reduce operational risk.", "采用分层控制降低运行风险。")),
        sections: [
          { title: t("Core Controls", "核心控制"), list: list(guide.securityControls, [t("Least privilege", "最小权限"), t("Input validation", "输入校验"), t("Audit logs", "审计日志"), t("Secret management", "密钥管理")]) },
          { title: t("Risk Focus", "风险重点"), body: text(guide.securityRisk, t("Prioritize controls around external inputs and privileged actions.", "优先控制外部输入与高权限动作。")) },
          { title: t("Response Rule", "响应规则"), body: text(guide.securityRule, t("If in doubt, stop the action and escalate with evidence.", "若存在不确定性，停止动作并附证据升级。")) }
        ]
      },
      "tips-best-practices": {
        summary: text(guide.tipsSummary, t("Capture practical habits that reduce regressions.", "沉淀可降低回归的实践习惯。")),
        sections: [
          { title: t("Team Habits", "团队习惯"), list: list(guide.tipsHabits, [t("Keep docs in sync with code", "文档与代码同步更新"), t("Prefer explicit defaults", "优先显式默认值"), t("Log meaningful events", "记录关键事件")]) },
          { title: t("Delivery Rhythm", "交付节奏"), body: text(guide.tipsDelivery, t("Ship baseline clarity first, then deepen advanced modules.", "先保证基础清晰，再扩展高级模块。")) },
          { title: t("Next Milestone", "下一里程碑"), body: text(guide.tipsMilestone, repoModel.whyItMatters) }
        ]
      },
      architecture: {
        summary: text(guide.archSummary, t("Understand system shape, boundaries, and collaboration flow.", "理解系统形态、边界与协作流。")),
        sections: [
          { title: t("System Shape", "系统形态"), list: list(guide.archShape, [t(`Role: ${repoModel.role}`, `角色：${repoModel.role}`), t(`Surface: ${repoModel.whatItIs}`, `能力面：${repoModel.whatItIs}`)]) },
          { title: t("Primary Capability", "核心能力"), body: text(guide.archPrimary, repoModel.whatItDoes) },
          { title: t("Depth Anchor", "深度锚点"), body: text(guide.archDepth, repoModel.whyItMatters) }
        ]
      },
      "faq-troubleshooting": {
        summary: text(guide.faqSummary, t("Resolve common failures with reproducible diagnostics.", "通过可复现诊断路径解决常见故障。")),
        sections: [
          { title: t("Common Issues", "常见问题"), list: list(guide.faqIssues, [t("Environment setup mismatch", "环境配置不一致"), t("Invalid config values", "配置值错误"), t("Integration timeout", "集成超时")]) },
          { title: t("Troubleshooting Order", "排查顺序"), list: list(guide.faqOrder, [t("Check setup and configuration", "先查安装与配置"), t("Check logs and traces", "再查日志与调用轨迹"), t("Check module-specific dependencies", "最后查模块依赖")]) },
          { title: t("Escalation Rule", "升级规则"), body: text(guide.faqEscalation, t("Capture a minimal repro and logs before escalating.", "升级前先提供最小复现与日志证据。")) }
        ]
      }
    };

    return templates[moduleId] || null;
  }

  function buildJackshaWebsiteUpgradeModuleContent(moduleId, options) {
    const guide = {
      installSummary: {
        en: "Set up the website locally with reproducible static-preview workflow.",
        zh: "建立可复现的本地网站预览流程。"
      },
      reality: {
        en: "This is a static multi-page site plus an application-like Code section. There is no backend runtime service.",
        zh: "这是一个静态多页面站点，附带应用式 Code Section；当前没有后端服务。"
      },
      prerequisites: {
        en: ["Git", "Node.js 20+ (for tooling and dependencies)", "Python 3 (for local static server)", "Modern browser (Chrome/Safari)"],
        zh: ["Git", "Node.js 20+（工具与依赖）", "Python 3（本地静态服务器）", "现代浏览器（Chrome/Safari）"]
      },
      installFlow: {
        en: [
          `Clone repository: ${options.repoModel.htmlUrl || "repository URL"}`,
          "Run `npm install` to install local dependencies.",
          "Start static server with `python3 -m http.server 4173` from repository root.",
          "Open `/index.html` and `/pages/code/index.html` to verify both content and code system views."
        ],
        zh: [
          `克隆仓库：${options.repoModel.htmlUrl || "仓库地址"}`,
          "执行 `npm install` 安装依赖。",
          "在仓库根目录运行 `python3 -m http.server 4173` 启动静态服务器。",
          "打开 `/index.html` 与 `/pages/code/index.html` 同时验证内容页与代码系统页。"
        ]
      },
      installDone: {
        en: ["Main navbar renders consistently across pages.", "Gallery media loads from manifest.", "Code section sidebar and module panel render without JS errors."],
        zh: ["主导航在多页面一致显示。", "Gallery 图片按 manifest 正常加载。", "Code Section 侧边栏与模块面板无 JS 报错。"]
      },
      quickstartSummary: {
        en: "Run a complete local preview-and-check loop in under 10 minutes.",
        zh: "10 分钟内完成一次本地预览与检查闭环。"
      },
      quickstartFlow: {
        en: [
          "Install deps: `npm install`.",
          "Serve site: `python3 -m http.server 4173`.",
          "Visit `http://localhost:4173/pages/code/index.html`.",
          "Switch EN/ZH and confirm module text updates correctly."
        ],
        zh: [
          "安装依赖：`npm install`。",
          "启动服务：`python3 -m http.server 4173`。",
          "访问 `http://localhost:4173/pages/code/index.html`。",
          "切换中英文并确认模块内容联动更新。"
        ]
      },
      quickstartArtifacts: {
        en: ["Home page hero + navigation", "Code section repository list", "Language toggle behavior", "No console errors in key pages"],
        zh: ["首页视觉与导航", "Code Section 仓库列表", "语言切换行为", "关键页面无控制台报错"]
      },
      pathStages: {
        en: [
          "Stage 1: Verify static rendering and navigation consistency.",
          "Stage 2: Understand `assets/js/main.js` and page-level scripts.",
          "Stage 3: Deep dive `assets/js/code-system.js` data and module logic.",
          "Stage 4: Improve UX, content quality, and sync reliability."
        ],
        zh: [
          "阶段 1：验证静态渲染与导航一致性。",
          "阶段 2：理解 `assets/js/main.js` 与页面脚本。",
          "阶段 3：深入 `assets/js/code-system.js` 数据与模块逻辑。",
          "阶段 4：持续优化体验、内容质量与同步可靠性。"
        ]
      },
      keyFiles: {
        en: ["index.html", "gallery.html", "pages/code/index.html", "assets/js/code-system.js", "assets/css/work.css", "assets/images/gallery-manifest.json"],
        zh: ["index.html", "gallery.html", "pages/code/index.html", "assets/js/code-system.js", "assets/css/work.css", "assets/images/gallery-manifest.json"]
      },
      configScope: {
        en: ["`window.CODE_PORTFOLIO_CONFIG` repository targets", "Language copy blocks (`COPY.en` / `COPY.zh`)", "Page metadata and canonical URLs", "Asset path consistency"],
        zh: ["`window.CODE_PORTFOLIO_CONFIG` 仓库目标配置", "语言文案块（`COPY.en` / `COPY.zh`）", "页面元信息与 canonical URL", "静态资源路径一致性"]
      },
      configFiles: {
        en: ["`pages/code/index.html`", "`assets/js/code-system.js`", "`assets/js/main.js`", "`assets/css/main.css` / `assets/css/work.css`"],
        zh: ["`pages/code/index.html`", "`assets/js/code-system.js`", "`assets/js/main.js`", "`assets/css/main.css` / `assets/css/work.css`"]
      },
      msgFlow: {
        en: ["User input (search/module click)", "State update in code-system store", "DOM re-render (sidebar/workspace)", "Optional hash sync for deep links"],
        zh: ["用户输入（搜索/模块点击）", "code-system 状态更新", "DOM 重新渲染（侧栏/工作区）", "可选 hash 同步用于深链接"]
      },
      toolsCore: {
        en: ["GitHub REST repository sync", "Session/local storage cache", "Signal scoring and repository curation", "Dynamic bilingual copy rendering"],
        zh: ["GitHub REST 仓库同步", "session/localStorage 缓存", "信号分评分与仓库筛选", "中英文动态渲染"]
      },
      toolsBoundary: {
        en: "This repository is frontend-only; anything requiring protected credentials or server-side jobs should be treated as an external integration boundary.",
        zh: "本仓库是纯前端；涉及受保护凭证或服务端任务的能力应视为外部集成边界。"
      },
      memoryLayers: {
        en: ["Session cache for fetched repository snapshots", "Local history for sync runs", "URL hash for module-level context"],
        zh: ["会话缓存：仓库快照", "本地历史：同步记录", "URL hash：模块级上下文"]
      },
      memoryValidation: {
        en: "Clear browser storage and verify the page can rebuild state from source sync without stale artifacts.",
        zh: "清空浏览器存储后，验证页面可通过源同步重建状态且无陈旧数据残留。"
      },
      mcpSummary: {
        en: "MCP is currently not wired in this static website. Use this module as integration design planning, not runtime claim.",
        zh: "当前静态网站未直接接入 MCP。本模块用于集成设计规划，不应误报为已运行能力。"
      },
      voiceSummary: {
        en: "Voice modules are roadmap-oriented for this repository and should be documented as planned capabilities.",
        zh: "本仓库语音模块属于路线图能力，应以规划视角文档化。"
      },
      securityControls: {
        en: ["No secrets in client-side code", "Validate and sanitize external JSON content", "Add/maintain CSP and strict link handling", "Audit third-party script usage"],
        zh: ["前端代码不存放敏感密钥", "校验并净化外部 JSON 内容", "维护 CSP 与外链安全策略", "审查第三方脚本使用"]
      },
      tipsHabits: {
        en: ["Update docs when module copy changes", "Test EN/ZH after every content change", "Treat cache behavior as a test case", "Keep repository profile descriptions evidence-based"],
        zh: ["模块文案变更时同步更新文档", "每次改动后都测试中英文切换", "把缓存行为纳入测试用例", "仓库描述保持证据驱动"]
      },
      archShape: {
        en: ["Static page layer: Home/Gallery/section pages", "Application layer: Code system shell and module workspace", "Source layer: GitHub sync + browser cache state"],
        zh: ["静态页面层：Home/Gallery/栏目页", "应用层：Code System 壳与模块工作区", "数据源层：GitHub 同步 + 浏览器缓存状态"]
      },
      faqIssues: {
        en: ["Incorrect relative paths break assets on subpages", "Stale cache after script updates", "GitHub API rate limit or partial sync state", "Image file-name case mismatch on deployment"],
        zh: ["子页面相对路径错误导致资源丢失", "脚本更新后缓存未刷新", "GitHub API 限流或部分同步状态", "部署后图片文件名大小写不一致"]
      },
      faqOrder: {
        en: ["Check browser console/network panel", "Clear session/local storage and reload", "Verify configured repository list and source mode", "Re-test with clean static server session"],
        zh: ["先查浏览器控制台/网络面板", "清空 session/localStorage 后重载", "核对仓库配置列表与数据源模式", "用干净静态服务会话复测"]
      }
    };

    return buildGuideDrivenRepositoryModuleContent(moduleId, options, guide);
  }

  function buildDesktopTutorialUpgradeModuleContent(moduleId, options) {
    const guide = {
      installSummary: {
        en: "Prepare a clean Git onboarding environment focused on collaboration basics.",
        zh: "准备面向协作基本功的 Git 入门环境。"
      },
      reality: {
        en: "This repository is an onboarding sandbox. Its value comes from repeatable practice, not complex runtime features.",
        zh: "这是一个入门训练沙盒，价值来自可重复训练，而不是复杂运行能力。"
      },
      prerequisites: {
        en: ["GitHub account", "GitHub Desktop installed", "Git configured (name/email)", "Basic Markdown editing capability"],
        zh: ["GitHub 账号", "已安装 GitHub Desktop", "Git 已配置（name/email）", "具备基础 Markdown 编辑能力"]
      },
      installFlow: {
        en: [
          `Clone repository: ${options.repoModel.htmlUrl || "repository URL"}`,
          "Open repository in GitHub Desktop.",
          "Create a training branch (e.g., `feat/onboarding-step-1`).",
          "Edit README, commit once, push branch, and open a PR."
        ],
        zh: [
          `克隆仓库：${options.repoModel.htmlUrl || "仓库地址"}`,
          "使用 GitHub Desktop 打开仓库。",
          "创建训练分支（如 `feat/onboarding-step-1`）。",
          "修改 README，完成一次提交、推送并创建 PR。"
        ]
      },
      installDone: {
        en: ["Local changes are tracked cleanly.", "Commit messages are meaningful.", "Branch is pushed and PR is reviewable."],
        zh: ["本地改动可被清晰追踪。", "提交信息语义清楚。", "分支已推送且 PR 可评审。"]
      },
      quickstartSummary: {
        en: "Finish a full clone-edit-commit-push-PR loop as the first successful workflow.",
        zh: "以 clone-edit-commit-push-PR 完成首个成功闭环。"
      },
      quickstartFlow: {
        en: [
          "Create branch in GitHub Desktop.",
          "Add one concrete README section (Goal / Steps / Expected Result).",
          "Commit with message format: `docs: add onboarding checkpoint`.",
          "Push and open PR with a short self-review note."
        ],
        zh: [
          "在 GitHub Desktop 创建分支。",
          "给 README 增加一个明确章节（目标/步骤/预期结果）。",
          "用 `docs: add onboarding checkpoint` 类格式提交。",
          "推送并创建 PR，附简短自检说明。"
        ]
      },
      quickstartArtifacts: {
        en: ["One clean branch", "One focused commit", "One PR with clear change scope", "No accidental binary/secret files"],
        zh: ["一个干净分支", "一次聚焦提交", "一个范围清晰的 PR", "无误提交二进制/敏感文件"]
      },
      pathStages: {
        en: [
          "Stage 1: Single-file documentation edit.",
          "Stage 2: Multi-file change with coherent commit scope.",
          "Stage 3: Resolve review comments and update PR.",
          "Stage 4: Rebase/sync branch without history chaos."
        ],
        zh: [
          "阶段 1：单文件文档改动训练。",
          "阶段 2：多文件改动并保持提交范围一致。",
          "阶段 3：处理评审意见并更新 PR。",
          "阶段 4：在不污染历史的前提下完成同步/变基。"
        ]
      },
      keyFiles: {
        en: ["README.md", ".gitignore", "Any tutorial checkpoint docs under `/docs` (if added)"],
        zh: ["README.md", ".gitignore", "后续新增的 `/docs` 训练文档"]
      },
      configScope: {
        en: ["Git user identity", "Branch naming convention", "Commit message format", "PR template/checklist"],
        zh: ["Git 用户身份信息", "分支命名规范", "提交信息规范", "PR 模板/检查单"]
      },
      msgSummary: {
        en: "Treat commit history and PR discussion as the repository's core messaging gateway.",
        zh: "把提交历史与 PR 讨论视为该仓库的核心消息网关。"
      },
      msgFlow: {
        en: ["Task intent -> branch", "Local changes -> commit", "Commit -> PR", "PR comments -> follow-up commits"],
        zh: ["任务意图 -> 分支", "本地改动 -> 提交", "提交 -> PR", "PR 评论 -> 跟进提交"]
      },
      toolsCore: {
        en: ["GitHub Desktop", "Git CLI (optional diagnostics)", "Markdown editor", "GitHub PR review interface"],
        zh: ["GitHub Desktop", "Git CLI（可选诊断）", "Markdown 编辑器", "GitHub PR 评审界面"]
      },
      memoryLayers: {
        en: ["Commit history as durable memory", "PR thread as review memory", "README checkpoints as learning memory"],
        zh: ["提交历史作为长期记忆", "PR 讨论作为评审记忆", "README 检查点作为学习记忆"]
      },
      mcpSummary: {
        en: "MCP is not required here; if introduced, it should only assist onboarding analytics or checklist automation.",
        zh: "该仓库不要求 MCP；若引入，也应仅用于入门分析或检查单自动化。"
      },
      voiceSummary: {
        en: "Voice mode is optional and secondary for this repository's scope.",
        zh: "语音模式在该仓库中属于可选次要能力。"
      },
      securityControls: {
        en: ["Do not commit secrets/tokens", "Enable branch protection where possible", "Review file diffs before every commit", "Use least-privilege access for collaborators"],
        zh: ["禁止提交密钥/令牌", "可用时启用分支保护", "每次提交前核对文件 diff", "协作者权限遵循最小权限原则"]
      },
      tipsHabits: {
        en: ["One concern per commit", "Small PRs are easier to review", "Use explicit checklists in PR descriptions", "Close the loop by documenting what you learned"],
        zh: ["一次提交只解决一个关注点", "小 PR 更易评审", "PR 描述使用显式检查单", "收尾时记录本次学习收获"]
      },
      archShape: {
        en: ["People/workflow layer: onboarding tasks", "Version-control layer: branch/commit/PR contracts", "Documentation layer: checkpoints and playbooks"],
        zh: ["人员流程层：入门训练任务", "版本控制层：分支/提交/PR 契约", "文档层：检查点与操作手册"]
      },
      faqIssues: {
        en: ["Detached HEAD or wrong branch commits", "Dirty working tree confusion", "Push rejected due to remote updates", "PR scope too broad to review"],
        zh: ["误在错误分支或 Detached HEAD 提交", "工作区脏状态导致混乱", "远端已更新导致推送被拒", "PR 范围过大难以评审"]
      },
      faqOrder: {
        en: ["Check current branch and status", "Inspect `git log --oneline --graph`", "Sync remote and rebase/merge intentionally", "Split oversized PR into focused changes"],
        zh: ["先查当前分支与状态", "查看 `git log --oneline --graph`", "有意识地同步远端并 rebase/merge", "把过大的 PR 拆分为聚焦改动"]
      }
    };

    return buildGuideDrivenRepositoryModuleContent(moduleId, options, guide);
  }

  function buildNamespaceIncubationUpgradeModuleContent(moduleId, options, variant) {
    const isIdentityAnchor = variant === "identity";
    const guide = {
      installSummary: {
        en: "Initialize this placeholder as an intentional incubation repository.",
        zh: "把当前占位仓库初始化为可管理的孵化仓库。"
      },
      reality: {
        en: isIdentityAnchor
          ? "This repository currently acts as an identity anchor. Treat it as a controlled foundation for future public-facing assets."
          : "This repository currently acts as a namespace reserve. Treat it as a controlled foundation for future implementation.",
        zh: isIdentityAnchor
          ? "该仓库当前是身份锚点，应作为未来公开资产的受控基础。"
          : "该仓库当前是命名空间占位，应作为后续实现的受控基础。"
      },
      prerequisites: {
        en: ["Clear project scope statement", "README contract template", "Issue/milestone planning baseline", "Basic CI/lint strategy"],
        zh: ["明确项目范围声明", "README 契约模板", "Issue/里程碑规划基线", "基础 CI/lint 策略"]
      },
      installFlow: {
        en: [
          `Clone repository: ${options.repoModel.htmlUrl || "repository URL"}`,
          "Replace placeholder README with scope, non-goals, and roadmap.",
          "Add baseline repo files: LICENSE, .gitignore, CONTRIBUTING (optional).",
          "Create first runnable or verifiable artifact with explicit acceptance criteria."
        ],
        zh: [
          `克隆仓库：${options.repoModel.htmlUrl || "仓库地址"}`,
          "将占位 README 升级为范围、非目标与路线图文档。",
          "补齐基线文件：LICENSE、.gitignore、CONTRIBUTING（可选）。",
          "创建首个可运行或可验证产物，并定义验收标准。"
        ]
      },
      installDone: {
        en: ["Repository purpose is explicit.", "Roadmap has near-term milestones.", "First artifact can be validated by another collaborator."],
        zh: ["仓库目的已明确。", "路线图含近期里程碑。", "首个产物可被其他协作者验证。"]
      },
      quickstartSummary: {
        en: "Turn an empty namespace into a reviewable project baseline in one iteration.",
        zh: "在一次迭代内把空命名空间升级为可评审的项目基线。"
      },
      quickstartFlow: {
        en: [
          "Define one concrete target outcome for the next 7 days.",
          "Write a README with `Goal / Scope / How to Run / Next Milestones`.",
          "Create one minimal artifact (script/page/spec) tied to that goal.",
          "Open a PR documenting evidence and remaining gaps."
        ],
        zh: [
          "定义未来 7 天的一个具体目标结果。",
          "编写 README：`Goal / Scope / How to Run / Next Milestones`。",
          "围绕目标创建一个最小产物（脚本/页面/规范）。",
          "提交 PR，附结果证据与剩余缺口。"
        ]
      },
      quickstartArtifacts: {
        en: ["Structured README", "Milestone issue list", "First minimal artifact", "Reviewable PR notes"],
        zh: ["结构化 README", "里程碑 issue 列表", "首个最小产物", "可评审 PR 说明"]
      },
      pathStages: {
        en: [
          "Stage 1: Clarify repository intent and boundaries.",
          "Stage 2: Publish first runnable/verifiable artifact.",
          "Stage 3: Add quality gates (tests/lint/checklists).",
          "Stage 4: Expand to a stable release rhythm."
        ],
        zh: [
          "阶段 1：明确仓库意图与边界。",
          "阶段 2：发布首个可运行/可验证产物。",
          "阶段 3：补齐质量门槛（测试/lint/检查单）。",
          "阶段 4：建立稳定发布节奏。"
        ]
      },
      keyFiles: {
        en: ["README.md", "LICENSE", ".gitignore", "docs/roadmap.md (recommended)", "first artifact entrypoint"],
        zh: ["README.md", "LICENSE", ".gitignore", "docs/roadmap.md（建议）", "首个产物入口文件"]
      },
      configScope: {
        en: ["Repository intent and constraints", "Initial tech-stack decision", "Branch and release policy", "Definition of done for milestones"],
        zh: ["仓库意图与约束", "初始技术栈决策", "分支与发布策略", "里程碑完成标准"]
      },
      msgSummary: {
        en: "In incubation repos, clarity of written contracts is the primary messaging gateway.",
        zh: "在孵化仓库中，文档契约清晰度就是核心消息网关。"
      },
      msgFlow: {
        en: ["Intent in README/issues", "Execution in commits", "Validation in PR", "Decisions in merged docs"],
        zh: ["README/Issue 中定义意图", "Commit 中执行实现", "PR 中完成验证", "合并文档中沉淀决策"]
      },
      toolsCore: {
        en: ["Markdown documentation", "Git workflow tooling", "Issue/PR templates", "Optional starter scaffolding tools"],
        zh: ["Markdown 文档", "Git 协作工具链", "Issue/PR 模板", "可选脚手架工具"]
      },
      memoryLayers: {
        en: ["Roadmap history", "Decision records", "Milestone outcomes", "Retro notes after each iteration"],
        zh: ["路线图历史", "决策记录", "里程碑结果", "每轮复盘记录"]
      },
      mcpSummary: {
        en: "MCP should be introduced only after baseline repository contracts are stable.",
        zh: "应在仓库基线契约稳定后再考虑引入 MCP。"
      },
      voiceSummary: {
        en: "Voice mode is non-critical at incubation stage; prioritize core executable value first.",
        zh: "孵化阶段语音能力非关键，先优先建设核心可执行价值。"
      },
      securityControls: {
        en: ["Protect naming ownership and access rights", "Avoid exposing private planning artifacts unintentionally", "Set permission boundaries early", "Review external links and references"],
        zh: ["保护命名所有权与访问权限", "避免误公开私有规划材料", "尽早设置权限边界", "审查外链与引用来源"]
      },
      tipsHabits: {
        en: ["Every milestone must produce one tangible artifact", "Track assumptions explicitly", "Kill vague goals quickly", "Prefer small, visible wins"],
        zh: ["每个里程碑都要产出可见产物", "显式记录关键假设", "尽快淘汰模糊目标", "优先小步可见胜利"]
      },
      archShape: {
        en: ["Intent layer: why this repo exists", "Execution layer: what is shipped now", "Growth layer: how it scales to real project scope"],
        zh: ["意图层：为何存在该仓库", "执行层：当前交付了什么", "成长层：如何扩展到真实项目规模"]
      },
      faqIssues: {
        en: ["Repository stays empty for too long", "Roadmap drifts without clear owner", "Artifacts do not map to goals", "PRs describe changes but not outcomes"],
        zh: ["仓库长期空转无产出", "路线图漂移且无明确负责人", "产物与目标不对应", "PR 只描述改动不描述结果"]
      },
      faqOrder: {
        en: ["Re-validate the 7-day target", "Map each artifact to one milestone", "Delete stale tasks and rewrite scope", "Re-open iteration with evidence-based acceptance criteria"],
        zh: ["先重新确认 7 天目标", "把每个产物映射到单一里程碑", "删除过期任务并重写范围", "以证据化验收标准重新启动迭代"]
      }
    };

    return buildGuideDrivenRepositoryModuleContent(moduleId, options, guide);
  }

  function buildRepositoryUpgradeModuleContent(moduleId, options) {
    const repoKey = String(options.repoModel && options.repoModel.key ? options.repoModel.key : "");
    if (!repoKey) return null;

    if (repoKey === "personal-ai-agent-system") {
      return buildPersonalAgentSystemUpgradeModuleContent(moduleId, options);
    }
    if (repoKey === "jacksha-website") {
      return buildJackshaWebsiteUpgradeModuleContent(moduleId, options);
    }
    if (repoKey === "desktop-tutorial") {
      return buildDesktopTutorialUpgradeModuleContent(moduleId, options);
    }
    if (repoKey === "jacksha") {
      return buildNamespaceIncubationUpgradeModuleContent(moduleId, options, "namespace");
    }
    if (repoKey === "jack-sha") {
      return buildNamespaceIncubationUpgradeModuleContent(moduleId, options, "identity");
    }
    return null;
  }

  function buildModuleContent(moduleId, repoModel) {
    const isZh = getLang() === "zh";
    const t = (en, zh) => (isZh ? zh : en);
    const requirements = inferRuntimeRequirements(repoModel);
    const quickstartCommand = /\bpython\b/i.test(repoModel.stack)
      ? "python -m app.main"
      : /\bnode|javascript|typescript|react|next/i.test(repoModel.stack)
      ? "npm run dev"
      : isZh
      ? "按仓库启动脚本执行"
      : "follow repository bootstrap script";
    const stackSentence = repoModel.stack || getCopy().defaultStack;
    const syncSentence = state.syncMeta.lastSyncAt
      ? t(
          `Latest source sync: ${formatDateTime(state.syncMeta.lastSyncAt)}.`,
          `最近一次源同步：${formatDateTime(state.syncMeta.lastSyncAt)}。`
        )
      : t("Source sync has not completed yet.", "数据源同步尚未完成。");
    const repositoryUpgrade = buildRepositoryUpgradeModuleContent(moduleId, {
      t,
      repoModel,
      requirements,
      quickstartCommand,
      syncSentence
    });
    if (repositoryUpgrade) return repositoryUpgrade;

    const templates = {
      installation: {
        summary: t(`Install ${repoModel.name} with a predictable local setup path.`, `为 ${repoModel.name} 建立稳定、可复现的本地安装路径。`),
        sections: [
          { title: t("Prerequisites", "前置条件"), list: requirements },
          {
            title: t("Install Flow", "安装流程"),
            list: [
              t(`Clone repository: ${repoModel.htmlUrl || "repository URL"}`, `克隆仓库：${repoModel.htmlUrl || "仓库地址"}`),
              t("Install dependencies from the repository manifest.", "根据仓库依赖清单安装依赖。"),
              t("Create environment variables from the local template.", "基于本地模板创建环境变量。"),
              t("Run smoke checks before moving to tutorial steps.", "进入教程前先完成冒烟检查。")
            ]
          },
          { title: t("Current Stack", "当前技术栈"), body: stackSentence }
        ]
      },
      "quickstart-tutorial": {
        summary: t(`Run a first successful workflow in ${repoModel.name} in minutes.`, `在几分钟内跑通 ${repoModel.name} 的首个成功流程。`),
        sections: [
          {
            title: t("Fast Path", "快速路径"),
            list: [
              t("Complete installation prerequisites.", "先完成安装前置条件。"),
              t(`Start the system: ${quickstartCommand}`, `启动系统：${quickstartCommand}`),
              t("Run one representative command or endpoint.", "执行一个代表性命令或接口。"),
              t("Confirm logs, output, and state persistence.", "确认日志、输出与状态持久化正常。")
            ]
          },
          {
            title: t("Success Criteria", "成功标准"),
            body: t("A first run should complete without manual patching or hidden setup.", "首次运行应在无需临时补丁和隐藏步骤的情况下完成。")
          }
        ]
      },
      "learning-path": {
        summary: t("Follow a staged path from onboarding to advanced operation.", "按照分阶段路径从入门走向高级运行。"),
        sections: [
          { title: t("Stage 1", "阶段 1"), body: t("Install and run Quickstart with default settings.", "使用默认配置完成安装并跑通快速上手。") },
          { title: t("Stage 2", "阶段 2"), body: t("Configure runtime and inspect gateway/tool behavior.", "配置运行参数并检查网关/工具行为。") },
          { title: t("Stage 3", "阶段 3"), body: t("Integrate memory, skills, and context policies.", "接入记忆、技能与上下文策略。") },
          { title: t("Stage 4", "阶段 4"), body: t("Operate integration, security, and troubleshooting routines.", "完成集成、安全与故障处理的运行闭环。") }
        ]
      },
      configuration: {
        summary: t("Configure this repository for consistent local and production behavior.", "配置该仓库以保证本地与生产行为一致。"),
        sections: [
          { title: t("Configuration Scope", "配置范围"), body: t("Environment variables, runtime flags, and deployment profiles.", "环境变量、运行开关与部署配置。") },
          { title: t("Recommended Order", "推荐顺序"), list: [t("Base environment", "基础环境"), t("Integration credentials", "集成凭证"), t("Operational safeguards", "运行防护") ] },
          { title: t("Repository Context", "仓库上下文"), body: repoModel.whatItDoes }
        ]
      },
      "messaging-gateway": {
        summary: t("Map how requests, events, and responses flow through this repository.", "梳理请求、事件与响应在仓库中的流转路径。"),
        sections: [
          { title: t("Gateway Surface", "网关面"), body: t("Define inbound interfaces, broker rules, and outbound response contracts.", "定义入口接口、路由规则与出站响应契约。") },
          { title: t("Operational Checks", "运行检查"), list: [t("Message validation", "消息校验"), t("Retry behavior", "重试行为"), t("Dead-letter handling", "死信处理")] },
          { title: t("Current State", "当前状态"), body: syncSentence }
        ]
      },
      "tools-toolsets": {
        summary: t("Catalog tools and capability bundles provided by this repository.", "盘点该仓库提供的工具能力与工具集边界。"),
        sections: [
          { title: t("Core Toolsets", "核心工具集"), list: dedupe([repoModel.role].concat(repoModel.tags || [])).slice(0, 6) },
          { title: t("Capability Surface", "能力边界"), body: repoModel.whatItIs },
          { title: t("Depth Guidance", "深度建议"), body: t("Start with setup tools, then move to intelligence and integration modules.", "先掌握系统搭建模块，再进入智能层与集成层。") }
        ]
      },
      "memory-system": {
        summary: t("Define how state is stored, recalled, and refreshed across sessions.", "定义状态在多轮会话中的存储、召回与刷新规则。"),
        sections: [
          { title: t("Memory Layers", "记忆层级"), list: [t("Session cache", "会话缓存"), t("Persistent records", "持久记录"), t("Recovery checkpoints", "恢复检查点")] },
          { title: t("Retention Rules", "保留策略"), body: t("Store enough context for repeatability while avoiding stale behavior drift.", "在保证可复现的前提下，避免过期上下文造成行为漂移。") },
          { title: t("Repository Signal", "仓库价值信号"), body: repoModel.whyItMatters }
        ]
      },
      "skills-system": {
        summary: t("Formalize reusable skill packs and execution playbooks.", "标准化可复用技能包与执行手册。"),
        sections: [
          { title: t("Skill Boundaries", "技能边界"), body: t("Each skill should own one repeatable outcome with clear inputs and outputs.", "每个技能只负责一个可复用结果，并明确输入输出。") },
          { title: t("Adoption Pattern", "采用路径"), list: [t("Start with onboarding skills", "先建设入门技能"), t("Add system setup", "补齐系统搭建能力"), t("Promote integration skills", "推进集成与协同技能")] },
          { title: t("Current Tags", "当前标签"), body: (repoModel.tags || []).join(" · ") || t("No explicit tags yet.", "暂无明确标签。") }
        ]
      },
      "context-files": {
        summary: t("Use context files to stabilize runtime decisions and behavior.", "通过上下文文件稳定运行决策与行为输出。"),
        sections: [
          { title: t("Context Sources", "上下文来源"), list: [t("Repository docs", "仓库文档"), t("Environment metadata", "环境元数据"), t("Operational history", "运行历史")] },
          { title: t("Update Policy", "更新策略"), body: t("Refresh context when architecture or execution contracts change.", "当架构或执行契约变化时及时刷新上下文。") },
          { title: t("Fallback Policy", "回退策略"), body: t("When context is incomplete, use documented preview defaults before custom overrides.", "上下文不完整时，先采用文档默认预案再做自定义覆盖。") }
        ]
      },
      "personality-soul": {
        summary: t("Define the behavior contract through SOUL.md and personality directives.", "通过 SOUL.md 与人格指令定义行为契约。"),
        sections: [
          { title: t("Contract Focus", "契约重点"), body: t("Voice, decision boundaries, escalation rules, and collaboration posture.", "语气风格、决策边界、升级规则与协作姿态。") },
          { title: t("Why It Matters", "为什么重要"), body: t("A stable personality layer keeps outputs consistent across modules and integrations.", "稳定的人格层能让多模块、多集成输出保持一致。") },
          { title: t("Repository Role", "仓库角色"), body: repoModel.role }
        ]
      },
      "mcp-integration": {
        summary: t("Integrate MCP endpoints and tool contracts into this repository.", "将 MCP 端点与工具契约接入该仓库。"),
        sections: [
          { title: t("Integration Plan", "集成计划"), list: [t("Register MCP servers", "注册 MCP 服务"), t("Declare tool schemas", "声明工具 Schema"), t("Validate invocation flow", "验证调用链路")] },
          { title: t("Observability", "可观测性"), body: t("Track MCP call success, latency, and failure patterns.", "跟踪 MCP 调用成功率、时延与失败模式。") },
          { title: t("Source Context", "源上下文"), body: syncSentence }
        ]
      },
      "use-mcp-with-hermes": {
        summary: t("Run MCP workflows with Hermes as the execution client.", "以 Hermes 作为执行客户端运行 MCP 工作流。"),
        sections: [
          { title: t("Hermes Path", "Hermes 路径"), list: [t("Configure Hermes transport", "配置 Hermes 传输层"), t("Bind MCP endpoints", "绑定 MCP 端点"), t("Run test invocation", "执行测试调用")] },
          { title: t("Validation", "验证"), body: t("Confirm Hermes receives structured responses and tool call traces.", "确认 Hermes 能收到结构化响应与工具调用轨迹。") },
          { title: t("Escalation", "升级处理"), body: t("If tool responses drift, inspect MCP schema versioning first.", "若工具响应漂移，先排查 MCP Schema 版本一致性。") }
        ]
      },
      "voice-mode": {
        summary: t("Enable voice mode interfaces for this repository system.", "为该仓库系统启用语音模式接口。"),
        sections: [
          { title: t("Voice Architecture", "语音架构"), body: t("Audio input, transcription layer, command dispatch, and response synthesis.", "语音输入、转写层、命令分发与响应合成。") },
          { title: t("Runtime Checks", "运行检查"), list: [t("Latency budget", "时延预算"), t("Fallback to text mode", "文本模式回退"), t("Session transcript integrity", "会话转写完整性")] },
          { title: t("Compatibility", "兼容性"), body: t("Ensure voice mode shares the same context and memory contracts as text mode.", "确保语音模式与文本模式共享同一上下文与记忆契约。") }
        ]
      },
      "use-voice-mode": {
        summary: t("Operate voice mode safely in real workflows.", "在真实流程中安全地使用语音模式。"),
        sections: [
          { title: t("Operator Runbook", "操作手册"), list: [t("Start voice session", "开启语音会话"), t("Confirm intent", "确认意图"), t("Execute command", "执行命令"), t("Verify response", "核对结果")] },
          { title: t("Interaction Tips", "交互建议"), body: t("Use short intents and explicit confirmations for state-changing actions.", "状态变更类操作使用短指令并要求显式确认。") },
          { title: t("Fallback", "回退"), body: t("Switch to text mode whenever voice confidence is low.", "当语音识别置信度偏低时立即切换文本模式。") }
        ]
      },
      security: {
        summary: t("Apply defense-in-depth controls around this repository.", "围绕该仓库实施纵深防御策略。"),
        sections: [
          { title: t("Core Controls", "核心控制"), list: [t("Credential isolation", "凭证隔离"), t("Input validation", "输入校验"), t("Least privilege", "最小权限"), t("Audit logging", "审计日志")] },
          { title: t("Operational Security", "运行安全"), body: t("Protect integrations and automation paths before opening external access.", "在开放外部访问前先保护集成通道与自动化路径。") },
          { title: t("Repository Signal", "仓库价值信号"), body: repoModel.whyItMatters }
        ]
      },
      "tips-best-practices": {
        summary: t("Use proven practices to reduce setup friction and runtime regressions.", "采用验证过的实践，降低搭建摩擦与运行回归。"),
        sections: [
          { title: t("Team Habits", "团队习惯"), list: [t("Keep module docs updated", "保持模块文档更新"), t("Favor predictable defaults", "优先可预测默认值"), t("Log meaningful events", "记录关键运行事件")] },
          { title: t("Delivery Rhythm", "交付节奏"), body: t("Ship onboarding clarity first, then deepen advanced module coverage.", "先保证入门清晰，再扩展高级模块深度。") },
          { title: t("Known Good Pattern", "稳定模式"), body: t("Treat Installation and Quickstart as non-optional entry points.", "安装与快速上手必须作为默认起点。") }
        ]
      },
      architecture: {
        summary: t("Understand the full architecture and depth model of this repository.", "理解该仓库的整体架构与深度模型。"),
        sections: [
          { title: t("System Shape", "系统形态"), body: t(`Role: ${repoModel.role}. Surface: ${repoModel.whatItIs}`, `角色：${repoModel.role}。能力面：${repoModel.whatItIs}`) },
          { title: t("Primary Capability", "核心能力"), body: repoModel.whatItDoes },
          { title: t("Depth Anchor", "深度锚点"), body: repoModel.whyItMatters }
        ]
      },
      "faq-troubleshooting": {
        summary: t("Resolve common failures with repeatable diagnostics.", "通过可复现的诊断流程解决常见故障。"),
        sections: [
          { title: t("Common Issues", "常见问题"), list: [t("Missing environment setup", "环境缺失"), t("Invalid configuration values", "配置值无效"), t("Integration timeouts", "集成超时")] },
          { title: t("Troubleshooting Order", "排查顺序"), list: [t("Check sync/source state", "先查同步/源状态"), t("Check runtime logs", "再查运行日志"), t("Check module-specific setup", "最后查模块专属配置")] },
          { title: t("Escalation Rule", "升级规则"), body: t("If root cause is unclear after baseline checks, capture logs and open a focused issue.", "基础排查后仍不明确时，收集日志并提交聚焦问题。") }
        ]
      }
    };

    return (
      templates[moduleId] || {
        summary: t(`${repoModel.name} documentation module preview.`, `${repoModel.name} 模块预览。`),
        sections: [{ title: t("Overview", "概览"), body: repoModel.whatItDoes }]
      }
    );
  }

  function buildRepositoryModules(repoModel) {
    return MODULE_BLUEPRINT.map((module) => ({
      id: module.id,
      title: getLocalizedModuleTitle(module.id, module.title),
      icon: module.icon,
      shortDescription: getLocalizedModuleDescription(module.id, module.shortDescription),
      group: module.group,
      priority: module.priority,
      status: module.status || "",
      linkTarget: repoModel.htmlUrl || "",
      content: buildModuleContent(module.id, repoModel)
    })).sort((left, right) => {
      const leftRank = MODULE_GROUP_RANK[left.group] || Number.MAX_SAFE_INTEGER;
      const rightRank = MODULE_GROUP_RANK[right.group] || Number.MAX_SAFE_INTEGER;
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.priority - right.priority;
    });
  }

  function buildRepositoryModel(repo) {
    const score = computeSignal(repo);
    const detectedType = detectProjectType(repo);
    const profile = getRepositoryProfile(repo.name);
    const projectType = profile && profile.roleKey ? profile.roleKey : detectedType;
    const derivedDomains = deriveDomains(repo, projectType);
    const domains = profile && profile.domains.length
      ? dedupe(profile.domains.concat(derivedDomains)).slice(0, 3)
      : derivedDomains;
    const topicTags = (Array.isArray(repo.topics) ? repo.topics : [])
      .map(normalizeTopic)
      .filter(Boolean)
      .slice(0, 6);
    const baselineTags = dedupe([repo.language].concat(topicTags).filter(Boolean));
    const tags = profile ? dedupe(profile.tags.concat(baselineTags)).slice(0, 8) : baselineTags.slice(0, 8);
    const whatItIs = profile && profile.whatItIs ? profile.whatItIs : buildRole(projectType);
    const whatItDoes = profile && profile.does ? profile.does : buildDescription(repo);
    const whyItMatters = profile && profile.matters ? profile.matters : deriveImportance(repo, projectType);
    const stack = profile && profile.stack ? profile.stack : buildStack(repo);
    const key = normalizeRepoIdentifier(repo.name || "");

    const model = {
      id: String(repo.id || repo.name || ""),
      key,
      name: String(repo.name || ""),
      htmlUrl: String(repo.html_url || ""),
      description: whatItDoes,
      projectType,
      role: buildRole(projectType),
      whatItIs,
      whatItDoes,
      whyItMatters,
      stack,
      tags,
      domains,
      stars: Number(repo.stargazers_count || 0),
      forks: Number(repo.forks_count || 0),
      score,
      lastUpdated: repo.pushed_at || repo.updated_at || repo.created_at || null,
      sourceStatus: "loaded"
    };

    model.modules = buildRepositoryModules(model);
    return model;
  }

  function buildMissingTargetRepository(target) {
    const copy = getCopy();
    const profile = getRepositoryProfile(target.key);
    const display = String(target.display || "");
    const segments = display.split("/").filter(Boolean);
    const repoName = segments.length ? segments[segments.length - 1] : display;
    const owner = segments.length > 1 ? segments[segments.length - 2] : String(CONFIG.githubUsername || "").trim();
    const githubUrl = owner && repoName ? `https://github.com/${owner}/${repoName}` : "#";
    const roleKey = profile && profile.roleKey ? profile.roleKey : "softwareProject";
    const whatItIs = profile && profile.whatItIs ? profile.whatItIs : buildRole(roleKey);
    const whatItDoes = profile && profile.does ? profile.does : copy.targetMissingDoes;
    const whyItMatters = profile && profile.matters ? profile.matters : copy.targetMissingMatters;
    const stack = profile && profile.stack ? profile.stack : copy.targetMissingStack;
    const tags = dedupe(
      (profile && Array.isArray(profile.tags) ? profile.tags : []).concat([copy.targetTagTargeted, copy.targetTagPending])
    ).slice(0, 8);
    const domains = profile && profile.domains.length ? profile.domains.slice(0, 3) : [];

    const model = {
      id: `target-missing-${target.key}`,
      key: target.key,
      name: repoName || target.key,
      htmlUrl: githubUrl,
      description: whatItDoes,
      projectType: roleKey,
      role: buildRole(roleKey),
      whatItIs,
      whatItDoes,
      whyItMatters,
      stack,
      tags,
      domains,
      stars: 0,
      forks: 0,
      score: -100,
      lastUpdated: null,
      sourceStatus: "missing",
      targetDisplay: display
    };

    model.modules = buildRepositoryModules(model);
    return model;
  }

  function curateRepositories(rawRepositories) {
    const includeSet = new Set((CONFIG.includeRepos || []).map((name) => normalizeRepoIdentifier(name)));
    const excludeSet = new Set((CONFIG.excludeRepos || []).map((name) => normalizeRepoIdentifier(name)));

    return rawRepositories
      .filter((repo) => {
        if (!CONFIG_USERNAME_KEY) return true;
        const ownerKey = String((repo.owner && repo.owner.login) || "").trim().toLowerCase();
        return ownerKey === CONFIG_USERNAME_KEY;
      })
      .map((repo) => ({ repo, score: computeSignal(repo) }))
      .filter((entry) => shouldKeepRepo(entry.repo, entry.score, includeSet, excludeSet))
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return new Date(right.repo.pushed_at).getTime() - new Date(left.repo.pushed_at).getTime();
      })
      .slice(0, CONFIG.maxProjects)
      .map((entry) => buildRepositoryModel(entry.repo));
  }

  function pickFeaturedRepositories(repositories) {
    const featuredNames = new Set((CONFIG.featuredRepos || []).map((name) => normalizeRepoIdentifier(name)));
    if (!repositories.length) return [];

    if (featuredNames.size) {
      const explicit = repositories.filter((repo) => featuredNames.has(normalizeRepoIdentifier(repo.name)));
      if (explicit.length) return explicit.slice(0, CONFIG.maxFeatured);
    }

    return repositories.slice(0, CONFIG.maxFeatured);
  }

  function evaluateTargetCoverage(repositories) {
    const loadedKeys = new Set((repositories || []).map((repo) => repo.key || normalizeRepoIdentifier(repo.name || "")));
    const items = TARGET_REPOSITORIES.map((target) => ({
      key: target.key,
      display: target.display,
      loaded: loadedKeys.has(target.key)
    }));

    return {
      items,
      missingCount: items.reduce((count, item) => count + (item.loaded ? 0 : 1), 0)
    };
  }

  function findRepositoryByKey(key) {
    const repoKey = normalizeRepoIdentifier(key);
    if (!repoKey || !state.data) return null;
    return state.data.repositories.find((repo) => repo.key === repoKey) || null;
  }

  function findRepositoryByName(name) {
    return findRepositoryByKey(name);
  }

  function readCache(ignoreTtl) {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      if (!ignoreTtl) {
        const age = Date.now() - Number(parsed.cachedAt || 0);
        if (!(age >= 0 && age <= CACHE_TTL_MS)) return null;
      }
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function writeCache(rawPublicRepos, syncMeta) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          cachedAt: Date.now(),
          rawPublicRepos,
          syncMeta
        })
      );
    } catch (_) {}
  }

  function readHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function writeHistory(entries) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 24)));
    } catch (_) {}
  }

  function pushHistory(type, meta) {
    const next = [
      {
        id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        timestamp: new Date().toISOString(),
        meta: meta || {}
      }
    ].concat(readHistory());
    writeHistory(next);
    state.syncHistory = readHistory();
  }

  async function fetchRepositories(username) {
    const repositories = [];
    let page = 1;
    const perPage = 100;
    const maxPages = PERFORMANCE_PROFILE.maxRepoPages;
    const targetCount = Math.max(CONFIG.maxProjects + 18, TARGET_REPOSITORIES.length * 6, 60);
    let partial = false;

    while (page <= maxPages) {
      const endpoint = `https://api.github.com/users/${encodeURIComponent(
        username
      )}/repos?type=owner&sort=updated&per_page=${perPage}&page=${page}`;

      const response = await fetch(endpoint, {
        headers: { Accept: "application/vnd.github+json" }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error (${response.status})`);
      }

      const chunk = await response.json();
      if (!Array.isArray(chunk) || !chunk.length) break;
      repositories.push(...chunk);

      if (chunk.length < perPage) break;
      if (repositories.length >= targetCount && page >= 2) {
        partial = true;
        break;
      }
      if (page === maxPages) {
        partial = true;
        break;
      }
      page += 1;
    }

    return { repositories, partial };
  }

  function buildData(rawPublicRepos, syncMeta) {
    const curated = curateRepositories(rawPublicRepos || []);
    const coverage = evaluateTargetCoverage(curated);
    const missingTargets = coverage.items.filter((item) => !item.loaded);
    const repositories = curated.concat(missingTargets.map((target) => buildMissingTargetRepository(target)));
    const featured = pickFeaturedRepositories(repositories);

    let mode = "live";
    if (syncMeta.errorMessage) {
      mode = repositories.length ? "stale" : "placeholder";
    } else if (!curated.length) {
      mode = "placeholder";
    } else if (syncMeta.partialHint || coverage.missingCount > 0) {
      mode = "partial";
    }

    const repoEvents = repositories
      .filter((repo) => repo.lastUpdated && repo.sourceStatus !== "missing")
      .sort((left, right) => new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime())
      .slice(0, 16)
      .map((repo) => ({
        id: `repo-${repo.id}-${repo.lastUpdated || "na"}`,
        type: "repo-update",
        timestamp: repo.lastUpdated,
        meta: { repoName: repo.name }
      }));

    const activityEntries = state.syncHistory
      .concat(repoEvents)
      .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
      .slice(0, MAX_ACTIVITY_ENTRIES);

    return {
      repositories,
      featured,
      activityEntries,
      sync: {
        mode,
        lastSyncAt: syncMeta.lastSyncAt || null,
        source: syncMeta.source || getCopy().syncSourceTemplate(CONFIG.githubUsername || ""),
        fetchedCount: curated.length,
        errorMessage: syncMeta.errorMessage || "",
        targetCoverage: coverage.items
      }
    };
  }

  function materializeData() {
    state.data = buildData(state.rawPublicRepos, state.syncMeta);
    if (!state.data) return;

    if (state.ui.selectedRepoId && !findRepositoryByKey(state.ui.selectedRepoId)) {
      state.ui.selectedRepoId = null;
    }

    if (!state.ui.selectedRepoId && state.data.repositories.length) {
      state.ui.selectedRepoId = state.data.repositories[0].key;
    }

    const selected = state.ui.selectedRepoId ? findRepositoryByKey(state.ui.selectedRepoId) : null;
    if (!selected || !Array.isArray(selected.modules) || !selected.modules.length) {
      state.ui.activeModuleId = "installation";
      return;
    }

    const hasSelectedModule = selected.modules.some((module) => module.id === state.ui.activeModuleId);
    if (!hasSelectedModule) {
      state.ui.activeModuleId = selected.modules[0].id;
    }
  }

  function getFreshnessText(lastSyncAt) {
    const copy = getCopy();
    if (!lastSyncAt) return copy.freshnessNever;
    const stamp = new Date(lastSyncAt).getTime();
    if (Number.isNaN(stamp)) return copy.freshnessNever;

    const minutes = Math.max(Math.floor((Date.now() - stamp) / 60000), 0);
    if (minutes <= 1) return copy.freshnessNow;
    if (minutes < 60) return copy.freshnessMinutes(minutes);
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return copy.freshnessHours(hours);
    return copy.freshnessDays(Math.floor(hours / 24));
  }

  function getEffectiveMode(sync) {
    if (!sync) return "placeholder";
    if (sync.mode !== "live") return sync.mode;
    if (!sync.lastSyncAt) return "live";
    const minutes = Math.floor((Date.now() - new Date(sync.lastSyncAt).getTime()) / 60000);
    if (minutes > 240) return "stale";
    return "live";
  }

  function getDomainLabel(domainKey) {
    const copy = getCopy();
    return (copy.domainLabels && copy.domainLabels[domainKey]) || domainKey;
  }

  function buildDisplayTags(repo) {
    const domainTags = (repo.domains || []).map((domain) => getDomainLabel(domain));
    return dedupe([repo.role].concat(repo.tags || []).concat(domainTags)).slice(0, 8);
  }

  function getFilteredRepositories() {
    if (!state.data) return [];
    const queryText = state.ui.repoQuery.trim().toLowerCase();
    const featuredPriority = new Map(
      (state.data.featured || []).map((repo, index) => [normalizeRepoIdentifier(repo.key || repo.name), index])
    );

    const filtered = state.data.repositories.filter((repo) => {
      if (!queryText) return true;
      const haystack = [repo.name, repo.role, repo.whatItDoes, repo.stack, (repo.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(queryText);
    });

    filtered.sort((left, right) => {
      const leftPriority = featuredPriority.has(left.key) ? featuredPriority.get(left.key) : Number.MAX_SAFE_INTEGER;
      const rightPriority = featuredPriority.has(right.key) ? featuredPriority.get(right.key) : Number.MAX_SAFE_INTEGER;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return new Date(right.lastUpdated || 0).getTime() - new Date(left.lastUpdated || 0).getTime();
    });

    return filtered;
  }

  function getSelectedRepository() {
    if (!state.data || !state.ui.selectedRepoId) return null;
    return findRepositoryByKey(state.ui.selectedRepoId);
  }

  function setActiveModule(moduleId, options) {
    const normalized = normalizeModuleId(moduleId);
    if (state.ui.activeModuleId === normalized && !(options && options.force)) return;
    state.ui.activeModuleId = normalized;

    const shouldSyncHash = !(options && options.syncHash === false);
    if (shouldSyncHash) {
      const current = String(window.location.hash || "").replace(/^#/, "");
      if (current !== normalized) window.location.hash = normalized;
    }
    renderCurrentView();
  }

  function setSelectedRepository(repoKey, options) {
    const normalized = normalizeRepoIdentifier(repoKey);
    if (!normalized) return;
    if (state.ui.selectedRepoId === normalized && !(options && options.force)) return;

    state.ui.selectedRepoId = normalized;
    const url = new URL(window.location.href);
    url.searchParams.set("repo", normalized);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    renderCurrentView();
  }

  function renderGlobalStatus() {
    const copy = getCopy();
    if (!state.data) {
      if (dom.statusLine) dom.statusLine.textContent = state.isLoading ? copy.statusSyncing : copy.statusWaiting;
      if (dom.modeBadge) {
        dom.modeBadge.dataset.state = state.isLoading ? "syncing" : "placeholder";
        dom.modeBadge.textContent = copy.modeLabels[state.isLoading ? "syncing" : "placeholder"];
      }
      return;
    }

    if (state.isLoading) {
      if (dom.statusLine) dom.statusLine.textContent = copy.statusSyncing;
      if (dom.modeBadge) {
        dom.modeBadge.dataset.state = "syncing";
        dom.modeBadge.textContent = copy.modeLabels.syncing;
      }
      return;
    }

    const mode = getEffectiveMode(state.data.sync);
    const modeLabel = copy.modeLabels[mode] || mode;
    const syncText = state.data.sync.lastSyncAt
      ? `${copy.lastSyncPrefix} ${formatDateTime(state.data.sync.lastSyncAt)}`
      : copy.neverSynced;

    if (dom.statusLine) dom.statusLine.textContent = copy.statusLine(modeLabel, syncText);
    if (dom.modeBadge) {
      dom.modeBadge.dataset.state = mode;
      dom.modeBadge.textContent = modeLabel;
    }
  }

  function renderRepositorySidebar() {
    if (!dom.repoSidebarList) return;
    const copy = getCopy();
    const repositories = getFilteredRepositories();

    if (!repositories.length) {
      dom.repoSidebarList.innerHTML = `
        <article class="code-empty-state">
          <p>${escapeHtml(copy.noRepositoriesLoaded)}</p>
        </article>
      `;
      return;
    }

    dom.repoSidebarList.innerHTML = repositories
      .map((repo) => {
        const selected = repo.key === state.ui.selectedRepoId ? " is-selected" : "";
        return `
          <button
            type="button"
            class="code-repo-sidebar-item${selected}"
            data-code-select-repo="${escapeHtml(repo.key)}"
          >
            <span class="code-repo-sidebar-name">${escapeHtml(repo.name)}</span>
            <span class="code-repo-sidebar-meta">${escapeHtml(repo.role)} · ${escapeHtml(formatDate(repo.lastUpdated))}</span>
          </button>
        `;
      })
      .join("");
  }

  function renderModuleSidebar(repo) {
    if (!dom.moduleGroups) return;
    const copy = getCopy();
    if (!repo || !Array.isArray(repo.modules)) {
      dom.moduleGroups.innerHTML = `
        <article class="code-empty-state">
          <p>${escapeHtml(copy.selectRepoForModules || "")}</p>
        </article>
      `;
      return;
    }

    const grouped = MODULE_GROUPS.map((group) => ({
      group,
      modules: repo.modules
        .filter((module) => module.group === group.id)
        .sort((left, right) => left.priority - right.priority)
    }));

    dom.moduleGroups.innerHTML = grouped
      .map(({ group, modules }) => {
        if (!modules.length) return "";
        const depthState = group.rank <= 2 ? "entry" : group.rank <= 4 ? "core" : "deep";
        const groupTitle = getLocalizedModuleGroupTitle(group.id, group.title);
        return `
          <section class="code-module-group" data-depth="${escapeHtml(depthState)}">
            <h3 class="code-module-group-title">${escapeHtml(groupTitle)}</h3>
            <div class="code-module-list">
              ${modules
                .map((module) => {
                  const isActive = module.id === state.ui.activeModuleId ? " is-active" : "";
                  const statusBadge = module.status
                    ? `<span class="code-module-status">${escapeHtml(module.status)}</span>`
                    : "";

                  return `
                    <button
                      type="button"
                      class="code-module-link${isActive}"
                      data-code-select-module="${escapeHtml(module.id)}"
                    >
                      <span class="code-module-icon">${escapeHtml(module.icon)}</span>
                      <span class="code-module-text">
                        <span class="code-module-title">${escapeHtml(module.title)}</span>
                        <span class="code-module-description">${escapeHtml(module.shortDescription)}</span>
                      </span>
                      ${statusBadge}
                    </button>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
  }

  function renderWorkspaceFrame(repo) {
    const copy = getCopy();
    if (!repo) {
      if (dom.workspaceKicker) dom.workspaceKicker.textContent = copy.workspaceKickerDefault || "";
      if (dom.workspaceTitle) dom.workspaceTitle.textContent = copy.workspaceWaitingTitle || "";
      if (dom.workspaceIntro) dom.workspaceIntro.textContent = copy.workspaceWaitingIntro || "";
      if (dom.workspaceStack) dom.workspaceStack.textContent = "--";
      if (dom.workspaceUpdated) dom.workspaceUpdated.textContent = "--";
      if (dom.workspaceLink) dom.workspaceLink.href = "#";
      if (dom.workspaceLink) dom.workspaceLink.textContent = copy.openOnGithub || "Open on GitHub";
      return;
    }

    if (dom.workspaceKicker) dom.workspaceKicker.textContent = repo.role;
    if (dom.workspaceTitle) dom.workspaceTitle.textContent = repo.name;
    if (dom.workspaceIntro) {
      const introTemplate = copy.workspaceIntroTemplate;
      dom.workspaceIntro.textContent = typeof introTemplate === "function" ? introTemplate(repo) : `${repo.whatItIs} ${repo.whatItDoes}`;
    }
    if (dom.workspaceStack) dom.workspaceStack.textContent = repo.stack;
    if (dom.workspaceUpdated) dom.workspaceUpdated.textContent = `${copy.workspaceUpdatedPrefix || ""} ${formatDate(repo.lastUpdated)}`.trim();
    if (dom.workspaceLink) dom.workspaceLink.href = repo.htmlUrl || "#";
    if (dom.workspaceLink) dom.workspaceLink.textContent = copy.openOnGithub || "Open on GitHub";
  }

  function renderModulePanel(repo) {
    if (!dom.modulePanel) return;
    const copy = getCopy();
    if (!repo || !Array.isArray(repo.modules) || !repo.modules.length) {
      dom.modulePanel.innerHTML = `
        <article class="code-empty-state">
          <p>${escapeHtml(copy.modulesUnavailable || "")}</p>
        </article>
      `;
      return;
    }

    const active = repo.modules.find((module) => module.id === state.ui.activeModuleId) || repo.modules[0];
    if (active.id !== state.ui.activeModuleId) state.ui.activeModuleId = active.id;
    const groupMeta = MODULE_GROUPS.find((group) => group.id === active.group);
    const moduleIndex = repo.modules.findIndex((module) => module.id === active.id);
    const deeperCount = Math.max(repo.modules.length - moduleIndex - 1, 0);
    const groupCount = MODULE_GROUPS.filter((group) => repo.modules.some((module) => module.group === group.id)).length;
    const sourceCoverage = (state.data && state.data.sync && state.data.sync.targetCoverage
      ? state.data.sync.targetCoverage.find((item) => item.key === repo.key)
      : null) || { loaded: repo.sourceStatus !== "missing" };
    const statusLine = sourceCoverage.loaded
      ? copy.sourceCoverageLoadedText || ""
      : copy.sourceCoveragePendingText || "";
    const modulePanelCopy = copy.modulePanel || {};
    const orientationCopy = copy.orientation || {};
    const moduleIdLabel = modulePanelCopy.moduleIdLabel || "Module ID";
    const deeperLabel = typeof modulePanelCopy.deeperLabel === "function"
      ? modulePanelCopy.deeperLabel(deeperCount)
      : `${deeperCount}`;
    const orientationDepthText = typeof orientationCopy.depthText === "function"
      ? orientationCopy.depthText(repo.modules.length, groupCount)
      : `${repo.modules.length}`;

    const sections = Array.isArray(active.content && active.content.sections) ? active.content.sections : [];

    dom.modulePanel.innerHTML = `
      <header class="code-module-panel-head">
        <p class="code-module-panel-kicker">${escapeHtml(groupMeta ? groupMeta.title : "MODULE")}</p>
        <h3>${escapeHtml(active.title)}</h3>
        <p class="meta">${escapeHtml((active.content && active.content.summary) || active.shortDescription || "")}</p>
        <div class="code-tag-row">
          <span class="code-tag">${escapeHtml(moduleIdLabel)}: ${escapeHtml(active.id)}</span>
          <span class="code-tag">${escapeHtml(statusLine)}</span>
          <span class="code-tag">${escapeHtml(deeperLabel)}</span>
        </div>
      </header>

      <section class="code-module-orientation" aria-label="${escapeHtml(orientationCopy.title || "")}">
        <h4>${escapeHtml(orientationCopy.title || "")}</h4>
        <div class="code-module-orientation-grid">
          <article>
            <p class="code-summary-label">${escapeHtml(orientationCopy.whatIs || "")}</p>
            <p>${escapeHtml(repo.whatItIs || repo.role)}</p>
          </article>
          <article>
            <p class="code-summary-label">${escapeHtml(orientationCopy.whatCanDo || "")}</p>
            <p>${escapeHtml(repo.whatItDoes)}</p>
          </article>
          <article>
            <p class="code-summary-label">${escapeHtml(orientationCopy.whereStart || "")}</p>
            <p>${escapeHtml(orientationCopy.startPath || "")}</p>
          </article>
          <article>
            <p class="code-summary-label">${escapeHtml(orientationCopy.depth || "")}</p>
            <p>${escapeHtml(orientationDepthText)}</p>
          </article>
        </div>
      </section>

      <div class="code-module-panel-sections">
        ${sections
          .map((section) => {
            const body = section.body ? `<p>${escapeHtml(section.body)}</p>` : "";
            const list = Array.isArray(section.list) && section.list.length
              ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : "";
            return `
              <section class="code-module-section">
                <h4>${escapeHtml(section.title || "Section")}</h4>
                ${body}
                ${list}
              </section>
            `;
          })
          .join("")}
      </div>

      <footer class="code-module-panel-footer">
        <p class="meta">${escapeHtml(modulePanelCopy.footerStartPoint || "")}</p>
        <a class="code-project-link" href="${escapeHtml(active.linkTarget || repo.htmlUrl || "#")}" target="_blank" rel="noopener noreferrer">${escapeHtml(
          modulePanelCopy.openSourceReference || ""
        )}</a>
      </footer>
    `;
  }

  function renderCurrentView() {
    const copy = getCopy();
    if (dom.sidebarMeta) dom.sidebarMeta.textContent = copy.sidebarMeta || "";
    const shellTitle = document.querySelector("[data-code-shell-title]");
    if (shellTitle) shellTitle.textContent = copy.shellTitle || "";
    const statusLabel = document.querySelector("[data-code-status-label]");
    if (statusLabel) statusLabel.textContent = copy.statusLabel || "";
    const modeLabel = document.querySelector("[data-code-mode-label]");
    if (modeLabel) modeLabel.textContent = copy.modeLabelText || "";
    const repositoriesLabel = document.querySelector("[data-code-repositories-label]");
    if (repositoriesLabel) repositoriesLabel.textContent = copy.repositoriesLabel || "";
    const searchLabel = document.querySelector("[data-code-search-label]");
    if (searchLabel) searchLabel.textContent = copy.searchLabel || "";
    const modulesLabel = document.querySelector("[data-code-modules-label]");
    if (modulesLabel) modulesLabel.textContent = copy.modulesLabel || "";
    if (dom.repoSearchInput) {
      dom.repoSearchInput.placeholder = copy.searchPlaceholderDocs || copy.searchPlaceholder || "";
    }
    renderGlobalStatus();
    const selectedRepo = getSelectedRepository();
    renderRepositorySidebar();
    renderModuleSidebar(selectedRepo);
    Array.from(document.querySelectorAll(".code-sidebar-entry-link")).forEach((button) => {
      const moduleId = normalizeModuleId(button.dataset.codeSelectModule);
      const key = button.dataset.codeEntryKey || moduleId;
      const entryText = copy.entryLabels && copy.entryLabels[key] ? copy.entryLabels[key] : getLocalizedModuleTitle(moduleId, moduleId);
      button.textContent = entryText;
      button.classList.toggle("is-active", Boolean(selectedRepo) && state.ui.activeModuleId === moduleId);
      button.disabled = !selectedRepo;
    });
    renderWorkspaceFrame(selectedRepo);
    renderModulePanel(selectedRepo);
  }

  async function syncData(options) {
    const force = Boolean(options && options.force);
    const manual = Boolean(options && options.manual);

    if (state.isLoading) return;
    state.isLoading = true;
    renderCurrentView();
    if (manual) pushHistory("manual-sync", {});

    const username = String(CONFIG.githubUsername || "").trim();
    if (!username) {
      state.rawPublicRepos = [];
      state.syncMeta = {
        lastSyncAt: null,
        source: "--",
        errorMessage: "GitHub username is missing in CODE_PORTFOLIO_CONFIG.",
        partialHint: true
      };
      pushHistory("sync-error", { message: state.syncMeta.errorMessage });
      materializeData();
      state.isLoading = false;
      renderCurrentView();
      return;
    }

    const cached = readCache(false);
    if (!force && cached) {
      state.rawPublicRepos = Array.isArray(cached.rawPublicRepos) ? cached.rawPublicRepos : [];
      state.syncMeta = Object.assign(
        {
          lastSyncAt: null,
          source: getCopy().syncSourceTemplate(username),
          errorMessage: "",
          partialHint: false
        },
        cached.syncMeta || {}
      );
      state.syncHistory = readHistory();
      materializeData();
      state.isLoading = false;
      renderCurrentView();
      return;
    }

    try {
      const response = await fetchRepositories(username);
      state.rawPublicRepos = response.repositories;
      state.syncMeta = {
        lastSyncAt: new Date().toISOString(),
        source: getCopy().syncSourceTemplate(username),
        errorMessage: "",
        partialHint: Boolean(response.partial)
      };

      state.syncHistory = readHistory();
      materializeData();
      const mode = state.data ? state.data.sync.mode : "live";
      pushHistory("sync-success", {
        count: state.data ? state.data.sync.fetchedCount : 0,
        mode
      });
      state.syncHistory = readHistory();
      materializeData();
      writeCache(state.rawPublicRepos, state.syncMeta);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error.";
      pushHistory("sync-error", { message });
      state.syncHistory = readHistory();

      const fallback = readCache(true);
      if (fallback) {
        state.rawPublicRepos = Array.isArray(fallback.rawPublicRepos) ? fallback.rawPublicRepos : [];
        state.syncMeta = Object.assign(
          {
            lastSyncAt: null,
            source: getCopy().syncSourceTemplate(username),
            errorMessage: message,
            partialHint: false
          },
          fallback.syncMeta || {},
          { errorMessage: message }
        );
      } else {
        state.rawPublicRepos = [];
        state.syncMeta = {
          lastSyncAt: null,
          source: getCopy().syncSourceTemplate(username),
          errorMessage: message,
          partialHint: true
        };
      }
      materializeData();
      console.warn("Code system sync fallback mode", error);
    } finally {
      state.isLoading = false;
      renderCurrentView();
    }
  }

  function bindControls() {
    if (dom.repoSearchInput) {
      dom.repoSearchInput.addEventListener("input", () => {
        state.ui.repoQuery = String(dom.repoSearchInput.value || "");
        renderCurrentView();
      });
    }

    document.addEventListener("click", (event) => {
      const repoButton = event.target.closest("[data-code-select-repo]");
      if (repoButton) {
        setSelectedRepository(repoButton.dataset.codeSelectRepo, { syncHash: false });
        return;
      }

      const moduleButton = event.target.closest("[data-code-select-module]");
      if (moduleButton) {
        setActiveModule(moduleButton.dataset.codeSelectModule, { syncHash: true });
        return;
      }

    });

    window.addEventListener("hashchange", () => {
      const nextModuleId = getInitialModuleId();
      if (nextModuleId === state.ui.activeModuleId) return;
      state.ui.activeModuleId = nextModuleId;
      renderCurrentView();
    });
  }

  function bindLanguageObserver() {
    const observer = new MutationObserver(() => {
      materializeData();
      renderCurrentView();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }

  function initHeavyControllers() {
    const codeWallIntroStore = PERFORMANCE_PROFILE.allowIntroLock ? createCodeWallIntroStore() : null;
    const rainHeroController = createRainHeroController();
    if (rainHeroController) rainHeroController.init();
    const breathStoryController = createBreathStoryController(codeWallIntroStore);
    if (breathStoryController) breathStoryController.init();
    const telemetryWallController = createTelemetryWallController(codeWallIntroStore);
    if (telemetryWallController) telemetryWallController.init();
  }

  function init() {
    state.syncHistory = readHistory();
    applyPerformanceProfile(PERFORMANCE_PROFILE);
    const codeHeaderController = createCodeHeaderController();
    if (codeHeaderController) codeHeaderController.init();
    const nestedScrollHandoffController = createNestedScrollHandoffController();
    if (nestedScrollHandoffController) nestedScrollHandoffController.init();
    bindControls();
    bindLanguageObserver();
    renderCurrentView();
    scheduleDeferredTask(initHeavyControllers, {
      delayMs: PERFORMANCE_PROFILE.heavyInitDelayMs,
      timeoutMs: PERFORMANCE_PROFILE.heavyInitDelayMs + 240
    });
    scheduleDeferredTask(() => {
      void syncData({ force: false, manual: false });
    }, {
      delayMs: PERFORMANCE_PROFILE.syncDelayMs,
      timeoutMs: PERFORMANCE_PROFILE.syncDelayMs + 240
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
