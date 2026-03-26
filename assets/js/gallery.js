"use strict";

(function () {
  const IMAGE_BASE_PATH = "./assets/images/";
  const MANIFEST_PATH = `${IMAGE_BASE_PATH}gallery-manifest.json`;
  const INLINE_MANIFEST_KEY = "__GALLERY_IMAGES__";
  const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  const LIGHTBOX_CLOSE_DELAY_MS = 300;
  const INITIAL_RENDER_BATCH = 8;
  const RENDER_BATCH_SIZE = 10;
  const PRIORITY_IMAGE_COUNT = 4;
  const EAGER_SOURCE_COUNT = 6;
  const OBSERVER_ROOT_MARGIN = "360px 0px";
  const CURATED_IMAGE_SEQUENCE = [
    "photo1-optimized.jpg",
    "photo6-optimized.jpg",
    "DSC00186.jpeg",
    "IMG_9816.JPG",
    "photo4-optimized.jpg",
    "IMG_2959.jpeg",
    "IMG_2237.jpeg",
    "photo7-optimized.jpg",
    "photo5-optimized.jpg",
    "IMG_1885.jpeg",
    "IMG_3905.jpeg",
    "photo3-optimized.jpg",
    "IMG_2846.jpeg",
    "IMG_3308.jpeg"
  ];
  // Default gap handling for the top gallery composition:
  // keep the right-side column visually full with an editorial note panel.
  const TOP_FEATURE_NOTE_COPY = Object.freeze({
    en: {
      kicker: "Series Note",
      body: "Between ridge, cloud, and settlement, scale softens into silence."
    },
    zh: {
      kicker: "系列注记",
      body: "在山脊、云层与聚落之间，尺度感悄然归于宁和"
    }
  });

  function hasSupportedExtension(filename) {
    const dot = filename.lastIndexOf(".");
    if (dot === -1) return false;
    const extension = filename.slice(dot).toLowerCase();
    return SUPPORTED_EXTENSIONS.has(extension);
  }

  function normalizeImageList(list) {
    if (!Array.isArray(list)) return [];
    const filtered = [];

    list.forEach((name) => {
      if (typeof name !== "string" || !hasSupportedExtension(name)) return;
      const trimmed = name.trim();
      if (!trimmed.length) return;
      filtered.push(trimmed);
    });

    return dedupeImages(filtered);
  }

  function safeDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (_) {
      return value;
    }
  }

  function canonicalImageKey(filename) {
    return safeDecodeURIComponent(filename)
      .toLowerCase()
      .replace(/\.[^/.]+$/, "")
      .replace(/-optimized$/, "")
      .replace(/\s+copy(?:\s*\d+)?$/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const IMAGE_METADATA = Object.freeze({
    photo1: {
      title: "Silence I",
      location: "Western China",
      caption: "Cloud shadow and terrain settle into one tone.",
      size: "featured"
    },
    photo3: {
      title: "Quiet Courtyard",
      location: "Central China",
      caption: "Architecture and cedar hold the same stillness.",
      size: "standard"
    },
    photo4: {
      title: "Bridge and Haze",
      location: "Chongqing, China",
      caption: "The city appears between guardrails and summer haze.",
      size: "featured"
    },
    photo5: {
      title: "Blue Hour Crossing",
      location: "Atlantic Coast",
      caption: "Light lingers just before the horizon disappears.",
      size: "standard"
    },
    photo6: {
      title: "After Rain",
      location: "Sichuan, China",
      caption: "A walled garden opens toward low clouds.",
      size: "standard"
    },
    photo7: {
      title: "Harbor Weather",
      location: "New York, United States",
      caption: "A distant skyline emerges after the rain.",
      size: "panoramic"
    },
    dsc00186: {
      title: "Field Settlement",
      location: "Southwest China",
      caption: "Homes remain small against the scale of the valley.",
      size: "featured"
    },
    img_9816: {
      title: "Cloud Line",
      location: "Southwest China",
      caption: "Fog breaks and reforms along the ridge.",
      size: "standard"
    },
    img_2237: {
      title: "Ring Road",
      location: "China",
      caption: "Traffic settles into a shared tempo.",
      size: "standard"
    },
    img_2846: {
      title: "Shibuya Walk",
      location: "Tokyo, Japan",
      caption: "Pedestrian flow redraws the frame every second.",
      size: "tall"
    },
    img_2959: {
      title: "Approach",
      location: "Los Angeles, United States",
      caption: "The city arrives first as pattern, then as place.",
      size: "tall"
    },
    img_3308: {
      title: "Evening Air",
      location: "Northeast United States",
      caption: "Color fades slowly before night.",
      size: "wide"
    },
    img_3905: {
      title: "Times Square, 11:42 PM",
      location: "New York, United States",
      caption: "Crowd movement and light compete for attention.",
      size: "featured"
    },
    img_1885: {
      title: "Encore Speedway",
      location: "Boston, United States",
      caption: "Artificial light sharpens every turn.",
      size: "wide"
    }
  });

  function imagePreferenceScore(filename) {
    const lower = filename.toLowerCase();
    const ext = lower.slice(lower.lastIndexOf("."));
    let score = 0;

    if (lower.includes("-optimized")) score += 100;
    if (ext === ".webp") score += 30;
    if (ext === ".jpg" || ext === ".jpeg") score += 20;
    if (ext === ".png") score += 10;
    if (/\bcopy\b/.test(lower)) score -= 10;

    return score;
  }

  function dedupeImages(list) {
    const selected = new Map();

    list.forEach((filename, index) => {
      const key = canonicalImageKey(filename);
      if (!key) return;

      const candidate = {
        filename,
        index,
        score: imagePreferenceScore(filename)
      };

      const existing = selected.get(key);
      if (!existing) {
        selected.set(key, candidate);
        return;
      }

      if (candidate.score > existing.score) {
        selected.set(key, candidate);
        return;
      }

      if (
        candidate.score === existing.score &&
        candidate.filename.localeCompare(existing.filename) < 0
      ) {
        selected.set(key, candidate);
      }
    });

    return Array.from(selected.values())
      .sort((a, b) => a.index - b.index)
      .map((item) => item.filename);
  }

  function encodePathSegment(segment) {
    return encodeURIComponent(segment).replace(/%2F/g, "/");
  }

  function toImageUrl(filename) {
    return `${IMAGE_BASE_PATH}${encodePathSegment(filename)}`;
  }

  function toImageLabel(filename) {
    const decoded = safeDecodeURIComponent(filename);
    const withoutExtension = decoded.replace(/\.[^/.]+$/, "");
    const normalized = withoutExtension
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return normalized.length ? normalized : "Gallery image";
  }

  function wrapIndex(index, total) {
    return ((index % total) + total) % total;
  }

  function selectPreferredByKey(filenames) {
    const selected = new Map();

    filenames.forEach((filename) => {
      const key = canonicalImageKey(filename);
      if (!key) return;
      const existing = selected.get(key);
      if (!existing) {
        selected.set(key, filename);
        return;
      }
      if (imagePreferenceScore(filename) > imagePreferenceScore(existing)) {
        selected.set(key, filename);
      }
    });

    return selected;
  }

  function applyCuratedSequence(files) {
    const byKey = selectPreferredByKey(files);
    const curated = [];

    CURATED_IMAGE_SEQUENCE.forEach((filename) => {
      const key = canonicalImageKey(filename);
      const preferred = byKey.get(key);
      if (preferred) curated.push(preferred);
    });

    if (curated.length) return curated;
    return files;
  }

  function getImageMetadata(filename) {
    return IMAGE_METADATA[canonicalImageKey(filename)] || null;
  }

  function getInlineManifestImages() {
    const inline = window[INLINE_MANIFEST_KEY];
    const normalized = normalizeImageList(inline);
    return applyCuratedSequence(normalized);
  }

  function normalizeHrefToFilename(href) {
    const sanitized = href.split("#")[0].split("?")[0].trim();
    if (!sanitized || sanitized === "/" || sanitized.endsWith("/")) return "";
    try {
      return decodeURIComponent(sanitized.split("/").pop() || "");
    } catch (_) {
      return sanitized.split("/").pop() || "";
    }
  }

  async function loadImagesFromDirectoryListing() {
    const response = await fetch(IMAGE_BASE_PATH, { cache: "no-store" });
    if (!response.ok) return [];

    const html = await response.text();
    if (!html.includes("<a")) return [];

    const parsed = new DOMParser().parseFromString(html, "text/html");
    const links = Array.from(parsed.querySelectorAll("a[href]"));
    const fromListing = links
      .map((link) => normalizeHrefToFilename(link.getAttribute("href") || ""))
      .filter((name) => name.length > 0);

    const normalized = normalizeImageList(fromListing);
    return applyCuratedSequence(normalized);
  }

  async function loadImages() {
    const inline = getInlineManifestImages();
    if (inline.length) return inline;

    try {
      const listed = await loadImagesFromDirectoryListing();
      if (listed.length) return listed;
    } catch (_) {}

    const response = await fetch(MANIFEST_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Gallery source request failed: ${response.status}`);
    }

    const payload = await response.json();
    return applyCuratedSequence(normalizeImageList(payload.images));
  }

  function initGallery() {
    const grid = document.querySelector("[data-gallery-grid]");
    if (!grid) return;

    const status = document.querySelector("[data-gallery-status]");
    const emptyState = document.querySelector("[data-gallery-empty]");
    const lightbox = document.querySelector("[data-gallery-lightbox]");
    const lightboxImage = document.querySelector("[data-gallery-lightbox-image]");
    const lightboxMeta = document.querySelector("[data-gallery-lightbox-meta]");
    const lightboxCount = document.querySelector("[data-gallery-lightbox-count]");
    const lightboxTitle = document.querySelector("[data-gallery-lightbox-title]");
    const lightboxLocation = document.querySelector("[data-gallery-lightbox-location]");
    const lightboxCaption = document.querySelector("[data-gallery-lightbox-caption]");
    const closeControls = document.querySelectorAll("[data-gallery-lightbox-close]");
    const closeButton = document.querySelector(".gallery-lightbox-close");
    const prevButton = document.querySelector("[data-gallery-prev]");
    const nextButton = document.querySelector("[data-gallery-next]");

    if (
      !status ||
      !emptyState ||
      !lightbox ||
      !lightboxImage ||
      !lightboxMeta ||
      !lightboxCount ||
      !lightboxTitle ||
      !lightboxLocation ||
      !lightboxCaption ||
      !closeControls.length ||
      !closeButton ||
      !prevButton ||
      !nextButton
    ) {
      return;
    }

    let imageRecords = [];
    let activeIndex = -1;
    let activeTrigger = null;
    let closeTimer = 0;
    const preloadedUrls = new Set();
    let imageObserver = null;
    let pendingRenderFrame = 0;
    let topFeatureNote = null;

    function toImageRecord(filename) {
      const fallbackLabel = toImageLabel(filename);
      const meta = getImageMetadata(filename) || {};
      const title = meta.title || fallbackLabel;
      const location = meta.location || "";
      const caption = meta.caption || "";
      return {
        label: title,
        title,
        location,
        caption,
        size: meta.size || "standard",
        url: toImageUrl(filename)
      };
    }

    function getImageRecord(index) {
      if (index < 0 || index >= imageRecords.length) return null;
      return imageRecords[index];
    }

    function preloadImage(record) {
      if (!record || preloadedUrls.has(record.url)) return;
      const preload = new Image();
      preload.src = record.url;
      preloadedUrls.add(record.url);
    }

    function setImageSource(imageElement) {
      if (!imageElement) return;
      const pendingSrc = imageElement.dataset.src;
      if (!pendingSrc) return;
      imageElement.src = pendingSrc;
      imageElement.removeAttribute("data-src");
    }

    function observeImage(imageElement) {
      if (!imageElement) return;
      if (!imageElement.dataset.src) return;
      if (!imageObserver) {
        setImageSource(imageElement);
        return;
      }
      imageObserver.observe(imageElement);
    }

    function preloadAdjacent(index) {
      if (imageRecords.length < 2) return;
      const nextIndex = wrapIndex(index + 1, imageRecords.length);
      const prevIndex = wrapIndex(index - 1, imageRecords.length);
      preloadImage(getImageRecord(nextIndex));
      preloadImage(getImageRecord(prevIndex));
    }

    function syncLightbox() {
      const record = getImageRecord(activeIndex);
      if (!record) return;
      lightboxImage.src = record.url;
      lightboxImage.alt = record.title;
      lightboxCount.textContent = `${activeIndex + 1} / ${imageRecords.length}`;
      lightboxTitle.textContent = record.title;
      lightboxCaption.textContent = record.caption || record.label;
      if (record.location) {
        lightboxLocation.hidden = false;
        lightboxLocation.textContent = record.location;
      } else {
        lightboxLocation.hidden = true;
        lightboxLocation.textContent = "";
      }
      preloadAdjacent(activeIndex);
    }

    function openLightbox(index, trigger) {
      if (!imageRecords.length) return;
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      }
      activeIndex = wrapIndex(index, imageRecords.length);
      activeTrigger = trigger || null;
      syncLightbox();
      lightbox.hidden = false;
      requestAnimationFrame(() => {
        lightbox.classList.add("is-open");
      });
      document.body.classList.add("is-lightbox-open");
      closeButton.focus();
    }

    function closeLightbox() {
      if (lightbox.hidden) return;
      lightbox.classList.remove("is-open");
      document.body.classList.remove("is-lightbox-open");
      if (closeTimer) {
        window.clearTimeout(closeTimer);
      }
      closeTimer = window.setTimeout(() => {
        lightbox.hidden = true;
        if (activeTrigger) {
          activeTrigger.focus();
        }
        activeTrigger = null;
        closeTimer = 0;
      }, LIGHTBOX_CLOSE_DELAY_MS);
    }

    function moveLightbox(step) {
      if (activeIndex === -1 || !imageRecords.length) return;
      activeIndex = wrapIndex(activeIndex + step, imageRecords.length);
      syncLightbox();
    }

    function createGalleryItem(record, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-full-item";
      button.dataset.index = String(index);
      if (record.size === "featured") button.classList.add("is-featured");
      if (record.size === "panoramic") button.classList.add("is-panoramic");
      if (record.size === "tall") button.classList.add("is-tall");
      if (record.size === "wide") button.classList.add("is-wide");
      button.setAttribute(
        "aria-label",
        record.location ? `${record.title}, ${record.location}` : record.title
      );

      const image = document.createElement("img");
      if (index < PRIORITY_IMAGE_COUNT) {
        image.fetchPriority = "high";
      } else {
        image.fetchPriority = "low";
      }
      image.alt = record.label;
      image.loading = "lazy";
      image.decoding = "async";
      if (index < EAGER_SOURCE_COUNT) {
        image.src = record.url;
      } else {
        image.dataset.src = record.url;
      }
      button.appendChild(image);

      const meta = document.createElement("span");
      meta.className = "gallery-full-item-meta";
      const title = document.createElement("span");
      title.className = "gallery-full-item-title";
      title.textContent = record.title;
      meta.appendChild(title);
      if (record.location) {
        const location = document.createElement("span");
        location.className = "gallery-full-item-location";
        location.textContent = record.location;
        meta.appendChild(location);
      }
      button.appendChild(meta);

      return { button, image };
    }

    function getTopFeatureNoteCopy() {
      const lang = (document.documentElement.lang || "").toLowerCase();
      return lang.startsWith("zh") ? TOP_FEATURE_NOTE_COPY.zh : TOP_FEATURE_NOTE_COPY.en;
    }

    function syncTopFeatureNoteCopy() {
      if (!topFeatureNote) return;
      const copy = getTopFeatureNoteCopy();
      const kicker = topFeatureNote.querySelector(".gallery-full-top-note-kicker");
      const body = topFeatureNote.querySelector(".gallery-full-top-note-body");
      if (kicker) kicker.textContent = copy.kicker;
      if (body) body.textContent = copy.body;
    }

    function createTopFeatureGroup(records) {
      const topGroup = document.createElement("div");
      topGroup.className = "gallery-full-top-feature";

      const anchorItem = createGalleryItem(records[0], 0);
      anchorItem.button.classList.add("gallery-full-item--top-anchor");
      observeImage(anchorItem.image);
      topGroup.appendChild(anchorItem.button);

      const portraitGroup = document.createElement("div");
      portraitGroup.className = "gallery-full-top-portraits";

      for (let index = 1; index < 3; index += 1) {
        const portraitItem = createGalleryItem(records[index], index);
        portraitItem.button.classList.add("gallery-full-item--top-portrait");
        observeImage(portraitItem.image);
        portraitGroup.appendChild(portraitItem.button);
      }

      const note = document.createElement("aside");
      note.className = "gallery-full-top-note";
      const noteKicker = document.createElement("p");
      noteKicker.className = "gallery-full-top-note-kicker";
      const noteBody = document.createElement("p");
      noteBody.className = "gallery-full-top-note-body";
      note.appendChild(noteKicker);
      note.appendChild(noteBody);
      portraitGroup.appendChild(note);

      topGroup.appendChild(portraitGroup);
      return { topGroup, note };
    }

    function appendImageBatch(records, startIndex, batchSize) {
      const fragment = document.createDocumentFragment();
      const end = Math.min(startIndex + batchSize, records.length);

      for (let index = startIndex; index < end; index += 1) {
        const { button, image } = createGalleryItem(records[index], index);
        observeImage(image);
        fragment.appendChild(button);
      }

      grid.appendChild(fragment);
      return end;
    }

    function renderImages(records) {
      if (pendingRenderFrame) {
        window.cancelAnimationFrame(pendingRenderFrame);
        pendingRenderFrame = 0;
      }

      grid.replaceChildren();
      topFeatureNote = null;
      if (!records.length) return;

      let renderedCount = 0;
      if (records.length >= 3) {
        const topFeature = createTopFeatureGroup(records);
        grid.appendChild(topFeature.topGroup);
        topFeatureNote = topFeature.note;
        syncTopFeatureNoteCopy();
        renderedCount = 3;
      }

      const initialBatchSize = Math.max(0, INITIAL_RENDER_BATCH - renderedCount);
      renderedCount = appendImageBatch(records, renderedCount, initialBatchSize);

      function flushRemaining() {
        renderedCount = appendImageBatch(records, renderedCount, RENDER_BATCH_SIZE);
        if (renderedCount < records.length) {
          pendingRenderFrame = window.requestAnimationFrame(flushRemaining);
          return;
        }
        pendingRenderFrame = 0;
      }

      if (renderedCount < records.length) {
        pendingRenderFrame = window.requestAnimationFrame(flushRemaining);
      }
    }

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveLightbox(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveLightbox(-1);
      }
    });

    closeControls.forEach((button) => {
      button.addEventListener("click", closeLightbox);
    });
    prevButton.addEventListener("click", () => moveLightbox(-1));
    nextButton.addEventListener("click", () => moveLightbox(1));
    grid.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest(".gallery-full-item");
      if (!trigger || !grid.contains(trigger)) return;

      const index = Number(trigger.dataset.index);
      if (!Number.isInteger(index)) return;
      openLightbox(index, trigger);
    });
    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      button.addEventListener("click", () => {
        window.requestAnimationFrame(syncTopFeatureNoteCopy);
      });
    });

    loadImages()
      .then((files) => {
        if ("IntersectionObserver" in window) {
          imageObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const target = entry.target;
                if (!(target instanceof HTMLImageElement)) return;
                setImageSource(target);
                imageObserver.unobserve(target);
              });
            },
            {
              rootMargin: OBSERVER_ROOT_MARGIN
            }
          );
        }

        imageRecords = files.map(toImageRecord);
        preloadedUrls.clear();
        status.hidden = true;
        if (!imageRecords.length) {
          emptyState.hidden = false;
          return;
        }
        emptyState.hidden = true;
        renderImages(imageRecords);
      })
      .catch((error) => {
        status.hidden = true;
        emptyState.hidden = false;
        console.error(error);
      });
  }

  document.addEventListener("DOMContentLoaded", initGallery);
})();
