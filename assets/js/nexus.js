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
            uniform vec2 u_css_resolution;
      uniform vec2 u_pointer;
      uniform float u_dot_pitch;
      uniform float u_time;

      void main() {
        // The grid lives in CSS pixels, so dots stay circular at every aspect ratio.
        // A dot's OUTER radius never exceeds 0.29 of its cell: at least 73.5%
        // of the continuous surface is black even if every cell is fully lit.
        vec2 pixel = v_uv * u_css_resolution;
        vec2 cell = floor(pixel / u_dot_pitch);
        vec2 center = (cell + 0.5) * u_dot_pitch;
        vec2 p = (center - u_css_resolution * 0.5)
          / min(u_css_resolution.x, u_css_resolution.y) * 3.6;
        float t = u_time;

        // A flowing height field, not a sliding texture: folds deform together.
        vec2 q = p + vec2(
          0.46 * sin(p.y * 0.87 + t * 0.52),
          0.34 * cos(p.x * 0.72 - t * 0.41)
        );
        q += 0.19 * vec2(
          sin(p.y * 1.9 - p.x * 0.6 - t * 0.31),
          cos(p.x * 1.4 + p.y * 0.4 + t * 0.28)
        );
        vec2 delta = p - u_pointer * 1.1;
        float influence = exp(-dot(delta, delta) * 0.65);
        q += u_pointer * 0.19
          + influence * vec2(-delta.y, delta.x) * u_pointer.x * 0.14;

        float a = q.x * 1.12 + q.y * 0.54 + t * 0.28;
        float b = q.y * 1.18 - q.x * 0.38 - t * 0.24;
        float c = q.x * 2.0 + q.y * 0.9 + t * 0.4;
        float height = sin(a) + 0.52 * sin(b) + 0.22 * sin(c);
        vec2 slope = vec2(
          1.12 * cos(a) - 0.1976 * cos(b) + 0.44 * cos(c),
          0.54 * cos(a) + 0.6136 * cos(b) + 0.198 * cos(c)
        );
        vec3 normal = normalize(vec3(-slope * 0.85, 1.0));
        vec3 light = normalize(vec3(-0.55, 0.8, 1.1));
        vec3 halfVector = normalize(light + vec3(0.0, 0.0, 1.0));
        float specular = pow(max(dot(normal, halfVector), 0.0), 20.0);
        float ridge = exp(-pow((height - 0.23) / 0.36, 2.0));
        float diffuse = max(dot(normal, light), 0.0);
        float illumination = clamp(0.014 + ridge * (0.8 + 0.35 * diffuse)
          + specular * smoothstep(-0.6, 0.5, height) * 0.3, 0.0, 1.0);

        float radius = mix(0.035, 0.29, pow(illumination, 0.55));
        float distanceToDot = length(fract(pixel / u_dot_pitch) - 0.5);
        float coverage = 1.0 - smoothstep(max(radius - 0.07, 0.0), radius, distanceToDot);
        float visibility = smoothstep(0.012, 0.12, illumination);
        float energy = 0.1 + 0.9 * pow(illumination, 0.7);
        float temperature = 0.5 + 0.5 * sin(q.y * 0.75 - q.x * 0.3 + t * 0.12);
        vec3 silver = mix(vec3(0.69, 0.82, 0.94), vec3(1.0, 0.95, 0.87), temperature);
        silver = mix(vec3(0.94, 0.96, 0.96), silver, 0.27);
        vec3 black = vec3(0.002, 0.003, 0.004);
        vec3 color = mix(black, silver * energy, coverage * visibility);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    let program;
    let timeUniform;
    let cssResolutionUniform;
    let pointerUniform;
    let dotPitchUniform;
    let cssWidth = 1;
    let cssHeight = 1;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0 };
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
      cssResolutionUniform = gl.getUniformLocation(program, "u_css_resolution");
      pointerUniform = gl.getUniformLocation(program, "u_pointer");
      dotPitchUniform = gl.getUniformLocation(program, "u_dot_pitch");
      surface.dataset.renderer = "webgl";
      return true;
    }

    function draw() {
      gl.uniform2f(cssResolutionUniform, cssWidth, cssHeight);
      gl.uniform2f(pointerUniform, pointer.x, pointer.y);
      gl.uniform1f(dotPitchUniform, Math.max(3.6, Math.min(8.6, cssWidth / 112)));
      gl.uniform1f(timeUniform, elapsed * 0.34);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function resize() {
      if (!program || gl.isContextLost()) return;
      const rect = surface.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      cssWidth = width;
      cssHeight = height;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5, 2560 / width, 2160 / height, Math.sqrt(2400000 / (width * height)));
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
        const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 30;
        elapsed = (elapsed + delta) % (10000 * Math.PI);
        // Damped spring: the light field carries momentum after the pointer moves.
        pointer.vx += ((pointer.targetX - pointer.x) * 32 - pointer.vx * 10.5) * delta;
        pointer.vy += ((pointer.targetY - pointer.y) * 32 - pointer.vy * 10.5) * delta;
        pointer.x += pointer.vx * delta;
        pointer.y += pointer.vy * delta;
        lastFrame = now;
        draw();
      }
      frameId = requestAnimationFrame(tick);
    }

    function syncAnimation() {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
      surface.dataset.motion = shouldAnimate() ? "flowing" : "still";
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
    host.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || motionQuery.matches) return;
      const rect = surface.getBoundingClientRect();
      pointer.targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1) * 2 - 1));
      pointer.targetY = Math.max(-1, Math.min(1, 1 - (event.clientY - rect.top) / Math.max(rect.height, 1) * 2));
    }, { passive: true });
    host.addEventListener("pointerleave", () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    });
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
