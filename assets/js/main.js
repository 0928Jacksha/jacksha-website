"use strict";

(function () {
  const STORAGE_KEY = "site-lang";
  const SUPPORTED_LANGS = ["en", "zh"];
  const DEFAULT_LANG = "en";
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
          work: "Work",
          life: "Life",
          about: "About",
          contact: "Contact"
        }
      },
      pages: {
        home: {
          meta_title: "Home | Mo Sha",
          hero_title: "Mo Sha",
          hero_intro: "This site is my ongoing profile. Read ten thousand books, travel ten thousand miles. I use it to document what I learn through travel, building, and reflection.",
          overview_title: "Site Overview",
          overview: {
            travel_title: "Travel",
            travel_body: "I have traveled across more than 60 countries. Travel is how I test perspective against reality.",
            travel_cta: "Go to Travel",
            photography_title: "Photography",
            photography_body: "Human scenes, landscapes, and long-exposure night work with a quiet film-like tone.",
            photography_cta: "Go to Photography",
            work_title: "Work",
            work_body: "Two defining journeys: a 50,000 km Europe road trip and a 2,200 km cycling expedition.",
            work_cta: "Go to Work",
            life_title: "Life",
            life_body: "Books, music, sports, art, and films that shape my daily thinking.",
            life_cta: "Go to Life"
          },
          featured_title: "Current Focus",
          featured: {
            travel_title: "Travel Scale",
            travel_body: "2017 Europe road journey from Jinan and ongoing travel across 60+ countries.",
            project_title: "Current Direction",
            project_body: "Learning across finance, applied AI, international business, and real-world systems.",
            photo_title: "Photography Focus",
            photo_body: "Film-like atmosphere, quiet moments, natural light, and long exposures.",
            media_title: "Guiding Line",
            media_body: "Read ten thousand books, travel ten thousand miles."
          },
          footer: "Mo Sha / Sha Mo"
        },
        travel: {
          meta_title: "Travel | Mo Sha",
          hero_title: "Travel",
          hero_intro: "I travel to see the world as it is, not as it is described.",
          visual_copy_a: "Beyond the known world.",
          visual_copy_b: "Things begin to shift.",
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
          maps_title: "Visited Regions and Countries",
          maps_body: "Africa: Egypt, Libya, Morocco. North America: Bahamas, British Virgin Islands. Europe: Russia, Finland, Sweden, Norway, United Kingdom, France, Spain, Portugal, Italy, Albania, Andorra, Armenia, Austria, Azerbaijan, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Cyprus, Czechia, Denmark, Estonia, Germany, Gibraltar, Greece, Hungary, Iceland, Ireland, Kazakhstan, Kosovo, Latvia, Liechtenstein, Lithuania, Luxembourg, Monaco, Montenegro, Netherlands, North Macedonia, Poland, Romania, San Marino, Serbia, Slovakia, Slovenia, Switzerland, Türkiye, Ukraine, Vatican City. Asia: China, Cambodia, Hong Kong, Indonesia, Israel, Japan, Jordan, Lebanon, Pakistan, Philippines, Saudi Arabia, Singapore, South Korea, Thailand, Uzbekistan, Turkmenistan.",
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
          meta_title: "Photography | Mo Sha",
          hero_title: "Photography",
          visual_title: "Art of Light",
          hero_intro: "Human, landscape, and long-exposure astrophotography.",
          featured_title: "Type",
          gallery_title: "Gallery",
          statement_title: "Statement",
          statement_body: "I photograph to hold brief moments of people, light, and distance before they disappear.",
          influence_title: "Influence",
          influence_aria: "Photographic influences",
          influence_item_1: "Henri Cartier-Bresson",
          influence_item_2: "Josef Koudelka",
          influence_item_3: "Daido Moriyama",
          influence_item_4: "Alec Soth",
          series1_title: "Human",
          series1_body: "People-centered scenes, real moments, and natural context.",
          series2_title: "Landscape & Long-Exposure Astro",
          series2_body: "Landscape structure, night sky timing, and patient observation.",
          collections_title: "Style",
          street_title: "Atmosphere",
          street_body: "Film-like mood and restrained visual tone.",
          landscapes_title: "Light",
          landscapes_body: "Quiet moments and natural light over staged effects.",
          portraits_title: "Influence",
          portraits_body: "Leica M6 visual atmosphere and documentary sensitivity.",
          abstract_title: "Reference",
          abstract_body: "Henri Cartier-Bresson and the discipline of timing and composition.",
          gear_title: "Working Notes",
          gear_body: "The goal is clarity and feeling, not visual excess.",
          footer: "Quiet moments, natural light, and film-like atmosphere."
        },
        work: {
          meta_title: "Work | Mo Sha",
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
          meta_title: "Life | Mo Sha",
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
          meta_title: "About | Mo Sha",
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
          meta_title: "Contact | Mo Sha",
          hero_title: "Contact",
          hero_intro: "Minimal and open. Reach out if you want to talk.",
          form_title: "Contact Form",
          form_intro: "You can leave a message here. Keep it simple.",
          name_label: "Name",
          name_placeholder: "Your name",
          email_label: "Email",
          email_placeholder: "you@example.com",
          message_label: "Message",
          message_placeholder: "Write a short message...",
          submit: "Send",
          form_status_ready: "Fill out the form and submit when ready.",
          form_status_required: "Please complete your name, email, and message.",
          form_status_invalid_email: "Please enter a valid email address.",
          form_status_success: "Thanks. Your message has been prepared in this demo form.",
          form_note: "Open to communication, collaboration, and conversations.",
          elsewhere_title: "Elsewhere",
          email_title: "Email",
          email_body: "(you can add your real email later)",
          social_title: "Social",
          social_body: "(you can add later if needed)",
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
          work: "工作",
          life: "生活",
          about: "关于",
          contact: "联系"
        }
      },
      pages: {
        home: {
          meta_title: "首页 | 沙漠",
          hero_title: "沙漠 / Mo Sha",
          hero_intro: "这是我的个人网站，也是我对自己的长期记录。读万卷书，行万里路。我通过旅行、实践和反思，逐步理解自己。",
          overview_title: "网站概览",
          overview: {
            travel_title: "旅行",
            travel_body: "走过 60 多个国家。旅行是我用真实世界校准认知的方式。",
            travel_cta: "进入旅行",
            photography_title: "摄影",
            photography_body: "以人文、风光与星空长曝光为主，保持安静克制的表达。",
            photography_cta: "进入摄影",
            work_title: "经历",
            work_body: "两段关键经历：5 万公里欧洲自驾，以及 2200 公里骑行远征。",
            work_cta: "进入工作",
            life_title: "生活",
            life_body: "书、音乐、运动、艺术和电影，构成我日常的底色。",
            life_cta: "进入生活"
          },
          featured_title: "当前关注",
          featured: {
            travel_title: "旅行尺度",
            travel_body: "2017 年欧洲自驾与 60+ 国家旅行经历，持续塑造我的世界理解。",
            project_title: "当前方向",
            project_body: "持续学习金融、AI 应用探索、国际商业，以及系统与现实之间的连接。",
            photo_title: "摄影关注",
            photo_body: "胶片质感、安静瞬间、自然光与星空长曝光。",
            media_title: "核心信念",
            media_body: "读万卷书，行万里路。"
          },
          footer: "沙漠 / Mo Sha"
        },
        travel: {
          meta_title: "旅行 | 沙漠",
          hero_title: "旅行",
          hero_intro: "我旅行，是为了看真实的世界，而不是被描述的世界。",
          visual_copy_a: "走出已知边界。",
          visual_copy_b: "很多认知会被重排。",
          globe_title: "旅行足迹",
          globe_intro: "用一个克制的地球仪呈现我到访过的地点，以及几处真正改变我视角的坐标。",
          globe_panel_kicker: "已选择地点",
          globe_panel_title_default: "选择一个地点",
          globe_panel_body_default: "悬停预览，点击查看简短记录。",
          globe_panel_link: "查看记录",
          triplog_title: "旅行规模",
          trip1_title: "欧洲自驾（2017）",
          trip1_body: "2017 年我与家人从济南出发，4 个月自驾超过 5 万公里，走过 42 个国家。",
          trip2_title: "全球足迹",
          trip2_body: "已到访 60 多个国家，覆盖非洲、北美、欧洲和亚洲。当前学习基地：美国纽约州。",
          maps_title: "到访区域与国家",
          maps_body: "非洲：埃及、利比亚、摩洛哥。北美：巴哈马、英属维京群岛。欧洲：俄罗斯、芬兰、瑞典、挪威、英国、法国、西班牙、葡萄牙、意大利、阿尔巴尼亚、安道尔、亚美尼亚、奥地利、阿塞拜疆、白俄罗斯、比利时、波黑、保加利亚、克罗地亚、塞浦路斯、捷克、丹麦、爱沙尼亚、德国、直布罗陀、希腊、匈牙利、冰岛、爱尔兰、哈萨克斯坦、科索沃、拉脱维亚、列支敦士登、立陶宛、卢森堡、摩纳哥、黑山、荷兰、北马其顿、波兰、罗马尼亚、圣马力诺、塞尔维亚、斯洛伐克、斯洛文尼亚、瑞士、土耳其、乌克兰、梵蒂冈。亚洲：中国、柬埔寨、香港、印尼、以色列、日本、约旦、黎巴嫩、巴基斯坦、菲律宾、沙特、新加坡、韩国、泰国、乌兹别克斯坦、土库曼斯坦。",
          guides_title: "为什么旅行",
          planning_title: "动机",
          planning_body: "通过不同文化与系统的对比，我能更清楚地理解世界，也更清楚地认识自己所处的位置。",
          local_title: "反思",
          local_body: "只有亲眼看见世界，才能识别自己的局限，看见认知缺口。",
          next_title: "当前落点",
          next_body: "美国（目前在纽约州学习）。",
          footer: "旅行不只是距离，更是视野与判断力的拓展。"
        },
        photography: {
          meta_title: "摄影 | 沙漠",
          hero_title: "摄影",
          visual_title: "光的艺术",
          hero_intro: "人文、风光、风光星空延时。",
          featured_title: "类型",
          gallery_title: "影像作品",
          statement_title: "声明",
          statement_body: "我拍摄，是为了留住人物、光线与距离在消失前的短暂时刻。",
          influence_title: "影响",
          influence_aria: "摄影影响来源",
          influence_item_1: "亨利·卡地亚-布列松",
          influence_item_2: "约瑟夫·寇德卡",
          influence_item_3: "森山大道",
          influence_item_4: "亚历克·索斯",
          series1_title: "人文",
          series1_body: "关注真实人物、现场关系与自然情境。",
          series2_title: "风光与星空长曝光",
          series2_body: "关注地形结构、光线变化与时间尺度。",
          collections_title: "风格",
          street_title: "氛围",
          street_body: "偏好胶片质感和克制、安静的画面情绪。",
          landscapes_title: "光线",
          landscapes_body: "偏好自然光与不刻意的瞬间。",
          portraits_title: "影响",
          portraits_body: "受到徕卡 M6 画面气质的启发。",
          abstract_title: "参考",
          abstract_body: "受到亨利·卡地亚·布列松在时机与构图上的影响。",
          gear_title: "拍摄说明",
          gear_body: "目标是清晰表达与真实感，不追求视觉堆叠。",
          footer: "胶片氛围、安静瞬间、自然光。"
        },
        work: {
          meta_title: "工作 | 沙漠",
          hero_title: "工作",
          hero_intro: "我的经历建立在真实世界的尺度、耐力与反思之上。",
          projects_title: "项目",
          project1_title: "项目一 - 欧洲自驾",
          project1_body: "2017 年，我和家人从济南出发自驾穿越欧洲，4 个月超过 5 万公里，到访 42 个国家。",
          project2_title: "项目二 - 济南至黄山往返骑行",
          project2_body: "11 岁暑假，我与父亲骑行济南到黄山再返回，全程约 2200 公里，42 天，完全依靠自身力量完成。",
          case_title: "为什么",
          case_body: "读万卷书，行万里路。这些经历不只是距离，更是对边界、耐力、独立性和认知方式的持续训练。",
          skills_title: "核心能力",
          engineering_title: "执行",
          engineering_body: "长期规划、自我管理、压力下持续推进，以及按步骤落地。",
          product_title: "思考",
          product_body: "跨文化系统观察、现实场景判断、以及从实践中提炼方法。",
          collaboration_title: "合作",
          collaboration_body: "开放沟通、合作与交流。",
          footer: "联系方式可在 Contact 页面后续补充。"
        },
        life: {
          meta_title: "生活 | 沙漠",
          hero_title: "生活",
          hero_intro: "这些内容构成了我长期学习与成长的日常背景。",
          books_title: "书",
          books_body: "《人类简史》；《巴黎圣母院》；《老人与海》；《沙丘》。",
          music_title: "音乐",
          music_body: "Antônio Carlos Jobim；King Crimson；帕格尼尼；Pink Floyd；Radiohead。",
          sports_title: "运动",
          sports_body: "网球；田径；单板滑雪。",
          art_title: "艺术",
          art_body: "MoMA；文艺复兴；贝尼尼；印象派。",
          film_title: "电影",
          film_body: "《闻香识女人》；《银翼杀手2049》；La La Land；《星际穿越》；《爆裂鼓手》。",
          footer: "保持简单，持续生长。"
        },
        about: {
          meta_title: "关于 | 沙漠",
          hero_title: "关于",
          hero_intro: "我希望通过经历、思考和探索，逐渐理解我自己。",
          bio_title: "Bio",
          bio_body: "留学生，9 年级，目前在美国纽约州学习。",
          values_title: "方向",
          value1_title: "关注",
          value1_body: "我关注金融、AI 前沿探索以及国际商业，也在思考技术与真实世界之间的连接。",
          value2_title: "不同",
          value2_body: "我与他人不同的地方，在于经历的跨度与面对这些经历的方式。我曾骑行济南到黄山往返，也去过 60 多个国家。",
          timeline_title: "经历时间线",
          timeline_body: "2017：欧洲 5 万公里自驾，42 国。11 岁：2200 公里骑行远征，42 天。持续：60+ 国家旅行经历。",
          now_title: "现在",
          now_body: "现在的我在学习，不仅是学业上的学习，更是在为未来想要成为的自己做准备。",
          footer: "这个网站是我对自己的持续诠释。"
        },
        contact: {
          meta_title: "联系 | 沙漠",
          hero_title: "联系",
          hero_intro: "保持简洁，保持开放。",
          form_title: "联系表单",
          form_intro: "你可以在这里留下简短消息。",
          name_label: "姓名",
          name_placeholder: "你的名字",
          email_label: "邮箱",
          email_placeholder: "you@example.com",
          message_label: "留言",
          message_placeholder: "写下你的留言...",
          submit: "发送",
          form_status_ready: "填写完成后即可提交。",
          form_status_required: "请完整填写姓名、邮箱和留言。",
          form_status_invalid_email: "请输入有效的邮箱地址。",
          form_status_success: "感谢提交。当前为演示表单，消息已在本地准备完成。",
          form_note: "开放沟通、合作与交流。",
          elsewhere_title: "其他方式",
          email_title: "邮箱",
          email_body: "（你可以后续补充真实邮箱）",
          social_title: "社交",
          social_body: "（如有需要可后续补充）",
          footer: "开放沟通、合作与交流。"
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
      ".hero h1, .hero .meta, .section h2, .section .card, .gallery-item"
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

  function initContactForm() {
    if (getCurrentPage() !== "contact") return;

    const form = document.querySelector("form[data-contact-form]");
    const status = document.querySelector("[data-contact-status]");
    if (!form || !status) return;

    const nameInput = form.querySelector("input[name='name']");
    const emailInput = form.querySelector("input[name='email']");
    const messageInput = form.querySelector("textarea[name='message']");
    if (!nameInput || !emailInput || !messageInput) return;

    function setStatus(key, isError) {
      status.hidden = false;
      status.classList.toggle("is-error", Boolean(isError));
      status.setAttribute("data-i18n", key);
      status.textContent = translate(key);
    }

    setStatus("page.form_status_ready", false);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const hasName = nameInput.value.trim().length > 0;
      const hasEmail = emailInput.value.trim().length > 0;
      const hasMessage = messageInput.value.trim().length > 0;

      if (!hasName || !hasEmail || !hasMessage) {
        setStatus("page.form_status_required", true);
        return;
      }

      if (!emailInput.validity.valid) {
        setStatus("page.form_status_invalid_email", true);
        return;
      }

      form.reset();
      setStatus("page.form_status_success", false);
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

    function updateTravelVisual() {
      const start = visualSection.offsetTop;
      const distance = Math.max(visualSection.offsetHeight - window.innerHeight, 1);
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
        updateTravelVisual();
      });
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
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

    function updatePhotographyVisual() {
      const start = visualSection.offsetTop;
      const distance = Math.max(visualSection.offsetHeight - window.innerHeight, 1);
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

      const layerAScale = 1 + eased * 0.046;
      const layerAX = eased * 10;
      const layerAY = eased * -12;

      const layerBScale = 1.08 - eased * 0.066;
      const layerBX = (1 - eased) * -14;
      const layerBY = (1 - eased) * 26;

      const toneAlpha = 0.16 + pulse * 0.18;
      const bloomAlpha = pulse * 0.13;
      const bloomShift = (eased - 0.5) * 26;
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
        updatePhotographyVisual();
      });
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updatePhotographyVisual();
  }

  function initTravelAutoPause() {
    if (document.body.dataset.page !== "travel") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const globeSection = document.querySelector("[data-travel-globe-section]");
    if (!globeSection) return;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let lastScrollY = window.scrollY;
    let isSnapping = false;
    let lockUntil = 0;

    function getSnapTarget() {
      const idealOffset = Math.round(clamp(window.innerHeight * 0.09, 64, 118));
      return Math.max(0, globeSection.offsetTop - idealOffset);
    }

    function maybeAutoPause() {
      const now = performance.now();
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY + 1;
      lastScrollY = currentY;

      if (!scrollingDown || isSnapping || now < lockUntil) return;

      const rect = globeSection.getBoundingClientRect();
      const enterThreshold = window.innerHeight * 0.5;
      const tooDeep = rect.top < -window.innerHeight * 0.12;
      const notEntered = rect.top > enterThreshold;

      if (tooDeep || notEntered) return;

      const snapTarget = getSnapTarget();
      if (Math.abs(currentY - snapTarget) < 28) return;

      isSnapping = true;
      lockUntil = now + 1400;

      window.scrollTo({
        top: snapTarget,
        behavior: "smooth"
      });

      window.setTimeout(() => {
        isSnapping = false;
      }, 520);
    }

    window.addEventListener("scroll", maybeAutoPause, { passive: true });
    window.addEventListener("resize", () => {
      lastScrollY = window.scrollY;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLanguageSystem();
    initMobileNav();
    initHeaderScrollState();
    initRevealMotion();
    initContactForm();
    initTravelVisualFade();
    initPhotographyVisualBlend();
    initTravelAutoPause();
  });
})();
