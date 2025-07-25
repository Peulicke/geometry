import type { Grid } from "./grid.js";

export type Vec2 = [number, number];

export const getOrigin = (): Vec2 => [0, 0];

export const getXPlus = (): Vec2 => [1, 0];

export const getYPlus = (): Vec2 => [0, 1];

export const getXMinus = (): Vec2 => [-1, 0];

export const getYMinus = (): Vec2 => [0, -1];

export const clone = (v: Vec2): Vec2 => [...v];

export const isVec2 = (v: unknown): v is Vec2 => Array.isArray(v) && v.length === 2;

export const equals = (a: Vec2, b: Vec2): boolean => a[0] === b[0] && a[1] === b[1];

export const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];

export const mid = (a: Vec2, b: Vec2): Vec2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

export const sub = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]];

export const length = (a: Vec2): number => Math.sqrt(a[0] ** 2 + a[1] ** 2);

export const scale = (a: Vec2, n: number): Vec2 => [a[0] * n, a[1] * n];

export const normalize = (a: Vec2): Vec2 => {
    const l = length(a);
    if (l === 0) return a;
    return scale(a, 1 / l);
};

export const resize = (v: Vec2, l: number): Vec2 => scale(normalize(v), l);

export const dot = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1];

export const cross = (a: Vec2): Vec2 => [-a[1], a[0]];

export const getAngle = (a: Vec2): number => Math.atan2(a[1], a[0]);

export const averageDirection = (a: Vec2, b: Vec2): Vec2 => normalize(add(normalize(a), normalize(b)));

export const multiply = (a: Vec2, b: Vec2): Vec2 => [a[0] * b[0], a[1] * b[1]];

export const divide = (a: Vec2, b: Vec2): Vec2 => [a[0] / b[0], a[1] / b[1]];

export const lerp = (a: Vec2, b: Vec2, w: number): Vec2 => add(scale(a, 1 - w), scale(b, w));

export const negate = (a: Vec2): Vec2 => [-a[0], -a[1]];

export const proj = (a: Vec2, b: Vec2): Vec2 => {
    const nb = normalize(b);
    return scale(nb, dot(a, nb));
};

export const projOnLine = (v: Vec2, lineStart: Vec2, lineDir: Vec2): Vec2 =>
    add(proj(sub(v, lineStart), lineDir), lineStart);

export const dist = (a: Vec2, b: Vec2): number => length(sub(b, a));

export const dir = (a: Vec2, b: Vec2, l: number): Vec2 => scale(normalize(sub(b, a)), l);

export const floor = (v: Vec2): Vec2 => [Math.floor(v[0]), Math.floor(v[1])];

export const round = (v: Vec2): Vec2 => [Math.round(v[0]), Math.round(v[1])];

export const abs = (v: Vec2): Vec2 => [Math.abs(v[0]), Math.abs(v[1])];

export const min = (v: Vec2): number => Math.min(v[0], v[1]);

export const max = (v: Vec2): number => Math.max(v[0], v[1]);

export const clamp = (v: Vec2, from: Vec2, to: Vec2): Vec2 => [
    Math.min(Math.max(v[0], from[0]), to[0]),
    Math.min(Math.max(v[1], from[1]), to[1])
];

export const getNearestObject = <T>(obj: T | Vec2, allObjs: T[], pos: (t: T) => Vec2): T | undefined => {
    const objPos = isVec2(obj) ? obj : pos(obj);
    let result: T | undefined = undefined;
    let minDist = Infinity;
    for (const o of allObjs) {
        if (o === obj) continue;
        const d = dist(objPos, pos(o));
        if (d > minDist) continue;
        minDist = d;
        result = o;
    }
    return result;
};

export const getNearest = (v: Vec2, all: Vec2[]) => getNearestObject(v, all, t => t);

