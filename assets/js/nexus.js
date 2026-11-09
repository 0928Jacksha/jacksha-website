"use strict";

(function () {
  const elements = document.querySelectorAll("[data-nexus-en][data-nexus-zh]");
  if (!elements.length) return;

  function translateShowcase() {
    const isChinese = document.documentElement.lang.startsWith("zh");
    elements.forEach((element) => {
      element.textContent = isChinese ? element.dataset.nexusZh : element.dataset.nexusEn;
    });
    if (document.body.dataset.page === "nexus") {
      document.title = isChinese
        ? "Nexus — 个人智能工作空间 | Jack Sha"
        : "Nexus — Personal Intelligence Workspace | Jack Sha";
    }
  }

  translateShowcase();
  new MutationObserver(translateShowcase).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();
