"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { REDUCED_MOTION } from "@/lib/breakpoints";
import { readThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * A branch-and-merge graph: work spurs off the trunk, runs in parallel, and
 * merges back. The trunk draws itself in, the branches follow in spur order,
 * the commits fade up, and then a single head travels the trunk on a loop.
 */

const TOP = 2.2;
const BOTTOM = -2.2;
/** Sampling resolution, so `setDrawRange` can draw a line progressively. */
const SEGMENTS = 60;

const OPACITY = { trunk: 0.28, branch: 0.16, commit: 0.5, head: 0.85 } as const;

/** Branches deliberately overlap in Y — real work does not queue up neatly. */
const BRANCHES = [
  { from: 1.6, to: 0.4, x: -0.95, z: 0.35 },
  { from: 0.8, to: -0.6, x: 1.05, z: -0.45 },
  { from: -0.2, to: -1.5, x: -0.75, z: -0.55 },
] as const;

const TRUNK_COMMITS = [2, 1.6, 1.1, 0.4, -0.2, -0.6, -1.1, -1.5, -2] as const;
const BRANCH_COMMITS = [0.28, 0.5, 0.72] as const;

const TIMING = {
  trunk: 900,
  branch: 700,
  stagger: 140,
  commits: 500,
  /** Seconds for one full pass of the travelling head. */
  headLoop: 9,
} as const;

const REST_ROTATION = 0.3;
const SWAY = { amplitude: 0.42, speed: 0.16 } as const;

export function CommitGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.3, 9.5);
    camera.lookAt(0, 0, 0);
    const group = new THREE.Group();
    scene.add(group);

    const materials: THREE.Material[] = [];
    const keep = <T extends THREE.Material>(material: T) => {
      materials.push(material);
      return material;
    };

    const trunkPoints: THREE.Vector3[] = [];
    for (let index = 0; index <= SEGMENTS; index += 1) {
      trunkPoints.push(
        new THREE.Vector3(0, TOP + (BOTTOM - TOP) * (index / SEGMENTS), 0),
      );
    }
    const trunk = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(trunkPoints),
      keep(
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: OPACITY.trunk,
        }),
      ),
    );
    group.add(trunk);

    const branchMaterial = keep(
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: OPACITY.branch,
      }),
    );
    const branches = BRANCHES.map((branch) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, branch.from, 0),
        new THREE.Vector3(branch.x * 0.55, branch.from - 0.22, branch.z * 0.55),
        new THREE.Vector3(branch.x, branch.from - 0.55, branch.z),
        new THREE.Vector3(branch.x, branch.to + 0.55, branch.z),
        new THREE.Vector3(branch.x * 0.55, branch.to + 0.22, branch.z * 0.55),
        new THREE.Vector3(0, branch.to, 0),
      ]);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(SEGMENTS)),
        branchMaterial,
      );
      group.add(line);
      return { line, curve };
    });

    const commits = TRUNK_COMMITS.map((y) => new THREE.Vector3(0, y, 0));
    branches.forEach(({ curve }) => {
      BRANCH_COMMITS.forEach((at) => commits.push(curve.getPointAt(at)));
    });
    const commitMaterial = keep(
      new THREE.PointsMaterial({
        color,
        transparent: true,
        opacity: 0,
        size: 0.085,
        sizeAttenuation: true,
      }),
    );
    group.add(
      new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(commits),
        commitMaterial,
      ),
    );

    const headMaterial = keep(
      new THREE.PointsMaterial({
        color,
        transparent: true,
        opacity: 0,
        size: 0.17,
        sizeAttenuation: true,
      }),
    );
    const headGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, TOP, 0),
    ]);
    const headPosition = headGeometry.attributes.position;
    group.add(new THREE.Points(headGeometry, headMaterial));

    const layout = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    layout();

    const setHead = (y: number) => {
      headPosition.setY(0, y);
      headPosition.needsUpdate = true;
    };
    const drawTo = (line: THREE.Line, ratio: number) =>
      line.geometry.setDrawRange(
        0,
        Math.max(0, Math.round(ratio * (SEGMENTS + 1))),
      );

    const disposeScene = () => {
      group.traverse((object) => {
        if (object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
        }
      });
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };

    if (window.matchMedia(REDUCED_MOTION).matches) {
      group.rotation.y = REST_ROTATION;
      commitMaterial.opacity = OPACITY.commit;
      headMaterial.opacity = OPACITY.head;
      setHead(TOP);
      renderer.render(scene, camera);
      canvas.dataset.ready = "true";

      const resizeObserver = new ResizeObserver(() => {
        layout();
        renderer.render(scene, camera);
      });
      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.disconnect();
        disposeScene();
      };
    }

    const BRANCH_START = TIMING.trunk;
    const COMMIT_START =
      TIMING.trunk + TIMING.stagger * (BRANCHES.length - 1) + TIMING.branch;
    const DRAWN = COMMIT_START + TIMING.commits;

    drawTo(trunk, 0);
    branches.forEach(({ line }) => drawTo(line, 0));

    let elapsed = 0;
    let entranceElapsed = 0;
    let entered = false;
    let visible = false;
    let frameId: number | null = null;
    let last = 0;

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    const tick = (delta: number) => {
      elapsed += delta;
      if (entered) entranceElapsed += delta * 1000;

      group.rotation.y =
        Math.sin(elapsed * SWAY.speed) * SWAY.amplitude;

      drawTo(trunk, entered ? clamp01(entranceElapsed / TIMING.trunk) : 0);
      branches.forEach(({ line }, index) => {
        drawTo(
          line,
          entered
            ? clamp01(
                (entranceElapsed - BRANCH_START - index * TIMING.stagger) /
                  TIMING.branch,
              )
            : 0,
        );
      });
      commitMaterial.opacity =
        OPACITY.commit * clamp01((entranceElapsed - COMMIT_START) / TIMING.commits);

      if (entered && entranceElapsed >= DRAWN) {
        const at = (((entranceElapsed - DRAWN) / 1000) % TIMING.headLoop) /
          TIMING.headLoop;
        setHead(TOP + (BOTTOM - TOP) * at);
        // Fades the head in and out at the ends so the loop has no visible cut.
        headMaterial.opacity =
          OPACITY.head * Math.min(1, at / 0.06, (1 - at) / 0.06);
      } else {
        headMaterial.opacity = 0;
      }

      renderer.render(scene, camera);
    };

    const frame = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      tick(delta);
      frameId = requestAnimationFrame(frame);
    };
    const start = () => {
      if (frameId === null && visible && !document.hidden) {
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

    const viewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (!entered && entry.intersectionRatio >= 0.2) entered = true;
            start();
          } else {
            stop();
          }
        });
      },
      { threshold: [0, 0.2, 0.5] },
    );
    viewObserver.observe(canvas.closest("section") ?? canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(() => layout());
    resizeObserver.observe(canvas);

    canvas.dataset.ready = "true";
    tick(0);

    return () => {
      stop();
      viewObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      disposeScene();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className={cn(
        "pointer-events-none block h-full w-full opacity-0 transition-opacity duration-800 ease-linear data-ready:opacity-100",
        className,
      )}
    />
  );
}

export default CommitGraph;
