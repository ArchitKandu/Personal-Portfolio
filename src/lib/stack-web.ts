import { PRIMARY_STACK, STACK_CATEGORIES } from "@/lib/content";

/**
 * Lays the toolkit out as a scattered web: one hub per category on an ellipse
 * around a core, each technology orbiting its own hub, then a relaxation pass
 * that pushes overlapping labels apart. The result is deterministic for a given
 * stage width, so it is stable across renders and matches on the server.
 */

export const STAGE_HEIGHT = 760;

const CORE_SIZE = 168;
const CORE_DEPTH = 40;
const SPOKE_DEPTH = -90;
const HUB_HEIGHT = 34;

/** Hubs sit on an ellipse this fraction of the stage out from the core. */
const HUB_ELLIPSE = { x: 0.31, y: 0.3 } as const;

/** Technologies fan out from their hub at these radii. */
const ORBIT = { base: 118, step: 52, spread: 0.78, squash: 0.82 } as const;

/** Rough per-character widths, so a box is sized before it is measured. */
const CHAR_WIDTH = { hub: 7.6, primary: 10, node: 8.4 } as const;
const LABEL_PADDING = { hub: 34, primary: 46, node: 34 } as const;
const NODE_HEIGHT = { primary: 52, node: 48 } as const;

/** Relaxation: enough passes to settle, with a little breathing room. */
const RELAX_PASSES = 420;
const RELAX_GAP = { x: 16, y: 14 } as const;

/** Each category sits on its own plane so the web reads as having depth. */
const DEPTH = { base: 70, step: 22 } as const;

const EDGE_INSET = 4;

/*
 * Browsers serialise CSS lengths to limited precision, so a full-precision
 * value written into a style attribute reads back rounded. React then sees the
 * client's longer string as a mismatch against the server's HTML. Emitting
 * already-rounded values keeps the two identical. The relaxation pass above
 * still runs at full precision; only the output is rounded.
 */
const round = (value: number, places = 1) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Item = Box & {
  label: string;
  category: string;
  categoryIndex: number;
  isHub: boolean;
  isCore: boolean;
  primary: boolean;
  parent: Box | null;
};

export type WebNode = {
  label: string;
  category: string;
  primary: boolean;
  depth: number;
} & Box;

export type WebHub = {
  label: string;
  depth: number;
} & Box;

export type WebEdge = {
  x: number;
  y: number;
  length: number;
  angle: number;
  depth: number;
  spoke: boolean;
};

export type StackWeb = {
  width: number;
  height: number;
  core: { x: number; y: number; size: number; depth: number };
  hubs: WebHub[];
  nodes: WebNode[];
  edges: WebEdge[];
};

const depthOf = (categoryIndex: number) =>
  DEPTH.base - categoryIndex * DEPTH.step;

