<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { gsap } from 'gsap';
  import type { SweepDirection } from './pageCurlTypes';

  interface Props {
    onComplete: () => void;
    direction?: 'next' | 'prev';
    radius?: number;
    duration?: number;
    mode?: 'curl' | 'ripple';
    sweep?: SweepDirection;
  }

  let {
    onComplete,
    direction = 'next',
    radius = 0.08,
    duration = 0.7,
    mode = 'curl',
    sweep = 'right-to-left',
  }: Props = $props();

  let canvasEl: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.OrthographicCamera;
  let material: THREE.ShaderMaterial;
  let animId: number;
  let disposed = false;

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Full-width shader: main effect on the right half, echo on the left half.
  // The spine is at uv.x = 0.5.
  // Right half (uv.x > 0.5): full curl/ripple effect
  // Left half (uv.x < 0.5): echo — shadow, subtle ripple, or light shift
  //   that propagates from the spine as if the page turn disturbs the left page.
  const fragmentShader = /* glsl */ `
    uniform float uProgress;
    uniform float uRadius;
    uniform vec2 uResolution;
    uniform float uSweepMode;  // 0 = horizontal, 1 = corner
    uniform float uHDir;       // +1 = right-to-left, -1 = left-to-right
    uniform vec2 uOrigin;      // corner origin for radial sweep
    uniform float uEffectMode; // 0 = curl, 1 = ripple
    uniform float uReverse;    // 0 = forward (effect on right), 1 = backward (effect on left)
    varying vec2 vUv;

    const float PI = 3.14159265;
    const float SPINE = 0.5;

    // Sweep distance for the active page (remapped to 0–1 within that half)
    float sweepDist(vec2 localUv, float progress) {
      float aspect = (uResolution.x * 0.5) / uResolution.y;

      if (uSweepMode < 0.5) {
        // Horizontal sweep
        float r = uRadius;
        float axisX = uHDir > 0.0
          ? mix(1.0 + r * 2.0, -r * 2.0, progress)
          : mix(-r * 2.0, 1.0 + r * 2.0, progress);
        return (localUv.x - axisX) * uHDir;
      } else {
        // Corner radial sweep
        vec2 localOrigin = uOrigin;
        vec2 delta = localUv - localOrigin;
        delta.x *= aspect;
        float dist = length(delta);
        float maxDist = length(vec2(aspect, 1.0));
        float sweepR = mix(-uRadius, maxDist + uRadius, progress);
        return sweepR - dist;
      }
    }

    // ── Page curl/ripple effect ──
    vec4 pageEffect(float d, float r) {
      vec3 pageColor = vec3(0.98, 0.975, 0.965);
      vec3 backColor = vec3(0.94, 0.935, 0.925);
      float alpha = 0.0;
      vec3 color = vec3(0.0);

      if (uEffectMode < 0.5) {
        // CURL
        float cd = -d;
        if (cd < -r) {
          float behindDist = -cd - r;
          float shadowDist = smoothstep(0.0, r * 2.0, behindDist);
          float shadow = (1.0 - shadowDist) * 0.12 * sin(uProgress * PI);
          color = vec3(0.0);
          alpha = shadow;
        } else if (cd < 0.0) {
          float absCd = -cd;
          float theta = asin(clamp(absCd / r, 0.0, 1.0));
          if (theta > PI * 0.35) {
            float shadow = 0.82 + 0.18 * (absCd / r);
            color = backColor * shadow;
            alpha = 1.0;
          } else {
            float light = 0.90 + 0.10 * cos(theta);
            color = pageColor * light;
            alpha = 1.0;
          }
          float shadowEdge = smoothstep(0.0, r * 0.5, absCd);
          color *= 0.88 + 0.12 * shadowEdge;
        } else {
          color = pageColor;
          alpha = 1.0;
        }
      } else {
        // RIPPLE
        float waveWidth = r * 5.0;
        float freq = PI / (r * 1.5);
        float amplitude = r * 0.6;
        float rd = -d;

        if (rd > waveWidth) {
          alpha = 0.0;
        } else if (rd > 0.0) {
          float t = rd / waveWidth;
          float decay = exp(-t * 3.0);
          float wave = sin(rd * freq) * decay * amplitude;
          float lighting = 1.0 + wave * 3.0;
          color = pageColor * clamp(lighting, 0.7, 1.15);
          float dissolve = smoothstep(waveWidth, waveWidth * 0.3, rd);
          alpha = 1.0 - dissolve;
          float shadowWave = max(0.0, -wave) * 2.0;
          color -= vec3(shadowWave * 0.08);
        } else if (rd > -waveWidth * 0.4) {
          float echo = -rd;
          float echoWave = sin(echo * freq * 2.0) * exp(-echo * 8.0 / waveWidth);
          color = pageColor * (1.0 + echoWave * 0.5);
          alpha = 1.0;
        } else {
          color = pageColor;
          alpha = 1.0;
        }
      }

      return vec4(color, alpha);
    }

    // ── Echo effect for the passive page ──
    vec4 echoEffect(vec2 uv, float spineDist, float r) {
      float intensity = sin(uProgress * PI) * smoothstep(1.0, 0.0, spineDist / SPINE);

      if (uEffectMode < 0.5) {
        // Curl echo: shadow from spine
        float shadowDepth = r * 4.0;
        float shadowFade = smoothstep(shadowDepth, 0.0, spineDist);
        float shadow = shadowFade * intensity * 0.12;
        return vec4(0.0, 0.0, 0.0, shadow);
      } else {
        // Ripple echo: wave continues from spine
        float decay = exp(-spineDist * 6.0 / r);
        float wave = sin(spineDist / r * 1.8 + uProgress * PI * 2.0) * decay * r * 0.4;
        float echoIntensity = intensity * 0.25;
        vec3 color = wave > 0.0 ? vec3(1.0) : vec3(0.0);
        float alpha = abs(wave) * echoIntensity;
        return vec4(color, alpha);
      }
    }

    void main() {
      vec2 uv = vUv;
      float r = uRadius;
      bool isReverse = uReverse > 0.5;

      // Determine which half is the active (effect) side and which is the echo side
      bool onRight = uv.x > SPINE + 0.002;
      bool onLeft  = uv.x < SPINE - 0.002;
      bool isActiveHalf = isReverse ? onLeft : onRight;
      bool isEchoHalf   = isReverse ? onRight : onLeft;

      if (isActiveHalf) {
        // ── ACTIVE HALF: main curl/ripple effect ──
        vec2 localUv;
        if (isReverse) {
          // Left page: remap [0, 0.5] → [0, 1], mirrored so spine edge = 1.0
          localUv = vec2(1.0 - uv.x / SPINE, uv.y);
        } else {
          // Right page: remap [0.5, 1.0] → [0, 1]
          localUv = vec2((uv.x - SPINE) / (1.0 - SPINE), uv.y);
        }

        float d = sweepDist(localUv, uProgress);
        vec4 result = pageEffect(d, r);

        // Edge softening
        float edgeFade = smoothstep(0.0, 0.015, uv.y) * smoothstep(1.0, 0.985, uv.y);
        if (isReverse) {
          edgeFade *= smoothstep(0.0, 0.015, uv.x);  // fade at left edge
        } else {
          edgeFade *= smoothstep(1.0, 0.985, uv.x);  // fade at right edge
        }
        result.a *= edgeFade;

        gl_FragColor = result;

      } else if (isEchoHalf) {
        // ── ECHO HALF: shadow/ripple from spine ──
        float spineDist;
        if (isReverse) {
          spineDist = uv.x - SPINE;  // distance from spine toward right edge
        } else {
          spineDist = SPINE - uv.x;  // distance from spine toward left edge
        }

        vec4 result = echoEffect(uv, spineDist, r);

        // Edge softening
        float edgeFade = smoothstep(0.0, 0.015, uv.y) * smoothstep(1.0, 0.985, uv.y);
        if (isReverse) {
          edgeFade *= smoothstep(1.0, 0.985, uv.x);  // fade at right edge
        } else {
          edgeFade *= smoothstep(0.0, 0.015, uv.x);  // fade at left edge
        }
        result.a *= edgeFade;

        gl_FragColor = result;

      } else {
        // ── SPINE ZONE: thin gap, transparent ──
        gl_FragColor = vec4(0.0);
      }
    }
  `;

  function getSweepUniforms(): { sweepMode: number; hDir: number; origin: [number, number] } {
    switch (sweep) {
      case 'right-to-left':
        return { sweepMode: 0, hDir: 1.0, origin: [1, 0] };
      case 'left-to-right':
        return { sweepMode: 0, hDir: -1.0, origin: [0, 0] };
      case 'corner-br':
        return { sweepMode: 1, hDir: 1.0, origin: [1, 0] };
      case 'corner-bl':
        return { sweepMode: 1, hDir: -1.0, origin: [0, 0] };
      case 'corner-tl':
        return { sweepMode: 1, hDir: -1.0, origin: [1, 1] };
    }
  }

  function setup() {
    const rect = canvasEl.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const dpr = Math.min(window.devicePixelRatio, 2);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    camera.position.z = 0.5;

    const su = getSweepUniforms();

    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uRadius: { value: radius },
        uResolution: { value: new THREE.Vector2(w * dpr, h * dpr) },
        uSweepMode: { value: su.sweepMode },
        uHDir: { value: su.hDir },
        uOrigin: { value: new THREE.Vector2(su.origin[0], su.origin[1]) },
        uEffectMode: { value: mode === 'ripple' ? 1.0 : 0.0 },
        uReverse: { value: direction === 'prev' ? 1.0 : 0.0 },
      },
      transparent: true,
      depthTest: false,
    });

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      material
    );
    scene.add(quad);
  }

  export function play(): Promise<void> {
    return new Promise((resolve) => {
      // Both directions animate progress 0→1.
      // The shader uses uReverse to decide which half gets the effect.
      const proxy = { progress: 0 };

      function render() {
        if (disposed) return;
        material.uniforms.uProgress.value = proxy.progress;
        material.uniforms.uEffectMode.value = mode === 'ripple' ? 1.0 : 0.0;
        renderer.render(scene, camera);
        animId = requestAnimationFrame(render);
      }

      render();

      gsap.to(proxy, {
        progress: 1,
        duration: duration,
        ease: mode === 'ripple' ? 'power1.inOut' : 'power2.inOut',
        onComplete: () => {
          cancelAnimationFrame(animId);
          onComplete();
          resolve();
        },
      });
    });
  }

  onMount(() => {
    setup();
  });

  onDestroy(() => {
    disposed = true;
    cancelAnimationFrame(animId);
    renderer?.dispose();
    material?.dispose();
  });
</script>

<canvas
  bind:this={canvasEl}
  class="page-curl-canvas"
></canvas>

<style>
  .page-curl-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 36px);
    z-index: 50;
    pointer-events: none;
  }
</style>
