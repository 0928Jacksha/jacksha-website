"use strict";

(function () {
  const STORAGE_KEY = "site-lang";
  const SUPPORTED_LANGS = ["en", "zh"];
  const DEFAULT_LANG = "en";
  // Dormant pages stay in the codebase until explicitly re-enabled.
  const FEATURE_FLAGS = Object.freeze({
    work: false,
    life: false,
    about: false
  });
  let activeLang = DEFAULT_LANG;

  const TRANSLATIONS = {
    en: {
      common: {
        skip: "Skip to content",
        nav_aria: "Main navigation",
        lang_aria: "Language switch",
        lang_en: "EN",
        lang_zh: "中文",
        menu_open: "Menu",
        menu_close: "Close",
        nav: {
          home: "Home",
          travel: "Travel",
          photography: "Photography",
          about: "About",
          contact: "Contact"
        }
      },
      pages: {
        home: {
          meta_title: "Home | Jack Sha",
          hero_title: "Jack Sha",
          overview_title: "Site Overview",
          overview: {
            travel_title: "Travel",
            travel_cta: "Go to Travel",
            photography_title: "Photography",
            photography_cta: "Go to Photography"
          },
          footer: "Jack Sha / Sha Mo"
        },
        travel: {
          meta_title: "Travel | Jack Sha",
          hero_title: "Travel",
          hero_intro: "I travel to see the world as it is, not as it is described.",
          visual_copy_a: "Once you leave, distance becomes quietly familiar",
          visual_copy_b: "And the way you see the world is never quite the same again.",
          globe_title: "Travel Footprint",
          globe_intro: "A focused globe of places I have visited, with a few locations that reshaped my perspective.",
          globe_panel_kicker: "Selected place",
          globe_panel_title_default: "Choose a location",
          globe_panel_body_default: "Hover to preview. Click to open a short note.",
          globe_panel_link: "Open note",
          triplog_title: "Travel Scale",
          trip1_title: "Europe Road Journey (2017)",
          trip1_body: "Over 4 months, my family and I drove more than 50,000 km from Jinan across 42 countries.",
          trip2_title: "Global Footprint",
          trip2_body: "Visited 60+ countries across Africa, North America, Europe, and Asia. Current study base: New York State, United States.",
          maps_title: "Visited Countries by Continent",
          maps_board_aria: "Visited countries grouped by continent",
          maps_body: "Africa: Egypt, Libya, Morocco. North America: Bahamas, British Virgin Islands. Europe: Finland, Sweden, Norway, United Kingdom, France, Spain, Portugal, Italy, Albania, Andorra, Austria, Azerbaijan, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Czechia, Denmark, Estonia, Germany, Greece, Hungary, Iceland, Ireland, Kazakhstan, Latvia, Liechtenstein, Lithuania, Luxembourg, Monaco, Montenegro, Netherlands, North Macedonia, Poland, Romania, San Marino, Serbia, Slovakia, Slovenia, Switzerland, Türkiye, Vatican City. Asia: China, Cambodia, Hong Kong, Indonesia, Israel, Japan, Jordan, Lebanon, Philippines, Saudi Arabia, Singapore, South Korea, Thailand, Uzbekistan, Turkmenistan.",
          guides_title: "Why I Travel",
          planning_title: "Reason",
          planning_body: "Travel helps me understand different systems, cultures, and ways of living, and reflect on my own position within them.",
          local_title: "Reflection",
          local_body: "Only by seeing the world firsthand can I recognize my own limits and gaps in perspective.",
          next_title: "Current Base",
          next_body: "United States (currently studying in New York State).",
          footer: "Travel is not only distance; it expands perspective and judgment."
        },
        photography: {
          meta_title: "Photography | Jack Sha",
          hero_title: "Photography",
          visual_title: "The art of light",
          hero_intro: "Photographs made in transit, with attention to silence, distance, and passing human traces.",
          gallery_title: "Selected Works",
          gallery_intro: "A sequenced edit from the larger archive, with slower transitions between anchor images.",
          gallery_enter_cta: "Enter Gallery",
          gallery_pause: "Photographs made between departures and arrivals, across cities and mountain roads.",
          gallery_meta_title: "Gallery | Jack Sha",
          gallery_page_title: "Full Gallery",
          gallery_page_intro: "Browse the complete image archive.",
          gallery_back_cta: "Back to Photography Gallery",
          gallery_loading: "Loading gallery...",
          gallery_empty: "No images found in the gallery.",
          gallery_lightbox_dialog: "Image viewer",
          gallery_lightbox_close: "Close lightbox",
          gallery_lightbox_prev: "Previous image",
          gallery_lightbox_next: "Next image",
          series_title: "Series",
          series_intro: "Four ongoing threads made across multiple countries, mostly while moving between places.",
          series_aria: "Photographic series",
          series_silence_title: "Silence",
          series_silence_body: "Land and weather held at their quietest edge.",
          series_distance_title: "Distance",
          series_distance_body: "Roads, bridges, and horizons seen in motion.",
          series_night_title: "Night",
          series_night_body: "Low light, slow exposure, and after-hours atmosphere.",
          series_human_title: "Human Presence",
          series_human_body: "Figures and traces that shape a place without dominating it.",
          series_view_cta: "View selection",
          footer: "Silence, distance, and quiet light."
        },
        work: {
          meta_title: "Work | Jack Sha",
          hero_title: "Work",
          hero_intro: "My work is built through real-world scale, endurance, and reflection.",
          projects_title: "Projects",
          project1_title: "Project 1 - Europe by Road",
          project1_body: "In 2017, I traveled across Europe with my family by car. Starting from Jinan, we covered over 50,000 km in 4 months and visited 42 countries.",
          project2_title: "Project 2 - Jinan to Huangshan by Bicycle",
          project2_body: "At age 11, I cycled from Jinan to Huangshan and back with my father, about 2,200 km in 42 days, powered entirely by ourselves.",
          case_title: "Why",
          case_body: "Read ten thousand books, travel ten thousand miles. These experiences were not only about distance, but about understanding limits, building endurance, and growing independent judgment.",
          skills_title: "Strengths",
          engineering_title: "Execution",
          engineering_body: "Long-range planning, self-management, consistency under pressure, and step-by-step delivery.",
          product_title: "Thinking",
          product_body: "System observation across cultures, practical reasoning, and real-world decision perspective.",
          collaboration_title: "Collaboration",
          collaboration_body: "Open to communication, collaboration, and conversations.",
          footer: "Contact details can be added in the Contact page."
        },
        life: {
          meta_title: "Life | Jack Sha",
          hero_title: "Life",
          hero_intro: "Simple things I return to while learning and building.",
          books_title: "Books",
          books_body: "Sapiens; The Hunchback of Notre-Dame; The Old Man and the Sea; Dune.",
          music_title: "Music",
          music_body: "Antonio Carlos Jobim; King Crimson; Paganini; Pink Floyd; Radiohead.",
          sports_title: "Sports",
          sports_body: "Tennis; track and field; snowboarding.",
          art_title: "Art",
          art_body: "MoMA; Renaissance; Bernini; Impressionism.",
          film_title: "Films",
          film_body: "Scent of a Woman; Blade Runner 2049; La La Land; Interstellar; Whiplash.",
          footer: "Simple, personal, and still evolving."
        },
        about: {
          meta_title: "About | Jack Sha",
          hero_title: "About",
          hero_intro: "I try to understand myself through experience, thinking, and exploration.",
          bio_title: "Bio",
          bio_body: "I am an international student in 9th grade, currently studying in New York State, United States.",
          values_title: "Direction",
          value1_title: "Focus",
          value1_body: "I am interested in finance, AI exploration, international business, and the intersection between systems, technology, and real-world operations.",
          value2_title: "Difference",
          value2_body: "What sets me apart is the scale of my experiences and how I approach them. I have cycled from Jinan to Huangshan and back, and traveled across more than 60 countries.",
          timeline_title: "Experience Timeline",
          timeline_body: "2017: 50,000 km Europe road journey across 42 countries. Age 11: 2,200 km cycling expedition over 42 days. Ongoing: global travel across 60+ countries.",
          now_title: "Now",
          now_body: "Right now, I am focused on learning, not only academically but in a broader sense, and moving step by step toward the life I envision.",
          footer: "This site is my ongoing interpretation of who I am."
        },
        contact: {
          meta_title: "Contact | Jack Sha",
          hero_title: "Contact",
          hero_intro: "Minimal and open. Reach out if you want to talk.",
          elsewhere_title: "Elsewhere",
          email_title: "Email",
          email_copy_hint: "Click the email to copy.",
          email_copy_success: "Email copied.",
          email_copy_error: "Copy failed. Please copy it manually.",
          email_copy_aria: "Copy email address",
          social_title: "Social",
          social_kicker: "Social",
          social_heading_instagram: "Instagram",
          social_heading_snapchat: "Snapchat",
          social_support_instagram: "A visual journal, in motion.",
          social_support_snapchat: "Moments, in passing.",
          social_view: "View profile",
          social_share: "Share profile",
          social_share_aria: "Open profile sharing options",
          social_share_panel_aria: "Profile sharing options",
          social_copy_link: "Copy link",
          social_copy_handle: "Copy handle",
          social_native_share: "System share",
          social_status_copied_link: "Profile link copied.",
          social_status_copied_handle: "Handle copied.",
          social_status_copy_error: "Copy failed. Please copy manually.",
          social_status_shared: "Share sheet opened.",
          social_status_share_error: "Unable to share on this device.",
          footer: "Open to communication, collaboration, and conversations."
        }
      }
    },
    zh: {
      common: {
        skip: "跳至主要内容",
        nav_aria: "主导航",
        lang_aria: "语言切换",
        lang_en: "EN",
        lang_zh: "中文",
        menu_open: "菜单",
        menu_close: "关闭",
        nav: {
          home: "首页",
          travel: "旅行",
          photography: "摄影",
          about: "关于",
          contact: "联系"
        }
      },
      pages: {
        home: {
          meta_title: "首页 | 沙漠",
          hero_title: "沙漠",
          overview_title: "网站概览",
          overview: {
            travel_title: "旅行",
            travel_cta: "进入旅行",
            photography_title: "摄影",
            photography_cta: "进入摄影"
          },
          footer: "沙漠 / Jack Sha"
        },
        travel: {
          meta_title: "旅行 | 沙漠",
          hero_title: "旅行",
          hero_intro: "我旅行，是为了看真实的世界，而不是被描述的世界",
          visual_copy_a: "读万卷书，",
          visual_copy_b: "行万里路",
          globe_title: "旅行足迹",
          globe_intro: "用一个克制的地球仪呈现我到访过的地点，以及几处真正改变我视角的坐标",
          globe_panel_kicker: "已选择地点",
          globe_panel_title_default: "选择一个地点",
          globe_panel_body_default: "悬停预览，点击查看简短记录",
          globe_panel_link: "查看记录",
          triplog_title: "旅行规模",
          trip1_title: "欧洲自驾（2017）",
          trip1_body: "2017 年我与家人从济南出发，4 个月自驾超过 5 万公里，走过 42 个国家",
          trip2_title: "全球足迹",
          trip2_body: "已到访 60 多个国家，覆盖非洲、北美、欧洲和亚洲当前学习基地：美国纽约州",
          maps_title: "按大洲整理的到访国家",
          maps_board_aria: "按大洲分组的已到访国家",
          maps_body: "非洲：埃及、利比亚、摩洛哥北美：巴哈马、英属维京群岛欧洲：芬兰、瑞典、挪威、英国、法国、西班牙、葡萄牙、意大利、阿尔巴尼亚、安道尔、奥地利、阿塞拜疆、比利时、波黑、保加利亚、克罗地亚、捷克、丹麦、爱沙尼亚、德国、希腊、匈牙利、冰岛、爱尔兰、哈萨克斯坦、拉脱维亚、列支敦士登、立陶宛、卢森堡、摩纳哥、黑山、荷兰、北马其顿、波兰、罗马尼亚、圣马力诺、塞尔维亚、斯洛伐克、斯洛文尼亚、瑞士、土耳其、梵蒂冈亚洲：中国、柬埔寨、香港、印尼、以色列、日本、约旦、黎巴嫩、菲律宾、沙特、新加坡、韩国、泰国、乌兹别克斯坦、土库曼斯坦",
          guides_title: "为什么旅行",
          planning_title: "动机",
          planning_body: "通过不同文化与系统的对比，我能更清楚地理解世界，也更清楚地认识自己所处的位置",
          local_title: "反思",
          local_body: "只有亲眼看见世界，才能识别自己的局限，看见认知缺口",
          next_title: "当前落点",
          next_body: "美国（目前在纽约州学习）",
          footer: "旅行不只是距离，更是视野与判断力的拓展"
        },
        photography: {
          meta_title: "摄影 | 沙漠",
          hero_title: "摄影",
          visual_title: "光的艺术",
          hero_intro: "在移动中拍下的影像，关注安静、距离与人留下的痕迹",
          gallery_title: "精选作品",
          gallery_intro: "从更完整归档中抽出的顺序编辑，让主图与过渡更有呼吸",
          gallery_enter_cta: "进入画廊",
          gallery_pause: "这些照片拍于出发与抵达之间，穿过城市与山路",
          gallery_meta_title: "画廊 | 沙漠",
          gallery_page_title: "完整画廊",
          gallery_page_intro: "浏览全部影像归档",
          gallery_back_cta: "返回摄影页画廊区",
          gallery_loading: "正在加载画廊...",
          gallery_empty: "画廊中暂未找到图片",
          gallery_lightbox_dialog: "图片查看器",
          gallery_lightbox_close: "关闭查看器",
          gallery_lightbox_prev: "上一张图片",
          gallery_lightbox_next: "下一张图片",
          series_title: "系列",
          series_intro: "四条持续中的线索，拍于不同国家，多数发生在路途中",
          series_aria: "摄影系列",
          series_silence_title: "静默",
          series_silence_body: "在地形与天气最安静的边缘停留",
          series_distance_title: "距离",
          series_distance_body: "在移动中看见道路、桥梁与地平线",
          series_night_title: "夜",
          series_night_body: "低照度、慢节奏，以及夜晚的空气",
          series_human_title: "人的在场",
          series_human_body: "人物与痕迹出现，但不过度主导画面",
          series_view_cta: "查看该组",
          footer: "安静、距离与光线的笔记"
        },
        work: {
          meta_title: "工作 | 沙漠",
          hero_title: "工作",
          hero_intro: "我的经历建立在真实世界的尺度、耐力与反思之上",
          projects_title: "项目",
          project1_title: "项目一 - 欧洲自驾",
          project1_body: "2017 年，我和家人从济南出发自驾穿越欧洲，4 个月超过 5 万公里，到访 42 个国家",
          project2_title: "项目二 - 济南至黄山往返骑行",
          project2_body: "11 岁暑假，我与父亲骑行济南到黄山再返回，全程约 2200 公里，42 天，完全依靠自身力量完成",
          case_title: "为什么",
          case_body: "读万卷书，行万里路这些经历不只是距离，更是对边界、耐力、独立性和认知方式的持续训练",
          skills_title: "核心能力",
          engineering_title: "执行",
          engineering_body: "长期规划、自我管理、压力下持续推进，以及按步骤落地",
          product_title: "思考",
          product_body: "跨文化系统观察、现实场景判断、以及从实践中提炼方法",
          collaboration_title: "合作",
          collaboration_body: "开放沟通、合作与交流",
          footer: "联系方式可在 Contact 页面后续补充"
        },
        life: {
          meta_title: "生活 | 沙漠",
          hero_title: "生活",
          hero_intro: "这些内容构成了我长期学习与成长的日常背景",
          books_title: "书",
          books_body: "《人类简史》；《巴黎圣母院》；《老人与海》；《沙丘》",
          music_title: "音乐",
          music_body: "Antônio Carlos Jobim；King Crimson；帕格尼尼；Pink Floyd；Radiohead",
          sports_title: "运动",
          sports_body: "网球；田径；单板滑雪",
          art_title: "艺术",
          art_body: "MoMA；文艺复兴；贝尼尼；印象派",
          film_title: "电影",
          film_body: "《闻香识女人》；《银翼杀手2049》；La La Land；《星际穿越》；《爆裂鼓手》",
          footer: "保持简单，持续生长"
        },
        about: {
          meta_title: "关于 | 沙漠",
          hero_title: "关于",
          hero_intro: "我希望通过经历、思考和探索，逐渐理解我自己",
          bio_title: "Bio",
          bio_body: "留学生，9 年级，目前在美国纽约州学习",
          values_title: "方向",
          value1_title: "关注",
          value1_body: "我关注金融、AI 前沿探索以及国际商业，也在思考技术与真实世界之间的连接",
          value2_title: "不同",
          value2_body: "我与他人不同的地方，在于经历的跨度与面对这些经历的方式我曾骑行济南到黄山往返，也去过 60 多个国家",
          timeline_title: "经历时间线",
          timeline_body: "2017：欧洲 5 万公里自驾，42 国11 岁：2200 公里骑行远征，42 天持续：60+ 国家旅行经历",
          now_title: "现在",
          now_body: "现在的我在学习，不仅是学业上的学习，更是在为未来想要成为的自己做准备",
          footer: "这个网站是我对自己的持续诠释"
        },
        contact: {
          meta_title: "联系 | 沙漠",
          hero_title: "联系",
          hero_intro: "保持简洁，保持开放",
          elsewhere_title: "其他方式",
          email_title: "邮箱",
          email_copy_hint: "点击邮箱即可复制",
          email_copy_success: "邮箱已复制",
          email_copy_error: "复制失败，请手动复制",
          email_copy_aria: "复制邮箱地址",
          social_title: "社交",
          social_kicker: "社交",
          social_heading_instagram: "Instagram",
          social_heading_snapchat: "Snapchat",
          social_support_instagram: "在流动中记录的视觉日志",
          social_support_snapchat: "路过时刻，轻轻留存",
          social_view: "查看主页",
          social_share: "分享主页",
          social_share_aria: "打开主页分享选项",
          social_share_panel_aria: "主页分享选项",
          social_copy_link: "复制链接",
          social_copy_handle: "复制账号",
          social_native_share: "系统分享",
          social_status_copied_link: "主页链接已复制",
          social_status_copied_handle: "账号已复制",
          social_status_copy_error: "复制失败，请手动复制",
          social_status_shared: "已打开系统分享",
          social_status_share_error: "当前设备暂不支持分享",
          footer: "开放沟通、合作与交流"
        }
      }
    }
  };

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), obj);
  }

  function resolveTranslation(lang, page, key) {
    const langData = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    const fallbackData = TRANSLATIONS[DEFAULT_LANG];

    let value;

    if (key.startsWith("common.")) {
      const normalized = key.replace("common.", "");
      value = getNestedValue(langData.common, normalized);
      if (value === undefined) {
        value = getNestedValue(fallbackData.common, normalized);
      }
    } else if (key.startsWith("page.")) {
      const normalized = key.replace("page.", "");
      value = getNestedValue((langData.pages || {})[page] || {}, normalized);
      if (value === undefined) {
        value = getNestedValue((fallbackData.pages || {})[page] || {}, normalized);
      }
    } else {
      value = getNestedValue(langData, key);
      if (value === undefined) {
        value = getNestedValue(fallbackData, key);
      }
    }

    return value === undefined ? key : value;
  }

  function getCurrentPage() {
    return document.body.dataset.page || "home";
  }

  function enforcePageVisibility() {
    const page = getCurrentPage();
    if (
      (page === "work" && !FEATURE_FLAGS.work) ||
      (page === "life" && !FEATURE_FLAGS.life) ||
      (page === "about" && !FEATURE_FLAGS.about)
    ) {
      window.location.replace("../index.html");
      return false;
    }
    return true;
  }

  function translate(key, lang = activeLang) {
    return resolveTranslation(lang, getCurrentPage(), key);
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return null;
    }
  }

  function setStoredLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  function applyTranslations(lang) {
    const page = getCurrentPage();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      element.textContent = resolveTranslation(lang, page, key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      element.setAttribute("placeholder", resolveTranslation(lang, page, key));
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const raw = element.getAttribute("data-i18n-attr");
      raw.split(";").forEach((pair) => {
        const trimmed = pair.trim();
        if (!trimmed) return;
        const [attr, key] = trimmed.split(":").map((part) => part.trim());
        if (!attr || !key) return;
        element.setAttribute(attr, resolveTranslation(lang, page, key));
      });
    });

    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }

  function updateLanguageButtons(lang) {
    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      const isActive = button.getAttribute("data-lang-switch") === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setLanguage(lang) {
    const nextLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    activeLang = nextLang;
    setStoredLanguage(nextLang);
    applyTranslations(nextLang);
    updateLanguageButtons(nextLang);
  }

  function initLanguageSystem() {
    const saved = getStoredLanguage();
    const initialLang = SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;

    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      button.addEventListener("click", () => {
        setLanguage(button.getAttribute("data-lang-switch"));
      });
    });

    setLanguage(initialLang);
  }

  function initMobileNav() {
    const nav = document.querySelector(".nav");
    if (!nav || nav.querySelector(".nav-toggle")) return;

    const menu = document.createElement("div");
    menu.className = "nav-menu";
    menu.id = "site-nav-menu";

    while (nav.firstChild) {
      menu.appendChild(nav.firstChild);
    }

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", menu.id);

    nav.appendChild(toggle);
    nav.appendChild(menu);
    nav.classList.add("has-mobile-menu");

    function setMenuState(isOpen) {
      nav.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const key = isOpen ? "common.menu_close" : "common.menu_open";
      toggle.setAttribute("data-i18n", key);
      toggle.textContent = translate(key);
    }

    setMenuState(false);

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      setMenuState(!isOpen);
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenuState(false);
      }
    });

    const closeOnDesktop = () => {
      if (window.innerWidth > 640) {
        setMenuState(false);
      }
    };

    window.addEventListener("resize", closeOnDesktop);
  }

  function initHeaderScrollState() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let frame = 0;
    function updateState() {
      frame = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    function requestUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateState);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateState();
  }

  function initRevealMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll(
      ".hero h1, .hero .meta, .section h2, .section .card, .gallery-item, .gallery-full-item"
    );

    if (!targets.length) return;

    targets.forEach((target, index) => {
      target.classList.add("reveal-item");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 38}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    targets.forEach((target) => observer.observe(target));
  }

  function settleImageState(image, card) {
    if (!(image instanceof HTMLImageElement)) return;
    image.classList.remove("is-pending");
    image.classList.add("is-ready");
    if (card) {
      card.classList.remove("is-loading");
    }
  }

  function waitForImageReady(image, card) {
    if (!(image instanceof HTMLImageElement)) return;

    const finalize = () => {
      settleImageState(image, card);
    };

    if (image.complete) {
      finalize();
      return;
    }

    image.classList.add("is-pending");
    if (card) {
      card.classList.add("is-loading");
    }

    let settled = false;
    const complete = () => {
      if (settled) return;
      settled = true;
      if (typeof image.decode === "function") {
        image
          .decode()
          .catch(() => {})
          .finally(finalize);
        return;
      }
      finalize();
    };

    const fail = () => {
      if (settled) return;
      settled = true;
      finalize();
    };

    image.addEventListener("load", complete, { once: true });
    image.addEventListener("error", fail, { once: true });
  }

  function initInlineGalleryImagePolish() {
    const inlineGalleryImages = document.querySelectorAll(".gallery-item img");
    if (!inlineGalleryImages.length) return;

    inlineGalleryImages.forEach((image) => {
      const card = image.closest(".gallery-item");
      waitForImageReady(image, card);
    });
  }

  async function copyTextToClipboard(value) {
    if (!value) return false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (_) {}
    }

    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.left = "-9999px";
    fallback.style.top = "0";
    document.body.appendChild(fallback);
    fallback.focus();
    fallback.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (_) {
      copied = false;
    }

    fallback.remove();
    return copied;
  }

  function initContactEmailCopy() {
    if (getCurrentPage() !== "contact") return;

    const emailCopyTrigger = document.querySelector("[data-copy-email]");
    const emailCopyStatus = document.querySelector("[data-email-copy-status]");
    if (!emailCopyTrigger || !emailCopyStatus) return;

    function setEmailCopyStatus(key, isError) {
      if (!emailCopyStatus) return;
      emailCopyStatus.hidden = false;
      emailCopyStatus.classList.toggle("is-error", Boolean(isError));
      emailCopyStatus.setAttribute("data-i18n", key);
      emailCopyStatus.textContent = translate(key);
    }

    emailCopyTrigger.addEventListener("click", async (event) => {
      event.preventDefault();
      const emailValue = emailCopyTrigger.getAttribute("data-copy-email") || "";
      const copied = await copyTextToClipboard(emailValue);
      if (copied) {
        setEmailCopyStatus("page.email_copy_success", false);
        return;
      }
      setEmailCopyStatus("page.email_copy_error", true);
    });
  }

  function initSocialCards() {
    if (getCurrentPage() !== "contact") return;

    const cards = document.querySelectorAll("[data-social-card]");
    if (!cards.length) return;

    const canNativeShare = typeof navigator.share === "function";
    const controllers = [];

    cards.forEach((card, index) => {
      const shareToggle = card.querySelector("[data-social-share-toggle]");
      const sharePanel = card.querySelector("[data-social-share-panel]");
      const shareStatus = card.querySelector("[data-social-status]");
      const nativeShareButton = card.querySelector("[data-social-native-share]");
      const viewLink = card.querySelector("[data-social-view-link]");
      const handleLabel = card.querySelector("[data-social-handle-label]");

      const profileUrl = card.getAttribute("data-social-url") || "";
      const handle = card.getAttribute("data-social-handle") || "";
      const platform = card.getAttribute("data-social-platform") || "Social";
      const shareTitle =
        card.getAttribute("data-social-share-title") || `${platform} ${handle}`.trim();

      if (handleLabel) {
        handleLabel.textContent = handle;
      }

      if (viewLink && profileUrl) {
        viewLink.setAttribute("href", profileUrl);
      }

      if (!shareToggle || !sharePanel || !shareStatus) return;

      const panelId = sharePanel.id || `social-share-panel-${index + 1}`;
      sharePanel.id = panelId;
      shareToggle.setAttribute("aria-controls", panelId);
      shareToggle.setAttribute("aria-expanded", "false");
      sharePanel.setAttribute("aria-hidden", "true");

      function setPanelState(isOpen) {
        card.classList.toggle("is-share-open", isOpen);
        shareToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        sharePanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        sharePanel.querySelectorAll("button, a").forEach((element) => {
          if (element.hidden) {
            element.tabIndex = -1;
            return;
          }
          element.tabIndex = isOpen ? 0 : -1;
        });
      }

      function setShareStatus(key, isError) {
        shareStatus.hidden = false;
        shareStatus.classList.toggle("is-error", Boolean(isError));
        shareStatus.setAttribute("data-i18n", key);
        shareStatus.textContent = translate(key);
      }

      function flashCopiedState(target) {
        target.classList.add("is-copied");
        window.setTimeout(() => {
          target.classList.remove("is-copied");
        }, 900);
      }

      shareToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = card.classList.contains("is-share-open");
        if (!isOpen) {
          controllers.forEach((controller) => {
            if (controller.card !== card) {
              controller.setPanelState(false);
            }
          });
        }
        setPanelState(!isOpen);
      });

      card.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (!card.classList.contains("is-share-open")) return;
        setPanelState(false);
        shareToggle.focus();
      });

      card.querySelectorAll("[data-social-copy]").forEach((button) => {
        button.addEventListener("click", async () => {
          const copyType = button.getAttribute("data-social-copy");
          const value =
            copyType === "url" ? profileUrl : copyType === "handle" ? handle : "";
          const copied = await copyTextToClipboard(value);

          if (!copied) {
            setShareStatus("page.social_status_copy_error", true);
            return;
          }

          flashCopiedState(button);
          const key =
            copyType === "url"
              ? "page.social_status_copied_link"
              : "page.social_status_copied_handle";
          setShareStatus(key, false);
        });
      });

      if (nativeShareButton) {
        if (!canNativeShare || !profileUrl) {
          nativeShareButton.hidden = true;
          nativeShareButton.tabIndex = -1;
        } else {
          nativeShareButton.addEventListener("click", async () => {
            try {
              await navigator.share({
                title: shareTitle,
                text: `${platform} ${handle}`.trim(),
                url: profileUrl
              });
              setShareStatus("page.social_status_shared", false);
            } catch (error) {
              if (error && error.name === "AbortError") return;
              setShareStatus("page.social_status_share_error", true);
            }
          });
        }
      }

      if (viewLink) {
        viewLink.addEventListener("click", () => {
          setPanelState(false);
        });
      }

      setPanelState(false);
      controllers.push({ card, setPanelState });
    });

    document.addEventListener("click", (event) => {
      controllers.forEach(({ card, setPanelState }) => {
        if (!card.contains(event.target)) {
          setPanelState(false);
        }
      });
    });

    document.addEventListener("focusin", (event) => {
      controllers.forEach(({ card, setPanelState }) => {
        if (!card.contains(event.target)) {
          setPanelState(false);
        }
      });
    });
  }

  function initTravelVisualFade() {
    if (document.body.dataset.page !== "travel") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visualSection = document.querySelector("[data-travel-visual]");
    const visualPin = document.querySelector("[data-travel-visual-pin]");
    if (!visualSection || !visualPin) return;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const smoothstep = (edge0, edge1, x) => {
      const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    };

    let start = 0;
    let distance = 1;
    let isVisualInRange = true;

    function measureTravelVisual() {
      start = visualSection.offsetTop;
      distance = Math.max(visualSection.offsetHeight - window.innerHeight, 1);
    }

    function evaluateTravelVisualRange() {
      const rect = visualSection.getBoundingClientRect();
      isVisualInRange =
        rect.bottom > -window.innerHeight * 0.32 &&
        rect.top < window.innerHeight * 1.2;
    }

    function updateTravelVisual() {
      if (!isVisualInRange) return;
      const progressLinear = clamp((window.scrollY - start) / distance, 0, 1);
      const progressEased = easeInOutCubic(progressLinear);
      const colorPulse = Math.sin(progressEased * Math.PI) * 0.14;
      const copyA = 1 - smoothstep(0.18, 0.58, progressEased);
      const copyB = smoothstep(0.42, 0.88, progressEased);

      visualPin.style.setProperty("--travel-fade", progressEased.toFixed(4));
      visualPin.style.setProperty("--travel-color-alpha", colorPulse.toFixed(4));
      visualPin.style.setProperty("--travel-copy-a", copyA.toFixed(4));
      visualPin.style.setProperty("--travel-copy-b", copyB.toFixed(4));
    }

    let frame = 0;
    function requestUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        evaluateTravelVisualRange();
        updateTravelVisual();
      });
    }

    measureTravelVisual();
    evaluateTravelVisualRange();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", () => {
      measureTravelVisual();
      requestUpdate();
    });
    updateTravelVisual();
  }

  function initPhotographyVisualBlend() {
    if (document.body.dataset.page !== "photography") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visualSection = document.querySelector("[data-photo-visual]");
    const visualPin = document.querySelector("[data-photo-visual-pin]");
    if (!visualSection || !visualPin) return;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const smoothstep = (edge0, edge1, x) => {
      const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const easeInOutSine = (t) => 0.5 * (1 - Math.cos(Math.PI * t));

    let start = 0;
    let distance = 1;
    let isVisualInRange = true;

    function measurePhotographyVisual() {
      start = visualSection.offsetTop;
      distance = Math.max(visualSection.offsetHeight - window.innerHeight, 1);
    }

    function evaluatePhotographyVisualRange() {
      const rect = visualSection.getBoundingClientRect();
      isVisualInRange =
        rect.bottom > -window.innerHeight * 0.32 &&
        rect.top < window.innerHeight * 1.2;
    }

    function updatePhotographyVisual() {
      if (!isVisualInRange) return;
      const progress = clamp((window.scrollY - start) / distance, 0, 1);
      const titlePhaseEnd = 0.24;
      const transitionProgress = clamp(
        (progress - titlePhaseEnd) / (1 - titlePhaseEnd),
        0,
        1
      );
      const eased = easeInOutSine(transitionProgress);
      const blend = smoothstep(0.08, 0.9, transitionProgress);
      const pulse = Math.sin(blend * Math.PI);

      const layerAScale = 1 + eased * 0.026;
      const layerAX = eased * 6;
      const layerAY = eased * -8;

      const layerBScale = 1.05 - eased * 0.038;
      const layerBX = (1 - eased) * -10;
      const layerBY = (1 - eased) * 16;

      const toneAlpha = 0.14 + pulse * 0.12;
      const bloomEnabled = window.innerWidth > 900;
      const bloomAlpha = bloomEnabled ? pulse * 0.035 : 0;
      const bloomShift = bloomEnabled ? (eased - 0.5) * 14 : 0;
      const titleFade = smoothstep(0.02, titlePhaseEnd, progress);
      const titleAlpha = 1 - titleFade;
      const titleLift = -10 * titleFade;

      visualPin.style.setProperty("--photo-blend", blend.toFixed(4));
      visualPin.style.setProperty("--photo-layer-a-scale", layerAScale.toFixed(4));
      visualPin.style.setProperty("--photo-layer-a-x", `${layerAX.toFixed(2)}px`);
      visualPin.style.setProperty("--photo-layer-a-y", `${layerAY.toFixed(2)}px`);
      visualPin.style.setProperty("--photo-layer-b-scale", layerBScale.toFixed(4));
      visualPin.style.setProperty("--photo-layer-b-x", `${layerBX.toFixed(2)}px`);
      visualPin.style.setProperty("--photo-layer-b-y", `${layerBY.toFixed(2)}px`);
      visualPin.style.setProperty("--photo-tone-alpha", toneAlpha.toFixed(4));
      visualPin.style.setProperty("--photo-bloom-alpha", bloomAlpha.toFixed(4));
      visualPin.style.setProperty("--photo-bloom-shift", `${bloomShift.toFixed(2)}px`);
      visualPin.style.setProperty("--photo-title-alpha", titleAlpha.toFixed(4));
      visualPin.style.setProperty("--photo-title-lift", `${titleLift.toFixed(2)}px`);
    }

    let frame = 0;
    function requestUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        evaluatePhotographyVisualRange();
        updatePhotographyVisual();
      });
    }

    measurePhotographyVisual();
    evaluatePhotographyVisualRange();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", () => {
      measurePhotographyVisual();
      requestUpdate();
    });
    updatePhotographyVisual();
  }

  function initTravelGlobeLoader() {
    if (document.body.dataset.page !== "travel") return;

    const globeSection = document.querySelector("[data-travel-globe-section]");
    if (!globeSection) return;

    const scriptUrl = (document.body.getAttribute("data-travel-globe-src") || "").trim();
    if (!scriptUrl) return;

    let loaded = false;
    let observer = null;

    function loadGlobeScript() {
      if (loaded) return;
      loaded = true;

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.fetchPriority = "low";
      script.setAttribute("data-travel-globe", "true");
      script.addEventListener("error", () => {
        console.error(`Unable to load travel globe script: ${scriptUrl}`);
      });
      document.body.appendChild(script);
    }

    if (!("IntersectionObserver" in window)) {
      loadGlobeScript();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadGlobeScript();
        });
      },
      {
        rootMargin: "640px 0px",
        threshold: 0.01
      }
    );

    observer.observe(globeSection);

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        () => {
          const preloadLine = globeSection.offsetTop - window.innerHeight * 1.2;
          if (window.scrollY >= preloadLine) {
            loadGlobeScript();
          }
        },
        { timeout: 4200 }
      );
    }
  }

  function runWhenIdle(task, timeout = 1200) {
    if (typeof task !== "function") return;

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        () => {
          task();
        },
        { timeout }
      );
      return;
    }

    window.setTimeout(task, 80);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!enforcePageVisibility()) return;
    initLanguageSystem();
    initMobileNav();
    initHeaderScrollState();
    initTravelVisualFade();
    initPhotographyVisualBlend();
    initTravelGlobeLoader();
    runWhenIdle(() => {
      initInlineGalleryImagePolish();
      initRevealMotion();
      initContactEmailCopy();
      initSocialCards();
    });
  });
})();