export function buildStackWeb(width: number): StackWeb {
  const height = STAGE_HEIGHT;
  const items: Item[] = [];

  const core: Item = {
    label: "",
    category: "",
    categoryIndex: 3,
    isHub: true,
    isCore: true,
    primary: false,
    parent: null,
    x: width / 2,
    y: height / 2,
    width: CORE_SIZE,
    height: CORE_SIZE,
  };
  items.push(core);

  STACK_CATEGORIES.forEach((category, categoryIndex) => {
    const angle =
      -Math.PI / 2 + (categoryIndex / STACK_CATEGORIES.length) * Math.PI * 2;
    const hubX = width / 2 + Math.cos(angle) * width * HUB_ELLIPSE.x;
    const hubY = height / 2 + Math.sin(angle) * height * HUB_ELLIPSE.y;

    const hub: Item = {
      label: category.name,
      category: category.name,
      categoryIndex,
      isHub: true,
      isCore: false,
      primary: false,
      parent: core,
      x: hubX,
      y: hubY,
      width: category.name.length * CHAR_WIDTH.hub + LABEL_PADDING.hub,
      height: HUB_HEIGHT,
    };
    items.push(hub);

    category.items.forEach((label, slot) => {
      const primary = PRIMARY_STACK.includes(label);
      const spread = (slot - (category.items.length - 1) / 2) * ORBIT.spread;
      const radius = ORBIT.base + (slot % 3) * ORBIT.step;

      items.push({
        label,
        category: category.name,
        categoryIndex,
        isHub: false,
        isCore: false,
        primary,
        parent: hub,
        x: hubX + Math.cos(angle + spread) * radius,
        y: hubY + Math.sin(angle + spread) * radius * ORBIT.squash,
        width:
          label.length * (primary ? CHAR_WIDTH.primary : CHAR_WIDTH.node) +
          (primary ? LABEL_PADDING.primary : LABEL_PADDING.node),
        height: primary ? NODE_HEIGHT.primary : NODE_HEIGHT.node,
      });
    });
  });

  // Separate along whichever axis is least overlapped, which keeps the fan
  // shape of each cluster instead of collapsing it into a line.
  for (let pass = 0; pass < RELAX_PASSES; pass += 1) {
    for (let i = 0; i < items.length; i += 1) {
      for (let k = i + 1; k < items.length; k += 1) {
        const a = items[i];
        const b = items[k];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const overlapX =
          (a.width + b.width) / 2 + RELAX_GAP.x - Math.abs(dx);
        const overlapY =
          (a.height + b.height) / 2 + RELAX_GAP.y - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;

        if (
          overlapX / (a.width + b.width) <
          overlapY / (a.height + b.height)
        ) {
          const push = (dx >= 0 ? 1 : -1) * overlapX * 0.5;
          a.x -= push;
          b.x += push;
        } else {
          const push = (dy >= 0 ? 1 : -1) * overlapY * 0.5;
          a.y -= push;
          b.y += push;
        }
      }
    }

    items.forEach((item) => {
      item.x = Math.max(
        item.width / 2 + EDGE_INSET,
        Math.min(width - item.width / 2 - EDGE_INSET, item.x),
      );
      item.y = Math.max(
        item.height / 2 + EDGE_INSET,
        Math.min(height - item.height / 2 - EDGE_INSET, item.y),
      );
    });

    // The core is an anchor, not a participant.
    core.x = width / 2;
    core.y = height / 2;
  }

  // Recentre the settled cloud, which tends to drift off-axis.
  let low = Infinity;
  let high = -Infinity;
  items.forEach((item) => {
    low = Math.min(low, item.x - item.width / 2);
    high = Math.max(high, item.x + item.width / 2);
  });
  const shift = (width - (low + high)) / 2;
  if (Math.abs(shift) > 1) {
    items.forEach((item) => {
      item.x += shift;
    });
    core.x = width / 2;
  }

  const nodes: WebNode[] = items
    .filter((item) => !item.isHub)
    .map((item) => ({
      label: item.label,
      category: item.category,
      primary: item.primary,
      depth: depthOf(item.categoryIndex),
      x: round(item.x),
      y: round(item.y),
      width: round(item.width),
      height: round(item.height),
    }));

  const hubItems = items.filter((item) => item.isHub && !item.isCore);

  const hubs: WebHub[] = hubItems.map((item) => ({
    label: item.label,
    depth: depthOf(item.categoryIndex),
    x: round(item.x),
    y: round(item.y),
    width: round(item.width),
    height: round(item.height),
  }));

  const toEdge = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    depth: number,
    spoke: boolean,
  ): WebEdge => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return {
      x: round(from.x),
      y: round(from.y),
      length: round(Math.sqrt(dx * dx + dy * dy)),
      angle: round(Math.atan2(dy, dx), 4),
      depth,
      spoke,
    };
  };

  const edges: WebEdge[] = [
    ...items
      .filter((item) => !item.isHub && item.parent)
      .map((item) =>
        toEdge(item, item.parent as Box, depthOf(item.categoryIndex), false),
      ),
    ...hubItems.map((item) => toEdge(item, core, SPOKE_DEPTH, true)),
  ];

  return {
    width,
    height,
    core: {
      x: round(core.x),
      y: round(core.y),
      size: CORE_SIZE,
      depth: CORE_DEPTH,
    },
    hubs,
    nodes,
    edges,
  };
}
