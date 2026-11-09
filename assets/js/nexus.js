"use strict";

(function () {
  const elements = document.querySelectorAll("[data-nexus-en][data-nexus-zh]");
  if (!elements.length) return;

  function translateShowcase() {
    const isChinese = document.documentElement.lang.startsWith("zh");
    elements.forEach((element) => {
      const copy = isChinese ? element.dataset.nexusZh : element.dataset.nexusEn;
      if (element.hasAttribute("data-nexus-paragraphs")) {
        element.replaceChildren(...copy.split(/\n\n+/).map((paragraph) => {
          const span = document.createElement("span");
          span.className = "nexus-copy__paragraph";
          span.textContent = paragraph;
          return span;
        }));
      } else {
        element.textContent = copy;
      }
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

  const surfaces = Array.from(document.querySelectorAll(".nexus-feature"));
  if (document.body.classList.contains("nexus-page")) surfaces.push(document.body);
  surfaces.forEach(createFlowBackground);

  function createFlowBackground(host) {
    const surface = document.createElement("div");
    surface.className = "nexus-flow";
    surface.setAttribute("aria-hidden", "true");
    surface.dataset.renderer = "fallback";
    const canvas = document.createElement("canvas");
    surface.appendChild(canvas);
    host.prepend(surface);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power"
    });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragmentSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.4;
        float t = u_time;

        // Broad, continuously warped folds with a soft silver edge.
        vec2 q = p + vec2(
          0.38 * sin(p.y * 1.35 + t * 0.38) + 0.18 * cos(p.x * 0.9 - t * 0.2),
          0.30 * cos(p.x * 1.05 - t * 0.3)
        );
        float fold = q.y + 0.66 * sin(q.x * 0.95 + t * 0.26)
          + 0.19 * sin(q.x * 1.9 - t * 0.34);
        float body = exp(-pow((fold + 0.08) / 0.5, 2.0));
        float edge = exp(-pow((fold + 0.45) / 0.095, 2.0));
        float shadow = exp(-pow((fold - 0.43) / 0.23, 2.0));
        float secondFold = q.y - 0.76 * cos(q.x * 0.7 - t * 0.22) - 0.8;
        float secondEdge = exp(-pow(secondFold / 0.16, 2.0));
        float sheen = 0.5 + 0.5 * sin(q.x * 0.65 + q.y * 0.8 + t * 0.15);
        float light = 0.012 + body * 0.13 + edge * (0.08 + 0.07 * sheen)
          + secondEdge * 0.065 - shadow * 0.035;
        float vignette = 1.0 - 0.35 * smoothstep(0.2, 0.78, distance(uv, vec2(0.58, 0.5)));
        vec3 color = vec3(0.83, 0.88, 0.86) * max(light, 0.008) * vignette;
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 437.585);
        color += (grain - 0.5) / 255.0;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    let program;
    let timeUniform;
    let resolutionUniform;
    let frameId = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let inView = true;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      gl.deleteShader(shader);
      return null;
    }

    function prepare() {
      const vertex = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) {
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
        return false;
      }
      program = gl.createProgram();
      if (!program) {
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        return false;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        program = null;
        return false;
      }
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      if (!buffer) {
        gl.deleteProgram(program);
        program = null;
        return false;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      timeUniform = gl.getUniformLocation(program, "u_time");
      resolutionUniform = gl.getUniformLocation(program, "u_resolution");
      surface.dataset.renderer = "webgl";
      return true;
    }

    function draw() {
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, elapsed * 0.16);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function resize() {
      if (!program || gl.isContextLost()) return;
      const rect = surface.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const scale = Math.min(window.devicePixelRatio || 1, 1.25, 1440 / width, 1000 / height);
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    }

    function shouldAnimate() {
      return program && !gl.isContextLost() && inView && !document.hidden && !motionQuery.matches;
    }

    function tick(now) {
      frameId = 0;
      if (!shouldAnimate()) return;
      if (!lastFrame || now - lastFrame >= 1000 / 30) {
        if (lastFrame) elapsed += Math.min((now - lastFrame) / 1000, 0.1);
        lastFrame = now;
        draw();
      }
      frameId = requestAnimationFrame(tick);
    }

    function syncAnimation() {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
      if (shouldAnimate()) frameId = requestAnimationFrame(tick);
    }

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      program = null;
      surface.dataset.renderer = "fallback";
      syncAnimation();
    });
    canvas.addEventListener("webglcontextrestored", () => {
      if (prepare()) {
        resize();
        syncAnimation();
      }
    });

    if (!prepare()) return;
    resize();
    document.addEventListener("visibilitychange", syncAnimation);
    motionQuery.addEventListener("change", syncAnimation);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(surface);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncAnimation();
      }).observe(surface);
    }
    syncAnimation();
  }
})();
