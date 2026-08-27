"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import type { Breakpoint } from "@/hooks/use-breakpoint";
import { COARSE_POINTER, REDUCED_MOTION } from "@/lib/breakpoints";
import { readThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * A wireframe stack — one layer per category of the toolkit, widest where the
 * toolkit is deepest. The same object doubles as the opening loader: it
 * assembles bottom-up while the veil is over the page, then travels out to its
 * resting place beside the hero type in one continuous move.
 */

/** One rung of the stack. Width follows how many technologies sit in it. */
const LAYERS = [
  { count: 4, y: 1.8 },
  { count: 4, y: 0.9 },
  { count: 3, y: 0 },
  { count: 2, y: -0.9 },
  { count: 3, y: -1.8 },
].map((layer) => ({ ...layer, halfWidth: 0.28 * layer.count + 0.5 }));

const CORNERS = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
] as const;

/** Loose verticals that give the wireframe some depth off the main axis. */
const GUIDES = [
  [-0.55, -0.3],
  [0.15, 0.5],
  [0.7, -0.6],
] as const;

const SPAN = 4.8;
const FOV = 35;
const GUIDE_TOP = 2.2;

const OPACITY = { rung: 0.24, post: 0.12, guide: 0.08, marker: 0.65 } as const;
const ASSEMBLY = { step: 90, rung: 420, marker: 520, markerDuration: 380 } as const;
/** The assembly has to be under way before the veil lifts to read as one move. */
const ASSEMBLY_WINDOW_MS = 900;
const TRAVEL_MS = 900;

const CAMERA_Z = { intro: 7, hero: 8.5, tablet: 10.5, phone: 11 } as const;
const REST_ROTATION = 0.44;

type Part = {
  material: THREE.Material & { opacity: number };
  target: number;
  delay: number;
  duration: number;
  holder?: THREE.Object3D;
};

export type StackColumnProps = {
  breakpoint: Breakpoint;
  /** True when the opening veil was still up as this scene mounted. */
  intro: boolean;
  className?: string;
};

