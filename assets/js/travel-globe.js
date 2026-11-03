import * as THREE from "../vendor/three/three.module.js";
import { OrbitControls } from "../vendor/three/examples/jsm/controls/OrbitControls.js";

const EARTH_ATMOS_TEXTURE_NAME = "earth-atmos-1024.jpg";
const EARTH_NORMAL_TEXTURE_NAME = "earth-normal-1024.jpg";
const FALLBACK_COLOR_TEXTURE_URLS = [
  "https://cdn.jsdelivr.net/gh/0928Jacksha/jacksha-website@main/assets/images/earth-atmos-1024.jpg",
  "https://raw.githubusercontent.com/0928Jacksha/jacksha-website/main/assets/images/earth-atmos-1024.jpg",
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
];
const FALLBACK_NORMAL_TEXTURE_URLS = [
  "https://cdn.jsdelivr.net/gh/0928Jacksha/jacksha-website@main/assets/images/earth-normal-1024.jpg",
  "https://raw.githubusercontent.com/0928Jacksha/jacksha-website/main/assets/images/earth-normal-1024.jpg",
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
];

function uniqueUrls(urls) {
  return [...new Set(urls.filter((url) => typeof url === "string" && url.length > 0))];
}

function resolveTextureCandidates(fileName) {
  const urls = [];
  const activeScript = document.querySelector("script[data-travel-globe='true']");

  if (activeScript instanceof HTMLScriptElement && activeScript.src) {
    urls.push(new URL(`../images/${fileName}`, activeScript.src).href);
  }

  urls.push(new URL(`../assets/images/${fileName}`, window.location.href).href);
  urls.push(`/assets/images/${fileName}`);

  if (fileName === EARTH_ATMOS_TEXTURE_NAME) {
    urls.push(...FALLBACK_COLOR_TEXTURE_URLS);
  } else if (fileName === EARTH_NORMAL_TEXTURE_NAME) {
    urls.push(...FALLBACK_NORMAL_TEXTURE_URLS);
  }

  return uniqueUrls(urls);
}

function createEmergencyEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGradient.addColorStop(0, "#2d476e");
  oceanGradient.addColorStop(1, "#16263d");
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const continents = [
    [160, 170, 130, 100, 0.2],
    [280, 300, 120, 90, -0.3],
    [420, 180, 150, 110, 0.1],
    [535, 270, 95, 80, -0.4],
    [655, 150, 210, 130, 0.06],
    [820, 255, 120, 95, 0.32]
  ];
  ctx.fillStyle = "#7b9f6a";
  continents.forEach(([x, y, w, h, rot]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

const visitedLocations = [
  { id: "egypt", en: "Egypt", zh: "埃及", lat: 26.8, lng: 30.8 },
  { id: "libya", en: "Libya", zh: "利比亚", lat: 27.0, lng: 17.0 },
  { id: "morocco", en: "Morocco", zh: "摩洛哥", lat: 31.8, lng: -7.1 },
  { id: "bahamas", en: "Bahamas", zh: "巴哈马", lat: 25.0, lng: -77.4 },
  { id: "bvi", en: "British Virgin Islands", zh: "英属维京群岛", lat: 18.42, lng: -64.64 },
  { id: "finland", en: "Finland", zh: "芬兰", lat: 64.5, lng: 26.0 },
  { id: "sweden", en: "Sweden", zh: "瑞典", lat: 62.0, lng: 15.0 },
  { id: "norway", en: "Norway", zh: "挪威", lat: 61.0, lng: 8.0 },
  { id: "uk", en: "United Kingdom", zh: "英国", lat: 54.8, lng: -3.0 },
  { id: "france", en: "France", zh: "法国", lat: 46.2, lng: 2.2 },
  { id: "spain", en: "Spain", zh: "西班牙", lat: 40.4, lng: -3.7 },
  { id: "portugal", en: "Portugal", zh: "葡萄牙", lat: 39.4, lng: -8.2 },
  { id: "italy", en: "Italy", zh: "意大利", lat: 42.6, lng: 12.5 },
  { id: "albania", en: "Albania", zh: "阿尔巴尼亚", lat: 41.2, lng: 20.2 },
  { id: "andorra", en: "Andorra", zh: "安道尔", lat: 42.5, lng: 1.6 },
  { id: "austria", en: "Austria", zh: "奥地利", lat: 47.5, lng: 14.5 },
  { id: "azerbaijan", en: "Azerbaijan", zh: "阿塞拜疆", lat: 40.4, lng: 47.7 },
  { id: "belgium", en: "Belgium", zh: "比利时", lat: 50.8, lng: 4.5 },
  { id: "bosnia", en: "Bosnia and Herzegovina", zh: "波黑", lat: 44.2, lng: 17.7 },
  { id: "bulgaria", en: "Bulgaria", zh: "保加利亚", lat: 42.7, lng: 25.5 },
  { id: "croatia", en: "Croatia", zh: "克罗地亚", lat: 45.2, lng: 15.4 },
  { id: "czechia", en: "Czechia", zh: "捷克", lat: 49.8, lng: 15.5 },
  { id: "denmark", en: "Denmark", zh: "丹麦", lat: 56.0, lng: 9.3 },
  { id: "estonia", en: "Estonia", zh: "爱沙尼亚", lat: 58.7, lng: 25.0 },
  { id: "germany", en: "Germany", zh: "德国", lat: 51.2, lng: 10.4 },
  { id: "greece", en: "Greece", zh: "希腊", lat: 39.1, lng: 22.4 },
  { id: "hungary", en: "Hungary", zh: "匈牙利", lat: 47.1, lng: 19.5 },
  { id: "iceland", en: "Iceland", zh: "冰岛", lat: 64.9, lng: -18.6 },
  { id: "ireland", en: "Ireland", zh: "爱尔兰", lat: 53.1, lng: -8.0 },
  { id: "kazakhstan", en: "Kazakhstan", zh: "哈萨克斯坦", lat: 48.0, lng: 67.3 },
  { id: "latvia", en: "Latvia", zh: "拉脱维亚", lat: 56.9, lng: 24.6 },
  { id: "liechtenstein", en: "Liechtenstein", zh: "列支敦士登", lat: 47.2, lng: 9.6 },
  { id: "lithuania", en: "Lithuania", zh: "立陶宛", lat: 55.2, lng: 23.9 },
  { id: "luxembourg", en: "Luxembourg", zh: "卢森堡", lat: 49.8, lng: 6.1 },
  { id: "monaco", en: "Monaco", zh: "摩纳哥", lat: 43.73, lng: 7.42 },
  { id: "montenegro", en: "Montenegro", zh: "黑山", lat: 42.7, lng: 19.2 },
  { id: "netherlands", en: "Netherlands", zh: "荷兰", lat: 52.3, lng: 5.3 },
  { id: "north_macedonia", en: "North Macedonia", zh: "北马其顿", lat: 41.6, lng: 21.7 },
  { id: "poland", en: "Poland", zh: "波兰", lat: 52.2, lng: 19.1 },
  { id: "romania", en: "Romania", zh: "罗马尼亚", lat: 45.9, lng: 24.9 },
  { id: "san_marino", en: "San Marino", zh: "圣马力诺", lat: 43.94, lng: 12.46 },
  { id: "serbia", en: "Serbia", zh: "塞尔维亚", lat: 44.0, lng: 20.9 },
  { id: "slovakia", en: "Slovakia", zh: "斯洛伐克", lat: 48.7, lng: 19.5 },
  { id: "slovenia", en: "Slovenia", zh: "斯洛文尼亚", lat: 46.1, lng: 14.9 },
  { id: "switzerland", en: "Switzerland", zh: "瑞士", lat: 46.8, lng: 8.2 },
  { id: "turkey", en: "Turkey", zh: "土耳其", lat: 39.0, lng: 35.0 },
  { id: "vatican", en: "Vatican City", zh: "梵蒂冈", lat: 41.9, lng: 12.45 },
  { id: "china", en: "China", zh: "中国", lat: 35.8, lng: 104.1 },
  { id: "cambodia", en: "Cambodia", zh: "柬埔寨", lat: 12.7, lng: 104.9 },
  { id: "hong_kong", en: "Hong Kong", zh: "香港", lat: 22.3, lng: 114.2 },
  { id: "indonesia", en: "Indonesia", zh: "印尼", lat: -2.4, lng: 117.3 },
  { id: "israel", en: "Israel", zh: "以色列", lat: 31.0, lng: 34.8 },
  { id: "japan", en: "Japan", zh: "日本", lat: 36.2, lng: 138.2 },
  { id: "jordan", en: "Jordan", zh: "约旦", lat: 31.2, lng: 36.6 },
  { id: "lebanon", en: "Lebanon", zh: "黎巴嫩", lat: 33.9, lng: 35.8 },
  { id: "philippines", en: "Philippines", zh: "菲律宾", lat: 12.8, lng: 121.8 },
  { id: "saudi", en: "Saudi Arabia", zh: "沙特阿拉伯", lat: 24.1, lng: 45.1 },
  { id: "singapore", en: "Singapore", zh: "新加坡", lat: 1.35, lng: 103.82 },
  { id: "south_korea", en: "South Korea", zh: "韩国", lat: 36.5, lng: 127.9 },
  { id: "thailand", en: "Thailand", zh: "泰国", lat: 15.9, lng: 100.9 },
  { id: "uzbekistan", en: "Uzbekistan", zh: "乌兹别克斯坦", lat: 41.3, lng: 64.6 },
  { id: "turkmenistan", en: "Turkmenistan", zh: "土库曼斯坦", lat: 39.1, lng: 59.4 },
  { id: "usa", en: "United States", zh: "美国", lat: 39.8, lng: -98.6 },
  { id: "jinan", en: "Jinan", zh: "济南", lat: 36.65, lng: 117.12, key: true, kind: "city" },
  { id: "huangshan", en: "Huangshan", zh: "黄山", lat: 30.13, lng: 118.17, kind: "city" },
  { id: "new_york_state", en: "New York State", zh: "纽约州", lat: 43.0, lng: -75.0, key: true, kind: "region" }
];

const keyNotes = {
  egypt: {
    en: "Home to ancient pyramids and the Nile, Egypt blends millennia of history with modern life. Its desert landscapes and archaeological wonders define its global identity.",
    zh: "以金字塔和尼罗河闻名，融合了数千年古文明与现代社会 其沙漠景观与考古遗迹构成了全球独特的文化符号"
  },
  libya: {
    en: "A largely desert nation with dramatic Saharan landscapes and ancient Roman ruins. Its history spans classical civilizations and a rich cultural heritage.",
    zh: "一个以撒哈拉沙漠为主的国家，拥有壮阔自然与古罗马遗址 其历史横跨古典文明与丰富的文化传承"
  },
  morocco: {
    en: "A North African country known for Atlantic and Mediterranean coasts, old medinas, and Atlas Mountain landscapes. It blends Arab, Berber, and European influences in daily life.",
    zh: "一个位于北非的国家，以大西洋与地中海海岸、古老麦地那和阿特拉斯山脉风景闻名 阿拉伯、柏柏尔与欧洲文化在这里交汇"
  },
  bahamas: {
    en: "A tropical paradise of turquoise waters, white sand beaches, and relaxed island culture. Known for luxury resorts, diving, and vibrant marine life.",
    zh: "以碧蓝海水与白沙海滩闻名的热带天堂 这里融合了度假、潜水与轻松的岛屿生活方式"
  },
  bvi: {
    en: "A sailing haven with crystal-clear waters, secluded coves, and upscale Caribbean charm. Ideal for yachting, snorkeling, and quiet island escapes.",
    zh: "以清澈海域与私密海湾著称的航海胜地 适合帆船旅行、浮潜与高端静谧度假体验"
  },
  finland: {
    en: "A land of lakes, forests, and Northern Lights, known for its minimalist design and quiet lifestyle. It balances deep nature with cutting-edge education and technology.",
    zh: "湖泊与森林之国，以极简设计与宁静生活方式著称 极光与高质量教育体系共同塑造其独特气质"
  },
  sweden: {
    en: "A Nordic country known for design, aesthetics, and beautiful natural surroundings. Its cities are closely balanced with forests, lakes, and open space.",
    zh: "一个以设计、美学与自然环境著称的北欧国家 城市生活与森林、湖泊之间保持着鲜明平衡"
  },
  norway: {
    en: "Famous for its dramatic fjords and Arctic landscapes, Norway offers some of Europe’s most stunning natural scenery. Its wealth and sustainability shape a high-quality lifestyle.",
    zh: "以峡湾与极地风光闻名，是欧洲最壮丽的自然景观之一 高福利与可持续发展塑造高品质生活"
  },
  uk: {
    en: "A country known for royal tradition, historic cities, and scenic countryside. From London to rural estates, it offers a strong sense of cultural depth.",
    zh: "一个以王室传统、历史城市与乡村风景闻名的国家 从伦敦到乡间庄园，处处体现深厚文化层次"
  },
  france: {
    en: "Renowned for art, cuisine, and elegance, France defines cultural refinement. From Parisian life to rural vineyards, it offers a deeply aesthetic experience.",
    zh: "艺术、时尚与美食的代名词，代表文化精致感 从巴黎到葡萄园，呈现极强的审美与生活方式"
  },
  spain: {
    en: "Vibrant and diverse, Spain combines Mediterranean beaches with rich traditions like flamenco and festivals. Its regions each carry distinct identities and flavors.",
    zh: "充满活力与地域差异的国家，融合阳光与传统文化 弗拉门戈与节庆文化构成其独特魅力"
  },
  portugal: {
    en: "A coastal nation known for Atlantic views, historic cities, and maritime heritage. It offers a slower pace of life with strong cultural depth.",
    zh: "面向大西洋的海洋国家，拥有深厚航海历史 节奏舒缓且文化底蕴浓厚"
  },
  italy: {
    en: "A center of art, history, and cuisine, Italy shaped much of Western civilization. Its cities, landscapes, and lifestyle embody timeless beauty.",
    zh: "西方文明的重要发源地之一，艺术与历史极其丰富 城市、建筑与生活方式充满永恒美感"
  },
  albania: {
    en: "An emerging destination with rugged mountains and untouched Adriatic beaches. It offers authentic culture and growing tourism appeal.",
    zh: "一个逐渐兴起的旅游国家，拥有原始海岸与山地 文化真实且尚未被过度商业化"
  },
  andorra: {
    en: "A small Pyrenean country known for skiing, mountain landscapes, and tax-free shopping. It blends alpine lifestyle with compact luxury.",
    zh: "位于比利牛斯山的小国，以滑雪与免税购物闻名 融合山地风景与精致生活"
  },
  austria: {
    en: "Elegant and classical, Austria is known for music, imperial history, and alpine scenery. Vienna stands as a cultural and artistic center.",
    zh: "以古典音乐与帝国历史闻名，兼具优雅与秩序 维也纳是欧洲文化核心之一"
  },
  azerbaijan: {
    en: "A country at the meeting point of Europe and Asia, blending modern cityscapes with traditional culture. Baku is especially known for its coastline and distinctive architecture.",
    zh: "一个连接欧亚的国家，融合现代城市风貌与传统文化元素 首都巴库的海岸线与建筑景观极具辨识度"
  },
  belgium: {
    en: "Known for chocolate, beer, and beautifully preserved historic cities. Brussels, Bruges, and other cities offer a rich blend of history and urban charm.",
    zh: "以巧克力、啤酒与中世纪城市闻名 布鲁塞尔与布鲁日等城市展现出浓厚的历史与都市魅力"
  },
  bosnia: {
    en: "A Balkan country known for mountain scenery, historic towns, and layered cultural heritage. Its architecture and local atmosphere reflect a rich blend of influences.",
    zh: "一个拥有山地风景、古桥古城与多元文化遗产的巴尔干国家 其城市建筑与地方氛围展现出丰富层次"
  },
  bulgaria: {
    en: "A mix of ancient history, mountains, and Black Sea coastlines. It offers affordability alongside deep cultural heritage.",
    zh: "拥有黑海海岸与悠久历史的国家 兼具自然风光与较高性价比"
  },
  croatia: {
    en: "Known for its Adriatic coastline, islands, and historic towns like Dubrovnik. It blends Mediterranean beauty with Slavic culture.",
    zh: "以亚得里亚海海岸与历史古城闻名 融合地中海风情与东欧文化"
  },
  czechia: {
    en: "A country of preserved medieval cities and strong cultural identity. Prague stands out as one of Europe’s most beautiful capitals.",
    zh: "以保存完好的中世纪城市闻名 布拉格是欧洲最具魅力的城市之一"
  },
  denmark: {
    en: "A leader in design and quality of life, Denmark blends simplicity with innovation. Copenhagen reflects its clean, modern aesthetic.",
    zh: "以高幸福指数与设计文化著称 哥本哈根体现简约与现代感"
  },
  estonia: {
    en: "A country that combines medieval old-town charm with a modern digital lifestyle. Its historic atmosphere and contemporary urban experience fit together naturally.",
    zh: "一个兼具中世纪老城与现代数字生活气息的国家 历史氛围与当代城市体验结合得十分自然"
  },
  germany: {
    en: "A country known for engineering tradition, historic cities, and varied landscapes. From old towns to modern urban centers, it offers a strong blend of order and culture.",
    zh: "一个以工程传统、历史城市与多样景观著称的国家 从古城到现代都市，秩序与文化并存"
  },
  greece: {
    en: "A country known for ancient civilization, mythology, and island scenery. Historic ruins and Mediterranean landscapes define its unique appeal.",
    zh: "一个以古代文明、神话传统与海岛风景闻名的国家 历史遗迹与地中海景观共同构成其独特魅力"
  },
  hungary: {
    en: "Known for Budapest’s architecture and thermal baths. It blends Central European culture with unique national identity.",
    zh: "以布达佩斯建筑与温泉文化闻名 融合中欧传统与独特民族文化"
  },
  iceland: {
    en: "A land of volcanoes, glaciers, and extreme natural beauty. Its landscapes feel raw, isolated, and otherworldly.",
    zh: "火山与冰川共存的极端自然之地 景观原始且具有强烈视觉冲击"
  },
  ireland: {
    en: "Known for green landscapes, folklore, and warm culture. Its identity is shaped by history, music, and storytelling.",
    zh: "以绿色自然与文化传统著称 音乐与故事构成其精神内核"
  },
  kazakhstan: {
    en: "A vast Central Asian country with steppe landscapes and growing modern cities. It reflects both nomadic heritage and rapid development.",
    zh: "广阔草原国家，融合游牧传统与现代发展 城市与自然形成鲜明对比"
  },
  latvia: {
    en: "A Baltic country with forests, coastlines, and Art Nouveau architecture. Riga stands as a cultural and historical center.",
    zh: "波罗的海国家，拥有森林与海岸线 里加以建筑与文化闻名"
  },
  liechtenstein: {
    en: "A tiny alpine principality known for wealth, banking, and mountains. It offers exclusivity and scenic landscapes.",
    zh: "阿尔卑斯山中的小型富裕国家 以金融与自然风景著称"
  },
  lithuania: {
    en: "A Baltic nation with strong history and cultural revival. It combines medieval heritage with modern European identity.",
    zh: "历史深厚的波罗的海国家 兼具传统文化与现代欧洲身份"
  },
  luxembourg: {
    en: "A compact European country known for its multilingual culture and refined urban setting. Historic quarters and modern city life sit side by side.",
    zh: "一个小巧精致、文化多语并存的欧洲国家 历史城区与现代都市环境相互映衬"
  },
  monaco: {
    en: "A small Mediterranean destination known for coastal scenery, refined urban surroundings, and motorsport culture. Its compact yet elegant cityscape is instantly recognizable.",
    zh: "一个以海岸风景、精致城市环境与赛事文化闻名的小型地中海目的地 其密集而优雅的城市景观极具辨识度"
  },
  montenegro: {
    en: "A Balkan country with dramatic mountains and Adriatic coastline. It offers natural beauty with rising tourism appeal.",
    zh: "山地与海岸并存的国家 自然景观与旅游潜力持续上升"
  },
  netherlands: {
    en: "Known for canals, cycling culture, and beautifully ordered cityscapes. Historic towns and modern design give it a distinctive character.",
    zh: "以运河、自行车文化与整洁城市景观著称 历史城镇与现代设计共同塑造其独特气质"
  },
  north_macedonia: {
    en: "A culturally rich Balkan country with lakes, mountains, and layered history. It reflects a blend of influences.",
    zh: "文化多元的巴尔干国家 历史与自然交织"
  },
  poland: {
    en: "A resilient nation with strong history and economic growth. Its cities mix reconstruction with modern development.",
    zh: "历史坚韧、经济增长迅速 城市在重建与现代化中发展"
  },
  romania: {
    en: "A country of castles, mountains, and folklore, including Transylvania. It blends mystery with natural beauty.",
    zh: "拥有山地与传说色彩的国家 特兰西瓦尼亚赋予其神秘气质"
  },
  san_marino: {
    en: "One of the world’s oldest republics, perched on a mountain. It offers history in a compact, scenic form.",
    zh: "世界最古老共和国之一 以山城与历史著称"
  },
  serbia: {
    en: "A Balkan country with vibrant culture and complex history. Belgrade is known for its energy and nightlife.",
    zh: "文化活跃且历史复杂 贝尔格莱德充满活力与夜生活"
  },
  slovakia: {
    en: "A mountainous country with castles and natural landscapes. It offers quiet charm and Central European culture.",
    zh: "以山地与城堡景观为特色 氛围宁静且富有文化底蕴"
  },
  slovenia: {
    en: "A small but diverse country with lakes, mountains, and sustainability focus. It combines alpine and Mediterranean elements.",
    zh: "自然与可持续发展兼具的小国 融合阿尔卑斯与地中海元素"
  },
  switzerland: {
    en: "Known for precision, wealth, and alpine scenery. It represents stability, luxury, and high quality of life.",
    zh: "以精密、稳定与高品质生活著称 阿尔卑斯山景与金融实力并存"
  },
  turkey: {
    en: "A bridge between Europe and Asia with rich history and culture. Istanbul embodies its unique dual identity.",
    zh: "横跨欧亚的文化桥梁 伊斯坦布尔体现历史与现代交汇"
  },
  vatican: {
    en: "One of the world’s smallest countries, known for its religious architecture, artistic treasures, and historical significance. Though small in size, it holds remarkable cultural symbolism.",
    zh: "世界最小的国家之一，以宗教建筑、艺术收藏与历史价值闻名 其空间虽小，却拥有极高的文化象征意义"
  },
  china: {
    en: "A vast country with ancient civilization and rapid modernization. It blends tradition, scale, and economic power.",
    zh: "拥有悠久文明与高速现代化进程的国家 融合传统文化、规模与经济力量"
  },
  cambodia: {
    en: "Known for Angkor Wat and deep historical heritage. It combines ancient culture with developing modern identity.",
    zh: "以吴哥窟闻名的历史国家 古老文化与现代发展并存"
  },
  hong_kong: {
    en: "A global financial hub with dense urban skyline and East-West fusion. It is defined by efficiency, finance, and culture.",
    zh: "全球金融中心，融合东西方文化 以高密度城市与效率著称"
  },
  indonesia: {
    en: "An archipelago of thousands of islands with diverse cultures and landscapes. Bali represents its global tourism image.",
    zh: "由数千岛屿组成的国家，文化多样 巴厘岛代表其全球旅游形象"
  },
  israel: {
    en: "A country known for innovation, historic sites, and a diverse cultural landscape. Its modern cities and ancient places create a striking contrast.",
    zh: "一个以创新能力、历史遗迹与多元文化景观著称的国家 现代城市与古老地点并存，形成鲜明对比"
  },
  japan: {
    en: "A balance of tradition and cutting-edge technology. It is known for precision, culture, and refined aesthetics.",
    zh: "传统与科技高度融合的国家 以精致文化与审美著称"
  },
  jordan: {
    en: "Home to Petra and desert landscapes, rich in history. It offers cultural depth in a stable Middle Eastern setting.",
    zh: "以佩特拉与沙漠景观闻名 历史与稳定性并存"
  },
  lebanon: {
    en: "A culturally vibrant country with Mediterranean influence. Its history and resilience define its identity.",
    zh: "文化活跃且具有地中海风格 历史与现实交织"
  },
  philippines: {
    en: "An island nation with beaches, hospitality, and vibrant culture. It blends Asian roots with Western influence.",
    zh: "以海岛与热情文化著称 融合亚洲与西方影响"
  },
  saudi: {
    en: "A country known for vast desert landscapes, rich resources, and rapidly developing cities. Traditional settings and modern architecture shape its distinctive character.",
    zh: "一个拥有广阔沙漠景观、丰富资源与快速城市发展的国家 传统环境与现代建筑共同塑造其独特面貌"
  },
  singapore: {
    en: "A city destination known for clean urban landscapes, tropical greenery, and modern architecture. Its multicultural atmosphere and high-density city life feel especially well integrated.",
    zh: "一个以整洁城市景观、热带绿意与现代建筑著称的城市目的地 多元文化与高密度都市生活在这里融合得非常自然"
  },
  south_korea: {
    en: "A leader in technology, entertainment, and culture. It combines rapid growth with strong national identity.",
    zh: "科技与文化输出强国 娱乐与产业并行发展"
  },
  thailand: {
    en: "A major tourism destination known for beaches, temples, and cuisine. It balances tradition with modern tourism.",
    zh: "热门旅游国家，以海滩与美食闻名 传统与旅游经济结合紧密"
  },
  uzbekistan: {
    en: "A Silk Road country with historic cities like Samarkand. It reflects Central Asia’s rich cultural past.",
    zh: "丝绸之路核心国家之一 历史城市体现中亚文化精髓"
  },
  turkmenistan: {
    en: "A Central Asian country largely shaped by the Karakum Desert and Silk Road history. Its identity blends ancient caravan routes with a distinct modern state.",
    zh: "一个深受卡拉库姆沙漠与丝绸之路历史影响的中亚国家其国家气质融合了古代商路遗产与鲜明的现代国家形态"
  },
  usa: {
    en: "A country known for vast geography, cultural variety, and distinctive cities. From natural scenery to urban life, each region offers a different character.",
    zh: "一个拥有广阔地理、多元文化与鲜明城市风格的国家 从自然景观到都市生活，各地区都展现出不同气质"
  },
  jinan: {
    en: "Starting point of the 2017 long-range Europe road journey.",
    zh: "2017 年欧洲长途自驾的出发点"
  },
  huangshan: {
    en: "Anchor point of the 2,200 km cycling expedition with my father.",
    zh: "与父亲 2200 公里骑行远征的重要坐标"
  },
  new_york_state: {
    en: "Current study base and a new chapter in my global route.",
    zh: "当前学习生活基地，也是旅行叙事的新阶段"
  }
};

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function getLang() {
  return document.documentElement.lang === "zh-CN" ? "zh" : "en";
}

function getName(location) {
  return getLang() === "zh" ? location.zh || location.en : location.en;
}

function getDescription(location) {
  const lang = getLang();
  if (keyNotes[location.id]) {
    return keyNotes[location.id][lang];
  }
  return lang === "zh"
    ? `${location.zh || location.en}：该地点简介待补充`
    : `${location.en}: Description to be added.`;
}

function initTravelGlobe() {
  if (document.body.dataset.page !== "travel") return;

  const section = document.querySelector("[data-travel-globe-section]");
  const shell = document.querySelector("[data-travel-globe-shell]");
  const stage = document.querySelector("[data-travel-globe]");
  const tooltip = document.querySelector("[data-travel-globe-tooltip]");
  const panelTitle = document.querySelector("[data-travel-panel-title]");
  const panelBody = document.querySelector("[data-travel-panel-body]");
  const panelLink = document.querySelector("[data-travel-panel-link]");
  if (!section || !shell || !stage || !tooltip || !panelTitle || !panelBody || !panelLink) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          shell.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(section);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  const maxPixelRatio = window.matchMedia("(max-width: 900px)").matches ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
  camera.position.set(0, 0.02, 4.03);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.zoomSpeed = 0.42;
  controls.rotateSpeed = 1;
  controls.minDistance = 1.45;
  controls.maxDistance = 7.8;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.24;

  const ambient = new THREE.HemisphereLight(0xd3d0c6, 0x26282d, 0.96);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xf4ecdd, 0.92);
  keyLight.position.set(2.35, 1.55, 2.75);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xc2cbd8, 0.3);
  fillLight.position.set(-2.0, 0.9, 2.2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x7f8997, 0.58);
  rimLight.position.set(-2.2, -0.1, -2.8);
  scene.add(rimLight);

  const globeGroup = new THREE.Group();
  globeGroup.rotation.y = -Math.PI * 0.64;
  scene.add(globeGroup);

  const globeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x121316,
    emissiveIntensity: 0.12,
    roughness: 0.82,
    metalness: 0.06
  });

  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), globeMaterial);
  globeGroup.add(globe);

  const toneLayer = new THREE.Mesh(
    new THREE.SphereGeometry(1.003, 96, 96),
    new THREE.MeshBasicMaterial({ color: 0x0f1013, transparent: true, opacity: 0.06 })
  );
  globeGroup.add(toneLayer);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.055, 72, 72),
    new THREE.MeshBasicMaterial({
      color: 0x8f9bac,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    })
  );
  globeGroup.add(atmosphere);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("anonymous");
  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  function applyTexture(texture, assign, options = {}) {
    const { colorSpace = THREE.NoColorSpace } = options;
    texture.colorSpace = colorSpace;
    texture.anisotropy = anisotropy;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    assign(texture);
    globeMaterial.needsUpdate = true;
  }

  function loadTextureWithFallback(urls, onLoaded, options = {}) {
    const queue = uniqueUrls(Array.isArray(urls) ? urls : [urls]);
    const { label = "texture", onAllFailed } = options;

    function attempt(index) {
      if (index >= queue.length) {
        console.error(`[travel-globe] All ${label} paths failed`, queue);
        if (typeof onAllFailed === "function") onAllFailed();
        return;
      }

      const url = queue[index];
      textureLoader.load(
        url,
        (texture) => {
          console.info(`[travel-globe] Loaded ${label}: ${url}`);
          onLoaded(texture, url);
        },
        undefined,
        (error) => {
          console.warn(
            `[travel-globe] Failed ${label} (${index + 1}/${queue.length}): ${url}`,
            error
          );
          attempt(index + 1);
        }
      );
    }

    attempt(0);
  }

  const colorTextureUrls = resolveTextureCandidates(EARTH_ATMOS_TEXTURE_NAME);
  const normalTextureUrls = resolveTextureCandidates(EARTH_NORMAL_TEXTURE_NAME);

  loadTextureWithFallback(
    colorTextureUrls,
    (texture) => {
      applyTexture(
        texture,
        (next) => {
          globeMaterial.map = next;
        },
        { colorSpace: THREE.SRGBColorSpace }
      );
    },
    {
      label: "earth color map",
      onAllFailed: () => {
        const emergencyMap = createEmergencyEarthTexture();
        if (emergencyMap) {
          applyTexture(
            emergencyMap,
            (next) => {
              globeMaterial.map = next;
            },
            { colorSpace: THREE.SRGBColorSpace }
          );
          globeMaterial.emissiveIntensity = 0.08;
          toneLayer.material.opacity = 0.02;
          console.error("[travel-globe] Using emergency earth map fallback.");
        }
      }
    }
  );

  loadTextureWithFallback(
    normalTextureUrls,
    (texture) => {
      applyTexture(texture, (next) => {
        globeMaterial.normalMap = next;
        globeMaterial.normalScale = new THREE.Vector2(0.8, 0.8);
      });
    },
    { label: "earth normal map" }
  );

  const markerGroup = new THREE.Group();
  globeGroup.add(markerGroup);

  const markerGeometry = new THREE.SphereGeometry(0.0095, 10, 10);
  const keyMarkerGeometry = new THREE.SphereGeometry(0.0135, 12, 12);
  const markers = [];

  visitedLocations.forEach((location) => {
    const isKey = Boolean(location.key);
    const marker = new THREE.Mesh(
      isKey ? keyMarkerGeometry : markerGeometry,
      new THREE.MeshBasicMaterial({
        color: isKey ? 0xf1e6cd : 0xd4c9b1,
        transparent: true,
        opacity: isKey ? 0.94 : 0.44
      })
    );

    marker.position.copy(latLngToVector3(location.lat, location.lng, 1.012));
    marker.userData.location = location;
    marker.userData.baseScale = isKey ? 1.25 : 1;
    marker.userData.baseOpacity = isKey ? 0.94 : 0.44;
    marker.scale.setScalar(marker.userData.baseScale);
    markerGroup.add(marker);
    markers.push(marker);
  });

  const hoverGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 14, 14),
    new THREE.MeshBasicMaterial({
      color: 0xf7eedc,
      transparent: true,
      opacity: 0.24
    })
  );
  hoverGlow.visible = false;
  markerGroup.add(hoverGlow);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  let hoveredMarker = null;
  let selectedLocation = null;
  let pointerX = 0;
  let pointerY = 0;
  let lastInteractionAt = performance.now();

  function setPanel(location) {
    if (!location) return;
    panelTitle.textContent = getName(location);
    panelBody.textContent = getDescription(location);
    const hasLink = typeof location.link === "string" && location.link.length > 0;
    panelLink.hidden = !hasLink;
    if (hasLink) {
      panelLink.href = location.link;
    }
  }

  function refreshLanguageSensitiveText() {
    if (hoveredMarker) {
      tooltip.textContent = getName(hoveredMarker.userData.location);
    }
    if (selectedLocation) {
      setPanel(selectedLocation);
    }
  }

  function setHoveredMarker(nextMarker) {
    if (hoveredMarker === nextMarker) return;

    if (hoveredMarker) {
      hoveredMarker.scale.setScalar(hoveredMarker.userData.baseScale);
      hoveredMarker.material.opacity = hoveredMarker.userData.baseOpacity;
    }

    hoveredMarker = nextMarker;

    if (!hoveredMarker) {
      tooltip.hidden = true;
      hoverGlow.visible = false;
      return;
    }

    hoveredMarker.scale.setScalar(hoveredMarker.userData.baseScale * 1.8);
    hoveredMarker.material.opacity = 1;
    hoverGlow.position.copy(hoveredMarker.position);
    hoverGlow.visible = true;
    tooltip.textContent = getName(hoveredMarker.userData.location);
    tooltip.hidden = false;
  }

  function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
  }

  function onPointerMove(event) {
    updatePointer(event);
    tooltip.style.transform = `translate(${pointerX + 12}px, ${pointerY - 16}px)`;
    lastInteractionAt = performance.now();
  }

  function onPointerLeave() {
    pointer.set(2, 2);
    setHoveredMarker(null);
  }

  function onClick() {
    if (!hoveredMarker) return;
    selectedLocation = hoveredMarker.userData.location;
    setPanel(selectedLocation);
    lastInteractionAt = performance.now();
  }

  function onWheel(event) {
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);
    const globeHits = raycaster.intersectObject(globe, false);
    const rect = renderer.domElement.getBoundingClientRect();
    const dx = pointerX - rect.width * 0.5;
    const dy = pointerY - rect.height * 0.5;
    const focusRadius = Math.min(rect.width, rect.height) * 0.53;
    const inGlobeFocusZone = dx * dx + dy * dy <= focusRadius * focusRadius;
    if (globeHits.length === 0 && !inGlobeFocusZone) return;

    event.preventDefault();
    lastInteractionAt = performance.now();

    const zoomScale = Math.exp(event.deltaY * 0.0012);
    const offset = camera.position.clone().sub(controls.target);
    const nextDistance = Math.min(
      controls.maxDistance,
      Math.max(controls.minDistance, offset.length() * zoomScale)
    );
    offset.setLength(nextDistance);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);
  renderer.domElement.addEventListener("click", onClick);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

  const languageObserver = new MutationObserver(refreshLanguageSensitiveText);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(markers, false);
    setHoveredMarker(intersects.length > 0 ? intersects[0].object : null);

    controls.autoRotate = performance.now() - lastInteractionAt > 2200;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

initTravelGlobe();