export const resolveCollision = (pos: Vec2, collisionPoint: Vec2, radius: number): Vec2 => {
    const d = sub(pos, collisionPoint);
    const l = length(d);
    if (l > radius) return pos;
    return add(collisionPoint, scale(d, radius / l));
};

export const edgeDirs = (): Vec2[] => [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

export const cornerDirs = (): Vec2[] => [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1]
];

export const gridEdges = (pos: Vec2) => edgeDirs().map(n => ({ n, p: add(pos, n) }));

export const gridCorners = (pos: Vec2) => cornerDirs().map(n => ({ n, p: add(pos, n) }));

export const gridNeighbors = (pos: Vec2 = [0, 0]) => [
    ...gridEdges(pos).map(({ n, p }) => ({ n, p, isEdge: true })),
    ...gridCorners(pos).map(({ n, p }) => ({ n, p, isEdge: false }))
];

export const sizeOfGrid = <T>(grid: Grid<T>): Vec2 => [grid.length, grid[0]?.length ?? 0];

export const unique = (vList: Vec2[]): Vec2[] => {
    const result: Vec2[] = [];
    const exists: Map<number, Set<number>> = new Map();
    vList.forEach(v => {
        const [x, y] = v;
        if (!exists.has(x)) exists.set(x, new Set());
        if (exists.get(x)?.has(y)) return;
        exists.get(x)?.add(y);
        result.push([x, y]);
    });
    return result;
};

export const sum = (vList: Vec2[]): Vec2 => vList.reduce((s, v) => add(s, v), [0, 0]);

export const mean = (vList: Vec2[]): Vec2 => scale(sum(vList), 1 / vList.length);

export const rotate = (v: Vec2, angle: number): Vec2 => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c * v[0] - s * v[1], s * v[0] + c * v[1]];
};

export const getDir = (angle: number): Vec2 => [Math.cos(angle), Math.sin(angle)];

export const randSize = (size: Vec2, random: () => number): Vec2 => multiply([random(), random()], size);

export const randNumber = (size: number, random: () => number): Vec2 => randSize([size, size], random);

export const randFromTo = (from: Vec2, to: Vec2, random: () => number): Vec2 =>
    add(randSize(sub(to, from), random), from);

export type Rect = [Vec2, Vec2];

export const createRect = (center: Vec2, r: Vec2): Rect => [sub(center, r), add(center, r)];

export const createRectFromTo = (from: Vec2, to: Vec2): Rect => [
    [Math.min(from[0], to[0]), Math.min(from[1], to[1])],
    [Math.max(from[0], to[0]), Math.max(from[1], to[1])]
];

export const insideRect = (v: Vec2, rect: Rect): boolean =>
    v[0] > rect[0][0] && v[1] > rect[0][1] && v[0] < rect[1][0] && v[1] < rect[1][1];

export const getRectCenter = (rect: Rect): Vec2 => lerp(rect[0], rect[1], 0.5);

export const getRectSize = (rect: Rect): Vec2 => sub(rect[1], rect[0]);

export const getRectR = (rect: Rect): Vec2 => scale(getRectSize(rect), 0.5);

export const moveRect = (rect: Rect, pos: Vec2): Rect => [add(rect[0], pos), add(rect[1], pos)];

export const growRect = (rect: Rect, amount: Vec2): Rect => [sub(rect[0], amount), add(rect[1], amount)];

export const shrinkRect = (rect: Rect, amount: Vec2): Rect => growRect(rect, negate(amount));

export const getSubRect = (
    rect: Rect,
    count: Vec2,
    posIndex: Vec2,
    superMargin: Vec2 = [0, 0],
    subMargin: Vec2 = [0, 0]
): Rect => {
    const shrunkRect = shrinkRect(rect, superMargin);
    const subSize = divide(getRectSize(shrunkRect), count);
    const pos = add(shrunkRect[0], multiply(posIndex, subSize));
    return shrinkRect(moveRect([[0, 0], subSize], pos), subMargin);
};