export function StackColumn({ breakpoint, intro, className }: StackColumnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    const coarse = window.matchMedia(COARSE_POINTER).matches;
    const narrow = breakpoint !== "lg";

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    if (!renderer.getContext()) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);

    const color = new THREE.Color(readThemeColor("glow"));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    const group = new THREE.Group();
    scene.add(group);

    const parts: Part[] = [];
    const track = (part: Part) => {
      parts.push(part);
      return part.material;
    };

    // Assembly runs bottom to top, because a stack is built from its base.
    LAYERS.forEach((layer, index) => {
      const points = CORNERS.map(
        ([x, z]) =>
          new THREE.Vector3(x * layer.halfWidth, layer.y, z * layer.halfWidth),
      );
      const holder = new THREE.Group();
      const material = track({
        material: new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
        }),
        target: OPACITY.rung,
        delay: (LAYERS.length - 1 - index) * ASSEMBLY.step,
        duration: ASSEMBLY.rung,
        holder,
      });
      holder.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(points),
          material,
        ),
      );
      group.add(holder);
    });

    // Corner posts fade in with the upper of the two rungs they join.
    for (let index = 0; index < LAYERS.length - 1; index += 1) {
      const lower = LAYERS[index];
      const upper = LAYERS[index + 1];
      const material = track({
        material: new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
        }),
        target: OPACITY.post,
        delay: (LAYERS.length - 1 - index) * ASSEMBLY.step,
        duration: ASSEMBLY.rung,
      });
      CORNERS.forEach(([x, z]) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x * lower.halfWidth, lower.y, z * lower.halfWidth),
          new THREE.Vector3(x * upper.halfWidth, upper.y, z * upper.halfWidth),
        ]);
        group.add(new THREE.Line(geometry, material));
      });
    }

    const guideMaterial = track({
      material: new THREE.LineDashedMaterial({
        color,
        transparent: true,
        opacity: 0,
        dashSize: 0.14,
        gapSize: 0.12,
      }),
      target: OPACITY.guide,
      delay: ASSEMBLY.marker,
      duration: ASSEMBLY.markerDuration,
    });
    GUIDES.forEach(([x, z]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, GUIDE_TOP, z),
        new THREE.Vector3(x, -GUIDE_TOP, z),
      ]);
      const line = new THREE.Line(geometry, guideMaterial);
      line.computeLineDistances();
      group.add(line);
    });

    const markers: THREE.Vector3[] = [];
    LAYERS.forEach((layer, index) => {
      for (let slot = 0; slot < layer.count; slot += 1) {
        const angle = (slot / layer.count) * Math.PI * 2 + index * 0.7;
        const radius = layer.halfWidth * 0.82;
        markers.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            layer.y + (slot % 2 ? 0.05 : -0.05),
            Math.sin(angle) * radius,
          ),
        );
      }
    });
    const markerMaterial = track({
      material: new THREE.PointsMaterial({
        color,
        transparent: true,
        opacity: 0,
        size: 0.075,
        sizeAttenuation: true,
      }),
      target: OPACITY.marker,
      delay: ASSEMBLY.marker,
      duration: ASSEMBLY.markerDuration,
    });
    group.add(
      new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(markers),
        markerMaterial,
      ),
    );

    let baseZ: number = CAMERA_Z.hero;

    /**
     * `phase` 0 is the loader position — centred and close. `phase` 1 is the
     * resting position, pushed right of centre and further back.
     */
    const place = (phase: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);
      const restZ = narrow
        ? breakpoint === "sm"
          ? CAMERA_Z.phone
          : CAMERA_Z.tablet
        : CAMERA_Z.hero;
      const z = narrow
        ? restZ
        : CAMERA_Z.intro + (restZ - CAMERA_Z.intro) * phase;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const visibleHeight = 2 * z * Math.tan(((FOV * Math.PI) / 180) / 2);
      const fill = narrow ? 0.6 : 0.48 + 0.17 * phase;
      group.scale.setScalar((fill * visibleHeight) / SPAN);

      const offset = narrow ? 0 : -0.25 * phase * visibleHeight * camera.aspect;
      camera.position.set(offset, narrow ? 1.7 : 2.2, z);
      camera.lookAt(offset, 0, 0);
      baseZ = z;
    };

    const disposeScene = () => {
      group.traverse((object) => {
        if (object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
        }
      });
      parts.forEach((part) => part.material.dispose());
      renderer.dispose();
    };

    if (reduced) {
      place(1);
      group.rotation.y = REST_ROTATION;
      parts.forEach((part) => {
        part.material.opacity = part.target;
      });
      renderer.render(scene, camera);
      canvas.dataset.ready = "true";

      const resizeObserver = new ResizeObserver(() => {
        place(1);
        renderer.render(scene, camera);
      });
      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.disconnect();
        disposeScene();
      };
    }

    const boot = performance.now();
    // The loader never gates on WebGL: if the scene lands after the veil has
    // gone it simply starts in its resting state, with no replayed assembly.
    // Below the desktop breakpoint the column still assembles, but in place.
    const assemble = narrow || intro;
    const travel = intro && !narrow;

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    if (!coarse) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    const easeOut = (k: number) => 1 - (1 - k) ** 5;
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
    /** Eases the travel with a smoothstep so it settles rather than stops. */
    const travelPhase = () => {
      if (!travel) return 1;
      const k = clamp01(
        (performance.now() - boot - ASSEMBLY_WINDOW_MS) / TRAVEL_MS,
      );
      return k * k * (3 - 2 * k);
    };
    const scrollPhase = () =>
      narrow ? 0 : clamp01(window.scrollY / window.innerHeight);

    let frameId: number | null = null;
    let idle = 0;
    let yaw = 0;
    let pitch = 0;
    let last = performance.now();
    let settled = !travel;

    const frame = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;

      const phase = travelPhase();
      if (!settled) {
        place(phase);
        if (phase >= 1) settled = true;
      }

      const scrolled = scrollPhase();
      if (phase > 0) idle += ((Math.PI * 2) / 60) * delta;

      const targetYaw = narrow ? 0 : pointer.x * 0.1;
      const targetPitch = narrow ? 0 : -pointer.y * 0.06;
      yaw += (targetYaw - yaw) * 0.045;
      pitch += (targetPitch - pitch) * 0.045;

      group.rotation.y = idle + yaw * phase;
      group.rotation.x = pitch * phase;
      group.position.y = scrolled * 1.2;
      camera.position.z = baseZ + scrolled * 2.5;
      camera.lookAt(camera.position.x, 0, 0);

      // Fades the column out well before the hero leaves the viewport.
      const fade = Math.max(0, 1 - scrolled / 0.85);
      parts.forEach((part) => {
        const progress = assemble
          ? easeOut(clamp01((now - boot - part.delay) / part.duration))
          : 1;
        part.material.opacity = part.target * progress * fade;
        if (part.holder) part.holder.position.y = -0.22 * (1 - progress);
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(frame);
    };

    place(travel ? 0 : 1);
    canvas.dataset.ready = "true";

    let inView = true;
    const start = () => {
      if (frameId === null && inView && !document.hidden) {
        last = performance.now();
        frameId = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      settled = false;
    });
    resizeObserver.observe(canvas);

    // The column has faded out by the time the hero clears the viewport, so the
    // loop can be parked rather than left running behind the rest of the page.
    const hero = document.getElementById("hero");
    const viewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { rootMargin: "15% 0px 15% 0px" },
    );
    viewObserver.observe(hero ?? canvas);

    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      if (!coarse) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
      }
      resizeObserver.disconnect();
      viewObserver.disconnect();
      disposeScene();
    };
  }, [breakpoint, intro]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className={cn(
        "block h-full w-full opacity-0 transition-opacity duration-800 ease-linear data-ready:opacity-100",
        className,
      )}
    />
  );
}

export default StackColumn;
